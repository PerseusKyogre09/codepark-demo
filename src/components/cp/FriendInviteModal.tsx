import { useState, useEffect } from "react";
import { X, Search, Loader2, Send, Check } from "lucide-react";
import { apiClient } from "../../services/api";
import type { Friend } from "../../types";
import { Avatar } from "./Avatar";

interface FriendInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId?: string;
  sessionId?: string;
  projectName?: string;
}

export function FriendInviteModal({
  isOpen,
  onClose,
  projectId,
  sessionId,
  projectName
}: FriendInviteModalProps) {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [invitedFriends, setInvitedFriends] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (isOpen) {
      async function loadFriends() {
        try {
          const list = await apiClient.getFriends();
          setFriends(list);
        } catch (err) {
          console.error("Failed to load friends for invitation modal", err);
        } finally {
          setLoading(false);
        }
      }
      loadFriends();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSendInvite = async (friendUid: string) => {
    try {
      const res = await apiClient.sendInvite(friendUid, projectId, sessionId);
      if (res.success) {
        setInvitedFriends(prev => ({ ...prev, [friendUid]: true }));
      }
    } catch (err) {
      console.error("Failed to invite friend", err);
    }
  };

  const filteredFriends = friends.filter(
    (f) =>
      (f.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.username || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-surface border border-border rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
          <div>
            <h3 className="font-bold text-base text-foreground">Invite Collaborators</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Invite friends to build together on {projectName || "this workspace"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Search & Invite Link */}
        <div className="px-5 py-4 border-b border-border bg-muted/20 shrink-0 space-y-3">
          {(projectId || sessionId) && (
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={
                  projectId
                    ? `${window.location.origin}/project/${projectId}`
                    : `${window.location.origin}/project/${projectId || ''}`.replace(/\/$/, '')
                }
                className="flex-1 bg-background border border-border text-xs rounded-lg px-2.5 py-2 text-muted-foreground select-all focus:outline-none"
              />
              <button
                onClick={async () => {
                  try {
                    const link = projectId
                      ? `${window.location.origin}/project/${projectId}`
                      : `${window.location.origin}/project/${projectId || ''}`.replace(/\/$/, '');
                    await navigator.clipboard.writeText(link);
                    alert("Invite link copied to clipboard!");
                  } catch (err) {
                    console.error("Failed to copy", err);
                  }
                }}
                className="px-3 py-2 bg-primary text-primary-foreground text-xs font-semibold rounded-lg hover:bg-primary/90 transition-colors shrink-0"
              >
                Copy Link
              </button>
            </div>
          )}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search connections to invite..."
              className="w-full bg-background border border-border text-sm rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:border-primary text-foreground"
            />
          </div>
        </div>

        {/* Friends list */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3 min-h-[200px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2 text-muted-foreground">
              <Loader2 size={24} className="animate-spin text-primary" />
              <p className="text-xs">Loading connections...</p>
            </div>
          ) : filteredFriends.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground border border-dashed border-border rounded-xl">
              <p className="text-sm">No connections found.</p>
              {searchQuery && (
                <p className="text-xs text-muted-foreground/60 mt-1">
                  Try searching a different handle
                </p>
              )}
            </div>
          ) : (
            <div className="divide-y divide-border/60">
              {filteredFriends.map((friend) => (
                <div
                  key={friend.uid}
                  className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0"
                >
                  <div className="flex items-center gap-3 min-w-0">
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
                      <p className="text-sm font-semibold text-foreground truncate">
                        {friend.name || friend.username}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        @{friend.username}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSendInvite(friend.uid)}
                    disabled={invitedFriends[friend.uid]}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                      invitedFriends[friend.uid]
                        ? "bg-emerald-500/10 text-emerald-500 cursor-default"
                        : "bg-primary text-primary-foreground hover:bg-primary/90"
                    }`}
                  >
                    {invitedFriends[friend.uid] ? (
                      <>
                        <Check size={12} />
                        Invited
                      </>
                    ) : (
                      <>
                        <Send size={12} />
                        Invite
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
