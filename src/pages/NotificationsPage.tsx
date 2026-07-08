import { Bell, Award, Users, Tag, MessageSquare, Check, Loader2 } from "lucide-react";
import { useState, useEffect, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../services/api";
import type { Notification } from "../types";
import { PROJECT_CACHE_INVALIDATED_EVENT } from "../utils/projectSync";

const icons: Record<string, ReactNode> = {
  mention: <MessageSquare size={14} className="text-sky-500" />,
  achievement: <Award size={14} className="text-amber-500" />,
  team: <Users size={14} className="text-primary" />,
  release: <Tag size={14} className="text-emerald-500" />,
  session: <Bell size={14} className="text-muted-foreground" />,
  "Friend Request": <Users size={14} className="text-amber-500" />,
  "Friend Accepted": <Users size={14} className="text-emerald-500" />,
  "Project Invite": <Tag size={14} className="text-indigo-500" />,
  "Session Invite": <Bell size={14} className="text-purple-500" />,
  "Achievement Unlocked": <Award size={14} className="text-yellow-500" />,
};

function formatTimeAgo(timestamp: number): string {
  const ms = timestamp < 1e12 ? timestamp * 1000 : timestamp;
  const seconds = Math.floor((Date.now() - ms) / 1000);
  if (seconds < 0) return "Just now";
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  return new Date(ms).toLocaleDateString();
}

export default function NotificationsPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const cached = localStorage.getItem("cached_notifications");
    return cached ? JSON.parse(cached) : [];
  });
  const [loading, setLoading] = useState(() => {
    return !localStorage.getItem("cached_notifications");
  });
  const [actioningId, setActioningId] = useState<string | null>(null);

  const fetchNotifications = async () => {
    try {
      const data = await apiClient.getNotifications();
      setNotifications(data);
      localStorage.setItem("cached_notifications", JSON.stringify(data));
      const hasUnread = data.some((n) => !n.read && !n.read_status);
      if (hasUnread) {
        await apiClient.markAllNotificationsRead();
        window.dispatchEvent(new CustomEvent("notifications_read"));
      }
    } catch (err) {
      console.error("Failed to load notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    const handleProjectCacheInvalidated = () => {
      localStorage.removeItem("cached_notifications");
      void fetchNotifications();
    };

    window.addEventListener(PROJECT_CACHE_INVALIDATED_EVENT, handleProjectCacheInvalidated);
    return () => window.removeEventListener(PROJECT_CACHE_INVALIDATED_EVENT, handleProjectCacheInvalidated);
  }, []);

  const markAllRead = async () => {
    setNotifications((n) => n.map((item) => ({ ...item, read: true, read_status: true })));
    try {
      await apiClient.markAllNotificationsRead();
      window.dispatchEvent(new CustomEvent("notifications_read"));
    } catch (err) {
      console.error("Failed to mark all notifications as read:", err);
    }
  };

  const markRead = async (id: string) => {
    setNotifications((n) =>
      n.map((item) => (item.id === id ? { ...item, read: true, read_status: true } : item))
    );
    try {
      await apiClient.markNotificationRead(id);
      window.dispatchEvent(new CustomEvent("notification_marked_read"));
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const handleAcceptInvite = async (id: string, type: string, targetId?: string) => {
    setActioningId(id);
    try {
      if (type === "Friend Request" && targetId) {
        await apiClient.acceptFriendRequest(targetId);
      } else {
        const result = await apiClient.acceptInvite(id);
        if (result.project_id) {
          if (result.session_id) {
            navigate(`/project/${result.project_id}/editor?session=${encodeURIComponent(result.session_id)}`);
          } else {
            const sessionInfo = await apiClient.openProject(result.project_id);
            navigate(`/project/${result.project_id}/editor?session=${encodeURIComponent(sessionInfo.session_id)}`);
          }
        }
      }
      setNotifications((prev) =>
        prev.map((item) => (item.id === id ? { ...item, read: true, read_status: true } : item))
      );
      window.dispatchEvent(new CustomEvent("notification_marked_read"));
    } catch (err) {
      console.error("Failed to accept invite", err);
    } finally {
      setActioningId(null);
    }
  };

  const handleDeclineInvite = async (id: string, type: string, targetId?: string) => {
    setActioningId(id);
    try {
      if (type === "Friend Request" && targetId) {
        await apiClient.declineFriendRequest(targetId);
      } else {
        await apiClient.declineInvite(id);
      }
      setNotifications((prev) =>
        prev.map((item) => (item.id === id ? { ...item, read: true, read_status: true } : item))
      );
      window.dispatchEvent(new CustomEvent("notification_marked_read"));
    } catch (err) {
      console.error("Failed to decline invite", err);
    } finally {
      setActioningId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-full bg-background py-20">
        <Loader2 className="animate-spin text-primary size-8" />
      </div>
    );
  }

  const unread = notifications.filter((n) => !n.read && !n.read_status);
  const read = notifications.filter((n) => n.read || n.read_status);

  return (
    <div className="min-h-full bg-background">
      <header className="sticky top-0 z-10 bg-background/90 backdrop-blur-sm border-b border-border px-4 md:px-8 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1
            className="text-base font-semibold text-foreground"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Notifications
          </h1>
          {unread.length > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
              {unread.length}
            </span>
          )}
        </div>
        {unread.length > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
          >
            <Check size={12} />
            Mark all read
          </button>
        )}
      </header>

      <div className="max-w-2xl mx-auto px-4 md:px-8 py-6 md:py-8">
        {unread.length === 0 && read.length === 0 && (
          <div className="py-24 text-center">
            <Bell size={28} className="text-muted-foreground mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">No notifications yet.</p>
          </div>
        )}

        {unread.length > 0 && (
          <div className="mb-6 animate-fadeIn">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              New
            </p>
            <div className="space-y-2">
              {unread.map((n) => (
                <div
                  key={n.id}
                  className="flex items-start gap-3 px-4 py-3 rounded-lg bg-card border border-border hover:bg-muted/50 transition-colors group"
                >
                  <div className="size-8 rounded-full bg-muted flex items-center justify-center shrink-0 mt-0.5">
                    {icons[n.type] || <Bell size={14} className="text-muted-foreground" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground leading-relaxed">{n.text}</p>
                    
                    {/* Action buttons for Friend requests or invites */}
                    {(n.type.includes("Invite") || n.type === "Friend Request") && (
                      <div className="flex items-center gap-2 mt-2.5">
                        <button
                          onClick={() => handleAcceptInvite(n.id, n.type, n.target_id)}
                          disabled={actioningId === n.id}
                          className="px-3.5 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 disabled:opacity-50"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleDeclineInvite(n.id, n.type, n.target_id)}
                          disabled={actioningId === n.id}
                          className="px-3.5 py-1.5 rounded-lg bg-muted border border-border text-foreground text-xs font-semibold hover:bg-muted/80 disabled:opacity-50"
                        >
                          Decline
                        </button>
                      </div>
                    )}
                    
                    <p className="text-xs text-muted-foreground mt-1.5">
                      {formatTimeAgo(n.created_at)}
                    </p>
                  </div>
                  <button
                    onClick={() => markRead(n.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded text-muted-foreground hover:text-foreground transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    aria-label="Mark as read"
                  >
                    <Check size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {read.length > 0 && (
          <div className="animate-fadeIn">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Earlier
            </p>
            <div className="space-y-2">
              {read.map((n) => (
                <div
                  key={n.id}
                  className="flex items-start gap-3 px-4 py-3 rounded-lg hover:bg-muted/30 border border-transparent hover:border-border/30 transition-colors"
                >
                  <div className="size-8 rounded-full bg-muted/50 flex items-center justify-center shrink-0 mt-0.5 opacity-60">
                    {icons[n.type] || <Bell size={14} className="text-muted-foreground" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-muted-foreground leading-relaxed">{n.text}</p>
                    <p className="text-xs text-muted-foreground/60 mt-1">
                      {formatTimeAgo(n.created_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
