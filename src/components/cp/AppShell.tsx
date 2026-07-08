import {
  LayoutDashboard,
  FolderKanban,
  BookOpen,
  Scroll,
  Tag,
  Bell,
  Settings,
  Moon,
  Sun,
  ChevronLeft,
  ChevronRight,
  Users,
  Trophy,
} from "lucide-react";
import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { Logo } from "./Logo";
import { Avatar } from "./Avatar";
import { BottomNav } from "./BottomNav";
import { apiClient } from "../../services/api";

type Screen =
  | "home"
  | "dashboard"
  | "profile"
  | "settings"
  | "docs"
  | "devlogs"
  | "releases"
  | "projects"
  | "project-create"
  | "notifications"
  | "achievements"
  | "friends"
  | "empty-states"
  | "loading-states"
  | "error-states";

interface NavItem {
  label: string;
  screen: Screen;
  icon: ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", screen: "dashboard", icon: <LayoutDashboard size={16} /> },
  { label: "Projects", screen: "projects", icon: <FolderKanban size={16} /> },
  { label: "Docs", screen: "docs", icon: <BookOpen size={16} /> },
  { label: "Devlogs", screen: "devlogs", icon: <Scroll size={16} /> },
  { label: "Releases", screen: "releases", icon: <Tag size={16} /> },
];

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { settings, updateSettings } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const theme = settings.uiTheme;
  const toggleTheme = () => updateSettings({ uiTheme: theme === "dark" ? "light" : "dark" });

  const getPath = (scr: string) => {
    if (scr === "dashboard") return "/dashboard";
    if (scr === "projects") return "/dashboard/projects";
    if (scr === "docs") return "/dashboard/docs";
    if (scr === "devlogs") return "/dashboard/devlogs";
    if (scr === "releases") return "/dashboard/releases";
    if (scr === "notifications") return "/notifications";
    if (scr === "achievements") return "/achievements";
    if (scr === "settings") return "/settings";
    if (scr === "profile") return "/profile";
    return "/dashboard";
  };

  const path = location.pathname;
  let screen: Screen = "dashboard";
  if (path.startsWith("/profile")) screen = "profile";
  else if (path.startsWith("/settings")) screen = "settings";
  else if (path.includes("/docs")) screen = "docs";
  else if (path.includes("/devlog")) screen = "devlogs";
  else if (path.includes("/releases")) screen = "releases";
  else if (path.includes("/projects")) screen = "projects";
  else if (path.startsWith("/notifications")) screen = "notifications";
  else if (path.startsWith("/achievements")) screen = "achievements";
  else if (path.startsWith("/friends")) screen = "friends";

  /* Default collapsed on tablet (< 1024 px), expanded on large tablet+ */
  const [collapsed, setCollapsed] = useState(
    () => typeof window !== "undefined" && window.innerWidth < 1024
  );

  const [unread, setUnread] = useState(0);
  const [friendRequestsCount, setFriendRequestsCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    async function fetchCounts() {
      try {
        const [notifs, requests] = await Promise.all([
          apiClient.getNotifications(),
          apiClient.getPendingRequests()
        ]);
        setUnread(notifs.filter((n) => !n.read && !n.read_status).length);
        setFriendRequestsCount((requests.incoming || []).length);
      } catch (err) {
        console.error("Failed to load counts", err);
      }
    }
    fetchCounts();
    const interval = setInterval(fetchCounts, 30000);

    const handleNotificationsRead = () => {
      setUnread(0);
    };

    const handleSingleRead = () => {
      setUnread((prev) => Math.max(0, prev - 1));
    };

    window.addEventListener("notifications_read", handleNotificationsRead);
    window.addEventListener("notification_marked_read", handleSingleRead);

    return () => {
      clearInterval(interval);
      window.removeEventListener("notifications_read", handleNotificationsRead);
      window.removeEventListener("notification_marked_read", handleSingleRead);
    };
  }, [user]);

  return (
    <div className="flex h-screen bg-background overflow-hidden">

      {/* ── Sidebar — hidden on mobile, visible on md+ ─────────────────── */}
      <aside
        className={`hidden md:flex flex-col border-r border-border bg-surface transition-all duration-200 ease-out shrink-0 ${
          collapsed ? "md:w-14" : "md:w-14 lg:w-56"
        }`}
      >
        {/* Logo */}
        <div
          className={`h-14 flex items-center border-b border-border shrink-0 ${
            collapsed ? "justify-center px-0" : "lg:px-4 px-0 justify-center lg:justify-start"
          }`}
        >
          {collapsed ? (
            <Logo showText={false} size={26} />
          ) : (
            <>
              <span className="lg:hidden"><Logo showText={false} size={26} /></span>
              <span className="hidden lg:flex"><Logo /></span>
            </>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 flex flex-col gap-0.5 px-2 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const active = screen === item.screen;
            const showLabel = !collapsed;
            return (
              <button
                key={item.screen}
                onClick={() => navigate(getPath(item.screen))}
                className={`flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring w-full ${
                  active
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                } ${collapsed ? "justify-center" : "lg:justify-start justify-center"}`}
                title={item.label}
              >
                <span className="shrink-0">{item.icon}</span>
                {showLabel && <span className="truncate hidden lg:inline">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="border-t border-border py-3 px-2 flex flex-col gap-0.5">
          {/* Notifications */}
          <button
            onClick={() => navigate("/notifications")}
            className={`flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              collapsed ? "justify-center" : "lg:justify-start justify-center"
            } ${
              screen === "notifications"
                ? "bg-primary/10 text-primary font-medium"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
            title="Notifications"
          >
            <span className="relative shrink-0">
              <Bell size={16} />
              {unread > 0 && screen !== "notifications" && (
                <span className="absolute -top-1 -right-1 size-2 bg-primary rounded-full" />
              )}
            </span>
            {!collapsed && <span className="hidden lg:inline">Notifications</span>}
          </button>

          {/* Achievements */}
          <button
            onClick={() => navigate("/achievements")}
            className={`flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              collapsed ? "justify-center" : "lg:justify-start justify-center"
            } ${
              screen === "achievements"
                ? "bg-primary/10 text-primary font-medium"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
            title="Achievements"
          >
            <span className="relative shrink-0">
              <Trophy size={16} />
            </span>
            {!collapsed && <span className="hidden lg:inline">Achievements</span>}
          </button>

          {/* Friends */}
          <button
            onClick={() => navigate("/friends")}
            className={`flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              collapsed ? "justify-center" : "lg:justify-start justify-center"
            } ${
              screen === "friends"
                ? "bg-primary/10 text-primary font-medium"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
            title="Friends"
          >
            <span className="relative shrink-0">
              <Users size={16} className="shrink-0" />
              {friendRequestsCount > 0 && (
                <span className="absolute -top-1 -right-1 size-2 bg-primary rounded-full" />
              )}
            </span>
            {!collapsed && <span className="hidden lg:inline">Friends</span>}
          </button>

          {/* Settings */}
          <button
            onClick={() => navigate("/settings")}
            className={`flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              collapsed ? "justify-center" : "lg:justify-start justify-center"
            } ${
              screen === "settings"
                ? "bg-primary/10 text-primary font-medium"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
            title="Settings"
          >
            <Settings size={16} className="shrink-0" />
            {!collapsed && <span className="hidden lg:inline">Settings</span>}
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className={`flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors w-full ${
              collapsed ? "justify-center" : "lg:justify-start justify-center"
            }`}
            title={theme === "dark" ? "Light mode" : "Dark mode"}
          >
            {theme === "dark" ? <Sun size={16} className="shrink-0" /> : <Moon size={16} className="shrink-0" />}
            {!collapsed && <span className="hidden lg:inline">{theme === "dark" ? "Light mode" : "Dark mode"}</span>}
          </button>

          {/* Profile */}
          <button
            onClick={() => navigate(user?.username ? `/profile/${user.username}` : "/profile")}
            className={`flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors w-full mt-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              collapsed ? "justify-center" : "lg:justify-start justify-center"
            } ${
              screen === "profile"
                ? "bg-primary/10 text-primary font-medium"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
            title={user?.name || "Profile"}
          >
            <Avatar name={user?.name || user?.username || "User"} size="sm" className="shrink-0" />
            {!collapsed && (
              <span className="text-foreground font-medium truncate hidden lg:inline">{user?.name || user?.username || "User"}</span>
            )}
          </button>

          {/* Collapse toggle — only visible on lg+ where there's something to collapse */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex items-center gap-2.5 rounded-md px-2.5 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors w-full mt-1"
          >
            {collapsed ? <ChevronRight size={14} className="shrink-0" /> : <ChevronLeft size={14} className="shrink-0" />}
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>
      </aside>

      {/* ── Main content ────────────────────────────────────────────────── */}
      {/* pb-16 on mobile to clear the fixed bottom navigation bar */}
      <main className="flex-1 overflow-y-auto min-w-0 pb-16 md:pb-0">
        {children}
      </main>

      {/* ── Bottom navigation — mobile only ─────────────────────────────── */}
      <BottomNav />
    </div>
  );
}
