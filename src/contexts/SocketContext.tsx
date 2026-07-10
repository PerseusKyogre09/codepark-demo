import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import type {
  Operation,
  CursorPosition,
  FileMap,
  CollaboratorUser,
  ProjectAccessRequest,
} from '../types';
import { showErrorToast, showWarningToast, showInfoToast, logError } from '../utils/errorHandling';
import { apiClient, getApiBaseUrl } from '../services/api';
import { createRealtimeSocket, type RealtimeSocket } from '../services/realtime';
import { useAuth } from './AuthContext';
import { emitProjectLifecycleEvent } from '../utils/projectSync';

/**
 * SocketContext Provider
 * 
 * Responsibilities:
 * - Exposes connectionStatus, connectionError, and isConnected states to the application.
 * - Manages the singleton realtime socket connection instance.
 * - Note: Reconnection timing and logic are encapsulated within NativeWebSocketAdapter.
 */

// Connection status type
export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'reconnecting' | 'error';

// Realtime event types for type safety
export interface ClientToServerEvents {
  // Session Management
  create_session: (data: { user_id: string; user_name: string; user_handle?: string; color?: string }) => void;
  join_session: (data: { session_id: string; user_id: string; user_name: string; user_handle?: string; color?: string }) => void;
  leave_session: (data: { session_id: string; user_id: string }) => void;

  // File Operations
  create_file: (data: { session_id: string; file_name: string; user_id?: string; file_content?: string }) => void;
  create_folder: (data: { session_id: string; folder_path: string }) => void;
  delete_file: (data: { session_id: string; file_name: string }) => void;
  rename_file: (data: { session_id: string; old_name: string; new_name: string }) => void;
  move_folder: (data: { session_id: string; source_folder: string; target_folder?: string }) => void;
  switch_file: (data: { session_id: string; user_id: string; file_name: string }) => void;
  refresh_files: (data: { session_id: string }) => void;

  // Code Editing (OT)
  operation: (data: { session_id: string; operation: Operation; file_name?: string }) => void;
  cursor_move: (data: { session_id: string; user_id: string; position: CursorPosition; selection?: any }) => void;

  // Code Execution
  run_code: (data: { code: string; file_name?: string; language?: string; session_id?: string; user_id?: string }) => void;
  run_gui_code: (data: { code: string; file_name?: string; language?: string; session_id?: string; user_id?: string }) => void;
  stop_execution: (data?: any) => void;

  // Terminal
  terminal_command: (data: { command: string; session_id?: string; confirmed?: boolean }) => void;
  terminal_input: (data: { input: string; session_id?: string }) => void;
  terminal_share_command: (data: { command: string; session_id?: string }) => void;
  terminal_join: (data: { session_id?: string }) => void;
  terminal_request_prompt: (data?: { session_id?: string }) => void;
  terminal_request_preview: (data?: { session_id?: string }) => void;
  terminal_resize: (data: { cols: number; rows: number; session_id?: string }) => void;

  // GUI Session Management
  terminate_gui_session: (data: { gui_session_id: string }) => void;
  get_gui_session_status: (data: { gui_session_id: string }) => void;
  vnc_input: (data: {
    session_id: string;
    event_type: 'mouse' | 'key';
    x?: number;
    y?: number;
    relative?: boolean;
    key?: string;
    action?: 'keydown' | 'keyup' | 'keypress'
  }) => void;
  gui_audio_offer: (data: { gui_session_id: string; offer: { sdp: string; type: RTCSdpType } }) => void;
  gui_audio_candidate: (data: { gui_session_id: string; peer_id: string; candidate: RTCIceCandidateInit | null }) => void;

  // Sync
  request_sync: (data: { session_id: string; client_version: number }) => void;

  // User updates - allow client to tell server their new id/name and request propagation
  update_user: (data: { session_id: string; old_user_id?: string; user_id: string; user_name: string; color?: string; user_handle?: string }) => void;

  // Role management
  change_role: (data: { session_id: string; target_user_id: string; new_role: 'editor' | 'viewer' }) => void;

  // Chat
  send_chat_message: (data: { session_id: string; user_id: string; user_name: string; message: string }) => void;
  get_chat_history: (data: { session_id?: string }) => void;

  // Real-time Sync (Yjs & Custom)
  content_change: (data: { session_id: string; file_name: string; content: string }) => void;
  files_changed: (data: { session_id: string; reason: string; files?: any }) => void;
  yjs_update: (data: { session_id: string; update: string }) => void;
  yjs_awareness: (data: { session_id: string; update: string }) => void;
  mark_yjs_initialized: (data: { session_id: string }) => void;

  // Session Locking
  lock_session: (data: { session_id: string }) => void;
  request_access: (data: { session_id: string; user_id: string; user_name: string; user_handle?: string }) => void;
  respond_to_request: (data: { session_id: string; requester_id: string; approved: boolean }) => void;
  request_project_access: (data: { project_id: string; message?: string }) => void;
  respond_to_project_access_request: (data: { project_id: string; requester_id: string; approved: boolean }) => void;

  // Debug
  start_debug: (data: { session_id: string; file_name: string; language: string; code?: string; breakpoints?: any[] }) => void;
  stop_debug: (data: { session_id: string }) => void;
  debug_command: (data: { session_id: string; command: string; args?: any[] }) => void;
  debug_evaluate: (data: { session_id: string; expression: string; frame_id?: number }) => void;
}

export interface ServerToClientEvents {
  // Connection
  connected: (data: { status: string; message: string }) => void;
  error: (data: { message: string }) => void;

  // Session
  session_created: (data: {
    session_id: string;
    content: string;
    version: number;
    files?: FileMap;
    active_file?: string;
    user_id: string;
    color: string;
    project_id?: string;
    project_name?: string;
    last_saved_at?: string;
  }) => void;
  session_joined: (data: {
    session_id: string;
    content: string;
    users: CollaboratorUser[];
    version: number;
    files?: FileMap;
    active_file?: string;
    user_id: string;
    color: string;
    project_id?: string;
    project_name?: string;
    last_saved_at?: string;
  }) => void;
  session_not_found: (data: { message: string }) => void;
  session_full: (data: { message: string }) => void;
  user_joined: (data: { user_id: string; user_name: string; color: string; handle?: string }) => void;
  user_left: (data: { user_id: string }) => void;

  // Session Locking
  session_locked: (data: { session_id: string; message: string }) => void;
  session_locked_status: (data: { is_locked: boolean }) => void;
  access_request: (data: { user_id: string; user_name: string; handle?: string; timestamp: string }) => void;
  access_request_resolved: (data: { user_id: string; approved: boolean; is_me?: boolean }) => void;
  project_access_request: (data: ProjectAccessRequest) => void;
  project_access_request_resolved: (data: ProjectAccessRequest & { approved: boolean; session_id?: string | null }) => void;

  // File System
  file_created: (data: { file_name: string; content?: string; creator_id?: string; should_open?: boolean }) => void;
  folder_created: (data: { folder_path: string }) => void;
  file_deleted: (data: { file_name: string; new_active_file?: string }) => void;
  file_renamed: (data: { old_name: string; new_name: string }) => void;
  folder_moved: (data: { source_folder: string; target_folder?: string }) => void;
  file_switched: (data: { file_name: string; content: string; version: number }) => void;
  user_switched_file: (data: { user_id: string; file_name: string }) => void;
  files_changed: (data: { session_id: string; files: FileMap; reason: string; command?: string }) => void;
  files_refreshed: (data: { files: FileMap; active_file?: string }) => void;

  // Collaborative Editing
  operation: (data: { operation: any; version: number; file_name?: string }) => void;
  operation_ack: (data: { version: number; file_name?: string }) => void;
  cursor_update: (data: { user_id: string; position: CursorPosition; selection?: any }) => void;

  // Code Execution
  run_started: (data: { file_name?: string; language?: string; session_id?: string; user_id?: string }) => void;
  run_output: (data: { chunk: string; stream: 'stdout' | 'stderr'; file_name?: string; language?: string; session_id?: string; user_id?: string }) => void;
  run_complete: (data: { exit_code: number; duration: number; file_name?: string; language?: string; session_id?: string; user_id?: string }) => void;
  run_error: (data: { message: string; file_name?: string; language?: string; session_id?: string; user_id?: string }) => void;
  execution_stopped: (data: { message: string; type: string }) => void;

  // GUI Execution
  gui_status: (data: { status: string; message: string; gui_session_id?: string; file_name?: string; language?: string; session_id?: string; user_id?: string }) => void;
  gui_session_created: (data: {
    gui_session_id: string;
    novnc_url: string;
    framework: string;
    audio_enabled?: boolean;
    file_name?: string;
    language?: string;
    session_id?: string;
    user_id?: string;
  }) => void;
  gui_output: (data: { gui_session_id: string; chunk: string; stream: 'stdout' | 'stderr'; file_name?: string; language?: string; session_id?: string; user_id?: string }) => void;
  gui_complete: (data: { gui_session_id: string; exit_code: number; duration: number; timeout?: boolean; timeout_reason?: string; message?: string; file_name?: string; language?: string; session_id?: string; user_id?: string }) => void;
  gui_error: (data: { message: string; gui_session_id?: string; file_name?: string; language?: string; session_id?: string; user_id?: string }) => void;
  gui_session_terminated: (data: { gui_session_id: string; message: string }) => void;
  gui_session_status: (data: { gui_session_id: string; status: string; message?: string; novnc_url?: string }) => void;
  gui_missing_modules: (data: { missing_modules: string[]; message: string; file_name?: string; language?: string; session_id?: string; user_id?: string }) => void;
  gui_audio_answer: (data: { gui_session_id: string; peer_id: string; answer: { sdp: string; type: RTCSdpType } }) => void;
  gui_audio_error: (data: { gui_session_id?: string; message: string }) => void;
  gui_audio_detected: (data: { gui_session_id: string }) => void;

  // Terminal
  terminal_started: (data: { command_id: string }) => void;
  terminal_output: (data: { chunk: string; stream: 'stdout' | 'stderr'; command_id?: string; session_id?: string }) => void;
  terminal_history: (data: { history: string; session_id?: string }) => void;
  terminal_complete: (data: { exit_code: number; duration: number; prompt?: string; silent?: boolean; command_id?: string; session_id?: string }) => void;
  terminal_error: (data: { message: string; command_id?: string; session_id?: string }) => void;
  terminal_prompt: (data: { prompt: string }) => void;
  terminal_preview: (data: { enabled: boolean; message?: string; url?: string }) => void;
  terminal_confirm: (data: { command: string; message: string; warning?: boolean }) => void;
  terminal_shared_output: (data: { user_id: string; command: string }) => void;

  // Sync
  sync_response: (data: { session_id: string; content: string; version: number; version_mismatch: boolean }) => void;

  // User updates broadcast
  user_updated: (data: { old_user_id?: string; user_id: string; user_name: string; color?: string; handle?: string }) => void;

  // Role changed broadcast
  role_changed: (data: { user_id: string; new_role: 'owner' | 'editor' | 'viewer' }) => void;
  permissions_updated: (data: { project_id?: string; user_id?: string; role?: string; action?: 'added' | 'removed' }) => void;
  project_created: (data: { project_id?: string; project?: any }) => void;
  project_updated: (data: { project_id?: string; project?: any }) => void;
  project_deleted: (data: { project_id?: string; reason?: string }) => void;
  collaborator_added: (data: { project_id?: string; user_id?: string }) => void;
  collaborator_removed: (data: { project_id?: string; user_id?: string }) => void;
  access_approved: (data: { project_id?: string; requester_id?: string }) => void;
  access_revoked: (data: { project_id?: string; requester_id?: string }) => void;
  ownership_transferred: (data: { project_id?: string; owner_id?: string }) => void;
  project_invalidated: (data: { project_id?: string; reason?: string }) => void;

  // Chat
  chat_message: (data: { id: string; user_id: string; user_name: string; message: string; timestamp: string }) => void;
  chat_history: (data: { messages: Array<{ id: string; user_id: string; user_name: string; message: string; timestamp: string }> }) => void;

  // Debug
  debug_started: (data: { session_id: string; message: string }) => void;
  debug_stopped: (data: { session_id: string; message: string }) => void;
  debug_state_update: (data: { session_id: string; state: any }) => void;
  debug_error: (data: { session_id: string; message: string; details?: any }) => void;
  debug_evaluation_result: (data: { session_id: string; result: any; expression: string }) => void;
  debug_stack_trace: (data: { session_id: string; frames: any[] }) => void;
  debug_variables: (data: { session_id: string; variables: any[] }) => void;

  // Batch Updates (Performance Optimization)
  batch_update: (data: { messages: Array<{ event: string; data: any }> }) => void;
}

interface SocketContextValue {
  socket: RealtimeSocket | null;
  connectionStatus: ConnectionStatus;
  connectionError: string | null;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
}

interface SocketProviderProps {
  children: React.ReactNode;
  url?: string;
  autoConnect?: boolean;
}

const SocketContext = createContext<SocketContextValue | undefined>(undefined);

let globalSocket: RealtimeSocket | null = null;

export const SocketProvider: React.FC<SocketProviderProps> = ({
  children,
  url,
  autoConnect = true,
}) => {
  const resolvedUrl = url || getApiBaseUrl() || window.location.origin;
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [socket, setSocket] = useState<RealtimeSocket | null>(globalSocket);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const prevAuthStateRef = useRef<boolean>(isAuthenticated);
  const statusRef = useRef<ConnectionStatus>(connectionStatus);

  // Sync ref with state
  useEffect(() => {
    statusRef.current = connectionStatus;
  }, [connectionStatus]);

  const connect = useCallback(() => {
    // Atomic check for singleton
    if (globalSocket && (globalSocket.connected || globalSocket.readyState === 1 || globalSocket.readyState === 0)) {
      if (socket !== globalSocket) {
        setSocket(globalSocket);
      }
      return;
    }

    console.log('[Socket] connect() called, autoConnect:', autoConnect);
    if (statusRef.current === 'connecting') {
      console.log('[Socket] Already connecting, skipping');
      return;
    }

    console.log('[Socket] Initializing connection to:', resolvedUrl);
    
    const newSocket = createRealtimeSocket({
      baseUrl: resolvedUrl,
      wsBaseUrl: import.meta.env.VITE_NATIVE_WS_BASE,
      getWsToken: async (sessionId: string) => {
        const result = await apiClient.getWebsocketToken(sessionId);
        return result.token;
      },
    });

    globalSocket = newSocket;
    setSocket(newSocket);

    // Connection successful
    newSocket.on('connect', () => {
      console.log('[Socket] Connected successfully');
      
      // Show reconnection success message if this was a reconnect
      if (statusRef.current === 'reconnecting' || statusRef.current === 'error') {
        showInfoToast('Reconnected to server');
      }

      setConnectionStatus('connected');
      setConnectionError(null);
    });

    // Connection error
    newSocket.on('connect_error', (error: any) => {
      const message = String(error?.message || 'Connection error');
      console.error('[Socket] Connection error:', message);
      
      const normalizedMessage = message.toLowerCase();
      const isAuthError = 
        normalizedMessage.includes('401') || 
        normalizedMessage.includes('403') || 
        normalizedMessage.includes('unauthorized') || 
        normalizedMessage.includes('token is empty') || 
        normalizedMessage.includes('authentication required');

      // If it's a confirmed authentication/authorization error, don't attempt to reconnect and show error toast
      if (isAuthError) {
        console.warn('[Socket] Authentication required for WebSocket, skipping reconnect.');
        setConnectionStatus('error');
        setConnectionError('Authentication required');
        showErrorToast('Failed to establish collaborative session. Please sign in again.');
        return;
      }

      logError(error, 'Socket Connection');
      setConnectionError(message);
    });

    // Reconnection attempt from the adapter
    newSocket.on('reconnect_attempt', (data: any) => {
      console.log(`[Socket] Reconnect attempt ${data.attempt}, delay ${data.delay}ms`);
      setConnectionStatus('reconnecting');
      setConnectionError('Connection lost');
      if (data.attempt === 1) {
        showWarningToast('Connection lost. Attempting to reconnect...');
      }
    });

    // Disconnection
    newSocket.on('disconnect', (reason: any) => {
      const reasonText = typeof reason === 'string' ? reason : 'transport close';
      console.log('[Socket] Disconnected:', reason);
      setConnectionStatus('disconnected');

      // Attempt to reconnect if disconnection was not intentional
      if (reasonText === 'io server disconnect') {
        // Server disconnected the client, don't reconnect automatically
        const errorMsg = 'Disconnected by server';
        setConnectionError(errorMsg);
        showWarningToast(errorMsg);
      } else if (reasonText === 'io client disconnect') {
        // Client disconnected intentionally, don't reconnect
        setConnectionError(null);
      } else {
        // Unexpected disconnection, adapter will schedule reconnect automatically.
        setConnectionError('Connection lost');
      }
    });

    // Server error events
    newSocket.on('error', (data: any) => {
      const message = data?.message || 'Server error';
      const normalizedMessage = String(message).toLowerCase();
      if (
        normalizedMessage.includes('unable to update user identity') ||
        normalizedMessage.includes('missing required fields: session_id, user_id')
      ) {
        console.warn('[Socket] Ignoring transient identity sync error:', message);
        return;
      }
      console.error('[Socket] Server error:', message);
      logError(message, 'Socket Server Error');
      setConnectionError(message);
      showErrorToast(message, 'Server error');
    });

    setSocket(newSocket);
    globalSocket = newSocket;
    
    // START THE CONNECTION
    setConnectionStatus('connecting');
    newSocket.connect();
  }, [resolvedUrl]);


  const disconnect = useCallback(() => {
    if (globalSocket) {
      console.log('[Socket] Disconnecting singleton');
      globalSocket.disconnect();
      globalSocket = null;
      setSocket(null);
      setConnectionStatus('disconnected');
      setConnectionError(null);
    }
  }, []);



  // Auto-connect on mount if enabled
  useEffect(() => {
    if (autoConnect && isAuthenticated && !authLoading) {
      connect();
    }

    // Add handler for batched messages (performance optimization)
    // This processes server-side batched events through existing socket handlers
    if (socket) {
      const handleBatchUpdate = (data: { messages: Array<{ event: string; data: any }> }) => {
        try {
          if (!data || !Array.isArray(data.messages)) {
            console.error('Invalid batch_update data received');
            return;
          }

          // Trigger each event through socket's internal event emitter
          // This properly invokes all registered event handlers for each event
          data.messages.forEach((msg) => {
            if (msg && msg.event && msg.data) {
              // Use local realtime listener registry to trigger handlers
              // @ts-ignore - accessing internal emit mechanism
              const listeners = socket.listeners(msg.event);
              listeners.forEach((listener: any) => {
                try {
                  listener(msg.data);
                } catch (err) {
                  console.error(`Error in ${msg.event} handler:`, err);
                }
              });
            }
          });
        } catch (error) {
          console.error('Error processing batch_update:', error);
        }
      };

      socket.on('batch_update', handleBatchUpdate);

      const lifecycleHandler = (type: Parameters<typeof emitProjectLifecycleEvent>[0]) => (data: any) => {
        emitProjectLifecycleEvent(type, {
          project_id: data?.project_id,
          reason: data?.reason || data?.message,
          invalidateAll: type === 'project_deleted' || type === 'project_invalidated',
        });
      };

      const lifecycleHandlers = {
        project_created: lifecycleHandler('project_created'),
        project_updated: lifecycleHandler('project_updated'),
        project_deleted: lifecycleHandler('project_deleted'),
        collaborator_added: lifecycleHandler('collaborator_added'),
        collaborator_removed: lifecycleHandler('collaborator_removed'),
        access_approved: lifecycleHandler('access_approved'),
        access_revoked: lifecycleHandler('access_revoked'),
        ownership_transferred: lifecycleHandler('ownership_transferred'),
        project_invalidated: lifecycleHandler('project_invalidated'),
        permissions_updated: lifecycleHandler('project_permissions_updated'),
      } as const;

      socket.on('project_created', lifecycleHandlers.project_created);
      socket.on('project_updated', lifecycleHandlers.project_updated);
      socket.on('project_deleted', lifecycleHandlers.project_deleted);
      socket.on('collaborator_added', lifecycleHandlers.collaborator_added);
      socket.on('collaborator_removed', lifecycleHandlers.collaborator_removed);
      socket.on('access_approved', lifecycleHandlers.access_approved);
      socket.on('access_revoked', lifecycleHandlers.access_revoked);
      socket.on('ownership_transferred', lifecycleHandlers.ownership_transferred);
      socket.on('project_invalidated', lifecycleHandlers.project_invalidated);
      socket.on('permissions_updated', lifecycleHandlers.permissions_updated);

      // Persist lifecycle handler map on the socket object for cleanup in the same effect scope.
      (socket as any).__projectLifecycleHandlers = lifecycleHandlers;
    }

    // Cleanup on unmount
    return () => {
      if (socket) {
        socket.off('batch_update');
        const lifecycleHandlers = (socket as any).__projectLifecycleHandlers as Record<string, (...args: any[]) => void> | undefined;
        if (lifecycleHandlers) {
          socket.off('project_created', lifecycleHandlers.project_created);
          socket.off('project_updated', lifecycleHandlers.project_updated);
          socket.off('project_deleted', lifecycleHandlers.project_deleted);
          socket.off('collaborator_added', lifecycleHandlers.collaborator_added);
          socket.off('collaborator_removed', lifecycleHandlers.collaborator_removed);
          socket.off('access_approved', lifecycleHandlers.access_approved);
          socket.off('access_revoked', lifecycleHandlers.access_revoked);
          socket.off('ownership_transferred', lifecycleHandlers.ownership_transferred);
          socket.off('project_invalidated', lifecycleHandlers.project_invalidated);
          socket.off('permissions_updated', lifecycleHandlers.permissions_updated);
          delete (socket as any).__projectLifecycleHandlers;
        }
        socket.disconnect();
      }
    };
  }, [autoConnect, connect, isAuthenticated, authLoading]);


  useEffect(() => {
    if (authLoading || !socket) {
      return;
    }

    const previous = prevAuthStateRef.current;
    if (previous === isAuthenticated) {
      return;
    }

    prevAuthStateRef.current = isAuthenticated;

    if (socket.connected) {
      socket.disconnect();
      socket.connect();
    }
  }, [authLoading, isAuthenticated, socket]);

  const value: SocketContextValue = {
    socket,
    connectionStatus,
    connectionError,
    isConnected: connectionStatus === 'connected',
    connect,
    disconnect,
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

export const useSocket = (): SocketContextValue => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
