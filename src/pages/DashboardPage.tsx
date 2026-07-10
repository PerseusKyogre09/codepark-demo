import { useEffect, useState, useRef } from "react";
import {
  Plus, Play, FolderPlus, ArrowRight, Clock, FileCode,
  GitBranch, X, Globe, Terminal, Database, HardDrive,
  Rocket, CreditCard, Zap, CheckCircle2, ShoppingBag, GitFork
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useProjects } from "../hooks/useProjects";
import { Avatar } from "../components/cp/Avatar";
import { apiClient } from "../services/api";
import RepositorySelectModal from "../components/RepositorySelectModal";
import GitHubImportModal from "../components/GitHubImportModal";
import { showSuccessToast, showErrorToast } from "../utils/errorHandling";
import { getNextMountId, startNewNavigation, traceCall } from "../utils/debugTracer";

const RECENT_PROJECT_LIMIT = 6;

// ─── Blueprint analytics (user's OWN published blueprint - mock data for now) ────
const MY_BLUEPRINT = {
  name: "FastAPI Starter",
  emoji: "⚡",
  color: "#CE422B",
  desc: "Python async API with Redis caching and OpenAPI docs.",
  publishedAt: "5 hours ago",
  launches: 127,
  forks: 18,
  starsToday: 4,
  trend: "+12%",
  version: "v1.2.0",
  verified: true,
};

// ─── Marketplace featured (3 items for dashboard preview) ─────────────────────
const MARKETPLACE_FEATURED = [
  {
    id: "njs",
    emoji: "⬡",
    color: "#3178C6",
    name: "Next.js Starter",
    category: "Workspace Template",
    badge: "Official",
  },
  {
    id: "fp",
    emoji: "⚡",
    color: "#CE422B",
    name: "FastAPI Blueprint",
    category: "Blueprint",
    badge: "Trending · 1.8k runs",
  },
  {
    id: "theme",
    emoji: "🎨",
    color: "#9FD7A7",
    name: "Dark Forest Theme",
    category: "Theme",
    badge: "Coming soon",
  },
];

// ─── Welcome Back banner ──────────────────────────────────────────────────────
interface WelcomeBackBannerProps {
  onDismiss: () => void;
  heroProject: any;
  handleResume: (id: string) => void;
}

function WelcomeBackBanner({ onDismiss, heroProject, handleResume }: WelcomeBackBannerProps) {
  const navigate = useNavigate();
  return (
    <div className="relative border border-primary/25 bg-primary/[0.06] rounded-2xl p-5 mb-6">
      <button
        onClick={onDismiss}
        className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
      >
        <X size={14} />
      </button>
      <div className="flex items-start gap-3.5 pr-6">
        <div className="size-9 rounded-xl bg-primary/15 border border-primary/20 flex items-center justify-center shrink-0">
          <Clock size={15} className="text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground mb-1">
            Welcome back — you were away for a bit.
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed mb-3">
            Review active workspaces and resume your sessions. Check collaborator status and recent activities below.
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            {heroProject && (
              <button
                onClick={() => handleResume(heroProject.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground text-xs font-medium rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Play size={11} />
                Resume — {heroProject.name}
              </button>
            )}
            <button
              onClick={() => navigate("/dashboard/projects")}
              className="px-3 py-1.5 border border-border text-xs text-muted-foreground rounded-lg hover:text-foreground hover:bg-muted transition-colors"
            >
              See workspaces
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Active workspace card ────────────────────────────────────────────────────
interface ActiveWorkspaceCardProps {
  heroProject: any;
  handleResume: (id: string) => void;
  sortedFriends: any[];
  isRunning: boolean;
}

function ActiveWorkspaceCard({ heroProject, handleResume, sortedFriends, isRunning }: ActiveWorkspaceCardProps) {
  const onlineFriends = sortedFriends.filter((f) => {
    const state = f.presence?.state || f.mode || "offline";
    return state !== "offline";
  });

  return (
    <div className="relative bg-surface border border-primary/20 rounded-2xl p-6 overflow-hidden">
      {/* Ambient glow */}
      {isRunning && (
        <div className="absolute -top-20 -right-20 size-72 rounded-full bg-primary/6 blur-3xl pointer-events-none" />
      )}

      <div className="relative">
        <div className="flex items-start justify-between gap-4 mb-5 flex-wrap md:flex-nowrap">
          {/* Identity */}
          <div className="flex items-start gap-4">
            <div className="size-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
              <span className="text-primary font-bold text-xl" style={{ fontFamily: "var(--font-mono)" }}>
                {heroProject.name ? heroProject.name[0].toUpperCase() : "P"}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2.5 mb-2 flex-wrap">
                <h2 className="text-xl font-semibold text-foreground" style={{ fontFamily: "var(--font-display)" }}>
                  {heroProject.name}
                </h2>
                {isRunning ? (
                  <span className="flex items-center gap-1.5 text-[10px] font-semibold text-success bg-success/10 border border-success/20 px-2 py-0.5 rounded-full">
                    <span className="size-1.5 rounded-full bg-success animate-pulse" />
                    Running
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-[10px] font-semibold text-muted-foreground bg-muted border border-border px-2 py-0.5 rounded-full">
                    <span className="size-1.5 rounded-full bg-muted-foreground/60" />
                    Inactive
                  </span>
                )}
              </div>
              {/* Meta row */}
              <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                <span className="flex items-center gap-1">
                  <GitBranch size={11} /> {heroProject.branch || "main"}
                </span>
                <span className="text-border">·</span>
                <span className="flex items-center gap-1">
                  <Clock size={11} /> Last active {new Date(heroProject.updated_at).toLocaleDateString()}
                </span>
                {onlineFriends.length > 0 && (
                  <>
                    <span className="text-border">·</span>
                    <span className="flex items-center gap-1.5">
                      <span className="flex -space-x-1.5">
                        {onlineFriends.slice(0, 3).map((f) => (
                          <div
                            key={f.uid}
                            title={f.name || f.username}
                            className="size-4 rounded-full border border-surface flex items-center justify-center text-[7px] text-white font-semibold bg-primary"
                          >
                            {(f.name || f.username).substring(0, 2).toUpperCase()}
                          </div>
                        ))}
                      </span>
                      <span className="text-success text-[10px]">{onlineFriends.length} online</span>
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Primary CTA */}
          <button
            onClick={() => handleResume(heroProject.id)}
            disabled={isRunning}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-xl hover:bg-primary/90 transition-colors shrink-0 disabled:opacity-75 disabled:cursor-not-allowed"
          >
            <Play size={14} className={isRunning ? "animate-spin" : ""} />
            {isRunning ? "Starting..." : "Resume Workspace"}
          </button>
        </div>

        {/* Resource bars + Services — two columns */}
        {isRunning && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-5 border-t border-border/70">
            {/* Resource allocation */}
            <div className="space-y-3.5">
              <p className="text-[9px] font-semibold text-muted-foreground/60 uppercase tracking-widest">
                Workspace resources
              </p>
              <div>
                <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1.5">
                  <span>RAM · Starter (512 MB)</span>
                  <span className="font-mono">388 MB / 512 MB</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary/60 rounded-full transition-all" style={{ width: "76%" }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1.5">
                  <span>CPU · 1 vCPU</span>
                  <span className="font-mono">34%</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-info/50 rounded-full transition-all" style={{ width: "34%" }} />
                </div>
              </div>
            </div>

            {/* Running services */}
            <div className="space-y-2.5">
              <p className="text-[9px] font-semibold text-muted-foreground/60 uppercase tracking-widest">
                Services
              </p>
              <div className="flex items-center gap-3">
                <div className="size-7 rounded-lg bg-success/10 flex items-center justify-center shrink-0">
                  <Globe size={12} className="text-success" />
                </div>
                <div>
                  <p className="text-xs font-medium text-foreground">Preview live</p>
                  <p className="text-[10px] text-muted-foreground font-mono">localhost:3000</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="size-7 rounded-lg bg-warning/10 flex items-center justify-center shrink-0">
                  <Terminal size={12} className="text-warning" />
                </div>
                <div>
                  <p className="text-xs font-medium text-foreground">Terminal active</p>
                  <p className="text-[10px] text-muted-foreground">1 session open</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { projects, listProjects, openProject } = useProjects();
  const [friends, setFriends] = useState<any[]>([]);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [isRepoSelectOpen, setIsRepoSelectOpen] = useState(false);
  const [isGitHubImportOpen, setIsGitHubImportOpen] = useState(false);
  const [showWelcomeBack, setShowWelcomeBack] = useState(true);
  const [runningWorkspaceId, setRunningWorkspaceId] = useState<string | null>(null);

  const [searchParams, setSearchParams] = useSearchParams();

  const mountIdRef = useRef<number | null>(null);
  if (mountIdRef.current === null) {
    mountIdRef.current = getNextMountId();
  }
  const mountId = mountIdRef.current;

  useEffect(() => {
    if (searchParams.get("github_connected") === "true") {
      setIsGitHubImportOpen(true);
      showSuccessToast("Successfully connected to GitHub!");
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("github_connected");
      setSearchParams(newParams, { replace: true });
    } else if (searchParams.get("github_error") === "true") {
      showErrorToast(new Error("Failed to connect your GitHub account."), "GitHub Connection");
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("github_error");
      setSearchParams(newParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  // Trace mounts and navigate groups
  useEffect(() => {
    const isStrictMode = import.meta.env.DEV;
    const mountCount = (window as any).__dashboardMountCount || 0;
    const currentCount = mountCount + 1;
    (window as any).__dashboardMountCount = currentCount;

    console.log(
      `%c[MOUNT-TRACE] 📦 DashboardPage mounted.\n` +
      ` ├── Mount ID: ${mountId}\n` +
      ` ├── Route: /dashboard\n` +
      ` ├── StrictMode: ${isStrictMode ? "ACTIVE (DEV)" : "INACTIVE"}\n` +
      ` ├── Remount Count: ${currentCount - 1} (Is First Mount: ${currentCount === 1})\n` +
      ` └── Timestamp: ${new Date().toISOString()}`,
      'color: #10b981; font-weight: bold;'
    );

    startNewNavigation(`DashboardPage Mount ID #${mountId}`);

    return () => {
      console.log(
        `%c[UNMOUNT-TRACE] 🗑️ DashboardPage unmounted.\n` +
        ` ├── Mount ID: ${mountId}\n` +
        ` └── Timestamp: ${new Date().toISOString()}`,
        'color: #f43f5e; font-weight: bold;'
      );
    };
  }, [mountId]);

  useEffect(() => {
    traceCall("DashboardPage", mountId, () => listProjects());
  }, [listProjects, mountId]);

  // Fetch recent activities
  useEffect(() => {
    async function fetchActivities() {
      try {
        const list = await traceCall("DashboardPage", mountId, () => apiClient.getRecentUserActivity(20));
        setRecentActivities(list);
      } catch (err) {
        console.error("Failed to fetch recent activities", err);
      }
    }
    fetchActivities();
    const interval = setInterval(() => {
      traceCall("DashboardPage", mountId, () => fetchActivities());
    }, 15000);
    return () => clearInterval(interval);
  }, [mountId]);

  // Fetch collaborators presence
  useEffect(() => {
    let active = true;
    let pollInterval: ReturnType<typeof setInterval>;

    async function fetchFriendsPresence() {
      try {
        const friendsList = await traceCall("DashboardPage", mountId, () => apiClient.getFriends());
        if (!active) return;
        setFriends(friendsList);
      } catch (err) {
        console.error("Failed to fetch friends presence securely", err);
      }
    }

    fetchFriendsPresence();
    pollInterval = setInterval(() => {
      traceCall("DashboardPage", mountId, () => fetchFriendsPresence());
    }, 20000);

    return () => {
      active = false;
      clearInterval(pollInterval);
    };
  }, [mountId]);

  const handleResume = async (projectId: string) => {
    setRunningWorkspaceId(projectId);
    try {
      const sessionInfo = await openProject(projectId);
      if (sessionInfo) {
        navigate(`/project/${projectId}/editor?session=${encodeURIComponent(sessionInfo.session_id)}`);
      }
    } catch (err: any) {
      setRunningWorkspaceId(null);
      showErrorToast(err, "Resume Project Failed");
    }
  };

  const sortedFriends = [...friends].sort((a, b) => {
    const stateA = a.presence?.state || a.mode || "offline";
    const stateB = b.presence?.state || b.mode || "offline";

    const rank = { online: 3, away: 2, offline: 1 };
    const rA = rank[stateA as keyof typeof rank] || 1;
    const rB = rank[stateB as keyof typeof rank] || 1;

    if (rA !== rB) return rB - rA;

    const timeA = a.presence?.lastSeenAt || a.updated_at || 0;
    const timeB = b.presence?.lastSeenAt || b.updated_at || 0;
    return timeB - timeA;
  });

  const getFriendActivityDescription = (friend: any) => {
    const presence = friend.presence || {};
    const state = presence.state || friend.mode || "offline";

    if (state === "offline") {
      const lastSeen = presence.lastSeenAt || friend.updated_at;
      if (lastSeen) {
        const diffMs = Date.now() - (lastSeen * 1000);
        const diffMins = Math.floor(diffMs / 60000);
        if (diffMins < 1) return "Last active just now";
        if (diffMins < 60) return `Last active ${diffMins}m ago`;
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `Last active ${diffHours}h ago`;
        return `Last active ${Math.floor(diffHours / 24)}d ago`;
      }
      return "Offline";
    }

    if (state === "away") {
      return "Away";
    }

    return presence.activePage || friend.status_text || "Online";
  };

  const formatActivityMessage = (act: any) => {
    const type = act.event_type;
    const details = act.details || {};
    const fileName = details.file_name || details.file_id || "";
    const shortName = fileName.split("/").pop() || "";

    switch (type) {
      case "files_edited":
        return `Edited ${shortName || "a file"}`;
      case "branch_switched":
        return `Switched to branch ${details.branch || "main"}`;
      case "projects_created":
        return "Created project";
      case "repositories_imported":
        return "Imported repository";
      case "project_run":
        return `Ran execution on ${shortName || "project"}`;
      case "sessions_joined":
        return "Joined collaborative workspace";
      case "friend_requests_accepted":
        return "Accepted friend request";
      case "friend_requests_sent":
        return "Sent friend request";
      case "deployments":
        return "Deployed project to production";
      case "invites_sent":
        return "Sent collaboration invitation";
      default:
        return type.replace(/_/g, " ");
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "files_edited":
        return <FileCode size={12} className="text-primary" />;
      case "branch_switched":
        return <ArrowRight size={12} className="text-secondary" />;
      case "projects_created":
      case "repositories_imported":
        return <FolderPlus size={12} className="text-success" />;
      case "project_run":
        return <Play size={12} className="text-info" />;
      default:
        return <Clock size={12} className="text-muted-foreground" />;
    }
  };

  const formatRelativeTime = (timestamp: number) => {
    const diffMs = Date.now() - (timestamp * 1000);
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const firstName = user?.name?.split(" ")[0] || user?.username || "Developer";

  // Sort projects by updated_at descending
  const sortedProjects = [...projects].sort(
    (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  );

  const heroProject = sortedProjects[0];
  const otherProjects = sortedProjects.slice(1, 1 + RECENT_PROJECT_LIMIT);

  // Overview metrics calculation
  const OVERVIEW_METRICS = [
    { label: "Projects", value: String(projects.length), icon: Database, color: "#5B9BD4" },
    { label: "Blueprints", value: "2", icon: GitFork, color: "#4CAF7D" },
    { label: "Deployments", value: "12", icon: Rocket, color: "#D4A84B" },
    { label: "Storage", value: "1.2 GB", icon: HardDrive, color: "#C0624A" },
    { label: "Current Plan", value: "Pro", icon: CreditCard, color: "#9FD7A7" },
    { label: "AI Credits", value: "840", icon: Zap, color: "#5B9BD4" },
  ];

  return (
    <div className="min-h-full bg-background">
      <div className="max-w-6xl mx-auto px-6 md:px-8 py-8">

        {/* ── Welcome Back Banner ── */}
        {showWelcomeBack && (
          <WelcomeBackBanner
            onDismiss={() => setShowWelcomeBack(false)}
            heroProject={heroProject}
            handleResume={handleResume}
          />
        )}

        {/* ── Hero ── */}
        <section className="mb-8">
          <div className="flex items-start justify-between gap-6 flex-wrap lg:flex-nowrap">
            <div>
              <h1
                className="text-3xl md:text-4xl font-semibold text-foreground mb-2 leading-tight"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {greeting}, {firstName}.
              </h1>
              <p className="text-base text-muted-foreground mb-6">Ready to build something today?</p>
              <div className="flex items-center gap-3 flex-wrap">
                {heroProject && (
                  <button
                    onClick={() => handleResume(heroProject.id)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-xl hover:bg-primary/90 transition-colors"
                  >
                    <Play size={14} />
                    Resume Workspace
                  </button>
                )}
                <button
                  onClick={() => navigate("/projects/create")}
                  className="flex items-center gap-2 px-5 py-2.5 border border-border text-foreground text-sm font-medium rounded-xl hover:bg-muted transition-colors"
                >
                  <Plus size={14} />
                  New Project
                </button>
              </div>
            </div>

            {/* Desktop workspace snapshot widget */}
            {heroProject && (
              <div className="hidden lg:flex items-center gap-5 shrink-0 bg-surface border border-border rounded-2xl px-5 py-4">
                <div className="text-center">
                  <p className="text-[10px] text-muted-foreground mb-0.5">Workspace</p>
                  <p className="text-sm font-semibold text-foreground truncate max-w-[120px]">{heroProject.name}</p>
                </div>
                <div className="h-8 w-px bg-border" />
                <div className="text-center">
                  <p className="text-[10px] text-muted-foreground mb-1">Collaborators</p>
                  <div className="flex items-center gap-1.5 justify-center">
                    <div className="flex -space-x-1.5">
                      {["#5B9BD4", "#D4A84B"].map((c, i) => (
                        <div key={i} className="size-4 rounded-full border border-surface" style={{ backgroundColor: c }} />
                      ))}
                    </div>
                    <span className="text-[10px] text-success font-medium">{friends.filter(f => (f.presence?.state || f.mode) !== 'offline').length} online</span>
                  </div>
                </div>
                <div className="h-8 w-px bg-border" />
                <div className="text-center">
                  <p className="text-[10px] text-muted-foreground mb-0.5">Branch</p>
                  <p className="text-sm font-semibold text-foreground">{heroProject.branch || "main"}</p>
                </div>
                <div className="h-8 w-px bg-border" />
                <div className="text-center">
                  <p className="text-[10px] text-muted-foreground mb-0.5">Last active</p>
                  <p className="text-sm font-semibold text-foreground">{new Date(heroProject.updated_at).toLocaleDateString()}</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ── Continue Working ── */}
        {heroProject && (
          <section className="mb-8">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-3">
              Continue working
            </p>
            <ActiveWorkspaceCard
              heroProject={heroProject}
              handleResume={handleResume}
              sortedFriends={sortedFriends}
              isRunning={true}
            />
          </section>
        )}

        {/* ── Recent Workspaces + Activity ── */}
        <section className="mb-8 grid lg:grid-cols-5 gap-5">
          {/* Recent Workspaces — idle, no resource bars */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                Recent workspaces
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate("/dashboard/projects")}
                  className="text-[10px] text-primary hover:underline"
                >
                  View all
                </button>
                <span className="text-muted-foreground/30 text-[10px]">·</span>
                <span className="text-[9px] text-muted-foreground/50 uppercase tracking-wide">idle</span>
              </div>
            </div>

            {otherProjects.length > 0 ? (
              <div className="bg-surface border border-border rounded-2xl divide-y divide-border/60">
                {otherProjects.slice(0, 4).map((ws) => (
                  <div
                    key={ws.id}
                    className="flex items-center gap-3 px-4 py-3.5 group hover:bg-muted/30 transition-colors"
                  >
                    {/* Grey dot = idle, not consuming resources */}
                    <span className="size-1.5 rounded-full bg-muted-foreground/30 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{ws.name}</p>
                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-0.5">
                        <GitBranch size={9} />
                        <span>{ws.branch || "main"}</span>
                        <span>·</span>
                        <span>{new Date(ws.updated_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleResume(ws.id)}
                      className="text-[10px] font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity shrink-0 hover:underline"
                    >
                      Resume
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-surface border border-border rounded-2xl p-6 text-center text-xs text-muted-foreground">
                No other projects.
              </div>
            )}

            {/* Collaborator presence below workspaces */}
            <div className="mt-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                  Collaborators
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate("/friends")}
                    className="text-[10px] text-primary hover:underline"
                  >
                    Manage
                  </button>
                  <span className="text-muted-foreground/30 text-[10px]">·</span>
                  <button
                    onClick={() => {
                      const wsId = prompt("Enter Workspace / Session ID to join:");
                      if (wsId) navigate(`/project/join?session=${encodeURIComponent(wsId)}`);
                    }}
                    className="text-[10px] text-primary hover:underline"
                  >
                    Join Session
                  </button>
                </div>
              </div>

              {sortedFriends.length > 0 ? (
                <div className="bg-surface border border-border rounded-2xl divide-y divide-border/60">
                  {sortedFriends.slice(0, 5).map((p) => {
                    const state = p.presence?.state || p.mode || "offline";
                    const online = state !== "offline";
                    return (
                      <div key={p.uid} className="flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors">
                        <Avatar name={p.name || p.username} presenceMode={state} size="sm" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-foreground">{p.name || p.username}</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5 truncate">
                            {getFriendActivityDescription(p)}
                          </p>
                        </div>
                        {online && (
                          <button
                            onClick={() => {
                              if (p.presence?.projectId) {
                                handleResume(p.presence.projectId);
                              } else {
                                const wsId = prompt("Enter Workspace / Session ID to join:");
                                if (wsId) navigate(`/project/join?session=${encodeURIComponent(wsId)}`);
                              }
                            }}
                            className="text-[10px] font-medium text-primary hover:underline shrink-0"
                          >
                            Join
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-surface border border-border rounded-2xl p-6 text-center text-xs text-muted-foreground">
                  Teammates you add will appear here.
                </div>
              )}
            </div>
          </div>

          {/* Activity Feed */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                Activity
              </p>
              <button
                onClick={() => navigate("/dashboard/devlogs")}
                className="text-[10px] text-primary hover:underline"
              >
                View all
              </button>
            </div>
            {recentActivities.length > 0 ? (
              <div className="bg-surface border border-border rounded-2xl divide-y divide-border/50">
                {recentActivities.slice(0, 7).map((item, index) => {
                  return (
                    <div
                      key={item.id || index}
                      className="flex items-start gap-3 px-4 py-3.5 hover:bg-muted/30 transition-colors"
                    >
                      <div className="size-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 bg-primary/10 border border-primary/20">
                        {getActivityIcon(item.event_type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground leading-snug">{formatActivityMessage(item)}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5 truncate">
                          {item.details?.branch || item.details?.file_name || ""}
                        </p>
                      </div>
                      <span className="text-[10px] text-muted-foreground shrink-0 mt-0.5 tabular-nums">{formatRelativeTime(item.created_at)}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-surface border border-border rounded-2xl p-8 text-center text-xs text-muted-foreground">
                No recent activity.
              </div>
            )}
          </div>
        </section>

        {/* ── Blueprint Activity (user's published blueprint analytics) ── */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
              Blueprint activity
            </p>
            <button
              onClick={() => navigate("/dashboard/deployments")}
              className="text-[10px] text-primary hover:underline"
            >
              View all blueprints
            </button>
          </div>

          {/* TODO: Connect real backend APIs for blueprint activities and analytics */}
          <div className="bg-surface border border-border rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div
                className="size-12 rounded-2xl flex items-center justify-center shrink-0 text-2xl"
                style={{ backgroundColor: `${MY_BLUEPRINT.color}12` }}
              >
                {MY_BLUEPRINT.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5 mb-1 flex-wrap">
                  <p className="text-sm font-semibold text-foreground">{MY_BLUEPRINT.name}</p>
                  {MY_BLUEPRINT.verified && <CheckCircle2 size={12} className="text-primary" />}
                  <span className="text-[10px] font-mono text-muted-foreground">{MY_BLUEPRINT.version}</span>
                  <span className="text-[10px] text-muted-foreground ml-auto">Published {MY_BLUEPRINT.publishedAt}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-5 leading-relaxed">{MY_BLUEPRINT.desc}</p>

                {/* Stats */}
                <div className="flex items-end gap-8 flex-wrap">
                  {[
                    { value: MY_BLUEPRINT.launches, label: "launches", accent: false },
                    { value: MY_BLUEPRINT.forks, label: "forks", accent: false },
                    { value: MY_BLUEPRINT.starsToday, label: "stars today", accent: false },
                  ].map(({ value, label }) => (
                    <div key={label}>
                      <p
                        className="text-2xl font-semibold text-foreground leading-none"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {value}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-1">{label}</p>
                    </div>
                  ))}
                  <div className="ml-auto text-right">
                    <p className="text-base font-semibold text-success">{MY_BLUEPRINT.trend}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">vs last week</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Marketplace Preview ── */}
        <section className="mb-8">
          <div className="bg-surface border border-border rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <div>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1">
                  Marketplace
                </p>
                <p className="text-sm font-semibold text-foreground">Discover on Marketplace</p>
              </div>
              <button
                onClick={() => navigate("/dashboard/marketplace")}
                className="flex items-center gap-1.5 px-4 py-2 border border-border text-foreground text-xs font-medium rounded-xl hover:bg-muted hover:border-primary/30 transition-all"
              >
                <ShoppingBag size={12} />
                Explore all
                <ArrowRight size={11} className="text-muted-foreground" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {MARKETPLACE_FEATURED.map((item) => (
                <button
                  key={item.id}
                  onClick={() => navigate("/dashboard/marketplace")}
                  className="flex items-center gap-3 p-3.5 border border-border rounded-xl hover:border-primary/30 hover:bg-muted/50 transition-all text-left group"
                >
                  <div
                    className="size-9 rounded-xl flex items-center justify-center shrink-0 text-xl"
                    style={{ backgroundColor: `${item.color}12` }}
                  >
                    {item.emoji}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">{item.name}</p>
                    <p className="text-[10px] text-muted-foreground">{item.category}</p>
                    <p className="text-[9px] text-primary font-medium mt-0.5">{item.badge}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ── Overview metrics ── */}
        <section className="mb-8">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-3">
            Overview
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {OVERVIEW_METRICS.map((m) => {
              const Icon = m.icon;
              return (
                <div key={m.label} className="bg-surface border border-border rounded-2xl p-4 flex flex-col gap-3">
                  <div
                    className="size-8 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${m.color}15` }}
                  >
                    <Icon size={14} style={{ color: m.color }} />
                  </div>
                  <div>
                    <p
                      className="text-xl font-semibold text-foreground leading-none"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {m.value}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-1">{m.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Achievements ── */}
        <section className="pb-8">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
              Achievements
            </p>
            <button onClick={() => navigate("/profile")} className="text-[10px] text-primary hover:underline">
              View all
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {user?.achievements && user.achievements.length > 0 ? (
              user.achievements.map((a: any) => (
                <div
                  key={a.id}
                  title={a.description}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface border border-border hover:border-primary/30 transition-colors"
                >
                  <span className="text-sm">{a.icon}</span>
                  <span className="text-xs font-medium text-foreground">{a.name}</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-muted-foreground">No achievements unlocked yet.</p>
            )}
          </div>
        </section>

      </div>

      <RepositorySelectModal
        isOpen={isRepoSelectOpen}
        onClose={() => setIsRepoSelectOpen(false)}
        onSelectGitHub={() => {
          setIsRepoSelectOpen(false);
          setIsGitHubImportOpen(true);
        }}
      />

      <GitHubImportModal
        isOpen={isGitHubImportOpen}
        onClose={() => setIsGitHubImportOpen(false)}
        onImportSuccess={(projectId) => {
          listProjects();
          handleResume(projectId);
        }}
      />
    </div>
  );
}
