import { X } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faGitlab } from "@fortawesome/free-brands-svg-icons";
import { useTheme } from "../contexts/ThemeContext";

interface RepositorySelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectGitHub: () => void;
}

export default function RepositorySelectModal({
  isOpen,
  onClose,
  onSelectGitHub,
}: RepositorySelectModalProps) {
  const { themeColors } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-md rounded-2xl border overflow-hidden flex flex-col p-6 shadow-xl"
        style={{
          background: themeColors.cardBg,
          borderColor: themeColors.border,
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between pb-4 border-b mb-6"
          style={{ borderColor: themeColors.border }}
        >
          <h2 className="text-lg font-semibold" style={{ color: themeColors.text }}>
            Import Repository
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X size={18} style={{ color: themeColors.textSecondary }} />
          </button>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {/* GitHub Option */}
          <button
            onClick={onSelectGitHub}
            className="w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left group hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-ring"
            style={{
              background: themeColors.bg,
              borderColor: themeColors.border,
            }}
          >
            <div className="size-10 rounded-lg bg-[#24292e]/10 flex items-center justify-center text-[#24292e] dark:text-white shrink-0 group-hover:scale-105 transition-transform">
              <FontAwesomeIcon icon={faGithub} size="lg" />
            </div>
            <div>
              <p className="font-semibold text-sm" style={{ color: themeColors.text }}>
                GitHub
              </p>
              <p className="text-xs" style={{ color: themeColors.textSecondary }}>
                Import public or private GitHub repositories
              </p>
            </div>
          </button>

          {/* GitLab Option */}
          <div
            className="w-full flex items-center gap-4 p-4 rounded-xl border text-left opacity-50 cursor-not-allowed"
            style={{
              background: themeColors.bg,
              borderColor: themeColors.border,
            }}
          >
            <div className="size-10 rounded-lg bg-[#fc6d26]/10 flex items-center justify-center text-[#fc6d26] shrink-0">
              <FontAwesomeIcon icon={faGitlab} size="lg" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="font-semibold text-sm" style={{ color: themeColors.text }}>
                  GitLab
                </p>
                <span className="px-1.5 py-0.5 text-[10px] font-medium bg-muted text-muted-foreground rounded border border-border shrink-0">
                  Coming Soon
                </span>
              </div>
              <p className="text-xs" style={{ color: themeColors.textSecondary }}>
                Import GitLab projects and repositories
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
