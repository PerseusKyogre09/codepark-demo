import { useEffect, useState, useRef } from "react";
import {
  Plus, Play, FolderPlus, Link2, ArrowRight, UserPlus, ExternalLink, 
  MoreVertical, Clock, Trash2, Edit2, FileCode
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useProjects } from "../hooks/useProjects";
import { ProjectCard } from "../components/cp/ProjectCard";
import { Avatar } from "../components/cp/Avatar";
import { apiClient } from "../services/api";
import RepositorySelectModal from "../components/RepositorySelectModal";
import GitHubImportModal from "../components/GitHubImportModal";
import { showSuccessToast, showErrorToast } from "../utils/errorHandling";
import { getNextMountId, startNewNavigation, traceCall } from "../utils/debugTracer";

const RECENT_PROJECT_LIMIT = 6;

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { projects, listProjects, openProject, deleteProject } = useProjects();
  const [friends, setFriends] = useState<any[]>([]);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [isRepoSelectOpen, setIsRepoSelectOpen] = useState(false);
  const [isGitHubImportOpen, setIsGitHubImportOpen] = useState(false);
  const [activeMenuProjectId, setActiveMenuProjectId] = useState<string | null>(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  // Click outside to close hero context menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveMenuProjectId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleResume = async (projectId: string) => {
    try {
      const sessionInfo = await openProject(projectId);
      if (sessionInfo) {
        navigate(`/project/${projectId}/editor?session=${encodeURIComponent(sessionInfo.session_id)}`);
      }
    } catch (err: any) {
      showErrorToast(err, "Resume Project Failed");
    }
  };

  const handleResumeNewTab = async (projectId: string) => {
    try {
      const sessionInfo = await openProject(projectId);
      if (sessionInfo) {
        const url = `/project/${projectId}/editor?session=${encodeURIComponent(sessionInfo.session_id)}`;
        window.open(url, "_blank");
      }
    } catch (err: any) {
      showErrorToast(err, "Open Project Failed");
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      try {
        await deleteProject(projectId);
        showSuccessToast("Project deleted successfully");
        listProjects();
        setActiveMenuProjectId(null);
      } catch (err: any) {
        showErrorToast(err, "Delete Project Failed");
      }
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

  // Sort projects by updated_at descending
  const sortedProjects = [...projects].sort(
    (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  );

  const heroProject = sortedProjects[0];
  const otherProjects = sortedProjects.slice(1, 1 + RECENT_PROJECT_LIMIT);

  return (
    <div className="min-h-full bg-background">
      {/* Top bar header */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border px-4 md:px-8 h-14 flex items-center justify-between">
        <div>
          <h1 className="text-base font-semibold text-foreground tracking-tight leading-tight">
            {greeting}, {user?.name?.split(" ")[0] || user?.username || "Developer"}.
          </h1>
          <p className="text-[10px] md:text-xs text-muted-foreground mt-0.5 font-medium">Ready to build something?</p>
        </div>
        <button
          onClick={() => navigate("/projects/create")}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground text-xs font-semibold rounded-md hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Plus size={14} />
          New Project
        </button>
      </header>

      <div className="max-w-5xl mx-auto px-4 md:px-8 py-6 md:py-8 space-y-6">
        
        {/* Main Grid: Hero + Quick Actions */}
        <div className="grid md:grid-cols-3 gap-5">
          
          {/* Continue Working (Hero Card Slot) */}
          <div className="md:col-span-2 flex flex-col">
            <h2 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2.5">
              Continue Working
            </h2>
            
            {heroProject ? (
              <div className="bg-card border border-border rounded-lg p-5 flex flex-col justify-between flex-1 relative group hover:border-border/80 transition-all">
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="size-9 rounded-md bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                        <FileCode size={18} className="text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-foreground text-sm">{heroProject.name}</h3>
                          {heroProject.role && heroProject.role !== "owner" && (
                            <span className="rounded-full border border-primary/30 bg-primary/10 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-primary">
                              shared
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          Active branch: <span className="font-semibold text-foreground/80">{heroProject.branch || "main"}</span>
                        </p>
                      </div>
                    </div>

                    <div className="relative" ref={dropdownRef}>
                      <button
                        onClick={() => setActiveMenuProjectId(activeMenuProjectId === heroProject.id ? null : heroProject.id)}
                        className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <MoreVertical size={15} />
                      </button>

                      {activeMenuProjectId === heroProject.id && (
                        <div className="absolute right-0 mt-1 w-44 rounded-md border border-border bg-popover text-popover-foreground shadow-lg z-20 py-1 focus:outline-none">
                          <button
                            onClick={() => handleResume(heroProject.id)}
                            className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-left hover:bg-muted transition-colors font-medium"
                          >
                            <Play size={12} /> Resume
                          </button>
                          <button
                            onClick={() => handleResumeNewTab(heroProject.id)}
                            className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-left hover:bg-muted transition-colors font-medium"
                          >
                            <ExternalLink size={12} /> Open in New Tab
                          </button>
                          <button
                            onClick={() => navigate(`/project/${heroProject.id}/settings`)}
                            className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-left hover:bg-muted transition-colors font-medium"
                          >
                            <Edit2 size={12} /> Settings / Rename
                          </button>
                          <div className="border-t border-border my-1" />
                          <button
                            onClick={() => handleDeleteProject(heroProject.id)}
                            className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-left text-destructive hover:bg-destructive/10 transition-colors font-medium"
                          >
                            <Trash2 size={12} /> Delete Project
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed mt-4 line-clamp-3">
                    {heroProject.description || "No description provided."}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-border/80 pt-4 mt-6">
                  <span className="text-[10px] text-muted-foreground font-medium">
                    Last active {new Date(heroProject.updated_at).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => handleResume(heroProject.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground text-xs font-semibold rounded-md hover:bg-primary/95 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring shrink-0 shadow-sm"
                  >
                    <Play size={11} />
                    Resume Session
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-card border border-border border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-center flex-1">
                <FolderPlus size={32} className="text-muted-foreground/80 mb-3" />
                <p className="text-sm font-semibold text-foreground">Create your first project</p>
                <p className="text-xs text-muted-foreground mt-1 max-w-[280px] leading-relaxed">
                  Start coding from scratch or import a repository to begin collaborating.
                </p>
                <button
                  onClick={() => navigate("/projects/create")}
                  className="mt-4 px-4 py-2 bg-primary text-primary-foreground text-xs font-semibold rounded-md hover:bg-primary/90 transition-colors"
                >
                  New Project
                </button>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col">
            <h2 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2.5">
              Quick Actions
            </h2>
            <div className="bg-card border border-border rounded-lg p-5 flex flex-col justify-between flex-1 space-y-3">
              <button
                onClick={() => navigate("/projects/create")}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md border border-border hover:border-primary/40 hover:bg-muted transition-all text-left group"
              >
                <div className="size-8 rounded bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                  <Plus size={15} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">New Project</p>
                  <p className="text-[10px] text-muted-foreground">Start from blank canvas or templates</p>
                </div>
                <ArrowRight size={13} className="text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>

              <button
                onClick={() => setIsRepoSelectOpen(true)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md border border-border hover:border-primary/40 hover:bg-muted transition-all text-left group"
              >
                <div className="size-8 rounded bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                  <Link2 size={15} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">Import Repository</p>
                  <p className="text-[10px] text-muted-foreground">Connect and import GitHub repository</p>
                </div>
                <ArrowRight size={13} className="text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>

              <button
                onClick={() => {
                  const wsId = prompt("Enter Workspace / Session ID to join:");
                  if (wsId) navigate(`/project/join?session=${encodeURIComponent(wsId)}`);
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md border border-border hover:border-primary/40 hover:bg-muted transition-all text-left group"
              >
                <div className="size-8 rounded bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                  <UserPlus size={15} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">Join Workspace</p>
                  <p className="text-[10px] text-muted-foreground">Connect to a live shared session ID</p>
                </div>
                <ArrowRight size={13} className="text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>
          </div>
        </div>

        {/* Secondary Grid: Recent Projects + Activity Feed + Collaborators */}
        <div className="grid md:grid-cols-3 gap-5">

          {/* Recent Projects List */}
          <div className="flex flex-col md:col-span-2">
            <div className="flex items-center justify-between mb-2.5">
              <h2 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Recent Projects
              </h2>
              <button
                onClick={() => navigate("/dashboard/projects")}
                className="text-[10px] font-semibold text-primary hover:underline rounded"
              >
                View all
              </button>
            </div>
            <div className="bg-card border border-border rounded-lg p-5 flex-1">
              {otherProjects.length > 0 ? (
                <div className="grid sm:grid-cols-2 gap-3.5">
                  {otherProjects.map((p) => {
                    const adaptedProj = {
                      id: p.id,
                      name: p.name,
                      description: p.description || "",
                      language: "TypeScript",
                      branch: p.branch || "main",
                      lastActive: new Date(p.updated_at).toLocaleDateString(),
                      collaborators: 1,
                      tags: ["web"],
                      role: p.role,
                    };
                    return (
                      <ProjectCard
                        key={p.id}
                        project={adaptedProj}
                        compact
                        onClick={() => handleResume(p.id)}
                      />
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <p className="text-xs text-muted-foreground">Nothing here yet.</p>
                </div>
              )}
            </div>
          </div>

          {/* Activity Feed */}
          <div className="flex flex-col">
            <h2 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2.5">
              Activity Feed
            </h2>
            <div className="bg-card border border-border rounded-lg p-4 flex flex-col h-[280px]">
              <div className="space-y-3.5 overflow-y-auto pr-1 flex-1">
                {recentActivities.map((act, index) => (
                  <div key={act.id || index} className="flex items-start gap-2.5 text-xs">
                    <div className="size-5 rounded bg-muted flex items-center justify-center shrink-0 border border-border/60">
                      {getActivityIcon(act.event_type)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-foreground font-medium leading-tight truncate">
                        {formatActivityMessage(act)}
                      </p>
                      <span className="text-[9px] text-muted-foreground">
                        {formatRelativeTime(act.created_at)}
                      </span>
                    </div>
                  </div>
                ))}
                {recentActivities.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 text-center h-full">
                    <Clock size={20} className="text-muted-foreground/60 mb-2" />
                    <p className="text-[11px] text-muted-foreground font-medium">No recent activity.</p>
                    <p className="text-[9px] text-muted-foreground mt-0.5">Start building something!</p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Collaborators Panel */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-2.5">
            <h2 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Collaborators
            </h2>
          </div>
          <div className="bg-card border border-border rounded-lg p-5">
            <div className="space-y-3.5 overflow-y-auto max-h-[220px] pr-1">
              {sortedFriends.map((f) => {
                const state = f.presence?.state || f.mode || "offline";
                return (
                  <div key={f.uid} className="flex items-center justify-between group py-1 border-b border-border/40 last:border-0">
                    <div
                      onClick={() => navigate(`/profile/${f.username}`)}
                      className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer hover:opacity-85 transition-opacity"
                    >
                      <Avatar name={f.name || f.username} presenceMode={state} />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-foreground leading-tight hover:text-primary transition-colors truncate">
                          {f.name || f.username}
                        </p>
                        <p className="text-[10px] text-muted-foreground truncate mt-0.5 font-medium">
                          {getFriendActivityDescription(f)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
              {friends.length === 0 && (
                <div className="py-6 text-center">
                  <p className="text-xs text-muted-foreground">Invite teammates to collaborate.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Achievements */}
        <div className="bg-card border border-border rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Recent achievements
            </h2>
            <button
              onClick={() => navigate("/achievements")}
              className="text-xs text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
            >
              View all
            </button>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {(user?.achievements || [])
              .slice()
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .slice(0, 4)
              .map((a) => (
                <div
                  key={a.id}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted border border-border text-xs"
                  title={a.description}
                >
                  <span>{a.icon}</span>
                  <span className="text-foreground text-xs font-semibold">{a.name}</span>
                </div>
              ))}
            {(!user?.achievements || user.achievements.length === 0) && (
              <p className="text-[11px] text-muted-foreground py-1">No achievements unlocked yet.</p>
            )}
          </div>
        </div>

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
