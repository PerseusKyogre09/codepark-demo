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
    <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-sm border-b border-border">
      <div className="max-w-6xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between">
        <button onClick={() => navigate("/")} className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md">
          <Logo />
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <button
              key={l.label}
              onClick={() => handleNav(l.path)}
              className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {l.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {!isAuthenticated && (
            <button
              onClick={handleLoginClick}
              className="hidden md:block px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Sign in
            </button>
          )}

          <button
            onClick={handleLoginClick}
            className="hidden md:block px-4 py-1.5 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {isAuthenticated ? "Open Dashboard" : "Start Coding Instantly"}
          </button>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background px-6 py-4 flex flex-col gap-1">
          {links.map((l) => (
            <button
              key={l.label}
              onClick={() => handleNav(l.path)}
              className="text-left px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
            >
              {l.label}
            </button>
          ))}
          <div className="border-t border-border mt-2 pt-2 flex flex-col gap-2">
            <button onClick={handleLoginClick} className="px-3 py-2 text-sm text-left text-muted-foreground">
              {isAuthenticated ? "Dashboard" : "Sign in"}
            </button>
            <button
              onClick={handleLoginClick}
              className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md"
            >
              {isAuthenticated ? "Open Dashboard" : "Start Coding Instantly"}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
