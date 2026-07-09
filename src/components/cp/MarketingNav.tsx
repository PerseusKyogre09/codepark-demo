import { Moon, Sun, Menu, X } from "lucide-react";
import { useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { Logo } from "./Logo";

export function MarketingNav() {
  const { settings, updateSettings } = useTheme();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const theme = settings.uiTheme;
  const toggleTheme = () => updateSettings({ uiTheme: theme === "dark" ? "light" : "dark" });

  const links = [
    { label: "Pricing", path: "/#pricing" },
    { label: "Docs", path: "/docs" },
    { label: "Changelog", path: "/changelog" },
  ];

  const handleNav = (path: string) => {
    if (path.startsWith("/#")) {
      if (location.pathname !== "/") {
        navigate("/");
        setTimeout(() => {
          const el = document.getElementById(path.split("#")[1]);
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }, 100);
      } else {
        const el = document.getElementById(path.split("#")[1]);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate(path);
    }
    setMobileOpen(false);
  };

  const handleLoginClick = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/auth");
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-background/85 backdrop-blur-md border-b border-border/70">
      <div className="max-w-6xl mx-auto px-4 md:px-6 h-[68px] md:h-[72px] flex items-center justify-between">
        <button onClick={() => navigate("/")} className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md transition-opacity hover:opacity-90">
          <Logo size={44} />
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-2">
          {links.map((l) => (
            <button
              key={l.label}
              onClick={() => handleNav(l.path)}
              className="px-3.5 py-2 text-[0.92rem] font-medium tracking-[0.01em] text-muted-foreground hover:text-foreground transition-all duration-200 rounded-full hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {l.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {!isAuthenticated && (
            <button
              onClick={handleLoginClick}
              className="hidden md:block px-3 py-2 text-sm font-medium tracking-[0.01em] text-muted-foreground/90 hover:text-foreground transition-colors rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Sign in
            </button>
          )}

          <button
            onClick={handleLoginClick}
            className="hidden md:inline-flex min-h-[42px] items-center px-[18px] py-3 text-sm font-medium tracking-[0.01em] bg-primary text-primary-foreground rounded-[10px] border-[2px] border-foreground/80 hover:bg-primary/95 hover:-translate-y-[1px] active:translate-y-[1px] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring whitespace-nowrap"
          >
            {isAuthenticated ? "Open Dashboard" : "Start Coding Instantly"}
          </button>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border/70 bg-background/98 backdrop-blur-sm px-5 py-4 flex flex-col gap-1">
          {links.map((l) => (
            <button
              key={l.label}
              onClick={() => handleNav(l.path)}
              className="text-left px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/70 rounded-lg transition-colors"
            >
              {l.label}
            </button>
          ))}
          <div className="border-t border-border/70 mt-2 pt-2 flex flex-col gap-2">
            <button onClick={handleLoginClick} className="px-3 py-2 text-sm text-left text-muted-foreground/90">
              {isAuthenticated ? "Dashboard" : "Sign in"}
            </button>
            <button
              onClick={handleLoginClick}
              className="min-h-[42px] px-5.5 py-3 text-sm font-medium tracking-[0.01em] bg-primary text-primary-foreground rounded-[10px] border-[2px] border-foreground/80"
            >
              {isAuthenticated ? "Open Dashboard" : "Start Coding Instantly"}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
