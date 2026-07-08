import { useState, useEffect } from "react";
import {
  Users,
  Check,
  X,
  Loader2,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { apiClient } from "../../services/api";
import type { Friend, FriendRequest } from "../../types";
import { Avatar } from "./Avatar";

interface OnlineFriendsSidebarProps {
  currentProjectId?: string;
  currentSessionId?: string;
  isLeftDocked?: boolean;
  inPanel?: boolean;
}

export function OnlineFriendsSidebar({
  currentProjectId,
  currentSessionId,
  isLeftDocked = false,
  inPanel = false
}: OnlineFriendsSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [pendingRequests, setPendingRequests] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [invitedFriends, setInvitedFriends] = useState<Record<string, boolean>>({});

  const fetchSocialData = async () => {
    try {
      const [friendsList, requests] = await Promise.all([
        apiClient.getFriends(),
        apiClient.getPendingRequests()
      ]);
      setFriends(friendsList);
      setPendingRequests(requests.incoming || []);
    } catch (err) {
      console.error("Failed to fetch friends sidebar data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSocialData();
    // Poll friends/requests status every 15 seconds
    const interval = setInterval(fetchSocialData, 15000);
    return () => clearInterval(interval);
  }, []);



  const handleAcceptRequest = async (reqId: string) => {
    try {
      const res = await apiClient.acceptFriendRequest(reqId);
      if (res.success) {
        fetchSocialData();
      }
    } catch (err) {
      console.error("Failed to accept request", err);
    }
  };

  const handleDeclineRequest = async (reqId: string) => {
    try {
      const res = await apiClient.declineFriendRequest(reqId);
      if (res.success) {
        fetchSocialData();
      }
    } catch (err) {
      console.error("Failed to decline request", err);
    }
  };

  const handleDirectInvite = async (friendUid: string) => {
    if (!currentProjectId) return;
    try {
      const res = await apiClient.sendInvite(friendUid, currentProjectId, currentSessionId);
      if (res.success) {
        setInvitedFriends(prev => ({ ...prev, [friendUid]: true }));
        setTimeout(() => {
          setInvitedFriends(prev => ({ ...prev, [friendUid]: false }));
        }, 10000);
      }
    } catch (err) {
      console.error("Failed to send direct invite", err);
    }
  };

  // Sort friends: online first, then away, then offline
  const sortedFriends = [...friends].sort((a, b) => {
    const statusScore = { online: 3, idle: 2, dnd: 2, coding: 2, offline: 1 };
    const scoreA = statusScore[a.mode || "offline"] || 1;
    const scoreB = statusScore[b.mode || "offline"] || 1;
    if (scoreA !== scoreB) return scoreB - scoreA;
    return (a.name || a.username).localeCompare(b.name || b.username);
  });

  const onlineCount = friends.filter(f => f.mode && f.mode !== "offline").length;

  if (collapsed && !isLeftDocked && !inPanel) {
    return (
      <div className="hidden xl:flex flex-col w-14 border-l border-border bg-surface shrink-0 h-full items-center py-4 gap-4">
        <button
          onClick={() => setCollapsed(false)}
          className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          title="Expand Friends"
        >
          <ChevronLeft size={16} />
        </button>

        <div className="relative">
          <Users size={18} className="text-muted-foreground" />
          {pendingRequests.length > 0 && (
            <span className="absolute -top-1.5 -right-1.5 size-4 bg-primary text-[10px] text-primary-foreground font-bold flex items-center justify-center rounded-full">
              {pendingRequests.length}
            </span>
          )}
        </div>

        <div className="flex-1 w-full overflow-y-auto flex flex-col items-center gap-3 px-1 no-scrollbar">
          {sortedFriends.map(friend => (
            <div key={friend.uid} className="relative group cursor-pointer">
              <Avatar name={friend.name || friend.username} size="sm" />
              <span
                className={`absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border border-surface ${
                  friend.mode === "online" || friend.mode === "coding"
                    ? "bg-emerald-500"
                    : friend.mode === "idle" || friend.mode === "dnd"
                    ? "bg-amber-500"
                    : "bg-zinc-500"
                }`}
              />
              {/* Tooltip */}
              <div className="absolute right-14 top-1/2 -translate-y-1/2 hidden group-hover:block z-50 bg-popover text-popover-foreground border border-border text-xs rounded px-2.5 py-1.5 whitespace-nowrap shadow-md">
                <p className="font-semibold">{friend.name || friend.username}</p>
                <p className="text-[10px] text-muted-foreground">@{friend.username}</p>
                {friend.status_text && (
                  <p className="text-[10px] text-primary border-t border-border mt-1 pt-1 italic">
                    {friend.status_text}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const borderClass = isLeftDocked ? "border-r" : "border-l";
  const displayClass = isLeftDocked ? "hidden md:flex" : "hidden xl:flex";

  return (
    <div className={inPanel ? "flex flex-col w-full h-full bg-surface" : `${displayClass} flex-col w-64 ${borderClass} border-border bg-surface shrink-0 h-full`}>
      {/* Header */}
      <div className="h-14 border-b border-border flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-2">
          <Users size={16} className="text-muted-foreground" />
          <span className="text-sm font-semibold text-foreground">
            Friends ({onlineCount}/{friends.length})
          </span>
        </div>
        <div className="flex items-center gap-1">
          {!isLeftDocked && !inPanel && (
            <button
              onClick={() => setCollapsed(true)}
              className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              title="Collapse Sidebar"
            >
              <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Main Panel Content */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4 no-scrollbar">

        {/* Incoming Friend Invites / Requests */}
        {pendingRequests.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-[10px] font-bold text-primary uppercase tracking-wider">
              Friend Requests ({pendingRequests.length})
            </h4>
            <div className="space-y-2">
              {pendingRequests.map((req) => (
                <div
                  key={req.id}
                  className="flex items-center justify-between bg-primary/5 border border-primary/20 rounded-md p-2"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Avatar name={req.sender?.name || req.sender?.username || "?"} size="sm" />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-foreground truncate">
                        {req.sender?.name || req.sender?.username}
                      </p>
                      <p className="text-[9px] text-muted-foreground truncate">
                        @{req.sender?.username}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleAcceptRequest(req.id)}
                      className="p-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 transition-colors"
                      title="Accept Request"
                    >
                      <Check size={12} />
                    </button>
                    <button
                      onClick={() => handleDeclineRequest(req.id)}
                      className="p-1 rounded bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors"
                      title="Decline Request"
                    >
                      <X size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Friends List */}
        <div className="space-y-2.5">
          <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
            All Connections
          </h4>

          {loading ? (
            <div className="flex justify-center py-4">
              <Loader2 size={16} className="text-muted-foreground animate-spin" />
            </div>
          ) : sortedFriends.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground/80 border border-dashed border-border rounded-lg">
              <p className="text-xs">No friends added yet.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {sortedFriends.map((friend) => (
                <div
                  key={friend.uid}
                  className="flex items-center justify-between p-2 rounded-md hover:bg-muted/30 transition-colors group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="relative shrink-0">
                      <Avatar name={friend.name || friend.username} size="sm" />
                      <span
                        className={`absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border border-surface ${
                          friend.mode === "online" || friend.mode === "coding"
                            ? "bg-emerald-500"
                            : friend.mode === "idle" || friend.mode === "dnd"
                            ? "bg-amber-500"
                            : "bg-zinc-500"
                        }`}
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-foreground truncate">
                        {friend.name || friend.username}
                      </p>
                      {friend.status_text ? (
                        <p className="text-[10px] text-primary truncate italic font-medium">
                          {friend.status_text}
                        </p>
                      ) : (
                        <p className="text-[9px] text-muted-foreground truncate">
                          @{friend.username}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Context Actions (Invite to project/session) */}
                  {(currentProjectId || currentSessionId) &&
                    friend.mode !== "offline" && (
                      <button
                        onClick={() => handleDirectInvite(friend.uid)}
                        disabled={invitedFriends[friend.uid]}
                        className={`opacity-0 group-hover:opacity-100 p-1.5 rounded text-[10px] font-semibold transition-all shrink-0 ${
                          invitedFriends[friend.uid]
                            ? "bg-emerald-500/20 text-emerald-500 cursor-default"
                            : "bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground"
                        }`}
                        title="Invite to build"
                      >
                        {invitedFriends[friend.uid] ? "Invited" : "Invite"}
                      </button>
                    )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
