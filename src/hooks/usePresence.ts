import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { apiClient } from "../services/api";
import { useAuth } from "../contexts/AuthContext";

// Map routes to human-readable pages
function getHumanReadablePage(pathname: string, activeProjectName?: string | null): string {
  if (pathname.includes("/project/")) {
    return activeProjectName ? `Editing ${activeProjectName}` : "Editing CodePark";
  }
  if (pathname.includes("/projects/create")) {
    return "Importing Repository";
  }
  if (pathname.includes("/projects/")) {
    return activeProjectName ? `Working on ${activeProjectName}` : "Working on Project";
  }
  if (pathname.includes("/docs") || pathname.includes("/documentation")) {
    return "Reviewing Documentation";
  }
  if (pathname.includes("/settings/friends") || pathname.includes("/friends")) {
    return "Managing Team";
  }
  if (pathname.includes("/settings")) {
    return "Managing settings";
  }
  if (pathname.includes("/profile")) {
    return "Viewing Profile";
  }
  if (pathname.includes("/dashboard")) {
    return "Browsing Dashboard";
  }
  return "Active builder";
}

export function usePresence(activeProjectId: string | null = null, activeProjectName: string | null = null) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  const [state, setState] = useState<"online" | "away" | "offline">("online");
  
  const lastActivityRef = useRef<number>(Date.now());
  const stateRef = useRef<"online" | "away" | "offline">("online");
  const heartbeatTimerRef = useRef<any>(null);
  const awayTimerRef = useRef<any>(null);

  // Update refs to prevent closure stale states
  stateRef.current = state;

  const triggerHeartbeat = async (currentState: "online" | "away" | "offline") => {
    if (!isAuthenticated || !user) return;
    try {
      const activePage = getHumanReadablePage(location.pathname, activeProjectName);
      await apiClient.sendPresenceHeartbeat(
        currentState,
        activePage,
        activeProjectId,
        activeProjectName
      );
    } catch (err) {
      console.warn("[Presence] Failed to send heartbeat:", err);
    }
  };

  useEffect(() => {
    if (!isAuthenticated || !user) {
      // Clear timers if not authenticated
      if (heartbeatTimerRef.current) clearInterval(heartbeatTimerRef.current);
      if (awayTimerRef.current) clearTimeout(awayTimerRef.current);
      return;
    }

    // Reset activity helper
    const resetActivity = () => {
      lastActivityRef.current = Date.now();
      
      // If we were away or offline, transition back to online
      if (stateRef.current !== "online" && document.visibilityState === "visible") {
        setState("online");
        triggerHeartbeat("online");
      }

      // Restart away timeout (15 minutes)
      if (awayTimerRef.current) clearTimeout(awayTimerRef.current);
      awayTimerRef.current = setTimeout(() => {
        if (stateRef.current === "online") {
          setState("away");
          triggerHeartbeat("away");
        }
      }, 15 * 60 * 1000); // 15 minutes
    };

    // Visibility change handler (Page Visibility API / Mobile App lifecycle)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Tab backgrounded or phone closed: mark away immediately
        setState("away");
        triggerHeartbeat("away");
        if (awayTimerRef.current) clearTimeout(awayTimerRef.current);
      } else {
        // Tab foregrounded: mark online immediately
        resetActivity();
      }
    };

    // Register interaction listeners
    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    events.forEach((evt) => window.addEventListener(evt, resetActivity));
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Initial heartbeat
    setState("online");
    triggerHeartbeat("online");

    // Setup 30s heartbeat loop
    heartbeatTimerRef.current = setInterval(() => {
      triggerHeartbeat(stateRef.current);
    }, 30 * 1000);

    // Setup initial away timeout
    resetActivity();

    return () => {
      // Cleanup listeners and timers
      events.forEach((evt) => window.removeEventListener(evt, resetActivity));
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (heartbeatTimerRef.current) clearInterval(heartbeatTimerRef.current);
      if (awayTimerRef.current) clearTimeout(awayTimerRef.current);
    };
  }, [isAuthenticated, user, location.pathname, activeProjectId, activeProjectName]);

  return state;
}
