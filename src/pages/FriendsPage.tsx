import { Users, Check, X, Plus, Loader2, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { apiClient } from "../services/api";
import type { Friend, FriendRequest } from "../types";
import { Avatar } from "../components/cp/Avatar";

export default function FriendsPage() {
  const [friends, setFriends] = useState<Friend[]>(() => {
    const cached = localStorage.getItem("cached_friends");
    return cached ? JSON.parse(cached) : [];
  });
  const [pendingRequests, setPendingRequests] = useState<FriendRequest[]>(() => {
    const cached = localStorage.getItem("cached_pending_requests");
    return cached ? JSON.parse(cached) : [];
  });
  const [searchUsername, setSearchUsername] = useState("");
  const [searchStatus, setSearchStatus] = useState<{
    loading: boolean;
    success?: boolean;
    error?: string;
    message?: string;
  }>({ loading: false });
  const [loading, setLoading] = useState(() => {
    return !localStorage.getItem("cached_friends");
  });
  
  // Real-time user search states
  const [searchResults, setSearchResults] = useState<Array<{ uid: string; username: string; name: string; email?: string; picture?: string }>>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [requestSentMap, setRequestSentMap] = useState<Record<string, string>>({}); // targetUid -> 'pending' | 'accepted' | 'error'

  const fetchSocialData = async () => {
    try {
      const [friendsList, requests] = await Promise.all([
        apiClient.getFriends(),
        apiClient.getPendingRequests()
      ]);
      setFriends(friendsList);
      setPendingRequests(requests.incoming || []);
      localStorage.setItem("cached_friends", JSON.stringify(friendsList));
      localStorage.setItem("cached_pending_requests", JSON.stringify(requests.incoming || []));
    } catch (err) {
      console.error("Failed to fetch friends page data", err);
    }
  };

  const getFriendActivityDescription = (friend: any) => {
    const presence = friend.presence || {};
    const state = presence.state || friend.mode || "offline";

    if (state === "offline") {
      const lastSeen = presence.lastSeenAt || friend.updated_at;
      if (lastSeen) {
        const diffMs = Date.now() - (lastSeen * 1000);
        const diffMins = Math.floor(diffMs / 60000);
        if (diffMins < 1) return "Last seen just now";
        if (diffMins < 60) return `Last seen ${diffMins}m ago`;
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `Last seen ${diffHours}h ago`;
        return `Last seen ${Math.floor(diffHours / 24)}d ago`;
      }
      return "Offline";
    }

    if (state === "away") {
      return "Away";
    }

    return presence.activePage || friend.status_text || "Online";
  };

  useEffect(() => {
    let active = true;
    let unsubscribes: (() => void)[] = [];

    const fetchSocialDataAndListen = async () => {
      try {
        const [friendsList, requests] = await Promise.all([
          apiClient.getFriends(),
          apiClient.getPendingRequests()
        ]);
        if (!active) return;
        setFriends(friendsList);
        setPendingRequests(requests.incoming || []);
        localStorage.setItem("cached_friends", JSON.stringify(friendsList));
        localStorage.setItem("cached_pending_requests", JSON.stringify(requests.incoming || []));
        setLoading(false);

        // Setup real-time listeners for each friend
        const { getFirestore, doc, onSnapshot } = await import("firebase/firestore");
        const { getApp } = await import("firebase/app");
        const db = getFirestore(getApp());

        const unsubs = friendsList.map((friend) => {
          return onSnapshot(doc(db, "users", friend.uid), (docSnap) => {
            if (docSnap.exists() && active) {
              const data = docSnap.data();
              setFriends((prevFriends) =>
                prevFriends.map((f) => {
                  if (f.uid === friend.uid) {
                    const privacy = data.privacy_settings || {};
                    const presenceVis = privacy.presence_visibility || "everyone";
                    const activityVis = privacy.activity_visibility !== false;
                    const lastSeenVis = privacy.last_seen_visibility || "everyone";

                    const showPresence = presenceVis !== "nobody";
                    const showActivity = showPresence && activityVis;
                    const showLastSeen = lastSeenVis !== "nobody";

                    const rawPresence = data.presence || {};
                    const rawState = rawPresence.state || data.mode || "offline";
                    const rawLastSeen = rawPresence.lastSeenAt || data.updated_at;

                    // Stale check (150 seconds)
                    const isStale = rawLastSeen && (Date.now() / 1000 - rawLastSeen > 150);
                    const state = (rawState !== "offline" && isStale) ? "offline" : rawState;

                    return {
                      ...f,
                      name: data.name || data.username || f.name,
                      picture: data.picture || f.picture,
                      color: data.color || f.color,
                      mode: showPresence ? state : "offline",
                      status_text: (showPresence && showActivity) ? rawPresence.activePage : "",
                      presence: {
                        state: showPresence ? state : "offline",
                        lastSeenAt: showLastSeen ? rawLastSeen : null,
                        activePage: (showPresence && showActivity) ? rawPresence.activePage : "",
                        activeProjectId: (showPresence && showActivity) ? rawPresence.activeProjectId : null,
                        activeProjectName: (showPresence && showActivity) ? rawPresence.activeProjectName : null,
                      }
                    };
                  }
                  return f;
                })
              );
            }
          });
        });
        unsubscribes = unsubs;
      } catch (err) {
        console.error("Failed to setup real-time presence in FriendsPage", err);
        if (active) setLoading(false);
      }
    };

    fetchSocialDataAndListen();

    // Poll for pending requests every 30 seconds
    const interval = setInterval(async () => {
      try {
        const requests = await apiClient.getPendingRequests();
        if (active) {
          setPendingRequests(requests.incoming || []);
        }
      } catch (err) {
        console.error("Failed to poll pending requests", err);
      }
    }, 30000);

    return () => {
      active = false;
      unsubscribes.forEach((unsub) => unsub());
      clearInterval(interval);
    };
  }, []);

  // GitHub-like debounced search trigger as the user types
  useEffect(() => {
    if (!searchUsername.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      setSearchStatus({ loading: false });
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setSearchStatus({ loading: true });
      setIsSearching(true);
      try {
        const results = await apiClient.searchUsers(searchUsername.trim());
        setSearchResults(results);
        setSearchStatus({ loading: false });
      } catch (err: any) {
        setSearchStatus({
          loading: false,
          error: err.message || "Failed to search users."
        });
      }
    }, 400); // 400ms typing debounce

    return () => clearTimeout(delayDebounce);
  }, [searchUsername]);

  const handleSendRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchUsername.trim()) return;

    setSearchStatus({ loading: true });
    try {
      const res = await apiClient.sendFriendRequest(searchUsername.trim());
      if (res.success) {
        if (res.status === "accepted") {
          setSearchStatus({
            loading: false,
            success: true,
            message: `You are now friends with ${searchUsername}!`
          });
          fetchSocialData();
        } else {
          setSearchStatus({
            loading: false,
            success: true,
            message: `Friend request sent to ${searchUsername}!`
          });
        }
        setSearchUsername("");
        setSearchResults([]);
        setIsSearching(false);
        setTimeout(() => {
          setSearchStatus({ loading: false });
        }, 4000);
      } else {
        setSearchStatus({
          loading: false,
          error: res.detail || "Failed to send request."
        });
      }
    } catch (err: any) {
      setSearchStatus({
        loading: false,
        error: err.message || "User not found or error occurred."
      });
    }
  };

  const handleAddFriendClick = async (targetUid: string, targetUsername: string) => {
    try {
      const res = await apiClient.sendFriendRequest(targetUsername);
      if (res.success) {
        setRequestSentMap(prev => ({
          ...prev,
          [targetUid]: res.status === "accepted" ? "accepted" : "pending"
        }));
        if (res.status === "accepted") {
          fetchSocialData();
        }
      } else {
        setRequestSentMap(prev => ({ ...prev, [targetUid]: "error" }));
      }
    } catch (err) {
      setRequestSentMap(prev => ({ ...prev, [targetUid]: "error" }));
    }
  };

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

  // Sort friends: Online Friends -> Away Friends -> Offline Friends. Inside each group: Most recently active first.
  const sortedFriends = [...friends].sort((a, b) => {
    const stateA = a.presence?.state || a.mode || "offline";
    const stateB = b.presence?.state || b.mode || "offline";

    const rank = { online: 3, away: 2, offline: 1 };
    const rA = rank[stateA as keyof typeof rank] || 1;
    const rB = rank[stateB as keyof typeof rank] || 1;

    if (rA !== rB) return rB - rA;

    const timeA = a.presence?.lastSeenAt || 0;
    const timeB = b.presence?.lastSeenAt || 0;
    return timeB - timeA;
  });

  const onlineCount = friends.filter(f => {
    const state = f.presence?.state || f.mode || "offline";
    return state === "online" || state === "away";
  }).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-full bg-background py-20">
        <Loader2 className="animate-spin text-primary size-8" />
      </div>
    );
  }

  return (
    <div className="min-h-full bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/90 backdrop-blur-sm border-b border-border px-4 md:px-8 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users size={18} className="text-primary" />
          <h1
            className="text-base font-semibold text-foreground"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Friends
          </h1>
          <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
            {onlineCount} Online / {friends.length} Total
          </span>
        </div>
      </header>

      {/* Content layout */}
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Left Side: Add Friend & Pending Requests (Takes 1 column on lg) */}
          <div className="space-y-6 lg:col-span-1">
            {/* Add Friend Box */}
            <div className="bg-card border border-border rounded-xl p-5 space-y-4 animate-fadeIn">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                <Sparkles size={14} className="text-primary" />
                Add Builder
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Connect with other developers by searching their username, handle, or email.
              </p>
              
              <form onSubmit={handleSendRequest} className="space-y-3">
                <div className="relative">
                  <input
                    type="text"
                    value={searchUsername}
                    onChange={(e) => setSearchUsername(e.target.value)}
                    placeholder="Enter username or email..."
                    className="w-full bg-background border border-border text-sm rounded-lg pl-3 pr-10 py-2 focus:outline-none focus:border-primary text-foreground"
                  />
                  <button
                    type="submit"
                    disabled={searchStatus.loading}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-muted-foreground hover:text-primary transition-colors disabled:opacity-50"
                  >
                    {searchStatus.loading ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Plus size={16} />
                    )}
                  </button>
                </div>

                {searchStatus.error && (
                  <p className="text-xs text-red-500 font-medium animate-fadeIn">{searchStatus.error}</p>
                )}
                {searchStatus.message && (
                  <p className="text-xs text-emerald-500 font-medium animate-fadeIn">{searchStatus.message}</p>
                )}
              </form>

              {/* GitHub-like Search Results dropdown */}
              {isSearching && (
                <div className="mt-4 border-t border-border pt-4 space-y-2 max-h-[300px] overflow-y-auto pr-1 animate-fadeIn">
                  <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                    Search Results
                  </h4>
                  {searchStatus.loading && searchResults.length === 0 ? (
                    <div className="flex justify-center py-4">
                      <Loader2 size={16} className="text-muted-foreground animate-spin" />
                    </div>
                  ) : searchResults.length === 0 ? (
                    <p className="text-xs text-muted-foreground py-2 text-center">No builders found matching "{searchUsername}"</p>
                  ) : (
                    <div className="space-y-2">
                      {searchResults.map((user) => {
                        const status = requestSentMap[user.uid];
                        const isAlreadyFriend = friends.some(f => f.uid === user.uid);
                        
                        return (
                          <div
                            key={user.uid}
                            className="flex items-center justify-between p-2 rounded-lg bg-background border border-border/80 hover:border-primary/20 transition-all"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <Avatar name={user.name || user.username} size="sm" />
                              <div className="min-w-0">
                                <p className="text-xs font-semibold text-foreground truncate">
                                  {user.name || user.username}
                                </p>
                                <p className="text-[10px] text-muted-foreground truncate">
                                  @{user.username}
                                </p>
                              </div>
                            </div>
                            
                            {isAlreadyFriend ? (
                              <span className="text-[10px] font-semibold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-md shrink-0">
                                Connected
                              </span>
                            ) : status === "accepted" ? (
                              <span className="text-[10px] font-semibold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-md shrink-0">
                                Connected
                              </span>
                            ) : status === "pending" ? (
                              <span className="text-[10px] font-semibold text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-md shrink-0">
                                Requested
                              </span>
                            ) : (
                              <button
                                onClick={() => handleAddFriendClick(user.uid, user.username)}
                                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-primary text-primary-foreground text-[10px] font-semibold hover:bg-primary/90 transition-all shrink-0"
                              >
                                <Plus size={10} />
                                Add
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Pending Requests Box */}
            {pendingRequests.length > 0 && (
              <div className="bg-card border border-border rounded-xl p-5 space-y-4">
                <h3 className="text-xs font-bold text-primary uppercase tracking-wider">
                  Friend Requests ({pendingRequests.length})
                </h3>
                <div className="space-y-3">
                  {pendingRequests.map((req) => (
                    <div
                      key={req.id}
                      className="flex items-center justify-between bg-background border border-border/80 rounded-lg p-3 hover:border-primary/30 transition-all"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Avatar name={req.sender?.name || req.sender?.username || "?"} size="sm" />
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-foreground truncate">
                            {req.sender?.name || req.sender?.username}
                          </p>
                          <p className="text-[10px] text-muted-foreground truncate">
                            @{req.sender?.username}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => handleAcceptRequest(req.id)}
                          className="p-1.5 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 transition-colors"
                          title="Accept Request"
                        >
                          <Check size={14} />
                        </button>
                        <button
                          onClick={() => handleDeclineRequest(req.id)}
                          className="p-1.5 rounded bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors"
                          title="Decline Request"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Side: Connections List (Takes 2 columns on lg) */}
          <div className="bg-card border border-border rounded-xl p-5 lg:col-span-2 space-y-4">
            <h3 className="text-sm font-semibold text-foreground">
              All Connections ({friends.length})
            </h3>
            
            {sortedFriends.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-border rounded-xl">
                <Users size={32} className="text-muted-foreground/60 mx-auto mb-3" />
                <p className="text-sm font-medium text-foreground">No connections found</p>
                <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto leading-relaxed">
                  Start adding other developers to collaborate in real-time building sessions!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {sortedFriends.map((friend) => (
                  <div
                    key={friend.uid}
                    className="flex items-center justify-between p-3 rounded-lg border border-border bg-background hover:bg-muted/30 transition-all duration-200"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar name={friend.name || friend.username} size="sm" presenceMode={friend.presence?.state || (friend.mode === "offline" ? "offline" : friend.mode === "idle" ? "away" : "online")} />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">
                          {friend.name || friend.username}
                        </p>
                        <p className="text-xs text-muted-foreground truncate mt-0.5 font-medium">
                          {getFriendActivityDescription(friend)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
