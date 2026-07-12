import React, { createContext, useContext, useState, useEffect, useCallback, useRef, useMemo } from 'react';
import * as Y from 'yjs';
import { RealtimeProvider } from '../utils/RealtimeProvider';
import { useSocket } from './SocketContext';
import { useAuth } from './AuthContext';
import { useLocation } from 'react-router-dom';
import { useSubscription } from '../hooks/useSubscription';
import { useTheme } from './ThemeContext';
import { showInfoToast } from '../utils/errorHandling';
import { apiClient } from '../services/api';
import { clearProjectScopedCaches, PROJECT_ACCESS_REVOKED_EVENT, PROJECT_CACHE_INVALIDATED_EVENT, PROJECT_DELETED_EVENT, PROJECT_INVALIDATED_EVENT } from '../utils/projectSync';
import type {
  Session,
  FileMap,
  CollaboratorUser,
  AccessRequest,
  ProjectAccessRequest,
  DeveloperIdentity,
} from '../types';
import { useProjects } from '../hooks/useProjects';

/**
 * SessionContext Provider
 * 
 * Hierarchy Model:
 * User -> Project -> Session -> Connection
 * - User: Authenticated user.
 * - Project: Persistent entity.
 * - Session: Temporary collaboration room.
 * - Connection: Browser-tab scoped.
 * 
 * Responsibilities:
 * - Manages active collaboration session state.
 * - Handles join/leave semantics.
 * - Explicit leave clears session state and stops running processes.
 * - Disconnected sessions are preserved for a 30-second grace period for recovery.
 */

interface SessionContextValue {
  session: Session | null;
  isInSession: boolean;
  isCreatingSession: boolean;
  isJoiningSession: boolean;
  sessionError: string | null;
  createSession: (projectName?: string) => Promise<string | null>;
  joinSession: (sessionId: string, projectId?: string) => Promise<string | null>;
  leaveSession: () => void;
  getSessionLink: () => string | null;
  copySessionLink: () => Promise<boolean>;
  replaceSessionFiles: (files: FileMap, activeFile?: string) => void;
  refreshSession: (sessionId?: string) => Promise<boolean>;
  sessionRevision: number;
  clientIdentity: DeveloperIdentity | null;
  canEdit: boolean;
  isReadOnly: boolean;
  toggleLock: () => void;
  requestAccess: (sessionId: string) => void;
  respondToAccessRequest: (requesterId: string, approved: boolean) => void;
  requestProjectAccess: (projectId: string, message?: string) => Promise<boolean>;
  respondToProjectAccessRequest: (projectId: string, requesterId: string, approved: boolean) => Promise<boolean>;
  accessRequests: Array<AccessRequest | ProjectAccessRequest>;
  // Tab management for editor
  openFileInTab: (fileName: string) => void;
  closeFileTab: (fileName: string) => void;
  // Branch management
  currentBranch: string;
  switchBranch: (branchName: string) => Promise<boolean>;
  // Hoisted Yjs state
  ydoc: Y.Doc | null;
  provider: RealtimeProvider | null;
  isSynced: boolean;
}

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

interface SessionProviderProps {
  children: React.ReactNode;
}

const GUEST_ID_STORAGE_KEY = 'codeed_guest_id';
const GUEST_NAME_STORAGE_KEY = 'codeed_guest_name';

const COLLABORATOR_COLOR_PALETTE = [
  '#FF6B6B', '#FF9F43', '#FECA57', '#2ECC71', '#54A0FF',
  '#5F27CD', '#9B59B6', '#FF9FF3', '#48DBFB', '#1DD1A1',
  '#f1c40f', '#e67e22', '#e74c3c', '#ecf0f1', '#95a5a6',
  '#f39c12', '#d35400', '#c0392b', '#bdc3c7', '#7f8c8d',
  '#1abc9c', '#2ecc71', '#3498db', '#9b59b6', '#34495e',
  '#16a085', '#27ae60', '#2980b9', '#8e44ad', '#2c3e50',
  '#EAB543', '#55E6C1', '#CAD3C8', '#F97F51', '#1B9CFC',
  '#F8EFBA', '#58B19F', '#2C3A47', '#B33771', '#3B3B98',
  '#FD7272', '#9AECDB', '#D6A2E8', '#6D214F', '#182C61',
  '#FC427B', '#BDC581', '#82589F'
];

const COLLABORATOR_COLOR_STORAGE_KEY = 'codepark_collaborator_color';

const getRandomCollaboratorColor = () => {
  const index = Math.floor(Math.random() * COLLABORATOR_COLOR_PALETTE.length);
  return COLLABORATOR_COLOR_PALETTE[index];
};

/**
 * Returns a stable collaborator color for the given user.
 * For authenticated users: keyed to their UID so it's consistent across sessions.
 * For guests: keyed to a stable guest ID stored in localStorage.
 * The color is generated once and reused thereafter — it only changes if the user
 * explicitly picks a new one (pro feature).
 */
const getStableCollaboratorColor = (userId?: string): string => {
  const storageKey = userId
    ? `${COLLABORATOR_COLOR_STORAGE_KEY}_${userId}`
    : COLLABORATOR_COLOR_STORAGE_KEY;
  try {
    const stored = localStorage.getItem(storageKey);
    if (stored && COLLABORATOR_COLOR_PALETTE.includes(stored)) return stored;
    const fresh = getRandomCollaboratorColor();
    localStorage.setItem(storageKey, fresh);
    return fresh;
  } catch {
    return getRandomCollaboratorColor();
  }
};

export const SessionProvider: React.FC<SessionProviderProps> = ({ children }) => {
  const { socket, isConnected } = useSocket();
  const { user } = useAuth();
  const { settings } = useTheme();
  const { listProjects } = useProjects(); // useProjects hook for triggering refresh
  const { isPro } = useSubscription();
  const location = useLocation();
  const [session, setSession] = useState<Session | null>(null);
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const [isJoiningSession, setIsJoiningSession] = useState(false);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [sessionRevision, setSessionRevision] = useState(0);
  const [clientIdentity, setClientIdentity] = useState<DeveloperIdentity | null>(null);
  const [accessRequests, setAccessRequests] = useState<Array<AccessRequest | ProjectAccessRequest>>([]);

  // Hoisted Yjs state and refs
  const ydocRef = useRef<Y.Doc | null>(null);
  const providerRef = useRef<RealtimeProvider | null>(null);
  const [ydoc, setYdoc] = useState<Y.Doc | null>(null);
  const [provider, setProvider] = useState<RealtimeProvider | null>(null);
  const [isSynced, setIsSynced] = useState(false);
  const initializedFilesRef = useRef<Set<string>>(new Set());

  // Keep clientIdentity fresh in refs to avoid Yjs teardown/rebuild cycles
  const clientIdentityRef = useRef(clientIdentity);
  useEffect(() => {
    clientIdentityRef.current = clientIdentity;
  }, [clientIdentity]);
  // Color source separation:
  //   Authenticated users → backend-owned user.color (from database via /auth/me)
  //                         The backend assigns a unique random color on first login.
  //                         This is now stable across all devices for the same account.
  //   Guests             → getStableCollaboratorColor() (localStorage, no UID key)
  //                         Guests have no persistent identity; localStorage is correct.
  //   Pro users (override)→ settings.collaboratorColor (user-chosen, overrides the above)
  const guestColor = useState(() => !user ? getStableCollaboratorColor() : null)[0];
  const computedCollaboratorColor = isPro
    ? settings.collaboratorColor
    : (user?.color || guestColor || '#4ECDC4');

  // Listen for access requests (owner only)
  useEffect(() => {
    if (!socket) return;

    const handleAccessRequest = (request: AccessRequest) => {
      console.log('[Session] Received access request:', request);
      setAccessRequests(prev => {
        if (prev.some(r => 'user_id' in r && r.user_id === request.user_id && !('project_id' in r))) return prev;
        return [...prev, request];
      });
      showInfoToast(`Access request from ${request.user_name}`);
    };

    const handleAccessRequestResolved = (data: { user_id: string, approved: boolean, is_me?: boolean }) => {
      if (data.is_me) {
        // I am the requester and it was resolved
        if (data.approved) {
          showInfoToast('Access request approved! Joining session...');
          // Retry join
          // We need the session ID. Session is null here.
          // But we track 'pendingJoinRef' or we can leave it to the user to click 'Join' again?
          // The user is likely on the LockedScreen.
          // We can set a state 'accessApproved' which the LockedScreen listens to?
          // Or just clean the error so the UI might retry?
          // Better: Trigger a re-join attempt if we remember the session ID.
          // For now, let's just clear the error and maybe the UI can react or we show a toast.
          // Actually, if we just setSessionError(null), the UI might go back to "Loading" or "Join".
          setSessionError(null);
          // The LockedJoinScreen will see error is gone. 
          // BUT it won't auto-rejoin unless we trigger it.
          // Let's emit a global event or just let the user click "Join" again which is now safe.
          // Simpler: Show toast.
        } else {
          showInfoToast('Access request denied.');
        }
      } else {
        // I am the owner (or another editor?) seeing the resolution
        setAccessRequests(prev => prev.filter(r => !('user_id' in r) || r.user_id !== data.user_id));
      }
    };

    const handleProjectAccessRequest = (request: ProjectAccessRequest) => {
      console.log('[Session] Received project access request:', request);
      setAccessRequests(prev => {
        if (prev.some(r => 'request_id' in r && r.request_id === request.request_id)) return prev;
        return [request, ...prev];
      });
      showInfoToast(`${request.requester_name} requested access to ${request.project_name}`);
    };

    const handleProjectAccessRequestResolved = (
      data: ProjectAccessRequest & { approved: boolean; session_id?: string | null; status?: string }
    ) => {
      if (user && data.requester_id === user.uid) {
        if (data.approved) {
          showInfoToast('Access approved. Opening editor...');
          window.dispatchEvent(new CustomEvent('project_access_granted', { detail: data }));
        } else {
          showInfoToast('Your request was declined.');
          window.dispatchEvent(new CustomEvent('project_access_declined', { detail: data }));
        }
      }

      setAccessRequests(prev => prev.filter(r => {
        if ('request_id' in r) return r.request_id !== data.request_id;
        return !('user_id' in r) || r.user_id !== data.requester_id;
      }));
    };

    const handleSessionLockedStatus = (data: { is_locked: boolean }) => {
      setSession(prev => prev ? { ...prev, is_locked: data.is_locked } : null);
    };

    const handleSessionLocked = (_data: { session_id: string, message: string }) => {
      setSessionError('locked'); // Special error code for UI
    };

    const handleSessionUpdated = (data: Partial<Session>) => {
      console.log('[Session] Received session_updated:', data);
      setSession(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          project_id: data.project_id || prev.project_id,
          project_name: data.project_name || prev.project_name,
          owner_id: data.owner_id || prev.owner_id,
          branch: data.branch || prev.branch,
          last_saved_at: data.last_saved_at || prev.last_saved_at,
        };
      });
      setSessionRevision(rev => rev + 1);
    };

    socket.on('access_request', handleAccessRequest);
    socket.on('access_request_resolved', handleAccessRequestResolved);
    socket.on('project_access_request', handleProjectAccessRequest);
    socket.on('project_access_request_resolved', handleProjectAccessRequestResolved);
    socket.on('session_locked_status', handleSessionLockedStatus);
    socket.on('session_locked', handleSessionLocked);
    socket.on('session_updated', handleSessionUpdated);

    return () => {
      socket.off('access_request', handleAccessRequest);
      socket.off('access_request_resolved', handleAccessRequestResolved);
      socket.off('project_access_request', handleProjectAccessRequest);
      socket.off('project_access_request_resolved', handleProjectAccessRequestResolved);
      socket.off('session_locked_status', handleSessionLockedStatus);
      socket.off('session_locked', handleSessionLocked);
      socket.off('session_updated', handleSessionUpdated);
    };
  }, [socket, user]);

  // (Color is now stable per user — no re-randomize on new session)

  const toggleLock = useCallback(() => {
    if (!socket || !session) return;
    socket.emit('lock_session', { session_id: session.id });
  }, [socket, session]);

  const requestAccess = useCallback((sessionId: string) => {
    if (!socket || !clientIdentity) return;

    socket.emit('request_access', {
      session_id: sessionId,
      user_id: clientIdentity.id,
      user_name: clientIdentity.name,
      user_handle: clientIdentity.handle
    });
    showInfoToast('Access request sent to owner.');
  }, [socket, clientIdentity]);

  const respondToAccessRequest = useCallback((requesterId: string, approved: boolean) => {
    if (!socket || !session) return;
    socket.emit('respond_to_request', {
      session_id: session.id,
      requester_id: requesterId,
      approved
    });
    // Optimistic update
    setAccessRequests(prev => prev.filter(r => !('user_id' in r) || r.user_id !== requesterId));
  }, [socket, session]);

  const requestProjectAccess = useCallback(async (projectId: string, message?: string) => {
    try {
      const result = await apiClient.requestProjectAccess(projectId, message);
      return result.success === true;
    } catch (error) {
      console.error('[SessionContext] requestProjectAccess failed:', error);
      return false;
    }
  }, []);

  const respondToProjectAccessRequest = useCallback(async (projectId: string, requesterId: string, approved: boolean) => {
    try {
      const result = await apiClient.respondToProjectAccessRequest(projectId, requesterId, approved);
      if (result.success) {
        setAccessRequests(prev => prev.filter(r => {
          if ('request_id' in r) return r.request_id !== requesterId;
          return !('user_id' in r) || r.user_id !== requesterId;
        }));
        return true;
      }
      return false;
    } catch (error) {
      console.error('[SessionContext] respondToProjectAccessRequest failed:', error);
      return false;
    }
  }, []);
  // Monitor socket connection
  useEffect(() => {
    console.log('[SessionContext] Socket connection status:', { isConnected, socketId: socket?.id });
  }, [isConnected, socket]);

  // Clear session when navigating away from project views
  useEffect(() => {
    if (!location.pathname.includes('/project/') && !location.pathname.startsWith('/playground') && session) {
      console.log('[SessionContext] Navigated away from project view, clearing session state');
      setSession(null);
      setSessionError(null);
    }
  }, [location.pathname, session]);

  // Track pending operations to handle async responses
  const pendingCreateRef = useRef<{
    resolve: (sessionId: string | null) => void;
    reject: (error: Error) => void;
  } | null>(null);

  const pendingJoinRef = useRef<{
    resolve: (projectId: string | null) => void;
    reject: (error: Error) => void;
  } | null>(null);
  const lastIdentitySyncKeyRef = useRef<string | null>(null);

  const ensureClientIdentity = useCallback((): DeveloperIdentity | null => {
    if (user) {
      const identity: DeveloperIdentity = {
        id: user.uid,
        handle: user.handle || user.username,
        name: user.name || user.handle || user.username || user.email || 'You',
        avatar: user.picture,
        color: computedCollaboratorColor,
        isGuest: false,
      };
      setClientIdentity(identity);
      return identity;
    }

    try {
      let guestId = localStorage.getItem(GUEST_ID_STORAGE_KEY);
      let guestName = localStorage.getItem(GUEST_NAME_STORAGE_KEY);

      if (!guestId) {
        const randomId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        guestId = `guest-${randomId}`;
        localStorage.setItem(GUEST_ID_STORAGE_KEY, guestId);
      }

      if (!guestName) {
        const suffix = guestId.slice(-4).toUpperCase();
        guestName = `Guest ${suffix}`;
        localStorage.setItem(GUEST_NAME_STORAGE_KEY, guestName);
      }

      const identity: DeveloperIdentity = {
        id: guestId,
        name: guestName,
        color: computedCollaboratorColor,
        isGuest: true,
      };
      setClientIdentity(identity);
      return identity;
    } catch (error) {
      console.error('[SessionContext] Failed to access localStorage for guest identity:', error);
      return null;
    }
  }, [user, computedCollaboratorColor]);

  useEffect(() => {
    if (user) {
      setClientIdentity({
        id: user.uid,
        handle: user.handle,
        name: user.name || user.email || 'You',
        isGuest: false,
        color: computedCollaboratorColor
      });
    } else {
      setClientIdentity((prev) => {
        if (prev && prev.isGuest) {
          return { ...prev, color: computedCollaboratorColor };
        }
        return prev;
      });
    }
  }, [user, computedCollaboratorColor]);

  useEffect(() => {
    if (!session && !user) {
      setClientIdentity((prev) => (prev && prev.isGuest ? prev : null));
    }
  }, [session, user]);

  // Emit color update to server when collaborators change their pro color
  const lastProColorRef = useRef(settings.collaboratorColor);
  useEffect(() => {
    if (!isPro) return;
    lastProColorRef.current = settings.collaboratorColor;
  }, [session?.id, isPro]);

  useEffect(() => {
    if (!isPro || !socket || !isConnected || !session || !clientIdentity) return;
    if (lastProColorRef.current === settings.collaboratorColor) return;
    lastProColorRef.current = settings.collaboratorColor;
    console.log('[SessionContext] Emitting color update:', settings.collaboratorColor);
    socket.emit('update_user', {
      session_id: session.id,
      user_id: clientIdentity.id,
      user_name: clientIdentity.name,
      color: settings.collaboratorColor,
      user_handle: clientIdentity.handle,
    });
  }, [isPro, settings.collaboratorColor, socket, isConnected, session, clientIdentity]);

  // Save opened_files and active_file to localStorage
  useEffect(() => {
    if (!session?.id) return;
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;
    try {
      const activeFileKey = `codepark_active_file_${session.id}`;
      const openedFilesKey = `codepark_opened_files_${session.id}`;
      
      if (session.active_file) {
        localStorage.setItem(activeFileKey, session.active_file);
      } else {
        localStorage.removeItem(activeFileKey);
      }
      
      if (session.opened_files) {
        localStorage.setItem(openedFilesKey, JSON.stringify(session.opened_files));
      } else {
        localStorage.removeItem(openedFilesKey);
      }
    } catch (e) {
      console.error('[SessionContext] Failed to save tab state to localStorage:', e);
    }
  }, [session?.id, session?.active_file, session?.opened_files]);

  // Track previous client identity id so we can map/merge user entries when changing identity
  const prevClientIdentityIdRef = useRef<string | null>(clientIdentity?.id ?? null);

  // When clientIdentity changes, compare the previous identity and update the session user
  // entry to the new identity/name if needed. This handles the case where the user signs
  // in while already in a session, migrating the name (and optionally id) in the local UI.
  useEffect(() => {
    const prevId = prevClientIdentityIdRef.current;
    const newId = clientIdentity?.id ?? null;

    // Only proceed if we have a session and the identity actually changed
    if (!socket || !session || !clientIdentity || prevId === newId) return;

    const newName = clientIdentity.name || (user?.name || user?.email) || 'You';

    setSession((prevSession) => {
      if (!prevSession) return prevSession;
      const usersCopy = [...prevSession.users];
      const prevIndex = prevId ? usersCopy.findIndex((u) => u.id === prevId) : -1;
      const newIndex = newId ? usersCopy.findIndex((u) => u.id === newId) : -1;

      if (prevIndex >= 0 && newIndex >= 0 && prevIndex !== newIndex) {
        // merge into the existing newId and remove old guest entry
        usersCopy[newIndex] = { ...usersCopy[newIndex], name: newName };
        usersCopy.splice(prevIndex, 1);
      } else if (prevIndex >= 0 && newIndex >= 0 && prevIndex === newIndex) {
        usersCopy[prevIndex] = { ...usersCopy[prevIndex], name: newName };
      } else if (prevIndex >= 0) {
        // update id and name for the previous guest entry to the new identity
        usersCopy[prevIndex] = { ...usersCopy[prevIndex], id: newId!, name: newName };
      } else if (newIndex >= 0) {
        // update the existing entry name
        usersCopy[newIndex] = { ...usersCopy[newIndex], name: newName };
      } else if (newId) {
        // Neither the old nor new ID is in the session list yet — add a fresh entry
        // using the current clientIdentity color (the stable per-user color, not grey)
        usersCopy.push({ id: newId, name: newName, color: clientIdentity.color || '#a0a0a0' });
      }

      return { ...prevSession, users: usersCopy };
    });

    // Emit update to server (optional) for others to reflect the change
    try {
      socket.emit('update_user', {
        session_id: session.id,
        old_user_id: prevId ?? undefined,
        user_id: newId!,
        user_name: newName,
        user_handle: clientIdentity.handle,
      });
    } catch (error) {
      console.warn('[Session] Failed to emit update_user event (server may not support it)', error);
    }
    // update prev for next time
    prevClientIdentityIdRef.current = newId;
  }, [clientIdentity, socket, session, user]);

  // Create a new session
  const createSession = useCallback(async (projectName?: string): Promise<string | null> => {
    console.log('[SessionContext] createSession called', { socket: !!socket, isConnected, user, projectName });
 
    if (!socket) {
      console.error('[SessionContext] Cannot create session: Socket is not initialized');
      setSessionError('Not connected to server');
      return null;
    }

    if (!isConnected) {
      console.log('[SessionContext] Socket is not connected. Waiting for connection...');
      const connected = await new Promise<boolean>((resolve) => {
        const handleConnect = () => {
          socket.off('connect', handleConnect);
          socket.off('connect_error', handleConnectError);
          resolve(true);
        };
        const handleConnectError = () => {
          socket.off('connect', handleConnect);
          socket.off('connect_error', handleConnectError);
          resolve(false);
        };
        socket.on('connect', handleConnect);
        socket.on('connect_error', handleConnectError);
        socket.connect();
        setTimeout(() => {
          socket.off('connect', handleConnect);
          socket.off('connect_error', handleConnectError);
          resolve(false);
        }, 10000);
      });

      if (!connected) {
        console.error('[SessionContext] Cannot create session: Failed to connect to socket');
        setSessionError('Not connected to server');
        return null;
      }
    }
 
    const identity = ensureClientIdentity();
    if (!identity) {
      setSessionError('Unable to initialise identity');
      return null;
    }
 
    setIsCreatingSession(true);
    setSessionError(null);
 
    return new Promise((resolve, reject) => {
      pendingCreateRef.current = { resolve, reject };
 
      // Emit create_session event
      console.log('[SessionContext] Emitting create_session event');
      socket.emit('create_session', {
        user_id: identity.id,
        user_name: identity.name,
        user_handle: identity.handle,
        color: identity.color || computedCollaboratorColor,
        project_name: projectName,
      });

      // Set timeout for session creation
      setTimeout(() => {
        if (pendingCreateRef.current) {
          console.error('[SessionContext] Session creation timed out');
          pendingCreateRef.current = null;
          setIsCreatingSession(false);
          setSessionError('Session creation timed out');
          reject(new Error('Session creation timed out'));
        }
      }, 10000);
    });
  }, [socket, isConnected, ensureClientIdentity, computedCollaboratorColor]);

  // Join an existing session
  const joinSession = useCallback(async (sessionId: string, projectId?: string): Promise<string | null> => {
    if (!socket) {
      setSessionError('Not connected to server');
      return null;
    }

    if (!isConnected) {
      console.log('[SessionContext] Socket is not connected. Waiting for connection before joining session:', sessionId);
      const connected = await new Promise<boolean>((resolve) => {
        const handleConnect = () => {
          socket.off('connect', handleConnect);
          socket.off('connect_error', handleConnectError);
          resolve(true);
        };
        const handleConnectError = () => {
          socket.off('connect', handleConnect);
          socket.off('connect_error', handleConnectError);
          resolve(false);
        };
        socket.on('connect', handleConnect);
        socket.on('connect_error', handleConnectError);
        socket.connect();
        setTimeout(() => {
          socket.off('connect', handleConnect);
          socket.off('connect_error', handleConnectError);
          resolve(false);
        }, 10000);
      });

      if (!connected) {
        console.error('[SessionContext] Cannot join session: Failed to connect to socket');
        setSessionError('Not connected to server');
        return null;
      }
    }

    if (!sessionId || sessionId.trim() === '') {
      setSessionError('Invalid session ID');
      return null;
    }

    setIsJoiningSession(true);
    setSessionError(null);

    const identity = ensureClientIdentity();
    if (!identity) {
      setSessionError('Unable to initialise viewer identity');
      setIsJoiningSession(false);
      return null;
    }

    console.log('[SessionContext] Attempting to join session:', sessionId, { isConnected, socketId: socket?.id });

    return new Promise((resolve, reject) => {
      pendingJoinRef.current = { resolve, reject };

      // Emit join_session event
      socket.emit('join_session', {
        session_id: sessionId,
        project_id: projectId,
        user_id: identity.id,
        user_name: identity.name,
        user_handle: identity.handle,
        color: identity.color,
      });

      // Set timeout for joining session
      setTimeout(() => {
        if (pendingJoinRef.current) {
          console.error('[SessionContext] Join session timed out for:', sessionId);
          pendingJoinRef.current = null;
          setIsJoiningSession(false);
          setSessionError('Join session timed out');
          resolve(null); // Resolve with null instead of rejecting to let EditorPage handle it
        }
      }, 15000);
    });
  }, [socket, isConnected, ensureClientIdentity, computedCollaboratorColor]);


  // Leave the current session
  const leaveSession = useCallback(() => {
    const invocationId = Math.random().toString(36).substring(2, 9);
    const ts = new Date().toISOString();
    const stack = new Error().stack;
    const sessionId = session?.id || "none";

    console.log(`%c[LIFECYCLE-TRACE] 🔴 leaveSession() invoked. Invocation ID: ${invocationId}, Session ID: ${sessionId}, TS: ${ts}\nStack Trace:\n${stack}`, 'color: #ef4444; font-weight: bold;');

    // Clear session state unconditionally
    setSession(null);
    setSessionError(null);
    setSessionRevision(0);
    setIsJoiningSession(false);
    setIsCreatingSession(false);

    if (providerRef.current) {
      console.log('[SessionProvider] Destroying provider on leaveSession...');
      providerRef.current.destroy();
      providerRef.current = null;
    }
    ydocRef.current = null;
    setIsSynced(false);

    if (socket && session && clientIdentity) {
      try {
        console.log(`%c[SOCKET-TRACE] 📤 Emitting 'leave_session' over WebSocket. Invocation ID: ${invocationId}, Session ID: ${session.id}, User ID: ${clientIdentity.id}, TS: ${ts}`, 'color: #f59e0b; font-weight: bold;');
        // Emit leave_session event
        socket.emit('leave_session', {
          session_id: session.id,
          user_id: clientIdentity.id,
        });
      } catch (e) {
        console.error('[SessionContext] Failed to emit leave_session:', e);
      }
    }
  }, [socket, session, clientIdentity]);

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleProjectLifecycle = (event: Event) => {
      const detail = (event as CustomEvent<{ project_id?: string; reason?: string; invalidateAll?: boolean }>).detail
      const currentProjectId = session?.project_id ?? null
      if (detail?.project_id && currentProjectId && detail.project_id !== currentProjectId) {
        return
      }

      clearProjectScopedCaches(detail?.project_id ?? currentProjectId)
      setAccessRequests(prev => prev.filter((request) => {
        if ('project_id' in request && detail?.project_id) {
          return request.project_id !== detail.project_id
        }
        return true
      }))

      if (detail?.invalidateAll || detail?.project_id) {
        void listProjects({ silent: true })
      }

      if (detail?.project_id && currentProjectId === detail.project_id) {
        setSessionError(detail.reason || 'Project unavailable')
        leaveSession()
      }
    }

    const handleAccessRevoked = (event: Event) => {
      const detail = (event as CustomEvent<{ project_id?: string; reason?: string }>).detail
      const currentProjectId = session?.project_id ?? null
      if (detail?.project_id && currentProjectId && detail.project_id !== currentProjectId) return
      clearProjectScopedCaches(detail?.project_id ?? currentProjectId)
      setSessionError(detail?.reason || 'Your access to this project was revoked')
      leaveSession()
      window.dispatchEvent(new CustomEvent(PROJECT_CACHE_INVALIDATED_EVENT, {
        detail: { project_id: detail?.project_id ?? currentProjectId, reason: detail?.reason, invalidateAll: false }
      }))
    }

    window.addEventListener(PROJECT_CACHE_INVALIDATED_EVENT, handleProjectLifecycle as EventListener)
    window.addEventListener(PROJECT_DELETED_EVENT, handleProjectLifecycle as EventListener)
    window.addEventListener(PROJECT_INVALIDATED_EVENT, handleProjectLifecycle as EventListener)
    window.addEventListener(PROJECT_ACCESS_REVOKED_EVENT, handleAccessRevoked as EventListener)

    return () => {
      window.removeEventListener(PROJECT_CACHE_INVALIDATED_EVENT, handleProjectLifecycle as EventListener)
      window.removeEventListener(PROJECT_DELETED_EVENT, handleProjectLifecycle as EventListener)
      window.removeEventListener(PROJECT_INVALIDATED_EVENT, handleProjectLifecycle as EventListener)
      window.removeEventListener(PROJECT_ACCESS_REVOKED_EVENT, handleAccessRevoked as EventListener)
    }
  }, [leaveSession, listProjects, session?.project_id])

  // Switch branch
  const switchBranch = useCallback(async (branchName: string): Promise<boolean> => {
    if (!session || !clientIdentity) return false;

    try {
      setSessionError(null);
      // 1. Prepare backend for the switch (creates session if needed)
      const result = await apiClient.switchBranch(session.id, branchName, clientIdentity.id);

      if (result.success) {
        const targetSessionId = result.new_session_id || session.id;
        if (targetSessionId !== session.id) {
          // 2. Update URL silently to reflect new session ID without reload
          const newUrl = new URL(window.location.href);
          newUrl.searchParams.set('session', targetSessionId);
          window.history.pushState({}, '', newUrl.toString());

          // 3. Join the new session via socket
          const joinedProjectId = await joinSession(targetSessionId);
          return joinedProjectId !== null;
        } else {
          // If the session ID didn't change, update the branch locally and return true
          setSession(prev => {
            if (!prev) return prev;
            return { ...prev, branch: branchName };
          });
          return true;
        }
      }

      return false;
    } catch (error: any) {
      console.error('[SessionContext] Failed to switch branch:', error);
      setSessionError(error.message || 'Failed to switch branch');
      showInfoToast(`Failed to switch branch: ${error.message}`);
      return false;
    }
  }, [session, clientIdentity, joinSession]);

  const replaceSessionFiles = useCallback((files: FileMap, activeFile?: string) => {
    if (!files || typeof files !== 'object') {
      console.warn('[Session] Ignoring replaceSessionFiles call with invalid files payload');
      return;
    }

    console.log('[replaceSessionFiles CALL]', {
      activeFileArg: activeFile,
      callerStack: new Error().stack
    });

    setSession((prevSession) => {
      if (!prevSession) {
        return prevSession;
      }

      const nextActive = activeFile
        ? activeFile
        : prevSession.active_file && files[prevSession.active_file]
          ? prevSession.active_file
          : Object.keys(files)[0] || prevSession.active_file;

      console.log('[replaceSessionFiles state update]', {
        prevActive: prevSession.active_file,
        activeFileArg: activeFile,
        nextActiveSelected: nextActive
      });

      return {
        ...prevSession,
        files,
        active_file: nextActive,
      };
    });

    setSessionRevision((rev) => rev + 1);
  }, []);

  const refreshSession = useCallback(async (sessionId?: string): Promise<boolean> => {
    const targetSessionId = sessionId || session?.id;
    if (!targetSessionId) {
      return false;
    }

    try {
      const snapshot = await apiClient.getSessionSnapshot(targetSessionId);
      const fileEntries = Object.entries(snapshot.files ?? {});
      const nextActive = snapshot.active_file && snapshot.files?.[snapshot.active_file]
        ? snapshot.active_file
        : fileEntries.length > 0
          ? fileEntries[0][0]
          : '';

      setSession((prev) => {
        if (!prev) {
          return prev;
        }

        return {
          ...prev,
          files: snapshot.files ?? {},
          active_file: nextActive,
          project_id: snapshot.project_id ?? prev.project_id,
          project_name: snapshot.project_name ?? prev.project_name,
        };
      });

      setSessionRevision((rev) => rev + 1);

      return true;
    } catch (error) {
      console.error('[Session] Failed to refresh session state:', error);
      return false;
    }
  }, [session?.id]);

  // Get the shareable session link
  const getSessionLink = useCallback((): string | null => {
    if (!session || !session.project_id) {
      return null;
    }

    const baseUrl = window.location.origin;
    return `${baseUrl}/project/${session.project_id}`;
  }, [session]);

  // Copy session link to clipboard
  const copySessionLink = useCallback(async (): Promise<boolean> => {
    const link = getSessionLink();
    if (!link) {
      return false;
    }

    try {
      await navigator.clipboard.writeText(link);
      return true;
    } catch (error) {
      console.error('Failed to copy session link:', error);
      return false;
    }
  }, [getSessionLink]);

  // Handle session_created event
  useEffect(() => {
    if (!socket) return;

    const handleSessionCreated = (data: {
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
    }) => {
      console.log('[Session] Session created:', data.session_id);

      // Create session state
      let restoredActiveFile = data.active_file || '';
      let restoredOpenedFiles = data.active_file ? [data.active_file] : [];
      
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        try {
          const cachedActive = localStorage.getItem(`codepark_active_file_${data.session_id}`);
          const cachedOpened = localStorage.getItem(`codepark_opened_files_${data.session_id}`);
          
          if (cachedOpened) {
            const parsed = JSON.parse(cachedOpened);
            if (Array.isArray(parsed) && parsed.length > 0) {
              const availableFiles = data.files ? Object.keys(data.files) : [];
              const filteredOpened = availableFiles.length > 0 
                ? parsed.filter(f => availableFiles.includes(f))
                : parsed;
              if (filteredOpened.length > 0) {
                restoredOpenedFiles = filteredOpened;
              }
            }
          }
          
          if (cachedActive) {
            const availableFiles = data.files ? Object.keys(data.files) : [];
            if (availableFiles.length === 0 || availableFiles.includes(cachedActive)) {
              restoredActiveFile = cachedActive;
            }
          }
        } catch (e) {
          console.error('[SessionContext] Failed to restore tab state:', e);
        }
      }
      
      if (restoredActiveFile && !restoredOpenedFiles.includes(restoredActiveFile)) {
        restoredOpenedFiles.push(restoredActiveFile);
      }

      const newSession: Session = {
        id: data.session_id,
        project_id: data.project_id,
        project_name: data.project_name,
        files: data.files || {},
        active_file: restoredActiveFile,
        users: [{
          id: data.user_id,
          handle: user?.handle,
          name: user?.name || user?.email || 'You',
          color: data.color,
          role: 'owner',
        }],
        owner_id: data.user_id,
        opened_files: restoredOpenedFiles,
      };

      setSession(newSession);
      setIsCreatingSession(false);
      setSessionError(null);
      setSessionRevision((rev) => rev + 1);

      // Set client identity for the creator.
      // NOTE: role is NOT set here — role is ProjectMembership, not DeveloperIdentity.
      // The authoritative role is derived from session.users[].role (see canEdit/isReadOnly).
      setClientIdentity((prev) => ({
        ...(prev || {
          id: data.user_id,
          name: user?.name || user?.email || 'You',
          isGuest: !user,
        }),
        color: data.color,
      }) as DeveloperIdentity);

      // Resolve pending create promise
      if (pendingCreateRef.current) {
        pendingCreateRef.current.resolve(data.session_id);
        pendingCreateRef.current = null;
      }
    };

    socket.on('session_created', handleSessionCreated);

    return () => {
      socket.off('session_created', handleSessionCreated);
    };
  }, [socket, user]);

  // Handle session_joined event
  useEffect(() => {
    if (!socket) return;

    const handleSessionJoined = (data: {
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
      yjs_updates?: string[];
      yjs_content_initialized?: boolean;
      owner_id?: string;
      branch?: string;
    }) => {
      console.log('[Session] Joined session successfully:', data.session_id, 'Files:', Object.keys(data.files || {}).length);

      setSession((prevSession) => {
        // Check if this is a rejoin to the same session (e.g., after reconnection)
        // In that case, preserve existing files to prevent Yjs content duplication
        const isRejoin = prevSession?.id === data.session_id;

        if (isRejoin) {
          console.log('[Session] Rejoining existing session, checking file state...');
          const existingFileCount = Object.keys(prevSession.files || {}).length;
          const incomingFileCount = Object.keys(data.files || {}).length;

          // If we already have files loaded, preserve them to avoid Yjs content duplication.
          // BUT if our current state is empty (page refresh wiped it) and the server has files,
          // take the server's files so the explorer isn't blank.
          if (existingFileCount > 0) {
            return {
              ...prevSession,
              users: data.users,
              yjs_updates: data.yjs_updates,
              yjs_content_initialized: data.yjs_content_initialized || prevSession.yjs_content_initialized,
              owner_id: data.owner_id || prevSession.owner_id,
              branch: data.branch || prevSession.branch,
            };
          } else if (incomingFileCount > 0) {
            console.log('[Session] Rejoin: local files empty, restoring from server:', incomingFileCount, 'files');
            return {
              ...prevSession,
              files: data.files || {},
              active_file: data.active_file || prevSession.active_file,
              users: data.users,
              yjs_updates: data.yjs_updates,
              yjs_content_initialized: data.yjs_content_initialized || prevSession.yjs_content_initialized,
              owner_id: data.owner_id || prevSession.owner_id,
              branch: data.branch || prevSession.branch,
            };
          } else {
            // Both empty — just update metadata
            return {
              ...prevSession,
              users: data.users,
              yjs_updates: data.yjs_updates,
              yjs_content_initialized: data.yjs_content_initialized || prevSession.yjs_content_initialized,
              owner_id: data.owner_id || prevSession.owner_id,
              branch: data.branch || prevSession.branch,
            };
          }
        }

        // New session join - create fresh state
        let restoredActiveFile = data.active_file || '';
        let restoredOpenedFiles = data.active_file ? [data.active_file] : [];
        
        if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
          try {
            const cachedActive = localStorage.getItem(`codepark_active_file_${data.session_id}`);
            const cachedOpened = localStorage.getItem(`codepark_opened_files_${data.session_id}`);
            
            if (cachedOpened) {
              const parsed = JSON.parse(cachedOpened);
              if (Array.isArray(parsed) && parsed.length > 0) {
                const availableFiles = data.files ? Object.keys(data.files) : [];
                const filteredOpened = availableFiles.length > 0 
                  ? parsed.filter(f => availableFiles.includes(f))
                  : parsed;
                if (filteredOpened.length > 0) {
                  restoredOpenedFiles = filteredOpened;
                }
              }
            }
            
            if (cachedActive) {
              const availableFiles = data.files ? Object.keys(data.files) : [];
              if (availableFiles.length === 0 || availableFiles.includes(cachedActive)) {
                restoredActiveFile = cachedActive;
              }
            }
          } catch (e) {
            console.error('[SessionContext] Failed to restore tab state:', e);
          }
        }
        
        if (restoredActiveFile && !restoredOpenedFiles.includes(restoredActiveFile)) {
          restoredOpenedFiles.push(restoredActiveFile);
        }

        return {
          id: data.session_id,
          project_id: data.project_id,
          project_name: data.project_name,
          files: data.files || {},
          active_file: restoredActiveFile,
          users: data.users,
          yjs_updates: data.yjs_updates,
          yjs_content_initialized: data.yjs_content_initialized,
          owner_id: data.owner_id,
          opened_files: restoredOpenedFiles,
          branch: data.branch || 'main',
        };
      });

      setIsJoiningSession(false);
      setSessionError(null);
      setSessionRevision((rev) => rev + 1);

      // Resolve pending join promise
      if (pendingJoinRef.current) {
        pendingJoinRef.current.resolve(data.project_id || data.session_id || null);
        pendingJoinRef.current = null;
      }

      // Ensure we remember the identity used to join.
      // IMPORTANT: The client's own stable color (prev?.color, from localStorage) is the
      // single source of truth for THIS user's color. The server echo (joinerInfo?.color)
      // may be stale or assigned by a previous session. We never let the server overwrite
      // the client's own color for the local user.
      const joinerInfo = data.users.find((u) => u.id === data.user_id);
      setClientIdentity((prev) => ({
        ...(prev || {
          id: data.user_id,
          handle: user?.handle || joinerInfo?.handle,
          name: user?.name || user?.handle || joinerInfo?.name || 'Collaborator',
          isGuest: !user,
        }),
        // Own color: prefer existing stable color, fall back to server echo only if we had nothing
        color: prev?.color || joinerInfo?.color,
        // NOTE: role is NOT set here — role is ProjectMembership (session.users[].role),
        // not DeveloperIdentity. Read canEdit/isReadOnly from SessionContext instead.
      }) as DeveloperIdentity);
    };

    socket.on('session_joined', handleSessionJoined);

    return () => {
      socket.off('session_joined', handleSessionJoined);
    };
  }, [socket, user]);

  // Handle session_not_found event
  useEffect(() => {
    if (!socket) return;

    const handleSessionNotFound = (data: { message: string }) => {
      console.error('[Session] Session not found:', data.message);
      setSessionError(data.message);
      setIsJoiningSession(false);

      // Reject pending join promise
      if (pendingJoinRef.current) {
        pendingJoinRef.current.resolve(null);
        pendingJoinRef.current = null;
      }
    };

    socket.on('session_not_found', handleSessionNotFound);

    return () => {
      socket.off('session_not_found', handleSessionNotFound);
    };
  }, [socket]);

  // Handle session_full event
  useEffect(() => {
    if (!socket) return;

    const handleSessionFull = (data: { message: string }) => {
      console.error('[Session] Session full:', data.message);
      setSessionError(data.message);
      setIsJoiningSession(false);

      // Reject pending join promise
      if (pendingJoinRef.current) {
        pendingJoinRef.current.resolve(null);
        pendingJoinRef.current = null;
      }
    };

    socket.on('session_full', handleSessionFull);

    return () => {
      socket.off('session_full', handleSessionFull);
    };
  }, [socket]);



  // Handle user_joined event (another user joins)
  useEffect(() => {
    if (!socket) return;

    const handleUserJoined = (data: { user_id: string; user_name: string; color: string; handle?: string; role?: 'owner' | 'editor' | 'viewer' }) => {
      console.log('[Session] User joined:', data.user_name || data.handle || 'A collaborator');

      setSession((prevSession) => {
        if (!prevSession) return null;

        // Check if user already exists
        const userExists = prevSession.users.some((u) => u.id === data.user_id);
        if (userExists) return prevSession;

        // Add new user
        return {
          ...prevSession,
          users: [
            ...prevSession.users,
            {
              id: data.user_id,
              handle: data.handle,
              name: data.user_name || data.handle || 'Collaborator',
              color: data.color,
              role: data.role || 'viewer',
            },
          ],
        };
      });
    };

    socket.on('user_joined', handleUserJoined);

    return () => {
      socket.off('user_joined', handleUserJoined);
    };
  }, [socket]);

  // Handle user_left event (another user leaves)
  useEffect(() => {
    if (!socket) return;

    const handleUserLeft = (data: { user_id: string }) => {
      console.log('[Session] User left:', data.user_id);

      setSession((prevSession) => {
        if (!prevSession) return null;

        // Find user name for toast
        const userLeft = prevSession.users.find(u => u.id === data.user_id);
        if (userLeft) {
          showInfoToast(`${userLeft.name || userLeft.handle || 'A user'} left the session`);
        }

        // Remove user from list
        return {
          ...prevSession,
          users: prevSession.users.filter((u) => u.id !== data.user_id),
        };
      });
    };

    socket.on('user_left', handleUserLeft);

    return () => {
      socket.off('user_left', handleUserLeft);
    };
  }, [socket]);

  // Handle user_updated event (someone updated their identity/name)
  useEffect(() => {
    if (!socket) return;

    const handleUserUpdated = (data: { old_user_id?: string; user_id: string; user_name: string; color?: string; handle?: string }) => {
      // Update the user entry in the session if present
      setSession((prevSession) => {
        if (!prevSession) return null;

        const usersCopy = [...prevSession.users];
        const oldIndex = data.old_user_id ? usersCopy.findIndex((u) => u.id === data.old_user_id) : -1;
        const newIndex = usersCopy.findIndex((u) => u.id === data.user_id);

        if (oldIndex >= 0 && newIndex >= 0 && oldIndex !== newIndex) {
          // Ensure we merge info into existing new user and remove the old entry
          usersCopy[newIndex] = {
            ...usersCopy[newIndex],
            name: data.user_name,
            color: data.color || usersCopy[newIndex].color,
            handle: data.handle || usersCopy[newIndex].handle
          };
          usersCopy.splice(oldIndex, 1);
        } else if (oldIndex >= 0) {
          usersCopy[oldIndex] = {
            ...usersCopy[oldIndex],
            id: data.user_id,
            name: data.user_name,
            color: data.color || usersCopy[oldIndex].color,
            handle: data.handle || usersCopy[oldIndex].handle
          };
        } else if (newIndex >= 0) {
          usersCopy[newIndex] = {
            ...usersCopy[newIndex],
            name: data.user_name,
            color: data.color || usersCopy[newIndex].color,
            handle: data.handle || usersCopy[newIndex].handle
          };
        } else {
          usersCopy.push({
            id: data.user_id,
            name: data.user_name,
            color: data.color || '#a0a0a0',
            handle: data.handle
          });
        }

        return { ...prevSession, users: usersCopy };
      });
    };

    socket.on('user_updated', handleUserUpdated);

    return () => {
      socket.off('user_updated', handleUserUpdated);
    };
  }, [socket]);

  // Handle role_changed event (when owner changes someone's role)
  useEffect(() => {
    if (!socket) return;

    const handleRoleChanged = (data: { user_id: string; new_role: 'owner' | 'editor' | 'viewer' }) => {
      console.log('[Session] Role changed:', data.user_id, '->', data.new_role);

      setSession((prevSession) => {
        if (!prevSession) return null;

        return {
          ...prevSession,
          users: prevSession.users.map((u) =>
            u.id === data.user_id ? { ...u, role: data.new_role } : u
          ),
        };
      });
    };

    socket.on('role_changed', handleRoleChanged);

    return () => {
      socket.off('role_changed', handleRoleChanged);
    };
  }, [socket]);

  // Handle user sign-in while in session
  useEffect(() => {
    if (!socket || !isConnected || !session || !clientIdentity) return;

    // If user just signed in while in session, update the backend and other clients
    if (user && clientIdentity.isGuest) {
      console.log('[SessionContext] User signed in while in session, updating identity');

      // Update client identity to reflect that user is now authenticated
      setClientIdentity({
        id: user.uid,
        name: user.name || user.email || clientIdentity.name,
        isGuest: false,
        color: clientIdentity.color,
      });

      // Notify backend and other clients of the identity change
      socket.emit('update_user', {
        session_id: session.id,
        old_user_id: clientIdentity.id,
        user_id: user.uid,
        user_name: user.name || user.email || 'You',
        color: clientIdentity.color,
      });

      console.log('[SessionContext] Emitted update_user event after sign-in');
    }
  }, [socket, isConnected, user, session, clientIdentity]);

  useEffect(() => {
    if (!socket || !isConnected || !session || !clientIdentity || !user) {
      return;
    }

    const syncKey = `${session.id}:${clientIdentity.id}:${user.uid}`;
    if (lastIdentitySyncKeyRef.current === syncKey) {
      return;
    }

    if (clientIdentity.id === user.uid) {
      const oldUserId = session.users.find((u) => u.handle === clientIdentity.handle && u.id !== user.uid)?.id;
      lastIdentitySyncKeyRef.current = syncKey;
      socket.emit('update_user', {
        session_id: session.id,
        old_user_id: oldUserId,
        user_id: user.uid,
        user_name: user.name || user.email || clientIdentity.name,
        user_handle: user.handle,
        color: clientIdentity.color,
      });
    }
  }, [socket, isConnected, session, clientIdentity, user]);

  // Handle cursor_update event (remote cursor movements)
  useEffect(() => {
    if (!socket) return;

    const handleCursorUpdate = (data: {
      user_id: string;
      position: { line: number; column: number; filename: string };
      selection?: any;
    }) => {
      setSession((prevSession) => {
        if (!prevSession) return null;

        // Update cursor position for the user
        return {
          ...prevSession,
          users: prevSession.users.map((u) =>
            u.id === data.user_id
              ? { ...u, cursor: data.position }
              : u
          ),
        };
      });
    };

    socket.on('cursor_update', handleCursorUpdate);

    return () => {
      socket.off('cursor_update', handleCursorUpdate);
    };
  }, [socket]);

  // Handle bulk file updates (e.g., git revert/reset)
  useEffect(() => {
    if (!socket) return;

    const handleFilesChanged = (data: any) => {
      const refreshId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `ref_${Math.random().toString(36).slice(2, 10)}`;
      console.log('[FILES_CHANGED_EVENT_FIRED]', {
        refreshId,
        timestamp: new Date().toISOString(),
        rawData: data,
        currentLocalActiveFile: session?.active_file,
        sessionId: session?.id
      });

      if (!data?.session_id) {
        return;
      }

      if (session?.id && data.session_id !== session.id) {
        return;
      }

      if (!data.files || typeof data.files !== 'object') {
        return;
      }

      console.log('[FILES_CHANGED_EVENT]', {
        refreshId,
        caller: 'handleFilesChanged',
        incomingActiveFile: data.active_file,
        currentLocalActiveFile: session?.active_file,
        updateOrigin: 'unknown_git_panel'
      });

      // Preserve local active file selection unless we don't have one selected yet
      const activeFileToUse = !session?.active_file ? data.active_file : undefined;
      replaceSessionFiles(data.files, activeFileToUse);
    };

    socket.on('files_changed', handleFilesChanged);

    return () => {
      socket.off('files_changed', handleFilesChanged);
    };
  }, [socket, replaceSessionFiles, session?.id, session?.active_file]);

  // Handle files_refreshed event (refresh from terminal-created files)
  useEffect(() => {
    if (!socket) return;

    const handleFilesRefreshed = (data: any) => {
      const refreshId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `ref_${Math.random().toString(36).slice(2, 10)}`;
      console.log('[FILES_REFRESHED_EVENT_FIRED]', {
        refreshId,
        timestamp: new Date().toISOString(),
        rawData: data,
        currentLocalActiveFile: session?.active_file,
        sessionId: session?.id
      });

      if (!data || !data.files || typeof data.files !== 'object') {
        return;
      }

      if (session?.id && data.session_id && data.session_id !== session.id) {
        return;
      }

      const isLocalUser = !!(data.initiator_id && socket.id && data.initiator_id === socket.id);
      console.log('[FILES_REFRESHED_EVENT]', {
        refreshId,
        caller: 'handleFilesRefreshed',
        incomingActiveFile: data.active_file,
        currentLocalActiveFile: session?.active_file,
        updateOrigin: isLocalUser ? 'local' : 'remote',
        initiatorId: data.initiator_id,
        socketId: socket.id
      });
      const incomingFileKeys = Object.keys(data.files);
      const localFileKeys = session ? Object.keys(session.files) : [];
      const addedFiles = incomingFileKeys.filter(f => !localFileKeys.includes(f));
      const removedFiles = localFileKeys.filter(f => !incomingFileKeys.includes(f));

      console.log('[FILES_REFRESH_RECONCILIATION_DIAGNOSTICS]', {
        refreshId,
        incomingFileKeys,
        localFileKeysBeforeRefresh: localFileKeys,
        addedFiles,
        removedFiles
      });

      console.log('[Session] Files refreshed from disk:', Object.keys(data.files));
      // Debug: log first file's content length to verify content is received
      const firstFile = Object.keys(data.files)[0];
      if (firstFile && data.files[firstFile]) {
        console.log('[Session] First file content length:', data.files[firstFile].content?.length || 0);
      }

      // Preserve local active file unless refresh was local-user initiated or no active file is selected
      const activeFileToUse = (isLocalUser || !session?.active_file) ? data.active_file : undefined;
      replaceSessionFiles(data.files, activeFileToUse);

      // Dispatch event so editor knows to reload from session state
      // Pass fresh files directly so CodeEditor doesn't use stale closure
      window.dispatchEvent(new CustomEvent('files_refreshed_from_disk', {
        detail: {
          refreshId,
          files: data.files,
          initiator_id: data.initiator_id
        }
      }));
    };

    socket.on('files_refreshed', handleFilesRefreshed);

    return () => {
      socket.off('files_refreshed', handleFilesRefreshed);
    };
  }, [socket, replaceSessionFiles, session?.id]);

  // Handle file_switched event (when switching between files)
  useEffect(() => {
    if (!socket) return;

    const handleFileSwitched = (data: {
      file_name: string;
      content?: string;
      version?: number
    }) => {
      console.log('[Session] File switched:', data.file_name);

      setSession((prevSession) => {
        if (!prevSession) return null;

        console.log('[TAB_SWITCH]', {
          currentFile: prevSession.active_file,
          targetFile: data.file_name,
          previousActiveFile: prevSession.active_file,
          newActiveFile: data.file_name,
          source: 'socket_event'
        });

        // Keep opened_files updated (move to end to represent most recent focus)
        const existing = prevSession.opened_files ? prevSession.opened_files.filter(f => f !== data.file_name) : [];
        const newOpened = [...existing, data.file_name];

        // Update active file and file content
        return {
          ...prevSession,
          active_file: data.file_name,
          opened_files: newOpened,
        };
      });
    };

    socket.on('file_switched', handleFileSwitched);

    return () => {
      socket.off('file_switched', handleFileSwitched);
    };
  }, [socket]);

  // Listen for permission changes and refresh projects for affected users
  useEffect(() => {
    if (!socket) return;

    const handlePermissionsUpdated = (data: { project_id?: string, user_id?: string, role?: string, action?: 'added' | 'removed' }) => {
      if (!data || !data.user_id) return;

      // If this update affects the current user, refresh their projects list
      if (user && data.user_id === user.uid) {
        try {
          listProjects();
          if (data.action === 'added') {
            showInfoToast('You were added as a collaborator on a project. It should appear in your Shared tab.');
          } else if (data.action === 'removed') {
            showInfoToast('Your access to a project was revoked by the owner.');
          }
        } catch (e) {
          console.debug('Failed to refresh projects after permission update', e);
        }
      }
    };

    socket.on('permissions_updated', handlePermissionsUpdated);

    return () => {
      socket.off('permissions_updated', handlePermissionsUpdated);
    };
  }, [socket, user, listProjects]);

  // Handle file_created event
  useEffect(() => {
    if (!socket) return;

    const handleFileCreated = (data: { file_name: string; content?: string; creator_id?: string }) => {
      console.log('[Session] File created:', data.file_name);

      setSession((prevSession) => {
        if (!prevSession) return null;

        // Add new file
        return {
          ...prevSession,
          files: {
            ...prevSession.files,
            [data.file_name]: {
              content: data.content || '',
              version: 0,
            },
          },
        };
      });

      setSessionRevision((rev) => rev + 1);
    };

    socket.on('file_created', handleFileCreated);

    return () => {
      socket.off('file_created', handleFileCreated);
    };
  }, [socket]);

  // Handle automatic rejoin on socket reconnection
  const prevIsConnectedRef = useRef(isConnected);

  useEffect(() => {
    const wasConnected = prevIsConnectedRef.current;

    // Update the ref for the next render
    prevIsConnectedRef.current = isConnected;

    // Condition: connection restored (false -> true) AND we have an active session
    if (isConnected && !wasConnected && session?.id && clientIdentity && socket) {
      console.log('[SessionContext] Connection restored. Re-joining session room in 100ms:', session.id);

      // Add a small delay for stability on high-latency networks (hotspots/VPNs)
      // This matches the behavior in Terminal.tsx which is reported working
      const timer = setTimeout(() => {
        if (!socket.connected) return;
        
        socket.emit('join_session', {
          session_id: session.id,
          user_id: clientIdentity.id,
          user_name: clientIdentity.name,
          user_handle: clientIdentity.handle,
          color: computedCollaboratorColor,
        });

        // Also rejoin Yjs specific needs if any
        socket.emit('mark_yjs_initialized', { session_id: session.id });

        showInfoToast('Session connection restored');
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isConnected, session?.id, clientIdentity, socket, computedCollaboratorColor]);

  // Handle file_deleted event
  useEffect(() => {
    if (!socket) return;

    const handleFileDeleted = (data: { file_name?: string; deleted_file?: string; new_active_file?: string }) => {
      const deletedPath = data.file_name || data.deleted_file;
      if (!deletedPath) {
        console.warn('[Session] File deleted event missing path payload:', data);
        return;
      }

      console.log('[Session] File deleted:', deletedPath);

      setSession((prevSession) => {
        if (!prevSession) return null;

        const newFiles = { ...prevSession.files };
        delete newFiles[deletedPath];

        // Close the tab for the deleted file
        const newOpenedFiles = (prevSession.opened_files || []).filter(f => f !== deletedPath);

        // If the deleted file was active, switch to another open file or the first available file
        let nextActive = prevSession.active_file;
        if (prevSession.active_file === deletedPath) {
          // Priority: server suggestion > last opened tab > first file in list
          nextActive = data.new_active_file
            || (newOpenedFiles.length > 0 ? newOpenedFiles[newOpenedFiles.length - 1] : null)
            || Object.keys(newFiles)[0]
            || '';
        }

        return {
          ...prevSession,
          files: newFiles,
          opened_files: newOpenedFiles,
          active_file: nextActive,
        };
      });

      setSessionRevision((rev) => rev + 1);
    };

    socket.on('file_deleted', handleFileDeleted);

    return () => {
      socket.off('file_deleted', handleFileDeleted);
    };
  }, [socket]);

  // Handle file_renamed event
  useEffect(() => {
    if (!socket) return;

    const handleFileRenamed = (data: { old_name: string; new_name: string }) => {
      console.log('[Session] File renamed:', data.old_name, '->', data.new_name);

      setSession((prevSession) => {
        if (!prevSession) return null;

        const newFiles = { ...prevSession.files };
        const fileData = newFiles[data.old_name];

        if (fileData) {
          delete newFiles[data.old_name];
          newFiles[data.new_name] = fileData;
        }

        const newOpenedFiles = (prevSession.opened_files || []).map((f) =>
          f === data.old_name ? data.new_name : f
        );

        return {
          ...prevSession,
          files: newFiles,
          opened_files: newOpenedFiles,
          active_file: prevSession.active_file === data.old_name ? data.new_name : prevSession.active_file,
        };
      });

      setSessionRevision((rev) => rev + 1);
    };

    socket.on('file_renamed', handleFileRenamed);

    return () => {
      socket.off('file_renamed', handleFileRenamed);
    };
  }, [socket]);

  // Compute current user's role and permissions
  const { canEdit, isReadOnly } = useMemo(() => {
    if (!session || !clientIdentity) {
      return { canEdit: false, isReadOnly: false };
    }

    const currentUser = session.users.find(u => u.id === clientIdentity.id);
    const role = currentUser?.role || 'viewer';

    const canEdit = role === 'owner' || role === 'editor';
    const isReadOnly = role === 'viewer';

    return { canEdit, isReadOnly };
  }, [session, clientIdentity]);

  // =====================
  // Tab management helpers
  // =====================
  const openFileInTab = useCallback((fileName: string) => {
    if (!socket || !session) return;

    console.log('[TAB_SWITCH]', {
      currentFile: session.active_file,
      targetFile: fileName,
      previousActiveFile: session.active_file,
      newActiveFile: fileName,
      source: 'user_click'
    });

    // Emit to server to switch file (server will broadcast back and update session)
    socket.emit('switch_file', { session_id: session.id, user_id: clientIdentity?.id || '', file_name: fileName });

    // Optimistic update: ensure it's present in opened_files
    setSession(prev => {
      if (!prev) return prev;
      const opened = prev.opened_files ? Array.from(new Set([...prev.opened_files, fileName])) : [fileName];
      return { ...prev, opened_files: opened, active_file: fileName };
    });

    setSessionRevision(rev => rev + 1);
  }, [socket, session, clientIdentity]);

  const closeFileTab = useCallback((fileName: string) => {
    if (!session) return;

    setSession(prev => {
      if (!prev) return prev;
      const opened = prev.opened_files ? prev.opened_files.filter(f => f !== fileName) : [];
      // If closing the active file, pick the last opened as new active
      let newActive = prev.active_file;
      if (prev.active_file === fileName) {
        newActive = opened.length ? opened[opened.length - 1] : '';
      }

      // If we have a new active file, emit switch to server
      if (newActive && socket) {
        socket.emit('switch_file', { session_id: prev.id, user_id: clientIdentity?.id || '', file_name: newActive });
      }

      return { ...prev, opened_files: opened, active_file: newActive || prev.active_file };
    });
  }, [session, socket, clientIdentity]);

  // Hoisted Yjs collaboration provider initialization
  useEffect(() => {
    if (!socket || !session?.id) {
      setIsSynced(false);
      return;
    }

    console.log('[SessionProvider] 🚀 Hoisted Yjs Init: session =', session.id);
    const doc = new Y.Doc();
    ydocRef.current = doc;
    setYdoc(doc);
    initializedFilesRef.current = new Set();

    const provider = new RealtimeProvider(socket, session.id, doc, !isReadOnly, session.workspace_epoch || 1);
    providerRef.current = provider;
    setProvider(provider);

    provider.on('sync', (synced: boolean) => {
      console.log('[SessionProvider Yjs] Hoisted Sync state:', synced);
      setIsSynced(synced);
    });

    const handleFileCreated = (data: { file_name: string; content?: string; creator_id?: string }) => {
      if (initializedFilesRef.current.has(data.file_name)) return;
      if (data.creator_id !== clientIdentityRef.current?.id) return;

      const yText = doc.getText(data.file_name);
      const normalizedContent = (data.content || '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');

      if (yText.toString() === normalizedContent) {
        initializedFilesRef.current.add(data.file_name);
        return;
      }

      doc.transact(() => {
        if (yText.length > 0) {
          yText.delete(0, yText.length);
        }
        if (normalizedContent.length > 0) {
          yText.insert(0, normalizedContent);
        }
      });
      initializedFilesRef.current.add(data.file_name);
    };

    const handleFilesRefreshedFromDisk = (event: Event) => {
      const customEvent = event as CustomEvent<{ refreshId?: string; files: Record<string, { content: string; version: number }>; initiator_id?: string }>;
      const files = customEvent.detail?.files;
      const initiatorId = customEvent.detail?.initiator_id;

      if (!files) return;

      const activeUsers = session?.users || [];
      const leaderId = initiatorId || (activeUsers.length > 0 ? [...activeUsers].sort((a, b) => a.id.localeCompare(b.id))[0].id : null);
      const isLeader = initiatorId ? (socket && socket.id === initiatorId) : (clientIdentityRef.current?.id === leaderId);

      if (!isLeader) return;

      Object.entries(files).forEach(([filename, file]) => {
        const yText = doc.getText(filename);
        if (file.content !== undefined) {
          const normalizedNew = file.content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
          if (yText.toString() === normalizedNew) {
            initializedFilesRef.current.add(filename);
            return;
          }

          doc.transact(() => {
            if (yText.length > 0) {
              yText.delete(0, yText.length);
            }
            yText.insert(0, normalizedNew);
          });
          initializedFilesRef.current.add(filename);
        }
      });
    };

    socket.on('file_created', handleFileCreated);
    window.addEventListener('files_refreshed_from_disk', handleFilesRefreshedFromDisk);

    const history = (session as any).yjs_updates || [];
    const alreadyInitialized = (session as any).yjs_content_initialized || false;
    const sessionFiles = session.files;

    let initTimeout: ReturnType<typeof setTimeout> | null = null;

    if (history.length > 0) {
      console.log(`[SessionProvider Yjs] Hoisted Hydration: ${history.length} updates`);
      provider.syncWithHistory(history);
      Object.keys(sessionFiles).forEach(filename => {
        initializedFilesRef.current.add(filename);
      });
      setIsSynced(true);
    } else if (!alreadyInitialized) {
      const activeUsers = session?.users || [];
      const leader = [...activeUsers].sort((a, b) => a.id.localeCompare(b.id))[0];
      const isInitialLeader = clientIdentityRef.current?.id === leader?.id;

      if (!isInitialLeader) {
        console.log('[SessionProvider Yjs] I am NOT the initial leader. Waiting for sync from leader:', leader?.name || leader?.id);
        setIsSynced(true);
      } else {
        console.log('[SessionProvider Yjs] I am the initial leader. Initializing content...');
        initTimeout = setTimeout(() => {
          let anyFilecontent = false;
          Object.keys(sessionFiles).forEach((filename) => {
            if (doc.getText(filename).length > 0) {
              anyFilecontent = true;
              initializedFilesRef.current.add(filename);
            }
          });

          if (!anyFilecontent) {
            console.log("[SessionProvider Yjs] Document empty, populating from files...");
            Object.entries(sessionFiles).forEach(([filename, file]) => {
              const yText = doc.getText(filename);
              const normalizedContent = file.content?.replace(/\r\n/g, '\n').replace(/\r/g, '\n') || '';

              if (file.content !== undefined) {
                doc.transact(() => {
                  if (yText.length > 0) {
                    yText.delete(0, yText.length);
                  }
                  yText.insert(0, normalizedContent);
                });
                initializedFilesRef.current.add(filename);
              }
            });

            socket.emit('mark_yjs_initialized', { session_id: session.id });
          }
          setIsSynced(true);
        }, 500);
      }
    } else {
      console.log('[SessionProvider Yjs] Content already initialized by another user, waiting for sync...');
      Object.keys(sessionFiles).forEach(filename => {
        initializedFilesRef.current.add(filename);
      });
      setIsSynced(true);
    }

    return () => {
      console.log('[SessionProvider Yjs] Destroying RealtimeProvider...');
      if (initTimeout) clearTimeout(initTimeout);
      socket.off('file_created', handleFileCreated);
      window.removeEventListener('files_refreshed_from_disk', handleFilesRefreshedFromDisk);
      provider.destroy();
      providerRef.current = null;
      setProvider(null);
      ydocRef.current = null;
      setYdoc(null);
      setIsSynced(false);
    };
  }, [socket, session?.id, session?.workspace_epoch]);

  // Sync permission changes dynamically to the provider without recreating it
  useEffect(() => {
    if (provider) {
      provider.setCanEdit(!isReadOnly);
    }
  }, [provider, isReadOnly]);

  // Hoisted file renaming / deletion / flushing event handlers
  useEffect(() => {
    if (!socket || !session?.id) return;

    const handleFileRenamed = (data: { old_name: string; new_name: string }) => {
      if (!ydocRef.current) return;
      const doc = ydocRef.current;
      const oldText = doc.getText(data.old_name);
      const newText = doc.getText(data.new_name);

      if (newText.length === 0 && oldText.length > 0) {
        newText.insert(0, oldText.toString());
      }
    };

    const handleFileDeleted = (data: { file_name: string }) => {
      if (!ydocRef.current) return;
      const doc = ydocRef.current;
      const ytext = doc.getText(data.file_name);

      if (ytext.length > 0) {
        ytext.delete(0, ytext.length);
      }
      initializedFilesRef.current.delete(data.file_name);
    };

    const handleForceContentFlush = (data: { file_name: string }) => {
      if (isReadOnly || !ydocRef.current) return;
      const doc = ydocRef.current;
      const ytext = doc.getText(data.file_name);
      const content = ytext.toString();
      const normalizedContent = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

      socket.emit('content_change', {
        session_id: session.id,
        file_name: data.file_name,
        content: normalizedContent
      });
      socket.emit('files_changed', {
        session_id: session.id,
        reason: 'edit'
      });
    };

    socket.on('file_renamed', handleFileRenamed);
    socket.on('file_deleted', handleFileDeleted);
    socket.on('force_content_flush', handleForceContentFlush);

    return () => {
      socket.off('file_renamed', handleFileRenamed);
      socket.off('file_deleted', handleFileDeleted);
      socket.off('force_content_flush', handleForceContentFlush);
    };
  }, [socket, session?.id, isReadOnly]);

  // Hoisted Reset Yjs state on epoch change
  const prevEpochRef = useRef(session?.workspace_epoch || 1);
  useEffect(() => {
    if (!session?.workspace_epoch || !ydocRef.current) return;

    if (session.workspace_epoch !== prevEpochRef.current) {
      console.log('[SessionProvider Yjs] Workspace epoch changed! Invalidate local Yjs cache:', session.workspace_epoch);
      prevEpochRef.current = session.workspace_epoch;
      initializedFilesRef.current = new Set();

      const doc = ydocRef.current;
      doc.transact(() => {
        doc.share.forEach((type: any) => {
          if (type instanceof Y.Text) {
            type.delete(0, type.length);
          }
        });
      }, 'epoch-reset');
    }
  }, [session?.workspace_epoch]);

  const value: SessionContextValue = {
    session,
    isInSession: session !== null,
    isCreatingSession,
    isJoiningSession,
    sessionError,
    createSession,
    joinSession,
    leaveSession,
    getSessionLink,
    copySessionLink,
    replaceSessionFiles,
    refreshSession,
    sessionRevision,
    clientIdentity,
    canEdit,
    isReadOnly,
    toggleLock,
    requestAccess,
    respondToAccessRequest,
    requestProjectAccess,
    respondToProjectAccessRequest,
    accessRequests,
    // Tabs
    openFileInTab,
    closeFileTab,
    currentBranch: session?.branch || 'main',
    switchBranch,
    ydoc,
    provider,
    isSynced,
  };

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
};

export const useSession = (): SessionContextValue => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};

// Optional variant for components that can render outside the provider (e.g., tests/storybook)
export const useSessionOptional = (): SessionContextValue | undefined => {
  return useContext(SessionContext);
};
