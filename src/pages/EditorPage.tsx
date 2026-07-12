import { useEffect, useState, useRef, useCallback, lazy, Suspense } from 'react'
import { useParams, useSearchParams, useNavigate, useLocation } from 'react-router-dom'
import { useSession } from '../contexts/SessionContext'
import { useSocket } from '../contexts/SocketContext'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { useMobile } from '../hooks/useMobile'
import { useDialog } from '../contexts/DialogContext'
import { TopMenuBar } from '../components/editor/TopMenuBar'
import { ActivityBar } from '../components/editor/ActivityBar'
import { RightActivityBar, type ActiveRightPanel } from '../components/editor/RightActivityBar'
import { RequestPanel } from '../components/editor/RequestPanel'
import { LockedJoinScreen } from '../components/editor/LockedJoinScreen'

import { FileExplorer } from '../components/editor/FileExplorer'
import { DebugPanel } from '../components/editor/DebugPanel'
import { SettingsPanel } from '../components/editor/SettingsPanel'
import { UsersPanel } from '../components/editor/UsersPanel'
import { ChatPanel } from '../components/editor/ChatPanel'
import { ImageViewer } from '../components/editor/ImageViewer'
import { PDFViewer } from '../components/editor/PDFViewer'
import { GitPanel } from '../components/editor/GitPanel'
import { AIPanel } from '../components/editor/AIPanel'
import { BranchPicker } from '../components/editor/BranchPicker'
const CodeEditor = lazy(() => import('../components/editor/CodeEditor').then(module => ({ default: module.CodeEditor })))
import type { CodeEditorHandle } from '../components/editor/CodeEditor'
import { Terminal } from '../components/editor/Terminal'
import { GUIPreview } from '../components/editor/GUIPreview'
import { MarkdownPreview } from '../components/editor/MarkdownPreview';   //for markdown preview
import { StatusBar } from '../components/editor/StatusBar'
import FileTabs from '../components/editor/FileTabs'
import Breadcrumbs from '../components/editor/Breadcrumbs'
import CommandPalette from '../components/editor/CommandPalette'
import { MobileEditorShell } from '../components/editor/mobile/MobileEditorShell'
import { ErrorBoundary } from '../components/ErrorBoundary'
import { apiClient } from '../services/api'
import { createKeyboardHandler, type ShortcutActions } from '../utils/keyboardShortcuts'
import { WasmManager } from '../services/wasm/WasmManager'
import { showWarningToast, showSuccessToast, showErrorToast } from '../utils/errorHandling'
import type { Breakpoint } from '../types'
import KeyboardShortcutsModal from '../components/KeyboardShortcutsModal'
import { OnlineFriendsSidebar } from '../components/cp/OnlineFriendsSidebar'
import { FriendInviteModal } from '../components/cp/FriendInviteModal'
import {
  Files, GitBranch, Bug, Settings, Users, MessageSquare,
  Play, Bot, Inbox, Terminal as TerminalIcon, MoreHorizontal
} from 'lucide-react'
import type { ReactNode } from 'react'
import { PROJECT_ACCESS_REVOKED_EVENT, PROJECT_DELETED_EVENT, PROJECT_INVALIDATED_EVENT } from '../utils/projectSync'

type ActivePanel = 'explorer' | 'debug' | 'git' | 'settings' | 'apps' | null
// ActiveRightPanel is imported from RightActivityBar

/* ─── Drawer (mobile slide-in) ───────────────────────────────────────────────── */
// Drawer is handled inside MobileEditorShell component directly now.

/* ─── Mobile "More" sheet ────────────────────────────────────────────────────── */
function MobileMoreSheet({ open, onClose, onLeft, onRight, onTerminal }: {
    open: boolean; onClose: () => void;
    onLeft: (id: ActivePanel) => void; onRight: (id: ActiveRightPanel) => void; onTerminal: () => void;
}) {
    const tools = [
        { id: "debug", label: "Debugger", icon: <Bug size={20} />, side: "left" as const },
        { id: "settings", label: "Settings", icon: <Settings size={20} />, side: "left" as const },
        { id: "ai", label: "AI Chat", icon: <Bot size={20} />, side: "right" as const },
        { id: "requests", label: "Requests", icon: <Inbox size={20} />, side: "right" as const },
        { id: "terminal", label: "Terminal", icon: <TerminalIcon size={20} />, side: "bottom" as const },
    ];
    return (
        <div className={`fixed inset-0 z-50 flex items-end ${open ? "" : "pointer-events-none"}`}>
            <div className={`absolute inset-0 bg-background/70 backdrop-blur-sm transition-opacity duration-200 ${open ? "opacity-100" : "opacity-0"}`} onClick={onClose} />
            <div className={`relative w-full bg-surface rounded-t-2xl border-t border-border shadow-2xl transition-transform duration-200 ease-out ${open ? "translate-y-0" : "translate-y-full"}`}>
                <div className="flex justify-center pt-2 pb-1">
                    <div className="w-8 h-1 rounded-full bg-border" />
                </div>
                <p className="text-xs font-semibold text-muted-foreground px-5 pb-2">More tools</p>
                <div className="grid grid-cols-3 gap-0 pb-4" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
                    {tools.map(t => (
                        <button key={t.id} onClick={() => {
                            onClose();
                            if (t.side === "left") onLeft(t.id as ActivePanel);
                            if (t.side === "right") onRight(t.id as ActiveRightPanel);
                            if (t.side === "bottom") onTerminal();
                        }}
                            className="flex flex-col items-center gap-2 px-4 py-4 text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors rounded-xl">
                            {t.icon}
                            <span className="text-[11px] leading-none">{t.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

/* ─── Mobile bottom toolbar ─────────────────────────────────────────────────── */
function MobileToolbar({ leftPanel, rightPanel, terminalOpen, onLeft, onRight, onRun, onTerminal, onMore, gitChangesCount, collaboratorsCount }: {
    leftPanel: ActivePanel; rightPanel: ActiveRightPanel; terminalOpen: boolean;
    onLeft: (id: ActivePanel) => void; onRight: (id: ActiveRightPanel) => void;
    onRun: () => void; onTerminal: () => void; onMore: () => void;
    gitChangesCount: number; collaboratorsCount: number;
}) {
    const isActive = (id: string) => leftPanel === id || rightPanel === id || (id === "terminal" && terminalOpen);
    const items = [
        { id: "explorer", icon: <Files size={19} />, label: "Files", side: "left" as const },
        { id: "git", icon: <GitBranch size={19} />, label: "Git", side: "left" as const, badge: gitChangesCount },
        { id: "users", icon: <Users size={19} />, label: "Session", side: "right" as const, badge: collaboratorsCount },
        { id: "chat", icon: <MessageSquare size={19} />, label: "Chat", side: "right" as const },
    ];
    return (
        <nav className="bg-surface border-t border-border w-full shrink-0 relative z-30" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
            <div className="flex items-center h-14 px-1 gap-0.5">
                {/* Left tools */}
                {items.slice(0, 2).map(item => (
                    <button key={item.id}
                        onClick={() => item.side === "left" ? onLeft(item.id as ActivePanel) : onRight(item.id as ActiveRightPanel)}
                        className={`relative flex flex-col items-center gap-0.5 flex-1 min-h-[48px] justify-center rounded-lg transition-colors ${isActive(item.id) ? "text-primary" : "text-muted-foreground"}`}>
                        {item.icon}
                        <span className="text-[10px] leading-none">{item.label}</span>
                        {item.badge ? <span className="absolute top-1 right-2 size-3.5 rounded-full bg-primary text-[8px] text-primary-foreground flex items-center justify-center font-bold">{item.badge}</span> : null}
                    </button>
                ))}

                {/* Terminal */}
                <button onClick={onTerminal}
                    className={`relative flex flex-col items-center gap-0.5 flex-1 min-h-[48px] justify-center rounded-lg transition-colors ${terminalOpen ? "text-primary" : "text-muted-foreground"}`}>
                    <TerminalIcon size={19} />
                    <span className="text-[10px] leading-none">Terminal</span>
                </button>

                {/* Center Run */}
                <button onClick={onRun}
                    className="flex items-center justify-center size-11 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 active:scale-95 transition-all mx-1 shrink-0">
                    <Play size={20} strokeWidth={2.5} />
                </button>

                {/* Right tools */}
                {items.slice(2).map(item => (
                    <button key={item.id}
                        onClick={() => item.side === "left" ? onLeft(item.id as ActivePanel) : onRight(item.id as ActiveRightPanel)}
                        className={`relative flex flex-col items-center gap-0.5 flex-1 min-h-[48px] justify-center rounded-lg transition-colors ${isActive(item.id) ? "text-primary" : "text-muted-foreground"}`}>
                        {item.icon}
                        <span className="text-[10px] leading-none">{item.label}</span>
                        {item.badge ? <span className="absolute top-1 right-2 size-3.5 rounded-full bg-primary text-[8px] text-primary-foreground flex items-center justify-center font-bold">{item.badge}</span> : null}
                    </button>
                ))}

                {/* More */}
                <button onClick={onMore}
                    className="flex flex-col items-center gap-0.5 flex-1 min-h-[48px] justify-center rounded-lg text-muted-foreground hover:text-foreground transition-colors">
                    <MoreHorizontal size={19} />
                    <span className="text-[10px] leading-none">More</span>
                </button>
            </div>
        </nav>
    );
}

function EditorPage() {
  const [searchParams] = useSearchParams()
  const { projectId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  // Track if user manually left session to prevent auto-rejoin
  const hasManuallyLeftRef = useRef(false)
  const attemptedJoinSessionIdRef = useRef<string | null>(null)
  const { settings, themeColors } = useTheme()
  const { socket, isConnected } = useSocket()
  const { user, loading: authLoading } = useAuth()
  const {
    session,
    isInSession,
    isJoiningSession,
    joinSession,
    leaveSession,
    canEdit,
    isReadOnly,
    sessionError,
    switchBranch,
    currentBranch
  } = useSession()

  const { isMobile, isTablet, orientation } = useMobile()
  const isDesktop = !isMobile && !isTablet
  const closeLeft = useCallback(() => setActivePanel(null), [])
  const closeRight = useCallback(() => setActiveRightPanel(null), [])
  const { showAlert, showPrompt, showConfirm } = useDialog()
  
  // Read unused declarations to satisfy strict lint/compiler rules
  const _unused = { isDesktop, showAlert, showConfirm };
  Object.values(_unused);
  const [leftPanelWidth, setLeftPanelWidth] = useState(256) // Default 256px
  const [rightPanelWidth, setRightPanelWidth] = useState(256) // Default 256px
  const [terminalPixelHeight, setTerminalPixelHeight] = useState(300) // Default 300px
  const [isResizingLeft, setIsResizingLeft] = useState(false)
  const [isResizingRight, setIsResizingRight] = useState(false)
  const [isResizingTerminal, setIsResizingTerminal] = useState(false)

  // Resize handlers
  const handleMouseDownLeft = useCallback((e: React.MouseEvent) => {
    setIsResizingLeft(true)
    e.preventDefault()
  }, [])

  const handleMouseDownRight = useCallback((e: React.MouseEvent) => {
    setIsResizingRight(true)
    e.preventDefault()
  }, [])

  const handleMouseDownTerminal = useCallback((e: React.MouseEvent) => {
    setIsResizingTerminal(true)
    e.preventDefault()
  }, [])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isResizingLeft) {
      const newWidth = Math.max(200, Math.min(600, e.clientX - 48)) // Min 200px, max 600px, offset for activity bar
      setLeftPanelWidth(newWidth)
    } else if (isResizingRight) {
      const newWidth = Math.max(200, Math.min(600, window.innerWidth - e.clientX - 24)) // Min 200px, max 600px
      setRightPanelWidth(newWidth)
    } else if (isResizingTerminal) {
      const newHeight = Math.max(100, Math.min(window.innerHeight - 100, window.innerHeight - e.clientY))
      setTerminalPixelHeight(newHeight)
    }
  }, [isResizingLeft, isResizingRight, isResizingTerminal])

  const handleMouseUp = useCallback(() => {
    setIsResizingLeft(false)
    setIsResizingRight(false)
    setIsResizingTerminal(false)
  }, [])

  // Add global mouse event listeners
  useEffect(() => {
    if (isResizingLeft || isResizingRight || isResizingTerminal) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = isResizingTerminal ? 'row-resize' : 'col-resize'
      document.body.style.userSelect = 'none'
    } else {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [isResizingLeft, isResizingRight, isResizingTerminal, handleMouseMove, handleMouseUp])


  const [activePanel, setActivePanel] = useState<ActivePanel>(() => (typeof window !== 'undefined' && window.innerWidth < 768) ? null : 'explorer')
  const [activeRightPanel, setActiveRightPanel] = useState<ActiveRightPanel>(null)
  const [moreOpen, setMoreOpen] = useState(false)
  const [terminalVisible, setTerminalVisible] = useState(false)
  const [isBranchPickerOpen, setIsBranchPickerOpen] = useState(false)
  const [isExecuting, setIsExecuting] = useState(false)
  const runRequestInFlightRef = useRef(false)
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({})
  const [gitChangesCount, setGitChangesCount] = useState(0)
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false)
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
  const hasShownProAudioPopupRef = useRef(false)
  const termRef = useRef<any>(null)
  const [breakpoints, setBreakpoints] = useState<Breakpoint[]>([])
  const [showCommandPalette, setShowCommandPalette] = useState(false)
  const isDirtyRef = useRef(false)
  const [htmlprevvis, sethtmlprevvis] = useState(false);
  const [markdownpreview, setmarkdownpreview] = useState(false);
  const [markdownContent, setMarkdownContent] = useState('');
  const htmlWindowRef = useRef<Window | null>(null);  // Store reference to preview window

  const [guiSession, setGuiSession] = useState<{
    id: string
    novncUrl: string
    framework: string
    audioEnabled: boolean
  } | null>(null)
  const [webPreviewUrl, setWebPreviewUrl] = useState<string | null>(null)
  const [guiPreviewVisible, setGuiPreviewVisible] = useState(true)  // Whether the GUI preview panel is shown
  // Check if current file is HTML
  const activeFileName = typeof session?.active_file === 'string' ? session.active_file : ''
  const isHtmlFile = activeFileName.toLowerCase().endsWith('.html') || activeFileName.toLowerCase().endsWith('.htm')

  const isMarkdownFile = activeFileName.toLowerCase().endsWith('.md')

  // Preview state: unified button toggles markdown or html preview depending on file type
  const previewSupported = isMarkdownFile || isHtmlFile
  const isPreviewing = markdownpreview || htmlprevvis

  const togglePreview = () => {
    if (!previewSupported) {
      // Not supported for this file type
      showWarningToast('Preview not available for this file type')
      return
    }

    if (isMarkdownFile) {
      if (markdownpreview) {
        setmarkdownpreview(false)
        setMarkdownContent('')
      } else {
        const content = editorRef.current?.getCurrentContent() || ''
        setMarkdownContent(content)
        setmarkdownpreview(true)
      }
    } else if (isHtmlFile) {
      if (htmlWindowRef.current && !htmlWindowRef.current.closed) {
        htmlWindowRef.current.close()
        htmlWindowRef.current = null
        sethtmlprevvis(false)
      } else {
        const content = editorRef.current?.getCurrentContent() || ''
        const newWindow = window.open('', '_blank', 'width=800,height=600')
        if (newWindow) {
          htmlWindowRef.current = newWindow
          newWindow.document.write(content)
          newWindow.document.close()
          sethtmlprevvis(true)

          // Detect when user closes the window manually
          const checkClosed = setInterval(() => {
            if (newWindow.closed) {
              htmlWindowRef.current = null
              sethtmlprevvis(false)
              clearInterval(checkClosed)
            }
          }, 1000)
        }
      }
    }
  }



  // Live HTML preview - updates external window every 500ms
  useEffect(() => {
    if (!isHtmlFile || !htmlprevvis) return

    const interval = setInterval(() => {
      const content = editorRef.current?.getCurrentContent() || ''
      if (htmlWindowRef.current && !htmlWindowRef.current.closed) {
        htmlWindowRef.current.document.open()
        htmlWindowRef.current.document.write(content)
        htmlWindowRef.current.document.close()
      }
    }, 500) // Update every 500ms

    return () => clearInterval(interval)
  }, [isHtmlFile, htmlprevvis])
  const [guiStatus, setGuiStatus] = useState<string>('')
  const editorTheme = settings.editorTheme
  const sessionIdFromQuery = searchParams.get('session')
  const sessionIdFromUrl = sessionIdFromQuery || null

  const handleBranchSelect = async (branchName: string) => {
    if (!branchName) return;

    // Use session-aware branch switching
    const success = await switchBranch(branchName);
    if (!success) {
      console.error('Failed to switch branch via session manager');
      showWarningToast('Failed to switch branch session');
    }
  };

  const handleCreateBranch = async (branchName: string) => {
    if (!session?.id) return;
    try {
      const response = await apiClient.createBranch(session.id, branchName);
      if (response.success) {
        // Switch to the new branch immediately
        await switchBranch(branchName);
      } else {
        throw new Error(response.message || 'Failed to create branch');
      }
    } catch (err: any) {
      console.error('Failed to create branch:', err);
      throw err;
    }
  };

  const handleMergeBranch = async (branchName: string) => {
    if (!session?.id) return;
    try {
      const response = await apiClient.mergeBranch(session.id, branchName);
      if (response.success) {
        window.location.reload();
      } else {
        alert(response.message || 'Merge failed. There might be conflicts.');
      }
    } catch (err) {
      console.error('Failed to merge branch:', err);
    }
  };

  // Periodically refresh is handled by git section components or specific panels now
  // Redundant effect removed

  // Wasm Manager setup
  const wasmManagerRef = useRef<WasmManager | null>(null)

  useEffect(() => {
    if (!wasmManagerRef.current && socket) {
      wasmManagerRef.current = new WasmManager({
        onOutput: (output) => {
          // Emit a local event that Terminal can listen to, or reuse the socket event handler logic
          // For now, we'll manually dispatch a custom event that looks like a socket message
          const event = new CustomEvent('wasm_output', { detail: output });
          window.dispatchEvent(event);
        },
        onComplete: (result) => {
          setIsExecuting(false);
          const event = new CustomEvent('wasm_complete', { detail: result });
          window.dispatchEvent(event);
        },
        onError: (message) => {
          setIsExecuting(false);
          const event = new CustomEvent('wasm_error', { detail: { message } });
          window.dispatchEvent(event);
        }
      });
    }
  }, [socket]);

  // Create ref to access editor methods
  const editorRef = useRef<CodeEditorHandle>(null)
  const guiAudioElementRef = useRef<HTMLAudioElement | null>(null)
  const guiPeerConnectionRef = useRef<RTCPeerConnection | null>(null)
  const guiAudioPeerIdRef = useRef<string | null>(null)
  const pendingAudioCandidatesRef = useRef<Array<RTCIceCandidateInit | null>>([])

  // Redirect to dashboard if projectId is missing
  useEffect(() => {
    if (!projectId) {
      console.warn('[EditorPage] Missing projectId, redirecting to dashboard');
      navigate('/dashboard', { replace: true });
    }
  }, [projectId, navigate]);

  useEffect(() => {
    if (!projectId) return

    const handleProjectExit = (event: Event) => {
      const detail = (event as CustomEvent<{ project_id?: string; reason?: string }>).detail
      if (detail?.project_id !== projectId) return
      showWarningToast(detail.reason || 'This project is no longer available.')
      hasManuallyLeftRef.current = true
      leaveSession()
      navigate('/dashboard', { replace: true })
    }

    window.addEventListener(PROJECT_DELETED_EVENT, handleProjectExit as EventListener)
    window.addEventListener(PROJECT_INVALIDATED_EVENT, handleProjectExit as EventListener)
    window.addEventListener(PROJECT_ACCESS_REVOKED_EVENT, handleProjectExit as EventListener)

    return () => {
      window.removeEventListener(PROJECT_DELETED_EVENT, handleProjectExit as EventListener)
      window.removeEventListener(PROJECT_INVALIDATED_EVENT, handleProjectExit as EventListener)
      window.removeEventListener(PROJECT_ACCESS_REVOKED_EVENT, handleProjectExit as EventListener)
    }
  }, [leaveSession, navigate, projectId])

  // Handle opening project when session ID is not in URL
  const [isOpenProjectLoading, setIsOpenProjectLoading] = useState(false);
  useEffect(() => {
    if (!projectId || authLoading) return;
    
    if (!sessionIdFromUrl) {
      setIsOpenProjectLoading(true);
      apiClient.openProject(projectId)
        .then((sessionInfo) => {
          if (sessionInfo?.session_id) {
            const nextParams = new URLSearchParams(location.search);
            nextParams.set('session', sessionInfo.session_id);
            navigate(
              {
                pathname: location.pathname,
                search: `?${nextParams.toString()}`,
              },
              { replace: true }
            );
            return;
          } else {
            console.error('[EditorPage] openProject returned invalid sessionInfo:', sessionInfo);
            showWarningToast('Failed to open project: Invalid session response');
            navigate('/dashboard', { replace: true });
          }
        })
        .catch((err) => {
          console.error('[EditorPage] Failed to open project:', err);
          showWarningToast('Failed to open project. It may not exist or you lack permission.');
          navigate('/dashboard', { replace: true });
        })
        .finally(() => {
          setIsOpenProjectLoading(false);
        });
    }
  }, [projectId, sessionIdFromUrl, authLoading, navigate, location.pathname, location.search]);

  // Reset manual leave and attempt flags if the session ID in the URL changes
  const lastSessionIdRef = useRef<string | null>(null)
  useEffect(() => {
    if (sessionIdFromUrl !== lastSessionIdRef.current) {
      hasManuallyLeftRef.current = false
      attemptedJoinSessionIdRef.current = null
      lastSessionIdRef.current = sessionIdFromUrl
    }
  }, [sessionIdFromUrl])

  // If the socket reconnects while we're on the editor page and NOT yet in session,
  // clear the attempted-join guard so the join effect can re-run.
  // This handles the case where the backend restarted (same URL, new server state).
  const wasConnectedRef = useRef(false)
  useEffect(() => {
    if (isConnected) {
      if (!wasConnectedRef.current && !isInSession) {
        // Reconnected while not in session → allow join to retry
        attemptedJoinSessionIdRef.current = null
      }
      wasConnectedRef.current = true
    } else {
      wasConnectedRef.current = false
    }
  }, [isConnected, isInSession])

  // Automatically leave the old session if the session ID in the URL changes to a new one
  useEffect(() => {
    if (session?.id && sessionIdFromUrl && session.id !== sessionIdFromUrl) {
      console.log('[SESSION_TRANSITION]', {
        oldSession: session.id,
        newSession: sessionIdFromUrl,
        source: 'url_mismatch_effect'
      });
      console.log('[EditorPage] Session ID mismatch between state and URL (Temporarily bypassed for debugging)')
      // leaveSession()
    }
  }, [sessionIdFromUrl, session?.id, leaveSession])

  // Check for session parameter in URL and attempt a single deterministic join.
  // Retries automatically when socket reconnects (isConnected toggles).
  useEffect(() => {
    if (!sessionIdFromUrl || isInSession || isJoiningSession || hasManuallyLeftRef.current || authLoading) {
      return
    }

    // Don't attempt if socket isn't connected yet — effect will re-run when isConnected changes
    if (!isConnected) {
      return
    }

    if (attemptedJoinSessionIdRef.current === sessionIdFromUrl) {
      return
    }

    attemptedJoinSessionIdRef.current = sessionIdFromUrl

    joinSession(sessionIdFromUrl, projectId)
      .then((ok) => {
        if (!ok) {
          // Clear so the next reconnect can retry rather than hard-navigating away
          attemptedJoinSessionIdRef.current = null
          showWarningToast('Session join failed — retrying on reconnect…');
        }
      })
      .catch((err) => {
        console.error('[EditorPage] Error joining session:', err);
        attemptedJoinSessionIdRef.current = null
        showWarningToast('Failed to join collaboration session');
      })
  }, [
    sessionIdFromUrl,
    projectId,
    isInSession,
    isJoiningSession,
    joinSession,
    authLoading,
    navigate,
    isConnected,
  ])

  // Enforce session URL invariant: if URL has no session but state is in session, exit session cleanly.
  useEffect(() => {
    if (!sessionIdFromUrl && isInSession && !isOpenProjectLoading) {
      console.log('[EditorPage] URL has no session but state is in session, leaving session');
      hasManuallyLeftRef.current = true;
      leaveSession();
    }
  }, [sessionIdFromUrl, isInSession, isOpenProjectLoading, leaveSession])

  // Keep ref to leaveSession for cleanup
  const leaveSessionRef = useRef(leaveSession)
  useEffect(() => {
    leaveSessionRef.current = leaveSession
  }, [leaveSession])

  // ===== CODING SESSION HEARTBEAT =====
  // Demo: heartbeat is a no-op (no backend server to ping)
  useEffect(() => {
    if (!isInSession || !session?.id) return
    // No-op in demo mode — production pings /api/sessions/{id}/heartbeat every 10s
    return () => {}
  }, [isInSession, session?.id])

  // Cleanup session on unmount
  useEffect(() => {
    return () => {
      if (leaveSessionRef.current) {
        leaveSessionRef.current()
      }
    }
  }, [])

  const stopGuiAudio = useCallback(() => {
    guiAudioPeerIdRef.current = null
    pendingAudioCandidatesRef.current = [] as Array<RTCIceCandidateInit | null>

    const pc = guiPeerConnectionRef.current
    if (pc) {
      try {
        pc.ontrack = null
        pc.onicecandidate = null
        pc.oniceconnectionstatechange = null
        pc.close()
      } catch (error) {
        console.warn('[EditorPage] Error while closing audio peer connection:', error)
      }
      guiPeerConnectionRef.current = null
    }

    const audioElement = guiAudioElementRef.current
    if (audioElement) {
      const stream = audioElement.srcObject as MediaStream | null
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
      audioElement.srcObject = null
    }
  }, [])

  useEffect(() => {
    return () => {
      stopGuiAudio()
    }
  }, [stopGuiAudio])

  const flushPendingAudioCandidates = useCallback((sessionId: string, peerId: string) => {
    if (!socket || !peerId) {
      return
    }

    if (!pendingAudioCandidatesRef.current.length) {
      return
    }

    for (const candidate of pendingAudioCandidatesRef.current) {
      if (!candidate) {
        continue
      }
      socket.emit('gui_audio_candidate', {
        gui_session_id: sessionId,
        peer_id: peerId,
        candidate,
      })
    }
    pendingAudioCandidatesRef.current = [] as Array<RTCIceCandidateInit | null>
  }, [socket])

  const startGuiAudio = useCallback(async (sessionId: string) => {
    if (!socket) {
      return
    }

    stopGuiAudio()
    pendingAudioCandidatesRef.current = [] as Array<RTCIceCandidateInit | null>
    guiAudioPeerIdRef.current = null

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    })
    guiPeerConnectionRef.current = pc

    // Add a recvonly audio transceiver so the offer includes audio m-line
    pc.addTransceiver('audio', { direction: 'recvonly' })

    pc.ontrack = (event: RTCTrackEvent) => {
      const [stream] = event.streams
      if (stream && guiAudioElementRef.current) {
        guiAudioElementRef.current.srcObject = stream
        guiAudioElementRef.current
          .play()
          .catch(error => console.warn('[EditorPage] Audio autoplay blocked:', error))
      }
    }

    pc.onicecandidate = (event: RTCPeerConnectionIceEvent) => {
      const candidate = event.candidate
      const candidateInit: RTCIceCandidateInit | null = candidate
        ? {
          candidate: candidate.candidate,
          sdpMid: candidate.sdpMid ?? undefined,
          sdpMLineIndex: typeof candidate.sdpMLineIndex === 'number' ? candidate.sdpMLineIndex : undefined,
        }
        : null

      if (!candidateInit) {
        return
      }

      if (!guiAudioPeerIdRef.current) {
        pendingAudioCandidatesRef.current.push(candidateInit)
        return
      }

      socket.emit('gui_audio_candidate', {
        gui_session_id: sessionId,
        peer_id: guiAudioPeerIdRef.current,
        candidate: candidateInit,
      })
    }

    pc.oniceconnectionstatechange = () => {
      console.log('[EditorPage] Audio ICE state:', pc.iceConnectionState)
      if (pc.iceConnectionState === 'failed' || pc.iceConnectionState === 'disconnected') {
        stopGuiAudio()
      }
    }

    try {
      const offer = await pc.createOffer()
      await pc.setLocalDescription(offer)

      socket.emit('gui_audio_offer', {
        gui_session_id: sessionId,
        offer: {
          sdp: offer.sdp ?? '',
          type: offer.type,
        },
      })
    } catch (error) {
      console.error('[EditorPage] Failed to start GUI audio:', error)
      stopGuiAudio()
    }
  }, [socket, stopGuiAudio])

  // Track execution state from socket events
  useEffect(() => {
    if (!socket) return

    const handleRunStarted = () => {
      runRequestInFlightRef.current = true
      setIsExecuting(true)
      setWebPreviewUrl(null)
      // Auto-open terminal when execution starts
      setTerminalVisible(true)
    }

    const handleRunComplete = () => {
      runRequestInFlightRef.current = false
      setIsExecuting(false)
    }

    const handleRunError = () => {
      runRequestInFlightRef.current = false
      setIsExecuting(false)
    }

    const handleExecutionStopped = () => {
      runRequestInFlightRef.current = false
      setIsExecuting(false)
    }

    // GUI execution event handlers
    const handleGUIStatus = (data: any) => {
      console.log('[EditorPage] GUI status:', data)
      setGuiStatus(data.message || data.status)
      // Auto-open terminal to show status messages
      setTerminalVisible(true)
    }

    const handleGUISessionCreated = (data: any) => {
      console.log('[EditorPage] GUI session created:', data)
      setGuiSession({
        id: data.gui_session_id,
        novncUrl: data.novnc_url,
        framework: data.framework,
        audioEnabled: Boolean(data.audio_enabled),
      })

      setGuiPreviewVisible(true)  // Make sure preview is visible when session is created
      setGuiStatus('GUI session ready')

      // Start audio immediately only if Backend says it's enabled (Pro user)
      // For Free users, we wait for 'gui_audio_detected' event before trying (and failing -> Popup)
      if (data.audio_enabled) {
        void startGuiAudio(data.gui_session_id)
      }
    }

    const handleGUIOutput = (data: any) => {
      termRef.current?.write(data.output)
    }

    const handleGuiAudioDetected = (data: any) => {
      console.log('[EditorPage] Audio activity detected, attempting to connect audio...')
      void startGuiAudio(data.gui_session_id)
    }


    const handleGUIComplete = (data: any) => {
      console.log('[EditorPage] GUI execution completed:', data)
      setGuiStatus(`GUI session completed (exit code: ${data.exit_code})`)
      // Keep the session open so user can still view the GUI
      // They can manually terminate it
    }

    const handleGuiAudioAnswer = async (payload: any) => {
      if (!payload || !payload.answer || !payload.peer_id) {
        console.error('[EditorPage] Invalid audio answer payload', payload)
        stopGuiAudio()
        return
      }

      const pc = guiPeerConnectionRef.current
      if (!pc) {
        console.warn('[EditorPage] Received audio answer but peer connection is missing')
        return
      }

      try {
        await pc.setRemoteDescription(payload.answer)
        guiAudioPeerIdRef.current = payload.peer_id
        const sessionIdentifier = payload.gui_session_id ?? guiSession?.id
        if (sessionIdentifier) {
          flushPendingAudioCandidates(sessionIdentifier, payload.peer_id)
        }
        console.log('[EditorPage] Audio stream established')
      } catch (error) {
        console.error('[EditorPage] Failed to process audio answer:', error)
        stopGuiAudio()
      }
    }

    const handleGuiAudioError = async (payload: any) => {
      console.error('[EditorPage] GUI audio error:', payload?.message)
      stopGuiAudio()

      // Check if error is due to subscription status
      if (payload?.message === 'Audio is not enabled for this session' ||
        payload?.message?.includes('subscription') ||
        payload?.message?.includes('Pro subscription')) {

        // Frequency cap: Show popup only once per session/page load
        if (hasShownProAudioPopupRef.current) return

        try {
          hasShownProAudioPopupRef.current = true
          const confirmed = await showConfirm(
            'Audio Restricted',
            'Audio playback from GUI applications is a Pro feature.',
            'Subscribe to Pro',
            'I understand'
          )

          if (confirmed) {
            window.open('/pro', '_blank')
          }
        } catch (err) {
          console.error('[EditorPage] Error showing dialog:', err)
        }
      }
    }

    const handleGUIError = (data: any) => {
      console.error('[EditorPage] GUI error:', data.message)
      setGuiStatus(`Error: ${data.message}`)
      setGuiSession(null)
      setGuiPreviewVisible(true)  // Reset for next time
      stopGuiAudio()
    }

    const handleGUISessionTerminated = (data: any) => {
      console.log('[EditorPage] GUI session terminated:', data)
      setGuiSession(null)
      setGuiPreviewVisible(true)  // Reset for next time
      setGuiStatus('GUI session terminated')
      stopGuiAudio()
    }

    const handleGUIMissingModules = (data: any) => {
      console.warn('[EditorPage] GUI missing modules:', data.missing_modules)
      setGuiStatus(`Missing modules: ${data.missing_modules.join(', ')}`)
      setIsExecuting(false)
      // Show a toast/alert to the user
      if (data.missing_modules && data.missing_modules.length > 0) {
        const modules = data.missing_modules.join(' ')
        const message = `The following Python modules are missing: ${data.missing_modules.join(', ')}\n\nPlease install them by running:\n\npip install ${modules}\n\nAfter installing, re-run the GUI session.`
        showAlert('Missing Python modules', message)
      }
    }

    const handleTerminalPreview = (data: any) => {
      console.log('[EditorPage] Terminal preview detected:', data)
      if (data.url) {
        setWebPreviewUrl(data.url)
        // Optionally show a toast
      }
    }

    socket.on('run_started', handleRunStarted)
    socket.on('run_complete', handleRunComplete)
    socket.on('run_error', handleRunError)
    socket.on('execution_stopped', handleExecutionStopped)
    socket.on('gui_status', handleGUIStatus)
    socket.on('gui_session_created', handleGUISessionCreated)
    socket.on('gui_output', handleGUIOutput)
    socket.on('gui_complete', handleGUIComplete)
    socket.on('gui_error', handleGUIError)
    socket.on('gui_session_terminated', handleGUISessionTerminated)
    socket.on('gui_missing_modules', handleGUIMissingModules)
    socket.on('terminal_preview', handleTerminalPreview)
    socket.on('gui_audio_answer', handleGuiAudioAnswer)
    socket.on('gui_audio_error', handleGuiAudioError)
    socket.on('gui_audio_detected', handleGuiAudioDetected)

    return () => {
      socket.off('run_started', handleRunStarted)
      socket.off('run_complete', handleRunComplete)
      socket.off('run_error', handleRunError)
      socket.off('execution_stopped', handleExecutionStopped)
      socket.off('gui_status', handleGUIStatus)
      socket.off('gui_session_created', handleGUISessionCreated)
      socket.off('gui_output', handleGUIOutput)
      socket.off('gui_complete', handleGUIComplete)
      socket.off('gui_error', handleGUIError)
      socket.off('gui_session_terminated', handleGUISessionTerminated)
      socket.off('gui_missing_modules', handleGUIMissingModules)
      socket.off('terminal_preview', handleTerminalPreview)
      socket.off('gui_audio_answer', handleGuiAudioAnswer)
      socket.off('gui_audio_error', handleGuiAudioError)
      socket.off('gui_audio_detected', handleGuiAudioDetected)
    }
  }, [socket, startGuiAudio, stopGuiAudio, flushPendingAudioCandidates, guiSession?.id])

  const fetchGitChangesCount = useCallback(async () => {
    if (!session?.id) return
    try {
      const data = await apiClient.getGitStatus(session.id)
      const count = (data.modified?.length || 0) + (data.untracked?.length || 0) + (data.deleted?.length || 0)
      setGitChangesCount(count)
    } catch (err) {
      console.error('[EditorPage] Error fetching git status count:', err)
    }
  }, [session?.id])

  useEffect(() => {
    if (!socket || !session?.id) return

    fetchGitChangesCount()

    const handleGitUpdate = () => {
      fetchGitChangesCount()
    }

    socket.on('files_changed', handleGitUpdate)
    socket.on('file_created', handleGitUpdate)
    socket.on('file_deleted', handleGitUpdate)
    socket.on('file_renamed', handleGitUpdate)
    socket.on('operation_ack', handleGitUpdate)
    socket.on('operation', handleGitUpdate)

    return () => {
      socket.off('files_changed', handleGitUpdate)
      socket.off('file_created', handleGitUpdate)
      socket.off('file_deleted', handleGitUpdate)
      socket.off('file_renamed', handleGitUpdate)
      socket.off('operation_ack', handleGitUpdate)
      socket.off('operation', handleGitUpdate)
    }
  }, [socket, session?.id, fetchGitChangesCount])

  // Track chat messages for unread count
  const activeRightPanelRef = useRef(activeRightPanel)
  useEffect(() => {
    activeRightPanelRef.current = activeRightPanel
  }, [activeRightPanel])

  useEffect(() => {
    if (!socket) return

    const handleChatMessage = () => {
      // Increment unread count if chat panel is not active
      if (activeRightPanelRef.current !== 'chat') {
        setUnreadCounts(prev => ({ ...prev, chat: (prev.chat || 0) + 1 }))
      }
    }

    socket.on('chat_message', handleChatMessage)

    return () => {
      socket.off('chat_message', handleChatMessage)
    }
  }, [socket])

  // Handle code execution
  const handleRunCode = () => {
    if (!canEdit) {
      navigate('/auth', { state: { from: location } })
      return
    }

    if (!socket || !isConnected || !session || !session.active_file) {
      console.error('[EditorPage] Cannot run code: missing requirements')
      return
    }

    if (runRequestInFlightRef.current || isExecuting) {
      console.log('[EditorPage] Run request ignored: execution already in progress')
      return
    }

    const activeFile = session.active_file

    // Get current content from editor ref instead of session state
    const currentContent = editorRef.current?.getCurrentContent()

    if (!currentContent || !currentContent.trim()) {
      console.error('[EditorPage] No code content to execute')
      return
    }

    // Determine language from file extension
    const extension = activeFile.split('.').pop()?.toLowerCase()
    const languageMap: { [key: string]: string } = {
      'py': 'python',
      'js': 'javascript',
      'ts': 'typescript',
      'java': 'java',
      'cpp': 'cpp',
      'c': 'c',
      'go': 'go',
      'rs': 'rust',
      'rb': 'ruby',
      'php': 'php',
    }
    const language = extension ? languageMap[extension] || 'python' : 'python'

    console.log('[EditorPage] Running code:', {
      file_name: activeFile,
      language,
      session_id: session.id,
      user_id: user?.uid,
      content_length: currentContent.length
    })

    // Check if code likely requires input (heuristic) to avoid browser popups
    const needsInput = currentContent.includes('input(') || currentContent.includes('sys.stdin.read') || currentContent.includes('prompt(');

    // Try Wasm execution first if supported AND no input is detected
    if (!needsInput && wasmManagerRef.current?.isLanguageSupported(language)) {
      console.log('[EditorPage] Using Wasm execution for', language)
      runRequestInFlightRef.current = true
      setIsExecuting(true)
      setTerminalVisible(true)

      // Notify terminal that execution started
      const startEvent = new CustomEvent('wasm_started', {
        detail: { file_name: activeFile, language }
      });
      window.dispatchEvent(startEvent);

      wasmManagerRef.current.run(currentContent, language).catch(err => {
        console.error('[EditorPage] Wasm execution failed, falling back to socket:', err)
        // Fallback to socket if Wasm fails
        socket.emit('run_code', {
          code: currentContent,
          file_name: activeFile,
          language,
          session_id: session.id,
          user_id: user?.uid,
        })
      })
      return
    }

    // Emit run_code event (Fallback for non-Wasm languages)
    runRequestInFlightRef.current = true
    socket.emit('run_code', {
      code: currentContent,
      file_name: activeFile,
      language,
      session_id: session.id,
      user_id: user?.uid,
    })

    // Open terminal to show output
    setTerminalVisible(true)
  }

  // Auto-dismiss GUI status after 5 seconds
  useEffect(() => {
    if (guiStatus && !guiSession) {
      const timer = setTimeout(() => {
        setGuiStatus('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [guiStatus, guiSession]);

  // Handle stop execution
  const handleStopExecution = () => {
    if (!canEdit) {
      navigate('/auth', { state: { from: location } })
      return
    }

    if (!socket || !isConnected) {
      console.error('[EditorPage] Cannot stop execution: not connected')
      return
    }

    console.log('[EditorPage] Stopping execution')
    socket.emit('stop_execution', {})
  }


  // Handle GUI session termination
  const handleTerminateGUI = () => {
    if (!canEdit) {
      navigate('/auth', { state: { from: location } })
      return
    }

    if (!socket || !isConnected || !guiSession) {
      console.error('[EditorPage] Cannot terminate GUI: missing requirements')
      return
    }

    console.log('[EditorPage] Terminating GUI session:', guiSession.id)
    stopGuiAudio()
    socket.emit('terminate_gui_session', {
      gui_session_id: guiSession.id,
    })
    // Clear the session and hide preview
    setGuiSession(null)
    setGuiPreviewVisible(true)  // Reset for next time
  }

  // Handle closing GUI preview (without terminating - just hides it)
  const handleCloseGUIPreview = () => {
    setGuiPreviewVisible(false)
  }

  // Handle reopening GUI preview
  const handleReopenGUIPreview = () => {
    setGuiPreviewVisible(true)
  }

  const editorBg = editorTheme === 'dark' ? '#1e1e1e' :
    editorTheme === 'light' ? '#ffffff' :
      editorTheme === 'forest' ? '#1a2f1a' :
        editorTheme === 'ocean' ? '#0a1929' :
          editorTheme === 'sunset' ? '#1a0a2e' :
            editorTheme === 'midnight' ? '#000000' :
              editorTheme === 'cyberpunk' ? '#0f0326' :
                editorTheme === 'rose' ? '#2d1b2e' :
                  // Light themes
                  editorTheme === 'forest-light' ? '#e8f5e9' :
                    editorTheme === 'ocean-light' ? '#e0f2fe' :
                      editorTheme === 'sunny-light' ? '#fff7ed' :
                        editorTheme === 'beach-light' ? '#fffbeb' :
                          editorTheme === 'anime-light' ? '#fae8ff' :
                            editorTheme === 'rose-light' ? '#fff1f2' :
                              '#ffffff' // Default fallback

  const sidePanelBg = editorTheme === 'dark' ? '#252526' :
    editorTheme === 'light' ? '#f3f4f6' :
      editorTheme === 'forest' ? '#1f3a1f' :
        editorTheme === 'ocean' ? '#0d1f33' :
          editorTheme === 'sunset' ? '#2d1545' :
            editorTheme === 'midnight' ? '#1a1a2e' :
              editorTheme === 'cyberpunk' ? '#1a0b3d' :
                editorTheme === 'rose' ? '#3d2a3d' :
                  // Light themes
                  editorTheme === 'forest-light' ? '#c8e6c9' :
                    editorTheme === 'ocean-light' ? '#bae6fd' :
                      editorTheme === 'sunny-light' ? '#ffedd5' :
                        editorTheme === 'beach-light' ? '#fef3c7' :
                          editorTheme === 'anime-light' ? '#f0abfc' :
                            editorTheme === 'rose-light' ? '#ffe4e6' :
                              '#f3f4f6' // Default fallback

  const collaborators = session?.users || []

  // Handle panel change - on mobile, open drawer. On desktop, toggle if same panel.
  const handlePanelChange = useCallback((panel: ActivePanel) => {
    if (!isMobile && activePanel === panel) {
      setActivePanel(null)
      return
    }
    setActivePanel(panel)
  }, [isMobile, activePanel])

  // Handle right panel change
  const handleRightPanelChange = useCallback((panel: ActiveRightPanel) => {
    if (activeRightPanel === panel) {
      setActiveRightPanel(null)
      return
    }
    // Reset unread count when opening a panel
    if (panel === 'chat') {
      setUnreadCounts(prev => ({ ...prev, chat: 0 }))
    }
    setActiveRightPanel(panel)
  }, [activeRightPanel])

  const handleLeft = useCallback((id: ActivePanel) => {
    if (isMobile) {
      setActiveRightPanel(null)
    }
    handlePanelChange(id)
  }, [isMobile, handlePanelChange])

  const handleRight = useCallback((id: ActiveRightPanel) => {
    if (isMobile) {
      setActivePanel(null)
    }
    handleRightPanelChange(id)
  }, [isMobile, handleRightPanelChange])

  const handleUnreadCountChange = (panel: keyof typeof unreadCounts, count: number) => {
    setUnreadCounts(prev => ({ ...prev, [panel]: count }))
  }

  // Memoized handlers to prevent infinite re-renders in child components
  const handleChatUnreadCountChange = useCallback((count: number) => {
    handleUnreadCountChange('chat', count)
  }, [])

  const leftContent: Record<Exclude<ActivePanel, null>, ReactNode> = {
    explorer: <FileExplorer onClose={() => setActivePanel(null)} />,
    debug: (
      <DebugPanel
        onRun={handleRunCode}
        onStop={handleStopExecution}
        isExecuting={isExecuting}
        breakpoints={breakpoints}
        onBreakpointsChange={setBreakpoints}
        getCurrentContent={() => editorRef.current?.getCurrentContent() || null}
        getCurrentFile={() => editorRef.current?.getCurrentFile() || null}
        getCurrentLanguage={() => editorRef.current?.getCurrentLanguage() || null}
      />
    ),
    git: <GitPanel />,
    settings: <SettingsPanel />,
    apps: null,
  }

  const rightContent: Record<Exclude<ActiveRightPanel, null>, ReactNode> = {
    users: (
      <UsersPanel
        collaborators={collaborators}
        sessionId={session?.id || ''}
        ownerId={session?.owner_id}
        onInviteClick={() => setIsInviteModalOpen(true)}
      />
    ),
    chat: <ChatPanel isActive={activeRightPanel === 'chat'} onUnreadCountChange={handleChatUnreadCountChange} />,
    ai: <AIPanel />,
    requests: <RequestPanel />,
    friends: (
      <OnlineFriendsSidebar currentProjectId={session?.project_id} currentSessionId={session?.id} inPanel={true} />
    ),
  }

  // Handle manual leave session - clears URL and redirects to dashboard
  const handleLeaveSession = () => {
    hasManuallyLeftRef.current = true
    leaveSession()
    navigate('/dashboard', { replace: true })
  }

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [isScanning, setIsScanning] = useState(false)

  const handleScan = async () => {
    if (!session?.id) return
    setIsScanning(true)
    try {
      await apiClient.triggerManualScan(session.id)
      showSuccessToast('Codebase scan triggered successfully!')
    } catch (err) {
      console.error('[EditorPage] Manual scan failed:', err)
      showErrorToast(err, 'Failed to trigger scan')
    } finally {
      setIsScanning(false)
    }
  }

  // Handle save project
  const handleSave = async () => {
    if (!session) return

    if (!canEdit) {
      navigate('/auth', { state: { from: location } })
      return
    }

    // For new projects (no project_id), prompt for name
    let projectName = session.project_name
    if (!session.project_id && (!projectName || projectName.trim() === '')) {
      const name = await showPrompt('Save Project', 'Enter a name for your project:', 'Untitled Project')
      if (!name || !name.trim()) {
        return // User cancelled
      }
      projectName = name.trim()
    }

    setSaveStatus('saving')
    try {
      // Force sync current editor content to backend before saving
      if (editorRef.current && socket && isConnected) {
        const currentContent = editorRef.current.getCurrentContent()
        if (currentContent !== null) {
          socket.emit('content_change', {
            session_id: session.id,
            file_name: session.active_file,
            content: currentContent
          })
        }
      }

      await apiClient.saveFilesToDatabase(session.id);


      await apiClient.saveProject({
        session_id: session.id,
        project_name: projectName
      })
      console.log('[EditorPage] Project saved successfully')
      isDirtyRef.current = false
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 2000)
    } catch (error) {
      console.error('[EditorPage] Failed to save project:', error)
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 3000)
    }
  }

  // Keep ref to handleSave for autosave timer
  const handleSaveRef = useRef(handleSave)
  useEffect(() => {
    handleSaveRef.current = handleSave
  }, [handleSave])

  // Listen to codepark_content_changed event
  useEffect(() => {
    const handleContentChanged = () => {
      isDirtyRef.current = true
    }
    window.addEventListener('codepark_content_changed', handleContentChanged)
    return () => window.removeEventListener('codepark_content_changed', handleContentChanged)
  }, [])

  // Autosave background timer
  useEffect(() => {
    const timer = setInterval(async () => {
      if (isDirtyRef.current && session?.id) {
        console.log('[EditorPage] Autosave triggered')
        
        // Force sync current editor content to backend before saving
        if (editorRef.current && socket && isConnected && session.active_file) {
          const currentContent = editorRef.current.getCurrentContent()
          if (currentContent !== null) {
            socket.emit('content_change', {
              session_id: session.id,
              file_name: session.active_file,
              content: currentContent
            })
          }
        }

        try {
          await apiClient.saveFilesToDatabase(session.id)
          isDirtyRef.current = false
          console.log('[EditorPage] Autosave completed successfully')
        } catch (error) {
          console.error('[EditorPage] Autosave failed:', error)
        }
      }
    }, 15000)
    
    return () => clearInterval(timer)
  }, [session?.id, socket, isConnected])

  // Prompt beforeunload confirmation
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirtyRef.current) {
        e.preventDefault()
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?'
        return e.returnValue
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const actions: ShortcutActions = {
      toggleTerminal: () => setTerminalVisible(prev => !prev),
      save: handleSave,
      toggleFileExplorer: () => setActivePanel(activePanel === 'explorer' ? null : 'explorer'),
      toggleGitPanel: () => setActivePanel(activePanel === 'git' ? null : 'git'),
      toggleDebugPanel: () => setActivePanel(activePanel === 'debug' ? null : 'debug'),
      toggleUsersPanel: () => handleRightPanelChange('users'),
      toggleChatPanel: () => handleRightPanelChange('chat'),
      toggleAIPanel: () => handleRightPanelChange('ai'),
      toggleRequestsPanel: () => handleRightPanelChange('requests'),
      toggleSearch: () => {
        // Focus search input in the activity bar
        const searchInput = document.querySelector('[data-search-input]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      },
      toggleSettings: () => setActivePanel(activePanel === 'settings' ? null : 'settings'),
      newFile: () => {
        // Trigger new file creation in file explorer
        const newFileButton = document.querySelector('[data-new-file]') as HTMLButtonElement;
        if (newFileButton) {
          newFileButton.click();
        }
      },
      closeTab: () => {
        // Close current file tab
        if (session?.active_file) {
          // This would need to be implemented in FileTabs component
          console.log('Close tab:', session.active_file);
        }
      },
      nextTab: () => {
        // Switch to next tab
        const tabs = document.querySelectorAll('[data-file-tab]');
        const activeTab = document.querySelector('[data-file-tab][data-active="true"]');
        if (activeTab) {
          const nextTab = activeTab.nextElementSibling as HTMLElement;
          if (nextTab && nextTab.hasAttribute('data-file-tab')) {
            nextTab.click();
          } else if (tabs.length > 0) {
            (tabs[0] as HTMLElement).click();
          }
        }
      },
      prevTab: () => {
        // Switch to previous tab
        const tabs = document.querySelectorAll('[data-file-tab]');
        const activeTab = document.querySelector('[data-file-tab][data-active="true"]');
        if (activeTab) {
          const prevTab = activeTab.previousElementSibling as HTMLElement;
          if (prevTab && prevTab.hasAttribute('data-file-tab')) {
            prevTab.click();
          } else if (tabs.length > 0) {
            (tabs[tabs.length - 1] as HTMLElement).click();
          }
        }
      },
      focusEditor: () => {
        // Focus the Monaco editor
        if (editorRef.current) {
          editorRef.current.focus();
        }
      },
      toggleFullscreen: () => {
        // Toggle fullscreen mode
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen();
        } else {
          document.exitFullscreen();
        }
      }
    }

    const handleKeyDown = createKeyboardHandler(actions)
    // Use capture to beat Monaco/browser defaults (e.g., Ctrl+B bookmarks)
    document.addEventListener('keydown', handleKeyDown, true)

    return () => {
      document.removeEventListener('keydown', handleKeyDown, true)
    }
  }, [activePanel, activeRightPanel, session?.active_file]) // Dependencies are stable functions

  // Ctrl+P / Cmd+P listener for Quick Search Command Palette
  useEffect(() => {
    const handleCmdP = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        e.stopPropagation();
        setShowCommandPalette(prev => !prev);
      }
    };
    document.addEventListener('keydown', handleCmdP, true);
    return () => document.removeEventListener('keydown', handleCmdP, true);
  }, []);

  // Keyboard shortcuts modal event listener
  useEffect(() => {
    const handleShowKeyboardShortcuts = () => {
      setShowKeyboardShortcuts(true);
    };

    window.addEventListener('show_keyboard_shortcuts', handleShowKeyboardShortcuts);

    return () => {
      window.removeEventListener('show_keyboard_shortcuts', handleShowKeyboardShortcuts);
    };
  }, []);

  // Adjust terminal height based on orientation on mobile
  const terminalHeight = isMobile && orientation === 'portrait' ? '40vh' : '30vh'

  if (sessionError === 'locked') {
    return <LockedJoinScreen sessionId={sessionIdFromUrl} />
  }

  if (isMobile) {
    return (
      <MobileEditorShell
        collaborators={collaborators}
        session={session}
        isReadOnly={isReadOnly}
        isConnected={isConnected}
        saveStatus={saveStatus}
        currentBranch={currentBranch}
        isExecuting={isExecuting}
        terminalVisible={terminalVisible}
        setTerminalVisible={setTerminalVisible}
        activePanel={activePanel}
        activeRightPanel={activeRightPanel}
        handleLeft={handleLeft}
        handleRight={handleRight}
        handleRunCode={handleRunCode}
        handleStopExecution={handleStopExecution}
        handleSave={handleSave}
        previewSupported={previewSupported ?? false}
        togglePreview={togglePreview}
        isPreviewing={isPreviewing}
        webPreviewUrl={webPreviewUrl}
        gitChangesCount={gitChangesCount}
        editorRef={editorRef}
        breakpoints={breakpoints}
        setBreakpoints={setBreakpoints}
        moreOpen={moreOpen}
        setMoreOpen={setMoreOpen}
        leftContent={leftContent}
        rightContent={rightContent}
        closeLeft={closeLeft}
        closeRight={closeRight}
        MobileToolbarComponent={MobileToolbar}
        MobileMoreSheetComponent={MobileMoreSheet}
        terminalHeight={terminalHeight}
      >
        <BranchPicker
          isOpen={isBranchPickerOpen}
          onClose={() => setIsBranchPickerOpen(false)}
          currentBranch={currentBranch}
          onBranchSelect={handleBranchSelect}
          onCreateBranch={handleCreateBranch}
          onMergeBranch={handleMergeBranch}
        />

        {markdownpreview && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl max-h-[80vh] overflow-auto" style={{ overscrollBehavior: 'none' }}>
              <MarkdownPreview
                content={markdownContent}
                onClose={() => {
                  setmarkdownpreview(false)
                  setMarkdownContent('')
                }}
              />
            </div>
          </div>
        )}

        {guiSession && guiPreviewVisible && (
          <GUIPreview
            guiSessionId={guiSession.id}
            novncUrl={guiSession.novncUrl}
            framework={guiSession.framework}
            onClose={handleCloseGUIPreview}
            onTerminate={handleTerminateGUI}
          />
        )}

        {guiSession && !guiPreviewVisible && (
          <button
            onClick={handleReopenGUIPreview}
            className="fixed top-28 right-4 px-4 py-2 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all transform hover:scale-105 text-white z-40 flex items-center gap-2 text-sm"
            style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' }}
          >
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            GUI Preview
          </button>
        )}

        {guiStatus && !guiSession && (
          <div
            className="fixed bottom-6 left-6 px-4 py-3 rounded-lg shadow-lg border z-50"
            style={{
              background: sidePanelBg,
              borderColor: themeColors.border,
              color: themeColors.text,
            }}
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
              <span className="text-sm">{guiStatus}</span>
            </div>
          </div>
        )}

        <FriendInviteModal
          isOpen={isInviteModalOpen}
          onClose={() => setIsInviteModalOpen(false)}
          projectId={session?.project_id}
          sessionId={session?.id}
          projectName={session?.project_name}
        />

        <KeyboardShortcutsModal
          isOpen={showKeyboardShortcuts}
          onClose={() => setShowKeyboardShortcuts(false)}
        />
      </MobileEditorShell>
    );
  }

  // Unified Desktop & Tablet Layout
  return (
    <div
      className="h-screen flex flex-col overflow-hidden bg-background"
      style={{
        background: editorBg,
        color: themeColors.text,
        fontFamily: 'Inter, system-ui, sans-serif',
        overflowX: 'hidden',
        maxWidth: '100vw',
      }}
    >
      <audio ref={guiAudioElementRef} autoPlay playsInline style={{ display: 'none' }} />

      <TopMenuBar
        collaborators={collaborators}
        onRunCode={handleRunCode}
        onStopExecution={handleStopExecution}
        onSave={handleSave}
        isExecuting={isExecuting}
        activeFile={session?.active_file}
        isMobile={false}
        onMobileMenuToggle={undefined}
        isReadOnly={isReadOnly}
        onRequestSignIn={() => navigate('/auth', { state: { from: location } })}
        onLeaveSession={handleLeaveSession}
        onPreviewToggle={togglePreview}
        isPreviewing={isPreviewing}
        previewDisabled={!previewSupported}
        webPreviewUrl={webPreviewUrl}
        onInviteClick={() => setIsInviteModalOpen(true)}
        terminalOpen={terminalVisible}
        onTerminalToggle={() => setTerminalVisible(!terminalVisible)}
        onScan={handleScan}
        isScanning={isScanning}
      />

      {isReadOnly && (
        <div
          className="flex items-center justify-center px-4 py-3 text-sm font-medium shrink-0"
          style={{
            background: `${settings.accentColor}15`,
            color: settings.accentColor,
            borderBottom: `1px solid ${themeColors.border}`,
          }}
        >
          {user ? (
            <span>You&apos;re viewing this session in read-only mode.</span>
          ) : (
            <>
              <span className="mr-3">You&apos;re viewing this session in read-only mode.</span>
              <button
                onClick={() => navigate('/auth', { state: { from: location } })}
                className="rounded px-3 py-1 text-xs font-semibold"
                style={{
                  background: settings.accentColor,
                  color: '#0f172a',
                }}
              >
                Sign in to edit collaboratively
              </button>
            </>
          )}
        </div>
      )}

      <div className="relative flex flex-1 overflow-hidden">
        {/* Left Activity Bar */}
        <ActivityBar
          activePanel={activePanel}
          onPanelChange={handlePanelChange}
          gitChangesCount={gitChangesCount}
        />

        {/* Left Side Panel */}
        {isTablet ? (
          activePanel && (
            <>
              <div className="absolute inset-0 z-30" onClick={closeLeft} />
              <div className="absolute inset-y-0 left-11 z-40 w-64 border-r border-border shadow-xl flex flex-col bg-surface overflow-auto">
                {leftContent[activePanel]}
              </div>
            </>
          )
        ) : (
          <div className="flex">
            <div
              className={`border-r flex-shrink-0 overflow-auto ${activePanel ? '' : 'w-0 border-r-0'}`}
              style={{
                width: activePanel ? `${leftPanelWidth}px` : '0px',
                borderColor: 'var(--border)',
                background: 'var(--surface)',
                opacity: activePanel ? 1 : 0,
                transition: settings.animations && !isResizingLeft ? 'all 0.18s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
                overscrollBehavior: 'none',
              }}
            >
              {activePanel && leftContent[activePanel]}
            </div>

            {/* Left Resize Handle */}
            {activePanel && (
              <div
                className="w-1 bg-transparent hover:bg-primary cursor-col-resize flex-shrink-0 relative group"
                onMouseDown={handleMouseDownLeft}
                style={{
                  backgroundColor: isResizingLeft ? 'var(--primary)' : 'transparent',
                }}
              >
                <div className="absolute inset-y-0 left-1/2 transform -translate-x-1/2 w-0.5 bg-border opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            )}
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <ErrorBoundary level="component" onError={(err, info) => console.error('[FileTabs ErrorBoundary] error', err, info)}>
            <FileTabs />
          </ErrorBoundary>
          <Breadcrumbs />

          <Suspense fallback={null}>
            {(() => {
              const activeFile = session?.active_file || '';
              const fileExt = activeFile.split('.').pop()?.toLowerCase() || '';
              const isImage = ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'ico', 'bmp', 'tiff'].includes(fileExt);
              const isPdf = fileExt === 'pdf';

              if (isImage && session?.project_id) {
                return (
                  <ImageViewer
                    key={activeFile}
                    projectId={session.project_id}
                    filePath={activeFile}
                    sessionId={session.id}
                  />
                );
              }

              if (isPdf && session?.project_id) {
                return (
                  <PDFViewer
                    projectId={session.project_id}
                    filePath={activeFile}
                    sessionId={session.id}
                  />
                );
              }

              return (
                <CodeEditor
                  ref={editorRef}
                  collaborators={collaborators}
                  readOnly={isReadOnly}
                  activeFile={session?.active_file}
                  breakpoints={breakpoints}
                  onBreakpointsChange={setBreakpoints}
                />
              );
            })()}
          </Suspense>

          {/* Terminal split */}
          {terminalVisible && (
            isTablet ? (
              <div style={{ height: '30vh', position: 'relative' }} className="border-t border-border shrink-0">
                <Terminal
                  onClose={() => setTerminalVisible(false)}
                  height="100%"
                />
              </div>
            ) : (
              <div style={{ height: `${terminalPixelHeight}px`, position: 'relative' }} className="shrink-0">
                {/* Terminal Resize Handle */}
                <div
                  className="h-1 -mt-0.5 bg-transparent hover:bg-primary cursor-row-resize absolute top-0 left-0 right-0 z-10 group"
                  onMouseDown={handleMouseDownTerminal}
                  style={{ backgroundColor: isResizingTerminal ? 'var(--primary)' : 'transparent' }}
                >
                  <div className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 h-0.5 bg-border opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <Terminal
                  onClose={() => setTerminalVisible(false)}
                  height="100%"
                />
              </div>
            )
          )}
        </div>

        {/* Right Side Panel */}
        {isTablet ? (
          activeRightPanel && (
            <>
              <div className="absolute inset-0 z-30" onClick={closeRight} />
              <div className="absolute inset-y-0 right-11 z-40 w-64 border-l border-border shadow-xl flex flex-col bg-surface overflow-auto">
                {rightContent[activeRightPanel]}
              </div>
            </>
          )
        ) : (
          <div className="flex">
            {/* Right Resize Handle */}
            {activeRightPanel && (
              <div
                className="w-1 bg-transparent hover:bg-primary cursor-col-resize flex-shrink-0 relative group"
                onMouseDown={handleMouseDownRight}
                style={{
                  backgroundColor: isResizingRight ? 'var(--primary)' : 'transparent',
                }}
              >
                <div className="absolute inset-y-0 left-1/2 transform -translate-x-1/2 w-0.5 bg-border opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            )}

            <div
              className={`border-l flex-shrink-0 overflow-auto ${activeRightPanel ? '' : 'w-0 border-l-0'}`}
              style={{
                width: activeRightPanel ? `${rightPanelWidth}px` : '0px',
                borderColor: 'var(--border)',
                background: 'var(--surface)',
                opacity: activeRightPanel ? 1 : 0,
                transition: settings.animations && !isResizingRight ? 'all 0.18s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
                overscrollBehavior: 'none',
              }}
            >
              {activeRightPanel && rightContent[activeRightPanel]}
            </div>
          </div>
        )}

        {/* Desktop Right Activity Bar */}
        <RightActivityBar
          activePanel={activeRightPanel}
          onPanelChange={handleRightPanelChange}
          unreadCounts={unreadCounts}
          terminalOpen={terminalVisible}
          onTerminalToggle={() => setTerminalVisible(!terminalVisible)}
          collaboratorCount={collaborators.length}
        />
      </div>

      <StatusBar
        isConnected={isConnected}
        session={session}
        saveStatus={saveStatus}
        isReadOnly={isReadOnly}
        branch={currentBranch}
        onBranchClick={() => setIsBranchPickerOpen(true)}
        terminalVisible={terminalVisible}
        onToggleTerminal={() => setTerminalVisible(!terminalVisible)}
        isMobile={false}
      />

      <BranchPicker
        isOpen={isBranchPickerOpen}
        onClose={() => setIsBranchPickerOpen(false)}
        currentBranch={currentBranch}
        onBranchSelect={handleBranchSelect}
        onCreateBranch={handleCreateBranch}
        onMergeBranch={handleMergeBranch}
      />

      {markdownpreview && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="w-full max-w-4xl max-h-[80vh] overflow-auto" style={{ overscrollBehavior: 'none' }}>
            <MarkdownPreview
              content={markdownContent}
              onClose={() => {
                setmarkdownpreview(false)
                setMarkdownContent('')
              }}
            />
          </div>
        </div>
      )}

      {guiSession && guiPreviewVisible && (
        <GUIPreview
          guiSessionId={guiSession.id}
          novncUrl={guiSession.novncUrl}
          framework={guiSession.framework}
          onClose={handleCloseGUIPreview}
          onTerminate={handleTerminateGUI}
        />
      )}

      {guiSession && !guiPreviewVisible && (
        <button
          onClick={handleReopenGUIPreview}
          className="fixed top-28 right-4 px-4 py-2 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all transform hover:scale-105 text-white z-40 flex items-center gap-2 text-sm"
          style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' }}
        >
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
          GUI Preview
        </button>
      )}

      {guiStatus && !guiSession && (
        <div
          className="fixed bottom-6 left-6 px-4 py-3 rounded-lg shadow-lg border z-50"
          style={{
            background: sidePanelBg,
            borderColor: themeColors.border,
            color: themeColors.text,
          }}
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
            <span className="text-sm">{guiStatus}</span>
          </div>
        </div>
      )}

      <FriendInviteModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        projectId={session?.project_id}
        sessionId={session?.id}
        projectName={session?.project_name}
      />

      <KeyboardShortcutsModal
        isOpen={showKeyboardShortcuts}
        onClose={() => setShowKeyboardShortcuts(false)}
      />

      <CommandPalette
        isOpen={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
      />
    </div>
  )
}

export default EditorPage
