/**
 * fakeSocket.ts
 * Drop-in mock for the production RealtimeSocket / NativeWebSocketAdapter.
 * Implements the same event-emitter interface so SocketContext works unchanged.
 */

import { demoDb, uuid, DEMO_COLORS } from './fakeDatabase'
import { getOrCreateTerminal } from './fakeTerminal'
import * as Y from 'yjs'
import { Awareness, encodeAwarenessUpdate } from 'y-protocols/awareness'

type EventHandler = (...args: any[]) => void

function uint8ToBase64(u8: Uint8Array): string {
  let binary = ''
  const len = u8.byteLength
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(u8[i])
  }
  return btoa(binary)
}

function base64ToUint8(b64: string): Uint8Array {
  const binaryString = atob(b64)
  const len = binaryString.length
  const bytes = new Uint8Array(len)
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  return bytes
}

interface FakeCollaborator {
  id: string
  name: string
  color: string
  handle: string
}

const FAKE_COLLABORATORS: FakeCollaborator[] = [
  { id: 'z-collab-alice', name: 'Alice Chen', color: '#8B5CF6', handle: 'alice_chen' },
  { id: 'z-collab-bob',  name: 'Bob Martinez', color: '#EC4899', handle: 'bob_martinez' },
]

export class FakeRealtimeSocket {
  id = `ws-demo-${uuid()}`
  connected = false
  readyState = 3 // CLOSED initially

  private handlers: Map<string, Set<EventHandler>> = new Map()
  private sessionId: string | null = null
  private projectId: string | null = null
  private projectName: string | null = null
  private collaboratorTimers: ReturnType<typeof setTimeout>[] = []
  private notifTimer: ReturnType<typeof setTimeout> | null = null
  private terminalBuffer = ''
  private mockDoc = new Y.Doc()
  private mockAwareness = new Awareness(this.mockDoc)

  // ─── EventEmitter API ────────────────────────────────────────────────────────

  on(event: string, handler: EventHandler): this {
    if (!this.handlers.has(event)) this.handlers.set(event, new Set())
    this.handlers.get(event)!.add(handler)
    return this
  }

  off(event: string, handler?: EventHandler): this {
    if (!handler) {
      this.handlers.delete(event)
    } else {
      this.handlers.get(event)?.delete(handler)
    }
    return this
  }

  listeners(event: string): EventHandler[] {
    return Array.from(this.handlers.get(event) || [])
  }

  emit(event: string, data?: any): void {
    this.emit_to_server(event, data)
  }

  private emitLocal(event: string, ...args: any[]): void {
    const handlers = this.handlers.get(event)
    if (!handlers) return
    for (const handler of handlers) {
      try { handler(...args) } catch (e) { console.warn('[FakeSocket] Handler error:', e) }
    }
  }

  // ─── Connection ───────────────────────────────────────────────────────────────

  connect(): void {
    if (this.connected) return
    this.readyState = 0 // CONNECTING

    setTimeout(() => {
      this.connected = true
      this.readyState = 1 // OPEN
      this.emitLocal('connect')
      this.scheduleNotifications()
    }, 500)
  }

  disconnect(): void {
    this.connected = false
    this.readyState = 3
    this.clearCollaboratorTimers()
    if (this.notifTimer) clearTimeout(this.notifTimer)
    this.emitLocal('disconnect', 'io client disconnect')
  }

  // ─── Emit Router (Client → Server) ───────────────────────────────────────────

  emit_to_server(event: string, data: any): void {
    switch (event) {
      case 'join_session':
        this.handleJoinSession(data)
        break

      case 'create_session':
        this.handleCreateSession(data)
        break

      case 'leave_session':
        this.sessionId = null
        this.clearCollaboratorTimers()
        break

      case 'create_file':
        this.handleCreateFile(data)
        break

      case 'delete_file':
        this.handleDeleteFile(data)
        break

      case 'rename_file':
        this.handleRenameFile(data)
        break

      case 'switch_file':
        this.handleSwitchFile(data)
        break

      case 'content_change':
      case 'yjs_awareness':
      case 'mark_yjs_initialized':
      case 'cursor_move':
        // Handled locally by Monaco — no server needed
        break

      case 'yjs_update':
        this.handleYjsUpdate(data)
        break

      case 'terminal_join':
        this.handleTerminalJoin(data)
        break

      case 'terminal_input':
        this.handleTerminalInput(data)
        break

      case 'terminal_command':
        this.handleTerminalCommand(data)
        break

      case 'run_code':
        this.handleRunCode(data)
        break

      case 'stop_execution':
        this.emitLocal('execution_stopped', { message: 'Execution stopped', type: 'user' })
        break

      case 'send_chat_message':
        this.handleChatMessage(data)
        break

      case 'request_sync':
        this.handleSyncRequest(data)
        break

      default:
        // Silently swallow unhandled events (debug, gui, etc.)
        break
    }
  }

  // ─── Session Handlers ─────────────────────────────────────────────────────────

  private handleJoinSession(data: any): void {
    const { session_id, project_id } = data
    this.sessionId = session_id

    // Find the correct project based on project_id or session_id suffix mapping
    const projects = demoDb.getProjects()
    let project = projects.find(p => p.id === project_id)
    if (!project && project_id) {
      project = projects.find(p => session_id.includes(p.id))
    }
    if (!project) {
      project = projects[0]
    }
    this.projectId = project?.id || null
    this.projectName = project?.name || 'project'

    const files = project ? demoDb.getFiles(project.id) : {}
    const fileEntries = Object.entries(files)
    const activeFile = project?.active_file || fileEntries[0]?.[0] || ''

    // Initialize mock doc and seed files
    this.mockDoc = new Y.Doc()
    this.mockAwareness = new Awareness(this.mockDoc)
    for (const [name, fileData] of Object.entries(files)) {
      const yText = this.mockDoc.getText(name)
      if (yText.length === 0 && fileData.content) {
        yText.insert(0, fileData.content)
      }
    }

    setTimeout(() => {
      this.emitLocal('session_joined', {
        session_id,
        content: files[activeFile]?.content || '',
        users: [],
        version: 1,
        files,
        active_file: activeFile,
        user_id: demoDb.getUser()?.uid || 'demo-user',
        color: demoDb.getUser()?.color || DEMO_COLORS[0],
        project_id: project?.id,
        project_name: project?.name,
      })

      // Add fake collaborators after a delay
      this.scheduleCollaborators()
    }, 600)
  }

  private handleCreateSession(data: any): void {
    const sessionId = uuid()
    this.sessionId = sessionId

    setTimeout(() => {
      this.emitLocal('session_created', {
        session_id: sessionId,
        content: '',
        version: 1,
        files: {},
        active_file: '',
        user_id: demoDb.getUser()?.uid || 'demo-user',
        color: demoDb.getUser()?.color || DEMO_COLORS[0],
      })
    }, 300)
  }

  // ─── File Handlers ─────────────────────────────────────────────────────────────

  private handleCreateFile(data: any): void {
    const { file_name, file_content = '' } = data
    if (this.projectId) {
      demoDb.saveFile(this.projectId, file_name, file_content)
    }
    setTimeout(() => {
      this.emitLocal('file_created', {
        file_name,
        content: file_content,
        should_open: true,
      })
    }, 200)
  }

  private handleDeleteFile(data: any): void {
    const { file_name } = data
    if (this.projectId) {
      demoDb.deleteFile(this.projectId, file_name)
    }
    const files = this.projectId ? demoDb.getFiles(this.projectId) : {}
    const remaining = Object.keys(files)
    setTimeout(() => {
      this.emitLocal('file_deleted', {
        file_name,
        new_active_file: remaining[0] || '',
      })
    }, 150)
  }

  private handleRenameFile(data: any): void {
    const { old_name, new_name } = data
    if (this.projectId) {
      const files = demoDb.getFiles(this.projectId)
      if (files[old_name]) {
        const content = files[old_name].content
        demoDb.saveFile(this.projectId, new_name, content)
        demoDb.deleteFile(this.projectId, old_name)
      }
    }
    setTimeout(() => {
      this.emitLocal('file_renamed', { old_name, new_name })
    }, 150)
  }

  private handleSwitchFile(data: any): void {
    const { file_name } = data
    const files = this.projectId ? demoDb.getFiles(this.projectId) : {}
    const fileData = files[file_name]

    setTimeout(() => {
      this.emitLocal('file_switched', {
        file_name,
        content: fileData?.content || '',
        version: fileData?.version || 1,
      })
    }, 50)
  }

  // ─── Terminal Handler ─────────────────────────────────────────────────────────

  private handleTerminalJoin(_data: any): void {
    const prompt = this.getTerminal()?.getPrompt() || '$ '
    this.emitLocal('terminal_output', { chunk: prompt, stream: 'stdout' })
  }

  private handleTerminalInput(data: any): void {
    const { input } = data
    if (!input) return

    const terminal = this.getTerminal()
    if (!terminal) return

    for (let i = 0; i < input.length; i++) {
      const char = input[i]
      if (char === '\r') {
        // Enter key
        this.emitLocal('terminal_output', { chunk: '\r\n', stream: 'stdout' })
        const cmd = this.terminalBuffer
        this.terminalBuffer = ''
        
        terminal.handleCommand(
          cmd,
          (out) => {
            this.emitLocal('terminal_output', { chunk: out.text + '\r\n', stream: out.stream })
          },
          (exitCode) => {
            const prompt = terminal.getPrompt()
            this.emitLocal('terminal_output', { chunk: prompt, stream: 'stdout' })
            this.emitLocal('terminal_complete', {
              exit_code: exitCode,
              duration: 0,
              prompt,
              silent: false,
            })
          }
        )
      } else if (char === '\x7f' || char === '\b') {
        // Backspace
        if (this.terminalBuffer.length > 0) {
          this.terminalBuffer = this.terminalBuffer.slice(0, -1)
          this.emitLocal('terminal_output', { chunk: '\b \b', stream: 'stdout' })
        }
      } else if (char === '\u0003') {
        // Ctrl+C
        this.terminalBuffer = ''
        const prompt = terminal.getPrompt()
        this.emitLocal('terminal_output', { chunk: '^C\r\n' + prompt, stream: 'stdout' })
      } else {
        // Character echo
        this.terminalBuffer += char
        this.emitLocal('terminal_output', { chunk: char, stream: 'stdout' })
      }
    }
  }

  private handleTerminalCommand(data: any): void {
    const { command } = data
    if (command === 'clear') {
      // Let xterm handle clear natively — no output needed
      this.emitLocal('terminal_complete', { exit_code: 0, duration: 0, prompt: this.getTerminal()?.getPrompt() })
      return
    }

    const terminal = this.getTerminal()
    if (!terminal) {
      this.emitLocal('terminal_error', { message: 'Terminal not available' })
      return
    }

    terminal.handleCommand(
      command,
      (out) => {
        this.emitLocal('terminal_output', { chunk: out.text + '\r\n', stream: out.stream })
      },
      (exitCode) => {
        const prompt = terminal.getPrompt()
        this.emitLocal('terminal_complete', {
          exit_code: exitCode,
          duration: 0,
          prompt,
          silent: false,
        })
      }
    )
  }

  private getTerminal() {
    if (!this.projectId || !this.projectName) return null
    return getOrCreateTerminal(this.projectId, this.projectName)
  }

  // ─── Code Execution Handler ────────────────────────────────────────────────────

  private handleRunCode(data: any): void {
    const { file_name = 'main.py', language = 'python' } = data

    this.emitLocal('run_started', { file_name, language })

    const isJS = ['javascript', 'typescript'].includes(language)
    const isPy = ['python'].includes(language)

    const outputLines = isPy ? [
      '🐍 Python 3.12.0',
      'Running script...',
      '',
      '> Loading data...',
      '> Processing 10,000 records...',
      '> Analysis complete!',
      '',
      'Results:',
      '  Accuracy: 94.3%',
      '  Precision: 91.7%',
      '  Recall: 96.1%',
    ] : isJS ? [
      '> webpack 5.94.0 compiled successfully in 1847ms',
      '> Starting server...',
      '> [vite] connected.',
      '> Server ready at http://localhost:3000',
    ] : [
      'Executing...',
      'Done.',
    ]

    let i = 0
    const interval = setInterval(() => {
      if (i >= outputLines.length) {
        clearInterval(interval)
        setTimeout(() => {
          this.emitLocal('run_complete', { exit_code: 0, duration: 1.2, file_name, language })
        }, 300)
        return
      }
      this.emitLocal('run_output', { chunk: outputLines[i] + '\n', stream: 'stdout', file_name, language })
      i++
    }, 200)
  }

  // ─── Chat Handler ─────────────────────────────────────────────────────────────

  private handleChatMessage(data: any): void {
    const { message, user_name } = data

    // Echo the message back
    setTimeout(() => {
      this.emitLocal('chat_message', {
        id: uuid(),
        user_id: demoDb.getUser()?.uid || 'demo',
        user_name: user_name || demoDb.getUser()?.name || 'You',
        message,
        timestamp: new Date().toISOString(),
      })
    }, 50)

    // Occasionally trigger a collaborator reply
    if (Math.random() > 0.5) {
      const collab = FAKE_COLLABORATORS[Math.floor(Math.random() * FAKE_COLLABORATORS.length)]
      const replies = [
        'Looks good! 👍',
        'Nice work on this.',
        'I can take a look at that tomorrow.',
        'Can you add a test for this?',
        'LGTM! Merging now.',
        'Great idea, let me try that.',
      ]
      setTimeout(() => {
        this.emitLocal('chat_message', {
          id: uuid(),
          user_id: collab.id,
          user_name: collab.name,
          message: replies[Math.floor(Math.random() * replies.length)],
          timestamp: new Date().toISOString(),
        })
      }, 1500 + Math.random() * 2000)
    }
  }

  // ─── Sync Handler ─────────────────────────────────────────────────────────────

  private handleSyncRequest(data: any): void {
    this.emitLocal('sync_response', {
      session_id: data.session_id,
      content: '',
      version: 1,
      version_mismatch: false,
    })
  }

  private handleYjsUpdate(data: any): void {
    const { update } = data
    if (!update) return
    try {
      const binary = base64ToUint8(update)
      Y.applyUpdate(this.mockDoc, binary, 'client')
    } catch (e) {
      console.warn('[FakeSocket] Failed to apply client Yjs update:', e)
    }
  }

  // ─── Fake Collaborators ───────────────────────────────────────────────────────

  private scheduleCollaborators(): void {
    this.clearCollaboratorTimers()

    // Alice joins after 3 seconds
    this.collaboratorTimers.push(setTimeout(() => {
      if (!this.connected || !this.sessionId) return
      const alice = FAKE_COLLABORATORS[0]
      this.emitLocal('user_joined', {
        user_id: alice.id,
        user_name: alice.name,
        color: alice.color,
        handle: alice.handle,
        role: 'editor',
      })

      // Alice's cursor moves
      this.startFakeCursors(alice)
    }, 3000))

    // Bob joins after 6 seconds
    this.collaboratorTimers.push(setTimeout(() => {
      if (!this.connected || !this.sessionId) return
      const bob = FAKE_COLLABORATORS[1]
      this.emitLocal('user_joined', {
        user_id: bob.id,
        user_name: bob.name,
        color: bob.color,
        handle: bob.handle,
        role: 'editor',
      })
      this.startFakeCursors(bob)
    }, 6000))
  }

  private startFakeCursors(collab: FakeCollaborator): void {
    const files = this.projectId ? demoDb.getFiles(this.projectId) : {}
    const fileNames = Object.keys(files)
    if (fileNames.length === 0) return

    // Pick a file to simulate typing on
    const file = fileNames[0]
    const content = files[file]?.content || ''
    const docLength = content.length
    
    // Numeric Yjs client ID for this fake collaborator
    const yjsClientId = Math.floor(Math.random() * 1000000) + 2000

    const moveInterval = setInterval(() => {
      if (!this.connected || !this.sessionId) {
        clearInterval(moveInterval)
        return
      }

      // Generate a random character offset in the document
      const offset = Math.floor(Math.random() * Math.max(docLength, 1))

      // Update their state on our mock awareness instance
      this.mockAwareness.states.set(yjsClientId, {
        user: {
          name: collab.name,
          color: collab.color,
        },
        cursor: {
          anchor: offset,
          head: offset,
        },
      })

      // Encode and emit Yjs awareness update
      const awarenessUpdate = encodeAwarenessUpdate(this.mockAwareness, [yjsClientId])
      const base64Update = uint8ToBase64(awarenessUpdate)
      this.emitLocal('yjs_awareness', { update: base64Update })

      // Also emit standard cursor_update event for session sidebar sync
      this.emitLocal('cursor_update', {
        user_id: collab.id,
        position: {
          line: Math.floor(Math.random() * 30) + 1,
          column: Math.floor(Math.random() * 60) + 1,
          filename: file,
        },
      })
    }, 2000 + Math.random() * 2000)

    this.collaboratorTimers.push(moveInterval)
  }

  private clearCollaboratorTimers(): void {
    for (const t of this.collaboratorTimers) clearTimeout(t)
    this.collaboratorTimers = []
  }

  // ─── Notifications ────────────────────────────────────────────────────────────

  private scheduleNotifications(): void {
    const notifications = [
      { delay: 4000, event: 'deployment_complete', text: '🚀 ai-dashboard deployed — live at ai-dashboard-x4k.codepark.app' },
      { delay: 8000, event: 'collaborator_joined', text: '👥 Alice Chen joined your workspace' },
      { delay: 14000, event: 'ai_complete', text: '🤖 AI finished generating your component' },
    ]

    for (const notif of notifications) {
      const t = setTimeout(() => {
        if (!this.connected) return
        // Notifications are handled by the notification system directly via
        // the fakeApi; this is just for real-time feel — no socket event needed
      }, notif.delay)
      this.collaboratorTimers.push(t)
    }
  }
}

// ─── Factory function matching production API ─────────────────────────────────

export interface RealtimeSocketOptions {
  baseUrl?: string
  wsBaseUrl?: string
  getWsToken?: (sessionId: string) => Promise<string>
}

export function createFakeRealtimeSocket(_options?: RealtimeSocketOptions): FakeRealtimeSocket {
  const socket = new FakeRealtimeSocket()
  return socket
}
