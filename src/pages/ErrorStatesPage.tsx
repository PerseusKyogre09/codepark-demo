import { type ReactNode } from "react";
import { RefreshCw, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Logo } from "../components/cp/Logo";

interface ErrorCardProps {
  code: string;
  title: string;
  message: string;
  primaryAction: { label: string; icon?: ReactNode; onClick: () => void };
  secondaryAction?: { label: string; onClick: () => void };
}

function ErrorCard({ code, title, message, primaryAction, secondaryAction }: ErrorCardProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-8 text-center">
      <p
        className="text-6xl font-bold text-muted/60 mb-4 select-none"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {code}
      </p>
      <h3 className="text-base font-semibold text-foreground mb-2" style={{ fontFamily: "var(--font-display)" }}>
        {title}
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-xs mx-auto">
        {message}
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
        <button
          onClick={primaryAction.onClick}
          className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {primaryAction.icon}
          {primaryAction.label}
        </button>
        {secondaryAction && (
          <button
            onClick={secondaryAction.onClick}
            className="flex items-center gap-1.5 px-4 py-2 border border-border text-foreground text-sm font-medium rounded-md hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {secondaryAction.label}
          </button>
        )}
      </div>
    </div>
  );
}

export default function ErrorStatesPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-full bg-background">
      <header className="sticky top-0 z-10 bg-background/90 backdrop-blur-sm border-b border-border px-4 md:px-8 h-14 flex items-center">
        <h1 className="text-base font-semibold text-foreground" style={{ fontFamily: "var(--font-display)" }}>
          Error States
        </h1>
      </header>

      <div className="max-w-3xl mx-auto px-4 md:px-8 py-6 md:py-8">
        <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
          Errors should be friendly, calm, and reassuring. Always offer a next step. Never intimidate.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <ErrorCard
            code="404"
            title="Not found"
            message="This path doesn't seem to exist in the park. Maybe it moved, or the link was old."
            primaryAction={{ label: "Go home", icon: <Home size={13} />, onClick: () => navigate("/dashboard") }}
            secondaryAction={{ label: "Go back", onClick: () => navigate("/dashboard") }}
          />
          <ErrorCard
            code="500"
            title="Something went wrong"
            message="Something didn't go as planned. Your work is safe. We've noted the issue."
            primaryAction={{ label: "Try again", icon: <RefreshCw size={13} />, onClick: () => {} }}
            secondaryAction={{ label: "Go home", onClick: () => navigate("/dashboard") }}
          />
          <ErrorCard
            code="—"
            title="Connection lost"
            message="Having trouble reaching the server. Your recent changes are saved locally."
            primaryAction={{ label: "Reconnecting…", icon: <RefreshCw size={13} className="animate-spin" />, onClick: () => {} }}
          />
        </div>

        {/* Full-page 404 example */}
        <div className="border-t border-border pt-8">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-5">Full-page 404</p>
          <div className="min-h-80 bg-card border border-border rounded-lg flex flex-col items-center justify-center text-center p-10">
            <Logo size={36} className="mb-6 opacity-70" />
            <p
              className="text-5xl font-bold text-muted/40 mb-3 select-none"
              style={{ fontFamily: "var(--font-display)" }}
            >
              404
            </p>
            <h2
              className="text-xl font-semibold text-foreground mb-2"
              style={{ fontFamily: "var(--font-display)" }}
            >
              This path doesn't exist
            </h2>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs leading-relaxed">
              The page you're looking for isn't here. It may have moved, or the link might be outdated.
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate("/dashboard")}
                className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-colors"
              >
                <Home size={13} />
                Back to dashboard
              </button>
              <button
                onClick={() => navigate("/docs")}
                className="flex items-center gap-1.5 px-4 py-2 border border-border text-foreground text-sm font-medium rounded-md hover:bg-muted transition-colors"
              >
                Explore the docs
              </button>
            </div>
          </div>
        </div>

        {/* Inline error examples */}
        <div className="border-t border-border pt-8 mt-8">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Inline errors</p>
          <div className="space-y-2">
            {[
              { type: "error", text: "Something didn't go as planned. Your work is safe." },
              { type: "warning", text: "Your session will expire in 15 minutes. Save your work." },
              { type: "info", text: "ContextBase is still indexing this project. Results may be partial." },
              { type: "success", text: "Your changes were saved successfully." },
            ].map((item) => {
              const styles = {
                error: "bg-error/5 border-error/20 text-error",
                warning: "bg-warning/5 border-warning/20 text-warning",
                info: "bg-info/5 border-info/20 text-info",
                success: "bg-success/5 border-success/20 text-success",
              };
              const icons = { error: "⚠", warning: "⚠", info: "ℹ", success: "✓" };
              return (
                <div key={item.text} className={`flex items-start gap-3 px-4 py-3 rounded-lg border text-sm ${styles[item.type as keyof typeof styles]}`}>
                  <span className="shrink-0 mt-0.5">{icons[item.type as keyof typeof icons]}</span>
                  <p>{item.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
