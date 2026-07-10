export type RealtimeEventHandler<T = any> = (data: T) => void

export interface RealtimeSocket {
  id?: string
  connected: boolean
  readyState?: number
  sessionId: string
  connect: () => void
  disconnect: () => void
  emit: (event: string, data?: any) => void
  on: (event: string, handler: RealtimeEventHandler) => void
  off: (event: string, handler?: RealtimeEventHandler) => void
  listeners: (event: string) => RealtimeEventHandler[]
}

interface CreateRealtimeSocketOptions {
  baseUrl: string
  wsBaseUrl?: string
  getWsToken?: (sessionId: string) => Promise<string>
}

const normalizeWsBase = (baseUrl: string, wsBaseUrl?: string): string => {
  const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
  const isLocal = hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('10.') || hostname.startsWith('192.168.');

  // If we're on localhost but wsBaseUrl points to production, ignore it and use local proxy
  if (isLocal && wsBaseUrl && (wsBaseUrl.includes('codepark.qzz.io') || wsBaseUrl.includes('inc1.devtunnels.ms'))) {
    wsBaseUrl = undefined;
  }

  if (wsBaseUrl && wsBaseUrl.trim().length > 0) {
    return wsBaseUrl.trim().replace(/\/$/, '')
  }

  const resolved = baseUrl && baseUrl.trim().length > 0 ? new URL(baseUrl, window.location.origin) : new URL(window.location.origin)
  const protocol = resolved.protocol === 'https:' ? 'wss:' : 'ws:'
  return `${protocol}//${resolved.host}/ws/collab`
}

const generateBase62 = (length: number): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * NativeWebSocketAdapter
 * 
 * Responsibilities:
 * - Implements RealtimeSocket interface using raw browser WebSockets.
 * - Handles connection, manual disconnection, and room transitions.
 * - Acts as the sole owner for connection retry/reconnect timing and backoff.
 */
class NativeWebSocketAdapter implements RealtimeSocket {
  public id?: string
  public connected = false

  public get readyState(): number {
    if (!this.socket) return 3; // CLOSED
    return this.socket.readyState;
  }

  private readonly wsBaseUrl: string
  private readonly getWsToken?: (sessionId: string) => Promise<string>
  private readonly connectionId: string
  private socket: WebSocket | null = null
  private listenersMap = new Map<string, Set<RealtimeEventHandler>>()
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null
  private reconnectAttempts = 0
  private readonly maxReconnectAttempts = 10
  private readonly reconnectBaseDelay = 1000
  public sessionId = 'lobby'
  private manuallyDisconnected = false
  private pendingMessages: Array<{ type: string; payload: any }> = []
  private lastTransitionAt = 0
  private readonly transitionCooldown = 1500 // ms
  private openSocketGeneration = 0 // incremented on every openSocket() call; stale calls self-abort

  constructor(options: CreateRealtimeSocketOptions) {
    this.wsBaseUrl = normalizeWsBase(options.baseUrl, options.wsBaseUrl)
    this.getWsToken = options.getWsToken
    this.id = `ws-${Math.random().toString(36).slice(2, 10)}`
    this.connectionId = `c_${generateBase62(10)}`
  }

  public connect = (): void => {
    if (this.connected || (this.socket && this.socket.readyState === WebSocket.CONNECTING)) {
      return
    }

    this.manuallyDisconnected = false
    this.emitLocal('connecting', { transport: 'websocket' })
    void this.openSocket()
  }

  public disconnect = (): void => {
    this.manuallyDisconnected = true
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }

    if (this.socket) {
      this.socket.close(1000, 'client disconnect')
      this.socket = null
    }

    this.connected = false
    this.emitLocal('disconnect', 'io client disconnect')
  }

  public emit = (event: string, data?: any): void => {
    // If the data contains a session_id that differs from our current connection's room,
    // we need to reconnect to that specific room to ensure the backend routes correctly.
    // This often happens after 'create_session' when the app starts sending updates for the new ID.
    if (data?.session_id) {
      const targetSessionId = String(data.session_id)
      if (targetSessionId !== this.sessionId) {
        // Drop stale awareness/updates from old sessions during transition cooldown
        const now = Date.now()
        if (now - this.lastTransitionAt < this.transitionCooldown) {
          if (event === 'yjs_awareness' || event === 'yjs_update') {
             console.debug(`[Realtime] ⚠️ Ignoring stale ${event} for session ${targetSessionId} (Cooldown active)`);
             return;
          }
        }

        console.log(`[Realtime] 🔄 Session ID mismatch detected (Current: ${this.sessionId}, Target: ${targetSessionId}). Transitioning...`);
        this.sessionId = targetSessionId
        this.lastTransitionAt = now
        this.pendingMessages.push({ type: event, payload: data ?? {} })
        
        if (this.socket) {
          this.socket.onclose = null;
          this.socket.onerror = null;
          this.socket.onmessage = null;
          this.socket.onopen = null;
          this.socket.close(1000, 'room transition');
          this.socket = null;
        }

        // Bump generation so any in-progress openSocket() for the old room self-aborts
        this.openSocketGeneration++
        this.connected = false;
        void this.openSocket();
        return
      }
    }

    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      this.pendingMessages.push({ type: event, payload: data ?? {} })
      if (!this.socket || this.socket.readyState === WebSocket.CLOSED) {
        this.connect()
      }
      return
    }

    const payload = JSON.stringify({ type: event, payload: data ?? {} })
    this.socket.send(payload)
  }

  public on = (event: string, handler: RealtimeEventHandler): void => {
    if (!this.listenersMap.has(event)) {
      this.listenersMap.set(event, new Set())
    }
    this.listenersMap.get(event)?.add(handler)
  }

  public off = (event: string, handler?: RealtimeEventHandler): void => {
    const handlers = this.listenersMap.get(event)
    if (!handlers) {
      return
    }

    if (!handler) {
      handlers.clear()
      return
    }

    handlers.delete(handler)
  }

  public listeners = (event: string): RealtimeEventHandler[] => {
    return Array.from(this.listenersMap.get(event) ?? [])
  }

  private async openSocket(): Promise<void> {
    // Generation counter: if another openSocket() call starts while we're awaiting
    // the token, the newer call will have incremented openSocketGeneration.  We
    // check after the await and abort if we've been superseded — preventing two
    // simultaneous connections that would cause join_session to be sent on the
    // wrong (evicted) socket.
    const myGeneration = ++this.openSocketGeneration
    console.log('[Realtime] openSocket() called, sessionId:', this.sessionId, 'gen:', myGeneration);
    console.log('[Realtime] wsBaseUrl:', this.wsBaseUrl);
    let token: string | undefined
    if (this.getWsToken) {
      try {
        console.log('[Realtime] 🔑 Requesting WebSocket token...');
        token = await this.getWsToken(this.sessionId)
        console.log('[Realtime] ✅ Token received');
        if (!token) {
          throw new Error('WebSocket token is empty or undefined');
        }
      } catch (error: any) {
        console.error('[Realtime] ❌ Failed to get WebSocket token:', error);
        this.emitLocal('connect_error', error)
        
        // Prevent reconnect loop only on confirmed authentication failures
        const message = String(error?.message || '').toLowerCase();
        const isAuthError = 
          message.includes('401') || 
          message.includes('403') || 
          message.includes('unauthorized') || 
          message.includes('token is empty') || 
          message.includes('authentication required');
        
        if (!isAuthError) {
          this.scheduleReconnect()
        }
        return
      }
    }

    // Abort if a newer openSocket() call (room transition or retry) has started
    if (myGeneration !== this.openSocketGeneration) {
      console.log(`[Realtime] openSocket gen ${myGeneration} superseded by gen ${this.openSocketGeneration}, aborting`);
      return
    }

    if (this.manuallyDisconnected) {
      console.log('[Realtime] Aborting openSocket: manually disconnected while fetching token.');
      return;
    }

    const queryParts = [];
    if (token) {
      queryParts.push(`token=${encodeURIComponent(token)}`);
    }
    queryParts.push(`connection_id=${encodeURIComponent(this.connectionId)}`);
    const query = `?${queryParts.join('&')}`;
    const wsUrl = `${this.wsBaseUrl}/${encodeURIComponent(this.sessionId)}${query}`
    console.log('[Realtime] 🌐 Connecting to:', wsUrl.split('?')[0] + '?...');

    try {
      this.socket = new WebSocket(wsUrl)
    } catch (error) {
      console.error('[Realtime] ❌ WebSocket constructor failed:', error);
      this.emitLocal('connect_error', error)
      this.scheduleReconnect()
      return
    }

    this.socket.onopen = () => {
      this.connected = true
      this.reconnectAttempts = 0
      console.log('[SOCKET_CONNECT]', { sessionId: this.sessionId });
      this.emitLocal('connect', undefined)
      this.emitLocal('connected', { status: 'connected', message: 'WebSocket connected' })

      if (this.pendingMessages.length > 0 && this.socket?.readyState === WebSocket.OPEN) {
        const queued = [...this.pendingMessages]
        this.pendingMessages = []
        queued.forEach((msg) => {
          this.socket?.send(JSON.stringify({ type: msg.type, payload: msg.payload ?? {} }))
        })
      }
    }

    this.socket.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data)
        const type = parsed?.type
        const payload = parsed?.payload ?? {}

        if (typeof type !== 'string') {
          return
        }

        if (type === 'error') {
          this.emitLocal('error', payload)
          return
        }

        this.emitLocal(type, payload)
      } catch (error) {
        this.emitLocal('error', { message: 'Invalid websocket message format', error })
      }
    }

    this.socket.onerror = () => {
      this.emitLocal('connect_error', new Error('WebSocket connection failed'))
    }

    this.socket.onclose = () => {
      this.connected = false
      console.log('[SOCKET_DISCONNECT]', { sessionId: this.sessionId });
      this.emitLocal('disconnect', this.manuallyDisconnected ? 'io client disconnect' : 'transport close')
      this.socket = null

      if (!this.manuallyDisconnected) {
        this.scheduleReconnect()
      }
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      this.emitLocal('connect_error', new Error('Max WebSocket reconnection attempts reached'))
      return
    }

    const delay = Math.min(this.reconnectBaseDelay * 2 ** this.reconnectAttempts, 30000)
    this.reconnectAttempts += 1
    this.emitLocal('reconnect_attempt', { attempt: this.reconnectAttempts, delay })

    this.reconnectTimer = setTimeout(() => {
      void this.openSocket()
    }, delay)
  }

  private emitLocal(event: string, payload: any): void {
    const handlers = this.listenersMap.get(event)
    if (!handlers || handlers.size === 0) {
      return
    }

    handlers.forEach((handler) => {
      try {
        handler(payload)
      } catch (error) {
        console.error(`[Realtime] Handler error for event "${event}":`, error)
      }
    })
  }
}

export const createRealtimeSocket = (options: CreateRealtimeSocketOptions): RealtimeSocket => {
  return new NativeWebSocketAdapter(options)
}
