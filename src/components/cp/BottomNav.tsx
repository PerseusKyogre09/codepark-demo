import { type ReactNode } from "react";
import { LayoutDashboard, FolderKanban, Plus, Bell, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const unread = 0;

  const path = location.pathname;
  let screen = "dashboard";
  if (path.startsWith("/profile")) screen = "profile";
  else if (path.includes("/projects")) screen = "projects";
  else if (path.startsWith("/notifications")) screen = "notifications";

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 md:hidden bg-surface border-t border-border"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-center justify-around h-14 px-2">
        {/* Dashboard */}
        <TabButton
          label="Dashboard"
          active={screen === "dashboard"}
          onClick={() => navigate("/dashboard")}
          icon={<LayoutDashboard size={20} />}
        />

        {/* Projects */}
        <TabButton
          label="Projects"
          active={screen === "projects"}
          onClick={() => navigate("/dashboard/projects")}
          icon={<FolderKanban size={20} />}
        />

        {/* New — emphasized center action */}
        <button
          onClick={() => navigate("/projects/create")}
          className="flex items-center justify-center size-11 rounded-full bg-primary text-primary-foreground shadow-md hover:bg-primary/90 active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
          aria-label="New project"
        >
          <Plus size={22} strokeWidth={2.5} />
        </button>

        {/* Notifications */}
        <button
          onClick={() => navigate("/notifications")}
          className={`relative flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors min-w-[48px] min-h-[48px] justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${screen === "notifications" ? "text-primary" : "text-muted-foreground"
            }`}
          aria-label="Notifications"
        >
          <span className="relative">
            <Bell size={20} />
            {unread > 0 && (
              <span className="absolute -top-0.5 -right-0.5 size-2 bg-primary rounded-full" />
            )}
          </span>
          <span className="text-[10px] leading-none">Alerts</span>
        </button>

        {/* Profile */}
        <TabButton
          label="Profile"
          active={screen === "profile"}
          onClick={() => navigate(user?.username ? `/profile/${user.username}` : "/profile")}
          icon={<User size={20} />}
        />
      </div>
    </nav>
  );
}

function TabButton({
  label,
  active,
  onClick,
  icon,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  icon: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors min-w-[48px] min-h-[48px] justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${active ? "text-primary" : "text-muted-foreground"
        }`}
    >
      {icon}
      <span className="text-[10px] leading-none">{label}</span>
    </button>
  );
}
