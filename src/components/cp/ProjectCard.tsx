import { Clock, GitBranch, Users, Pin } from "lucide-react";
import { useNavigate } from "react-router-dom";

export interface Project {
  id: string;
  name: string;
  description: string;
  language: string;
  branch: string;
  lastActive: string;
  collaborators: number;
  tags: string[];
  role?: 'owner' | 'editor' | 'viewer';
}

interface ProjectCardProps {
  project: Project;
  compact?: boolean;
  onClick?: () => void;
  pinned?: boolean;
}

const langColors: Record<string, string> = {
  TypeScript: "#3178C6",
  JavaScript: "#F7DF1E",
  Rust: "#CE422B",
  Go: "#00ADD8",
  Python: "#3572A5",
  CSS: "#563D7C",
};

export function ProjectCard({ project, compact = false, onClick, pinned = false }: ProjectCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate("/dashboard/projects");
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`w-full text-left bg-card border border-border rounded-lg transition-all duration-100 hover:border-primary/40 hover:bg-card/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
        compact ? "p-4" : "p-5"
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className="size-2.5 rounded-full shrink-0 mt-0.5"
            style={{ backgroundColor: langColors[project.language] ?? "#6BAF82" }}
            aria-hidden="true"
          />
          <span className="font-medium text-foreground text-sm truncate">
            {project.name}
          </span>
          {pinned && (
            <Pin size={11} className="text-primary fill-primary/20 shrink-0 rotate-45" />
          )}
        </div>
        {!compact && (
          <div className="flex items-center gap-2 shrink-0">
            {project.role && project.role !== 'owner' && (
              <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
                shared
              </span>
            )}
            <span className="text-xs text-muted-foreground">
              {project.language}
            </span>
          </div>
        )}
      </div>

      {!compact && (
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2 leading-relaxed">
          {project.description || "No description provided."}
        </p>
      )}

      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <GitBranch size={11} />
          {project.branch}
        </span>
        <span className="flex items-center gap-1">
          <Clock size={11} />
          {project.lastActive}
        </span>
        <span className="flex items-center gap-1">
          <Users size={11} />
          {project.collaborators}
        </span>
      </div>
    </button>
  );
}
