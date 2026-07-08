import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin, Edit2, Loader2 } from "lucide-react";
import { Avatar } from "../components/cp/Avatar";
import { ProjectCard } from "../components/cp/ProjectCard";
import { useAuth } from "../contexts/AuthContext";
import { apiClient } from "../services/api";
import { useProjects } from "../hooks/useProjects";
import { useTheme } from "../contexts/ThemeContext";
import type { User } from "../types";
import AchievementsList from "../components/profile/AchievementsList";
import { PROJECT_CACHE_INVALIDATED_EVENT } from "../utils/projectSync";

/* Contribution graph helper — 45 weeks × 7 days calendar grid ending today */
function getGridFromHeatmap(heatmapData: Record<string, number>) {
  const grid: number[][] = [];
  const today = new Date();
  
  // Align to Saturday of the current week
  const lastDay = new Date(today);
  lastDay.setDate(today.getDate() + (6 - today.getDay()));
  
  // Start date is exactly 45 weeks (315 days) before that Saturday (Sunday of the first week)
  const startDate = new Date(lastDay);
  startDate.setDate(lastDay.getDate() - (45 * 7 - 1));
  
  for (let w = 0; w < 45; w++) {
    const week: number[] = [];
    for (let d = 0; d < 7; d++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + (w * 7) + d);
      
      const dateString = currentDate.toISOString().split('T')[0];
      const count = heatmapData[dateString] || 0;
      
      // Map counts to levels 0-4
      const level = count === 0 ? 0 : count <= 2 ? 1 : count <= 5 ? 2 : count <= 8 ? 3 : 4;
      week.push(level);
    }
    grid.push(week);
  }
  return grid;
}


const intensityDark = ["rgba(255, 255, 255, 0.06)", "#267A4A", "#2E8B57", "#5AA469", "#9FD7A7"];
const intensityLight = ["rgba(0, 0, 0, 0.06)", "#C4E8CC", "#6BAF82", "#3F8C5B", "#2B6840"];

export default function ProfilePage() {
  const { username } = useParams<{ username?: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { projects, listProjects, openProject } = useProjects();
  const { settings } = useTheme();
  const [profileUser, setProfileUser] = useState<User | null>(() => {
    const cacheKey = `cached_profile_${username || "me"}`;
    const cached = localStorage.getItem(cacheKey);
    return cached ? JSON.parse(cached) : null;
  });
  const [heatmap, setHeatmap] = useState<Record<string, number>>({});
  const [activityFilter, setActivityFilter] = useState("All Activity");
  const [loading, setLoading] = useState(() => {
    const cacheKey = `cached_profile_${username || "me"}`;
    return !localStorage.getItem(cacheKey);
  });
  const containerRef = useRef<HTMLDivElement>(null);

  const isOwnProfile = !username || username === currentUser?.username;
  const activeColors = settings.uiTheme === "light" ? intensityLight : intensityDark;

  const [pinnedIds, setPinnedIds] = useState<string[]>([]);

  useEffect(() => {
    if (profileUser) {
      setPinnedIds(profileUser.pinned_projects || []);
    }
  }, [profileUser]);

  useEffect(() => {
    async function loadProfile() {
      if (!profileUser) {
        setLoading(true);
      }
      try {
        let targetUser = currentUser;
        if (!isOwnProfile && username) {
          targetUser = await apiClient.getUserProfile(username);
        }
        setProfileUser(targetUser);

        const cacheKey = `cached_profile_${username || "me"}`;
        localStorage.setItem(cacheKey, JSON.stringify(targetUser));

        if (targetUser?.username) {
          if (targetUser?.username) {
            const actData = await apiClient.getUserHeatmap(targetUser.username, activityFilter);
            setHeatmap(actData.heatmap || {});
          }
        }
      } catch (err) {
        console.error("Failed to load user profile", err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [username, currentUser, isOwnProfile]);

  useEffect(() => {
    async function fetchFilteredHeatmap() {
      if (profileUser?.username) {
        try {
          const actData = await apiClient.getUserHeatmap(profileUser.username, activityFilter);
          setHeatmap(actData.heatmap || {});
        } catch (err) {
          console.error("Failed to load filtered user activity heatmap", err);
        }
      }
    }
    fetchFilteredHeatmap();
  }, [activityFilter, profileUser?.username]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollLeft = containerRef.current.scrollWidth;
    }
  }, [heatmap]);

  useEffect(() => {
    if (isOwnProfile) {
      listProjects();
    }
  }, [isOwnProfile, listProjects]);

  useEffect(() => {
    const handleProjectInvalidation = () => {
      void listProjects({ silent: true });
      void (async () => {
        try {
          let targetUser = currentUser;
          if (!isOwnProfile && username) {
            targetUser = await apiClient.getUserProfile(username);
          }
          setProfileUser(targetUser);
          const cacheKey = `cached_profile_${username || "me"}`;
          localStorage.setItem(cacheKey, JSON.stringify(targetUser));
        } catch (err) {
          console.error("Failed to refresh profile after project invalidation", err);
        }
      })();
    };

    window.addEventListener(PROJECT_CACHE_INVALIDATED_EVENT, handleProjectInvalidation);
    return () => window.removeEventListener(PROJECT_CACHE_INVALIDATED_EVENT, handleProjectInvalidation);
  }, [currentUser, isOwnProfile, listProjects, username]);

  const handleResume = async (projectId: string) => {
    const sessionInfo = await openProject(projectId);
    if (sessionInfo) {
      navigate(`/project/${projectId}/editor?session=${encodeURIComponent(sessionInfo.session_id)}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-full bg-background py-20">
        <Loader2 className="animate-spin text-primary size-8" />
      </div>
    );
  }

  const privacySettings = profileUser?.privacy_settings || {};
  const showHeatmap = privacySettings.show_heatmap !== false && !profileUser?.hidden_cards?.includes("activity");
  const showName = privacySettings.show_name !== false;
  const showEmail = privacySettings.show_email !== false;
  const isProfilePrivate = !isOwnProfile && (profileUser as any)?.is_private === true;

  const name = (showName && profileUser?.name) ? profileUser.name : (profileUser?.username || "User");
  
  let bio = profileUser?.bio || "No bio provided yet.";
  if (profileUser?.email && showEmail) {
    bio = `${bio} (Contact: ${profileUser.email})`;
  }

  // Filter projects by user pinned selections
  const pinnedProjectsList = projects.filter((p) => pinnedIds.includes(p.id));



  return (
    <div className="min-h-full bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-10 bg-background/90 backdrop-blur-sm border-b border-border px-4 md:px-8 h-14 flex items-center justify-between">
        <h1
          className="text-base font-semibold text-foreground"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Profile
        </h1>
        {isOwnProfile && (
          <button
            onClick={() => navigate("/settings")}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-border text-foreground text-sm font-medium rounded-md hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Edit2 size={13} />
            Edit profile
          </button>
        )}
      </header>

      <div className="max-w-3xl mx-auto px-4 md:px-8 py-6 md:py-8">

        {/* Primary zone */}
        <div className="bg-card border border-border rounded-lg p-6 mb-5">
          <div className="flex items-start gap-5">
            <Avatar name={name} size="xl" />
            <div className="flex-1 min-w-0">
              <h2
                className="text-xl font-semibold text-foreground leading-tight"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {name}
              </h2>
              <p className="text-sm text-muted-foreground mt-0.5">@{profileUser?.username || "user"}</p>

              <div className="flex items-center gap-1.5 mt-2">
                <span className="size-2 rounded-full bg-success" />
                <span className="text-xs text-muted-foreground">Active builder</span>
              </div>

              <p className="text-sm text-foreground/80 mt-3 leading-relaxed max-w-md">
                {bio}
              </p>

              <div className="flex flex-wrap items-center gap-3 mt-3">
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin size={11} />
                  Remote
                </span>
              </div>
            </div>
          </div>

          {/* Social and Collaboration stats */}
          <div className="grid grid-cols-4 gap-4 mt-6 border-t border-border/60 pt-4 text-center sm:text-left">
            <div>
              <p className="text-lg font-bold text-foreground">{profileUser?.friends_count ?? 0}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Friends</p>
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">{profileUser?.collaborators_count ?? 0}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Collaborators</p>
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">{profileUser?.shared_projects_count ?? 0}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Shared Projects</p>
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">{profileUser?.shared_sessions_count ?? 0}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Shared Sessions</p>
            </div>
          </div>
        </div>

        {isProfilePrivate ? (
          <div className="bg-card border border-border rounded-lg p-8 text-center">
            <p className="text-sm text-muted-foreground">This profile is private.</p>
            <p className="text-xs text-muted-foreground/70 mt-1">You must be friends with this user to view their activity.</p>
          </div>
        ) : (
          <>
            {/* Pinned Projects */}
            <div className="bg-card border border-border rounded-lg p-5 mb-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Pinned projects
                </h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {pinnedProjectsList.length > 0 ? (
                  pinnedProjectsList.map((p) => {
                    const adapted = {
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
                        project={adapted}
                        onClick={() => handleResume(p.id)}
                        pinned={true}
                      />
                    );
                  })
                ) : (
                  <p className="text-xs text-muted-foreground col-span-2 py-4 text-center">
                    {isOwnProfile 
                      ? "No projects pinned yet. Right-click projects on the Projects page to pin them." 
                      : "No projects pinned yet."}
                  </p>
                )}
              </div>
            </div>

            {/* Contribution record */}
            {showHeatmap && (
              <div className="bg-card border border-border rounded-lg p-5 mb-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Activity
                    </h2>
                    <p className="text-[11px] text-muted-foreground mt-0.5">Contributions over the last 45 weeks</p>
                  </div>
                  <select
                    value={activityFilter}
                    onChange={(e) => setActivityFilter(e.target.value)}
                    className="bg-muted border border-border text-xs rounded px-2 py-1 focus:outline-none focus:border-primary text-foreground font-medium cursor-pointer"
                  >
                    {["All Activity", "Coding", "Collaboration", "Projects", "Deployments", "AI Usage", "Documentation"].map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </div>

                <div ref={containerRef} className="overflow-x-auto">
                  <div className="flex gap-0.5 min-w-fit">
                    {getGridFromHeatmap(heatmap).map((week, wi) => (
                      <div key={wi} className="flex flex-col gap-0.5">
                        {week.map((level, di) => (
                          <div
                            key={di}
                            className="size-3 rounded-sm animate-fadeIn"
                            style={{ backgroundColor: activeColors[level] }}
                            title={`${level} contribution${level !== 1 ? "s" : ""}`}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-3 text-[10px] text-muted-foreground">
                  <span>Less</span>
                  {[0, 1, 2, 3, 4].map((l) => (
                    <div
                      key={l}
                      className="size-2.5 rounded-sm"
                      style={{ opacity: l === 0 ? 0.15 : l * 0.25 + 0.15, backgroundColor: "var(--brand)" }}
                    />
                  ))}
                  <span>More</span>
                </div>
              </div>
            )}

            {/* Pinned Achievements */}
            <div className="bg-card border border-border rounded-lg p-5 mb-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Pinned Achievements
                  </h2>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Showcase of favorite completed badges</p>
                </div>
                <button
                  onClick={() => navigate(profileUser?.username ? `/achievements/${profileUser.username}` : "/achievements")}
                  className="text-xs text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded font-medium"
                >
                  View all
                </button>
              </div>

              <AchievementsList
                achievements={(profileUser?.achievements || [])
                  .filter((a) => profileUser?.pinned_achievements?.includes(a.id))
                  .slice(0, 5)}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
