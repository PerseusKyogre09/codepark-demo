import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Loader2,
  ShieldAlert,
  XCircle,
  CheckCircle2,
  Clock,
  Home,
  Users,
  Wifi,
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useSession } from '../contexts/SessionContext'
import { useSocket } from '../contexts/SocketContext'
import { apiClient } from '../services/api'
import { Avatar } from '../components/cp/Avatar'
import type { ProjectAccessState } from '../types'
import {
  PROJECT_DELETED_EVENT,
  PROJECT_INVALIDATED_EVENT,
  PROJECT_ACCESS_REVOKED_EVENT,
} from '../utils/projectSync'

type ViewState = 'loading' | 'joining' | 'waiting' | 'declined' | 'error'

/* ─── tiny animated dots for "waiting" label ─── */
function PulsingDots() {
  return (
    <span className="inline-flex items-center gap-[3px] ml-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="inline-block size-1 rounded-full bg-current"
          style={{
            animation: `pulse-dot 1.4s ease-in-out ${i * 0.22}s infinite`,
          }}
        />
      ))}
    </span>
  )
}

export default function ProjectEntryPage() {
  const { projectId } = useParams<{ projectId: string }>()
  const navigate = useNavigate()
  const { loading: authLoading } = useAuth()
  const { socket } = useSocket()
  const { requestProjectAccess } = useSession()

  const [viewState, setViewState] = useState<ViewState>('loading')
  const [error, setError] = useState<string | null>(null)
  const [accessState, setAccessState] = useState<ProjectAccessState | null>(null)
  const [requestSent, setRequestSent] = useState(false)

  const ownerName = useMemo(
    () => accessState?.owner_name || 'Project owner',
    [accessState?.owner_name],
  )

  /* ── bootstrap: check access, request if needed ── */
  useEffect(() => {
    if (!projectId || authLoading) return
    let active = true

    const bootstrap = async () => {
      try {
        const state = await apiClient.getProjectAccessState(projectId)
        if (!active) return
        setAccessState(state)

        if (state.is_owner || state.is_collaborator || state.request_status === 'approved') {
          setViewState('joining')
          const sessionInfo = await apiClient.openProject(projectId)
          if (!active) return
          navigate(
            `/project/${projectId}/editor?session=${encodeURIComponent(sessionInfo.session_id)}`,
            { replace: true },
          )
          return
        }

        if (state.request_status === 'pending') {
          setViewState('waiting')
          return
        }

        const requested = await requestProjectAccess(projectId)
        if (!active) return
        setRequestSent(requested)
        setViewState('waiting')
      } catch (err: any) {
        if (!active) return
        // AppError stores the HTTP status as `statusCode`; fall back to `status` for other shapes
        const status = err?.statusCode ?? err?.status
        if (status === 403) {
          setViewState('waiting')
          try {
            const requested = await requestProjectAccess(projectId)
            if (active) setRequestSent(requested)
          } catch (requestErr) {
            console.error('Failed to request project access:', requestErr)
          }
          return
        }
        setError(err?.message || 'Failed to load project access state')
        setViewState('error')
      }
    }

    bootstrap()
    return () => {
      active = false
    }
  }, [authLoading, navigate, projectId, requestProjectAccess])

  /* ── realtime events ── */
  useEffect(() => {
    if (!socket || !projectId) return

    const handleGranted = (event: Event) => {
      const detail = (event as CustomEvent).detail as
        | { project_id?: string; session_id?: string | null }
        | undefined
      if (!detail || detail.project_id !== projectId) return
      setViewState('joining')
      if (detail.session_id) {
        navigate(
          `/project/${projectId}/editor?session=${encodeURIComponent(detail.session_id)}`,
          { replace: true },
        )
      } else {
        setError('Project session is unavailable.')
        setViewState('error')
      }
    }

    const handleDeclined = (event: Event) => {
      const detail = (event as CustomEvent).detail as { project_id?: string } | undefined
      if (!detail || detail.project_id !== projectId) return
      setViewState('declined')
    }

    window.addEventListener('project_access_granted', handleGranted as EventListener)
    window.addEventListener('project_access_declined', handleDeclined as EventListener)

    const onResolved = (data: {
      project_id?: string
      approved?: boolean
      session_id?: string | null
    }) => {
      if (data.project_id !== projectId) return
      if (data.approved) {
        setViewState('joining')
        if (data.session_id) {
          navigate(
            `/project/${projectId}/editor?session=${encodeURIComponent(data.session_id)}`,
            { replace: true },
          )
        } else {
          setError('Project session is unavailable.')
          setViewState('error')
        }
      } else {
        setViewState('declined')
      }
    }

    socket.on('project_access_request_resolved', onResolved)

    const handleDeleted = (event: Event) => {
      const detail = (event as CustomEvent<{ project_id?: string; reason?: string }>).detail
      if (detail?.project_id !== projectId) return
      setError(detail.reason || 'This project was deleted.')
      setViewState('error')
    }

    const handleInvalidated = (event: Event) => {
      const detail = (event as CustomEvent<{ project_id?: string; reason?: string }>).detail
      if (detail?.project_id !== projectId) return
      setError(detail.reason || 'This project is no longer available.')
      setViewState('error')
    }

    const handleRevoked = (event: Event) => {
      const detail = (event as CustomEvent<{ project_id?: string; reason?: string }>).detail
      if (detail?.project_id !== projectId) return
      setError(detail.reason || 'Your access was revoked.')
      setViewState('error')
    }

    window.addEventListener(PROJECT_DELETED_EVENT, handleDeleted as EventListener)
    window.addEventListener(PROJECT_INVALIDATED_EVENT, handleInvalidated as EventListener)
    window.addEventListener(PROJECT_ACCESS_REVOKED_EVENT, handleRevoked as EventListener)

    return () => {
      window.removeEventListener('project_access_granted', handleGranted as EventListener)
      window.removeEventListener('project_access_declined', handleDeclined as EventListener)
      socket.off('project_access_request_resolved', onResolved)
      window.removeEventListener(PROJECT_DELETED_EVENT, handleDeleted as EventListener)
      window.removeEventListener(PROJECT_INVALIDATED_EVENT, handleInvalidated as EventListener)
      window.removeEventListener(PROJECT_ACCESS_REVOKED_EVENT, handleRevoked as EventListener)
    }
  }, [navigate, projectId, socket])

  if (!projectId) return null

  /* ════════════════════════════════════════════════
     LOADING STATE
  ════════════════════════════════════════════════ */
  if (viewState === 'loading') {
    return (
      <Shell>
        <style>{pulseDotsCSS}</style>
        <div className="flex flex-col items-center gap-6 py-12 animate-fade-in">
          {/* spinner ring */}
          <div className="relative flex items-center justify-center size-16">
            <div className="absolute inset-0 rounded-full border-2 border-border" />
            <div className="absolute inset-0 rounded-full border-2 border-t-primary animate-spin" />
            <div className="size-7 rounded-full bg-primary/10 flex items-center justify-center">
              <Users size={14} className="text-primary" />
            </div>
          </div>
          <div className="text-center space-y-1">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground font-medium">
              Project Access
            </p>
            <h1 className="text-xl font-semibold text-foreground" style={{ fontFamily: 'Space Grotesk, Inter, system-ui' }}>
              Checking permissions
            </h1>
            <p className="text-sm text-muted-foreground max-w-xs">
              Verifying your access to this project.
            </p>
          </div>
        </div>
      </Shell>
    )
  }

  /* ════════════════════════════════════════════════
     ERROR STATE
  ════════════════════════════════════════════════ */
  if (viewState === 'error') {
    return (
      <Shell>
        <div className="flex flex-col items-center gap-6 py-10 text-center animate-fade-in">
          <div className="size-14 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center justify-center">
            <ShieldAlert size={22} className="text-destructive" />
          </div>
          <div className="space-y-1.5">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground font-medium">
              Access Error
            </p>
            <h1 className="text-xl font-semibold text-foreground" style={{ fontFamily: 'Space Grotesk, Inter, system-ui' }}>
              Unable to open project
            </h1>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
              {error || 'Something went wrong while resolving access.'}
            </p>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Home size={14} />
            Back to dashboard
          </button>
        </div>
      </Shell>
    )
  }

  /* ════════════════════════════════════════════════
     DECLINED STATE
  ════════════════════════════════════════════════ */
  if (viewState === 'declined') {
    return (
      <Shell>
        <div className="flex flex-col items-center gap-6 py-10 text-center animate-fade-in">
          <div className="size-14 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center justify-center">
            <XCircle size={22} className="text-destructive" />
          </div>
          <div className="space-y-1.5">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground font-medium">
              Request declined
            </p>
            <h1 className="text-xl font-semibold text-foreground" style={{ fontFamily: 'Space Grotesk, Inter, system-ui' }}>
              Access not granted
            </h1>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
              The project owner declined your access request.
            </p>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Home size={14} />
            Back to dashboard
          </button>
        </div>
      </Shell>
    )
  }

  /* ════════════════════════════════════════════════
     JOINING STATE  (briefly shown before redirect)
  ════════════════════════════════════════════════ */
  if (viewState === 'joining') {
    return (
      <Shell>
        <style>{pulseDotsCSS}</style>
        <div className="flex flex-col items-center gap-6 py-12 animate-fade-in">
          <div className="relative flex items-center justify-center size-16">
            <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
            <div className="absolute inset-0 rounded-full border-2 border-t-primary animate-spin" />
            <CheckCircle2 size={18} className="text-primary" />
          </div>
          <div className="text-center space-y-1">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground font-medium">
              Access approved
            </p>
            <h1 className="text-xl font-semibold text-foreground" style={{ fontFamily: 'Space Grotesk, Inter, system-ui' }}>
              Joining workspace
            </h1>
            <p className="text-sm text-muted-foreground">
              Preparing your collaboration session<PulsingDots />
            </p>
          </div>
        </div>
      </Shell>
    )
  }

  /* ════════════════════════════════════════════════
     WAITING STATE  (main UI)
  ════════════════════════════════════════════════ */
  const isPending = requestSent || accessState?.request_status === 'pending'

  return (
    <div className="min-h-screen bg-background flex items-start justify-center pt-16 pb-24 px-4 animate-fade-in">
      <style>{pulseDotsCSS}</style>

      <div className="w-full max-w-lg space-y-4">

        {/* ── Header card ── */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-1">
            {/* animated status dot */}
            <span className="relative flex size-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-warning opacity-60" />
              <span className="relative inline-flex rounded-full size-2.5 bg-warning" />
            </span>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Waiting for approval
            </p>
          </div>

          <h1
            className="text-2xl font-semibold text-foreground leading-tight mt-2"
            style={{ fontFamily: 'Space Grotesk, Inter, system-ui' }}
          >
            {accessState?.project_name || 'Loading project…'}
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
            Your access request has been sent. Stay on this page — you'll be moved into the
            editor as soon as the owner responds.
          </p>
        </div>

        {/* ── Owner info card ── */}
        <div className="bg-card border border-border rounded-xl p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-3">
            Project owner
          </p>
          <div className="flex items-center gap-3">
            <Avatar name={ownerName} size="md" online />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground leading-tight">{ownerName}</p>
              <p className="text-xs text-muted-foreground mt-0.5 truncate">
                {accessState?.owner_id || '—'}
              </p>
            </div>
          </div>
        </div>

        {/* ── Status checklist card ── */}
        <div className="bg-card border border-border rounded-xl p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-4">
            Status
          </p>

          <ol className="space-y-3">
            <StatusStep
              done
              icon={<CheckCircle2 size={14} />}
              label="Access check complete"
            />
            <StatusStep
              done={isPending}
              pending={!isPending}
              icon={isPending ? <CheckCircle2 size={14} /> : <Loader2 size={14} className="animate-spin" />}
              label={isPending ? 'Request submitted' : 'Sending request…'}
            />
            <StatusStep
              done={false}
              pending
              icon={<Clock size={14} />}
              label={
                <>
                  Waiting for owner approval<PulsingDots />
                </>
              }
            />
          </ol>
        </div>

        {/* ── Live hint ── */}
        <div className="flex items-start gap-3 rounded-xl border border-border bg-muted/40 px-4 py-3.5">
          <Wifi size={14} className="text-primary mt-0.5 shrink-0" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            This page listens in real time via a live connection.{' '}
            <strong className="text-foreground font-medium">You don't need to refresh.</strong>
          </p>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────
   Helpers
───────────────────────────────────────────────── */

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-card border border-border rounded-2xl p-8 shadow-sm">
        {children}
      </div>
    </div>
  )
}

interface StatusStepProps {
  done: boolean
  pending?: boolean
  icon: React.ReactNode
  label: React.ReactNode
}

function StatusStep({ done, icon, label }: StatusStepProps) {
  return (
    <li className="flex items-center gap-3">
      <span
        className={`flex items-center justify-center size-6 rounded-full shrink-0 ${
          done
            ? 'bg-primary/10 text-primary'
            : 'bg-muted text-muted-foreground'
        }`}
      >
        {icon}
      </span>
      <span className={`text-sm ${done ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
        {label}
      </span>
    </li>
  )
}

const pulseDotsCSS = `
@keyframes pulse-dot {
  0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); }
  40%            { opacity: 1;   transform: scale(1);   }
}
`
