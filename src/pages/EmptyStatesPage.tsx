import { type ReactNode } from "react";
import { FolderOpen, Users, Award, Wifi, Pen, Plus, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  message: string;
  action?: { label: string; onClick: () => void };
}

function EmptyState({ icon, title, message, action }: EmptyStateProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-8 flex flex-col items-center text-center">
      <div className="size-12 rounded-full bg-muted flex items-center justify-center mb-4 text-muted-foreground">
        {icon}
      </div>
      <h3 className="text-sm font-semibold text-foreground mb-1.5">{title}</h3>
      <p className="text-xs text-muted-foreground leading-relaxed max-w-[200px]">{message}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="mt-5 flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground text-xs font-medium rounded-md hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {action.label}
          <ArrowRight size={12} />
        </button>
      )}
    </div>
  );
}

export default function EmptyStatesPage() {
  const navigate = useNavigate();

  const states = [
    {
      icon: <FolderOpen size={22} />,
      title: "No projects yet",
      message: "Looks quiet here. Let's build something.",
      action: { label: "Create a project", onClick: () => navigate("/projects/create") },
    },
    {
      icon: <Users size={22} />,
      title: "No teammates yet",
      message: "No collaborators added. Invite someone to work alongside you.",
      action: { label: "Invite teammates", onClick: () => {} },
    },
    {
      icon: <Award size={22} />,
      title: "No achievements",
      message: "Achievements appear as you build. Start with something small.",
      action: { label: "See what's possible", onClick: () => navigate("/profile") },
    },
    {
      icon: <Wifi size={22} />,
      title: "No active sessions",
      message: "No active sessions. Start one whenever you're ready.",
      action: { label: "Start a session", onClick: () => navigate("/dashboard/projects") },
    },
    {
      icon: <Pen size={22} />,
      title: "No devlogs",
      message: "You haven't written a devlog yet. Share what you're building.",
      action: { label: "Write your first devlog", onClick: () => navigate("/devlog") },
    },
    {
      icon: <Plus size={22} />,
      title: "Nothing here yet",
      message: "This area is waiting for something worth celebrating.",
      action: undefined,
    },
  ];

  return (
    <div className="min-h-full bg-background">
      <header className="sticky top-0 z-10 bg-background/90 backdrop-blur-sm border-b border-border px-4 md:px-8 h-14 flex items-center">
        <h1 className="text-base font-semibold text-foreground" style={{ fontFamily: "var(--font-display)" }}>
          Empty States
        </h1>
      </header>

      <div className="max-w-4xl mx-auto px-4 md:px-8 py-6 md:py-8">
        <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
          Empty states are the quietest moments in the product. They should encourage action, not punish absence.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {states.map((s) => (
            <EmptyState key={s.title} {...s} />
          ))}
        </div>
      </div>
    </div>
  );
}
