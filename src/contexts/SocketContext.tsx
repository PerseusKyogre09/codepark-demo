/**
 * SocketContext.tsx — DEMO VERSION
 * Uses fakeSocket instead of the real NativeWebSocketAdapter.
 * The interface exposed to components is identical to production.
 */

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'
import type { RealtimeSocket } from '../services/realtime'
import { createRealtimeSocket } from '../services/realtime'
import { useAuth } from './AuthContext'

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'reconnecting' | 'error'

// Re-export all event type interfaces (identical to production for component compatibility)
export interface ClientToServerEvents {
  create_session: (data: any) => void
  join_session: (data: any) => void
  leave_session: (data: any) => void
  create_file: (data: any) => void
  create_folder: (data: any) => void
  delete_file: (data: any) => void
  rename_file: (data: any) => void
  move_folder: (data: any) => void
  switch_file: (data: any) => void
  refresh_files: (data: any) => void
  operation: (data: any) => void
  cursor_move: (data: any) => void
  run_code: (data: any) => void
  run_gui_code: (data: any) => void
  stop_execution: (data?: any) => void
  terminal_command: (data: any) => void
  terminal_input: (data: any) => void
  terminal_share_command: (data: any) => void
  terminal_join: (data: any) => void
  terminal_request_prompt: (data?: any) => void
  terminal_request_preview: (data?: any) => void
  terminal_resize: (data: any) => void
  terminate_gui_session: (data: any) => void
  get_gui_session_status: (data: any) => void
  vnc_input: (data: any) => void
  gui_audio_offer: (data: any) => void
  gui_audio_candidate: (data: any) => void
  request_sync: (data: any) => void
  update_user: (data: any) => void
  change_role: (data: any) => void
  send_chat_message: (data: any) => void
  get_chat_history: (data: any) => void
  content_change: (data: any) => void
  files_changed: (data: any) => void
  yjs_update: (data: any) => void
  yjs_awareness: (data: any) => void
  mark_yjs_initialized: (data: any) => void
  lock_session: (data: any) => void
  request_access: (data: any) => void
  respond_to_request: (data: any) => void
  request_project_access: (data: any) => void
  respond_to_project_access_request: (data: any) => void
  start_debug: (data: any) => void
  stop_debug: (data: any) => void
  debug_command: (data: any) => void
  debug_evaluate: (data: any) => void
}

export interface ServerToClientEvents {
  connected: (data: any) => void
  error: (data: any) => void
  session_created: (data: any) => void
  session_joined: (data: any) => void
  session_not_found: (data: any) => void
  session_full: (data: any) => void
  user_joined: (data: any) => void
  user_left: (data: any) => void
  session_locked: (data: any) => void
  session_locked_status: (data: any) => void
  access_request: (data: any) => void
  access_request_resolved: (data: any) => void
  project_access_request: (data: any) => void
  project_access_request_resolved: (data: any) => void
  file_created: (data: any) => void
  folder_created: (data: any) => void
  file_deleted: (data: any) => void
  file_renamed: (data: any) => void
  folder_moved: (data: any) => void
  file_switched: (data: any) => void
  user_switched_file: (data: any) => void
  files_changed: (data: any) => void
  files_refreshed: (data: any) => void
  operation: (data: any) => void
  operation_ack: (data: any) => void
  cursor_update: (data: any) => void
  run_started: (data: any) => void
  run_output: (data: any) => void
  run_complete: (data: any) => void
  run_error: (data: any) => void
  execution_stopped: (data: any) => void
  gui_status: (data: any) => void
  gui_session_created: (data: any) => void
  gui_output: (data: any) => void
  gui_complete: (data: any) => void
  gui_error: (data: any) => void
  gui_session_terminated: (data: any) => void
  gui_session_status: (data: any) => void
  gui_missing_modules: (data: any) => void
  gui_audio_answer: (data: any) => void
  gui_audio_error: (data: any) => void
  gui_audio_detected: (data: any) => void
  terminal_started: (data: any) => void
  terminal_output: (data: any) => void
  terminal_history: (data: any) => void
  terminal_complete: (data: any) => void
  terminal_error: (data: any) => void
  terminal_prompt: (data: any) => void
  terminal_preview: (data: any) => void
  terminal_confirm: (data: any) => void
  terminal_shared_output: (data: any) => void
  sync_response: (data: any) => void
  user_updated: (data: any) => void
  role_changed: (data: any) => void
  permissions_updated: (data: any) => void
  project_created: (data: any) => void
  project_updated: (data: any) => void
  project_deleted: (data: any) => void
  collaborator_added: (data: any) => void
  collaborator_removed: (data: any) => void
  access_approved: (data: any) => void
  access_revoked: (data: any) => void
  ownership_transferred: (data: any) => void
  project_invalidated: (data: any) => void
  chat_message: (data: any) => void
  chat_history: (data: any) => void
  debug_started: (data: any) => void
  debug_stopped: (data: any) => void
  debug_state_update: (data: any) => void
  debug_error: (data: any) => void
  debug_evaluation_result: (data: any) => void
  debug_stack_trace: (data: any) => void
  debug_variables: (data: any) => void
  batch_update: (data: any) => void
}

interface SocketContextValue {
  socket: RealtimeSocket | null
  connectionStatus: ConnectionStatus
  connectionError: string | null
  isConnected: boolean
  connect: () => void
  disconnect: () => void
}

interface SocketProviderProps {
  children: React.ReactNode
  url?: string
  autoConnect?: boolean
}

const SocketContext = createContext<SocketContextValue | undefined>(undefined)

let globalSocket: RealtimeSocket | null = null

export const SocketProvider: React.FC<SocketProviderProps> = ({
  children,
  autoConnect = true,
}) => {
  const { isAuthenticated, loading: authLoading } = useAuth()
  const [socket, setSocket] = useState<RealtimeSocket | null>(globalSocket)
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected')
  const [connectionError, setConnectionError] = useState<string | null>(null)
  const statusRef = useRef<ConnectionStatus>(connectionStatus)

  useEffect(() => {
    statusRef.current = connectionStatus
  }, [connectionStatus])

  const connect = useCallback(() => {
    if (globalSocket && (globalSocket.connected || globalSocket.readyState === 1)) {
      if (socket !== globalSocket) setSocket(globalSocket)
      return
    }

    if (statusRef.current === 'connecting') return

    // Create fake socket
    const newSocket = createRealtimeSocket({ baseUrl: '' })

    globalSocket = newSocket
    setSocket(newSocket)
    setConnectionStatus('connecting')

    newSocket.on('connect', () => {
      setConnectionStatus('connected')
      setConnectionError(null)
    })

    newSocket.on('disconnect', () => {
      setConnectionStatus('disconnected')
    })

    newSocket.on('connect_error', (error: any) => {
      setConnectionStatus('error')
      setConnectionError(String(error?.message || 'Connection error'))
    })

    newSocket.connect()
  }, [socket])

  const disconnect = useCallback(() => {
    if (globalSocket) {
      globalSocket.disconnect()
      globalSocket = null
      setSocket(null)
      setConnectionStatus('disconnected')
      setConnectionError(null)
    }
  }, [])

  // Auto-connect when authenticated
  useEffect(() => {
    if (autoConnect && isAuthenticated && !authLoading) {
      connect()
    }

    return () => {
      if (socket) {
        socket.off('batch_update')
      }
    }
  }, [autoConnect, connect, isAuthenticated, authLoading])

  const value: SocketContextValue = {
    socket,
    connectionStatus,
    connectionError,
    isConnected: connectionStatus === 'connected',
    connect,
    disconnect,
  }

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
}

export const useSocket = (): SocketContextValue => {
  const context = useContext(SocketContext)
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider')
  }
  return context
}
