import { useState, useEffect, type ReactNode } from "react";
import { User as UserIcon, Palette, Bell, Puzzle, Users, Shield, Link2, LogOut, CheckCircle2, Plus, Eye, EyeOff, Search, Loader2, Terminal } from "lucide-react";
import { Avatar } from "../components/cp/Avatar";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { apiClient, getApiBaseUrl } from "../services/api";
import SettingsSectionDeveloper from "../components/profile/settings/SettingsSectionDeveloper";

import type { Friend, FriendRequest, User } from "../types";

type SettingsTab = "profile" | "appearance" | "notifications" | "integrations" | "friends" | "privacy" | "developer";

const SIDEBAR = [
  { id: "profile" as SettingsTab, label: "Profile", icon: <UserIcon size={15} /> },
  { id: "appearance" as SettingsTab, label: "Appearance", icon: <Palette size={15} /> },
  { id: "notifications" as SettingsTab, label: "Notifications", icon: <Bell size={15} /> },
  { id: "integrations" as SettingsTab, label: "Integrations", icon: <Puzzle size={15} /> },
  { id: "friends" as SettingsTab, label: "Friends", icon: <Users size={15} /> },
  { id: "privacy" as SettingsTab, label: "Privacy", icon: <Shield size={15} /> },
  { id: "developer" as SettingsTab, label: "Developer", icon: <Terminal size={15} /> },
];

function ProfileSettings() {
  const { user, updateUsername, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || user?.username || "");
  const [username, setUsername] = useState(user?.username || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [status, setStatus] = useState(user?.status?.text || "");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    setSuccess(false);
    try {
      if (username && username !== user?.username) {
        await updateUsername(username);
      }
      await updateProfile(name, bio);
      if (status !== user?.status?.text) {
        await apiClient.updateStatus(user?.mode || "offline", { text: status, emoji: "💬" });
      }
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-semibold text-foreground" style={{ fontFamily: "var(--font-display)" }}>
          Profile
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          How you appear to teammates and the community.
        </p>
      </div>

      {/* Avatar */}
      <div className="flex items-center gap-4 p-5 bg-muted/50 border border-border rounded-lg">
        <Avatar name={name} size="xl" />
        <div>
          <p className="text-sm font-medium text-foreground">Profile picture</p>
          <p className="text-xs text-muted-foreground mt-0.5">Initials are used while avatar upload is in beta.</p>
        </div>
      </div>

      {/* Form fields */}
      <div className="grid gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            Display name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            Username
          </label>
          <div className="flex items-center border border-border rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-ring">
            <span className="px-3 py-2 bg-muted text-muted-foreground text-sm border-r border-border whitespace-nowrap">
              codepark.io/@
            </span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="flex-1 px-3 py-2 bg-background text-foreground text-sm outline-none"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">Your unique username handle.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm text-foreground outline-none focus:ring-2 focus:ring-ring resize-none leading-relaxed"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Status</label>
          <input
            type="text"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
            placeholder="What are you working on?"
          />
        </div>
      </div>

      <div className="border-t border-border pt-4 flex items-center justify-between">
        {success && (
          <span className="text-xs text-green-500 flex items-center gap-1.5 font-medium animate-pulse">
            <CheckCircle2 size={14} /> Profile settings saved successfully!
          </span>
        )}
        <button
          onClick={handleSave}
          disabled={saving}
          className="ml-auto px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save changes"}
        </button>
      </div>
    </div>
  );
}

function AppearanceSettings() {
  const { settings, updateSettings } = useTheme();

  const theme = settings.uiTheme;
  const streakTrackingEnabled = settings.streakTrackingEnabled !== false;

  const THEMES = [
    { id: "dark" as const, label: "Park (Dark)", desc: "Quiet park at dusk. The default CodePark experience." },
    { id: "light" as const, label: "Light", desc: "Writing in a sketchbook on a wooden table." },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-semibold text-foreground" style={{ fontFamily: "var(--font-display)" }}>
          Appearance
        </h2>
        <p className="text-sm text-muted-foreground mt-1">Choose how CodePark looks for you.</p>
      </div>

      <div>
        <p className="text-sm font-medium text-foreground mb-3">Theme</p>
        <div className="grid sm:grid-cols-2 gap-3">
          {THEMES.map((t) => (
            <button
              key={t.id}
              onClick={() => updateSettings({ uiTheme: t.id })}
              className={`text-left p-4 rounded-lg border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${theme === t.id
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/30 hover:bg-muted"
                }`}
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-foreground">{t.label}</p>
                {theme === t.id && (
                  <span className="size-2 rounded-full bg-primary" />
                )}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{t.desc}</p>
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Midnight, Forest, and Cyberpunk Legacy themes are coming in a future release.
        </p>
      </div>

      <div className="border-t border-border pt-5">
        <p className="text-sm font-medium text-foreground mb-3">Streaks</p>
        <div className="flex items-start justify-between p-4 rounded-lg border border-border">
          <div>
            <p className="text-sm text-foreground">Enable streak tracking</p>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed max-w-xs">
              Track how often you've been active. Streaks are private, optional, and never penalise absence.
            </p>
          </div>
          <button
            onClick={() => updateSettings({ streakTrackingEnabled: !streakTrackingEnabled })}
            className={`relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring mt-0.5 ${
              streakTrackingEnabled ? "bg-primary" : "bg-muted"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-background shadow transition ${
                streakTrackingEnabled ? "translate-x-4" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}

function NotificationsSettings() {
  const { user, checkAuth } = useAuth();
  const PREFS = [
    { label: "Achievement unlocks", desc: "When you earn a new achievement.", on: true },
    { label: "Team activity", desc: "When teammates join or leave a project.", on: true },
    { label: "Session invites", desc: "When someone invites you to a session.", on: true },
    { label: "Mentions", desc: "When someone mentions you in a comment or devlog.", on: true },
    { label: "Release published", desc: "When a project you contribute to ships a release.", on: false },
    { label: "Weekly digest", desc: "A quiet summary of what your team built.", on: false },
  ];
  const [prefs, setPrefs] = useState(PREFS);

  useEffect(() => {
    if (user?.notification_settings && Array.isArray(user.notification_settings)) {
      const dbPrefs = user.notification_settings;
      setPrefs((prevPrefs) =>
        prevPrefs.map((p) => {
          const match = dbPrefs.find((dp: any) => dp.label === p.label);
          return match ? { ...p, on: match.on } : p;
        })
      );
    }
  }, [user?.notification_settings]);

  const handleToggle = async (index: number) => {
    const updatedPrefs = prefs.map((pr, j) => (j === index ? { ...pr, on: !pr.on } : pr));
    setPrefs(updatedPrefs);
    try {
      await apiClient.updateNotificationSettings(updatedPrefs);
      await checkAuth();
    } catch (err) {
      console.error("Failed to update notification settings", err);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-semibold text-foreground" style={{ fontFamily: "var(--font-display)" }}>
          Notifications
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          We only send what matters. You're in control of the rest.
        </p>
      </div>
      <div className="space-y-2">
        {prefs.map((p, i) => (
          <div key={p.label} className="flex items-start justify-between p-4 rounded-lg border border-border hover:bg-muted/30 transition-colors">
            <div>
              <p className="text-sm font-medium text-foreground">{p.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{p.desc}</p>
            </div>
            <button
              onClick={() => handleToggle(i)}
              className={`relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring mt-0.5 ${p.on ? "bg-primary" : "bg-muted"
                }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition ${p.on ? "translate-x-4" : "translate-x-0"
                  }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function IntegrationsSettings() {
  const [githubConnected, setGithubConnected] = useState(false);
  const [githubUser, setGithubUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkGitHub() {
      try {
        const status = await apiClient.getGitHubStatus();
        setGithubConnected(status.connected);
        setGithubUser(status.username || null);
      } catch (err) {
        console.error("Failed to check GitHub integration status", err);
      } finally {
        setLoading(false);
      }
    }
    checkGitHub();
  }, []);

  const handleConnectGitHub = () => {
    const port = window.location.port ? `:${window.location.port}` : "";
    const redirectUrl = `${window.location.protocol}//${window.location.hostname}${port}/settings`;
    const apiBase = getApiBaseUrl() || `${window.location.protocol}//${window.location.hostname}${port}`;
    window.location.href = `${apiBase}/api/github/login?state=${encodeURIComponent(redirectUrl)}`;
  };

  const handleDisconnectGitHub = async () => {
    if (!confirm("Are you sure you want to disconnect GitHub?")) return;
    try {
      await apiClient.disconnectGitHub();
      setGithubConnected(false);
      setGithubUser(null);
    } catch (err) {
      console.error(err);
      alert("Failed to disconnect GitHub");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-semibold text-foreground" style={{ fontFamily: "var(--font-display)" }}>
          Integrations
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Connect your accounts to enable repository importing, authentication, and team collaboration.
        </p>
      </div>

      <div className="space-y-4">
        {/* Google Card */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 border border-border bg-card rounded-lg gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-muted rounded-md shrink-0">
              <svg className="size-6 text-foreground fill-current" viewBox="0 0 24 24">
                <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114A5.786 5.786 0 018.17 12.75a5.786 5.786 0 015.82-5.768c1.614 0 3.065.578 4.2 1.543l3.208-3.084C19.167 3.393 16.598 2.25 13.99 2.25c-5.38 0-9.74 4.36-9.74 9.74a9.74 9.74 0 009.74 9.74c5.136 0 9.407-3.714 9.407-9.74a9.387 9.387 0 00-.157-1.705H12.24z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground text-sm">Google</span>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 border border-green-500/20">
                  Connected
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Used for account authentication, secure SSO login, and syncing profile details.
              </p>
            </div>
          </div>
          <div className="shrink-0 flex items-center">
            <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1.5 rounded-md border border-border">
              Managed by login provider
            </span>
          </div>
        </div>

        {/* GitHub Card */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 border border-border bg-card rounded-lg gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-muted rounded-md shrink-0">
              <svg className="size-6 text-foreground fill-current" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground text-sm">GitHub</span>
                {githubConnected ? (
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 border border-green-500/20">
                    Connected
                  </span>
                ) : (
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
                    Disconnected
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Used for account login, importing repositories, git committing, and pushing code updates.
              </p>
              {githubConnected && githubUser && (
                <p className="text-[11px] text-primary font-medium mt-1">Connected as @{githubUser}</p>
              )}
            </div>
          </div>
          <div className="shrink-0 flex items-center">
            {loading ? (
              <span className="text-xs text-muted-foreground">Checking...</span>
            ) : githubConnected ? (
              <button
                onClick={handleDisconnectGitHub}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-red-500/30 text-red-500 text-xs font-medium rounded-md hover:bg-red-500/5 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-500"
              >
                <LogOut size={12} />
                Disconnect
              </button>
            ) : (
              <button
                onClick={handleConnectGitHub}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground text-xs font-medium rounded-md hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <Link2 size={12} />
                Connect GitHub
              </button>
            )}
          </div>
        </div>

        {/* GitLab Card */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 border border-border bg-card rounded-lg gap-4 opacity-70">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-muted rounded-md shrink-0">
              <svg className="size-6 text-foreground fill-current" viewBox="0 0 24 24">
                <path d="M22.65 14.39L12 22.13 1.35 14.39a.84.84 0 01-.3-.92l2.67-8.22a.85.85 0 01.8-.58h.05a.85.85 0 01.8.58L8 14.39h8l2.63-9.14a.85.85 0 01.8-.58h.05a.85.85 0 01.8.58l2.67 8.22a.84.84 0 01-.3.92z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground text-sm">GitLab</span>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
                  Coming Soon
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Connect your GitLab repositories and build integrations.
              </p>
            </div>
          </div>
          <div className="shrink-0 flex items-center">
            <button
              disabled
              className="flex items-center gap-1.5 px-3 py-1.5 border border-border text-muted-foreground text-xs font-medium rounded-md cursor-not-allowed bg-muted/50"
            >
              Unavailable
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FriendsSettings() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<FriendRequest[]>([]);
  const [outgoingRequests, setOutgoingRequests] = useState<FriendRequest[]>([]);
  const [blockedUsers, setBlockedUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [searchStatus, setSearchStatus] = useState<{ loading: boolean; success?: boolean; error?: string; message?: string }>({ loading: false });

  const loadData = async () => {
    try {
      const [friendsList, requests, blockedList] = await Promise.all([
        apiClient.getFriends(),
        apiClient.getPendingRequests(),
        apiClient.getBlockedUsers()
      ]);
      setFriends(friendsList);
      setIncomingRequests(requests.incoming || []);
      setOutgoingRequests(requests.outgoing || []);
      setBlockedUsers(blockedList);
    } catch (err) {
      console.error("Failed to load friends settings data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSendRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearchStatus({ loading: true });
    try {
      const res = await apiClient.sendFriendRequest(searchQuery.trim());
      if (res.success) {
        setSearchStatus({
          loading: false,
          success: true,
          message: res.status === "accepted" 
            ? `You are now friends with ${searchQuery.trim()}!`
            : `Friend request sent to ${searchQuery.trim()}!`
        });
        setSearchQuery("");
        loadData();
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

  const handleAcceptRequest = async (reqId: string) => {
    try {
      const res = await apiClient.acceptFriendRequest(reqId);
      if (res.success) loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeclineRequest = async (reqId: string) => {
    try {
      const res = await apiClient.declineFriendRequest(reqId);
      if (res.success) loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveFriend = async (username: string) => {
    if (!confirm(`Are you sure you want to remove @${username} from your friends list?`)) return;
    try {
      const res = await apiClient.removeFriend(username);
      if (res.success) loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUnblockUser = async (uid: string) => {
    try {
      const res = await apiClient.unblockUser(uid);
      if (res.success) loadData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h2 className="text-base font-semibold text-foreground" style={{ fontFamily: "var(--font-display)" }}>
          Friends & Connections
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your social graph, pending invites, and blocked list. CodePark is a cooperative space.
        </p>
      </div>

      {/* Find Builders Search */}
      <div className="bg-card border border-border rounded-lg p-5 space-y-4">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Find Builders
        </h3>
        <form onSubmit={handleSendRequest} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by username/handle (e.g. perseuskyogre)"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSearchStatus({ loading: false });
              }}
              className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-md text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <button
            type="submit"
            disabled={searchStatus.loading}
            className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-colors flex items-center gap-1.5"
          >
            {searchStatus.loading ? <Loader2 className="size-4 animate-spin" /> : <Plus size={14} />} Add Friend
          </button>
        </form>
        {searchStatus.error && (
          <p className="text-xs text-red-500 font-medium">{searchStatus.error}</p>
        )}
        {searchStatus.message && (
          <p className="text-xs text-emerald-500 font-medium">{searchStatus.message}</p>
        )}
      </div>

      {/* Pending Invitations */}
      {(incomingRequests.length > 0 || outgoingRequests.length > 0) && (
        <div className="bg-card border border-border rounded-lg p-5 space-y-4">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Pending Invites
          </h3>
          
          {incomingRequests.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-foreground">Incoming Requests</p>
              <div className="divide-y divide-border border border-border rounded-lg overflow-hidden bg-background">
                {incomingRequests.map((req) => (
                  <div key={req.id} className="flex items-center justify-between p-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar name={req.sender?.name || req.sender?.username || "?"} size="sm" />
                      <div>
                        <p className="text-sm font-semibold text-foreground">{req.sender?.name}</p>
                        <p className="text-xs text-muted-foreground">@{req.sender?.username}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleAcceptRequest(req.id)}
                        className="px-3 py-1.5 bg-primary text-primary-foreground text-xs font-semibold rounded hover:bg-primary/90 transition-colors"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleDeclineRequest(req.id)}
                        className="px-3 py-1.5 bg-muted border border-border text-foreground text-xs font-semibold rounded hover:bg-muted/80 transition-colors"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {outgoingRequests.length > 0 && (
            <div className="space-y-2 pt-2">
              <p className="text-xs font-medium text-foreground">Outgoing Requests</p>
              <div className="divide-y divide-border border border-border rounded-lg overflow-hidden bg-background">
                {outgoingRequests.map((req) => (
                  <div key={req.id} className="flex items-center justify-between p-3.5">
                    <div className="flex items-center gap-3 opacity-70">
                      <Avatar name={req.receiver?.name || req.receiver?.username || "?"} size="sm" />
                      <div>
                        <p className="text-sm font-semibold text-foreground">{req.receiver?.name}</p>
                        <p className="text-xs text-muted-foreground">@{req.receiver?.username}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeclineRequest(req.id)}
                      className="px-3 py-1.5 bg-muted text-muted-foreground hover:text-foreground text-xs font-semibold rounded hover:bg-muted/80 transition-colors"
                    >
                      Cancel Request
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Friends list */}
      <div className="bg-card border border-border rounded-lg p-5 space-y-4">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Connections ({friends.length})
        </h3>
        
        {loading ? (
          <div className="py-12 text-center text-sm text-muted-foreground">
            <Loader2 className="animate-spin text-primary size-6 mx-auto mb-2" /> Loading connections...
          </div>
        ) : friends.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-border rounded-lg text-muted-foreground">
            <Users className="size-8 mx-auto mb-2 opacity-50" />
            <p className="text-xs">No active connections. Start inviting other builders!</p>
          </div>
        ) : (
          <div className="divide-y divide-border border border-border rounded-lg bg-background overflow-hidden">
            {friends.map((friend) => (
              <div key={friend.uid} className="flex items-center justify-between p-3.5 hover:bg-muted/10 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar name={friend.name || friend.username} size="sm" />
                    <span
                      className={`absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border border-background ${
                        friend.mode === "online" || friend.mode === "coding"
                          ? "bg-emerald-500"
                          : friend.mode === "idle" || friend.mode === "dnd"
                          ? "bg-amber-500"
                          : "bg-zinc-500"
                      }`}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{friend.name || friend.username}</p>
                    <p className="text-xs text-muted-foreground">
                      @{friend.username} &bull; {friend.status_text || friend.mode}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveFriend(friend.username)}
                  className="text-xs text-red-500 hover:text-red-600 font-semibold px-2 py-1"
                >
                  Unfriend
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Block Manager */}
      {blockedUsers.length > 0 && (
        <div className="bg-card border border-border rounded-lg p-5 space-y-4">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Block List
          </h3>
          <div className="divide-y divide-border border border-border rounded-lg bg-background overflow-hidden">
            {blockedUsers.map((b) => (
              <div key={b.uid} className="flex items-center justify-between p-3.5">
                <div className="flex items-center gap-3 opacity-60">
                  <Avatar name={b.name || b.username || "?"} size="sm" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">{b.name || b.username}</p>
                    <p className="text-xs text-muted-foreground">@{b.username}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleUnblockUser(b.uid)}
                  className="text-xs text-primary hover:underline px-2 py-1 font-semibold"
                >
                  Unblock
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function PrivacySettings() {
  const { user, checkAuth } = useAuth();
  const [showHeatmap, setShowHeatmap] = useState(user?.privacy_settings?.show_heatmap !== false);
  const [showName, setShowName] = useState(user?.privacy_settings?.show_name !== false);
  const [showEmail, setShowEmail] = useState(user?.privacy_settings?.show_email !== false);
  const [profilePrivate, setProfilePrivate] = useState(user?.privacy_settings?.profile_private === true);
  
  // Real-time presence visibility settings
  const [presenceVisibility, setPresenceVisibility] = useState((user as any)?.privacy_settings?.presence_visibility || "everyone");
  const [activityVisibility, setActivityVisibility] = useState((user as any)?.privacy_settings?.activity_visibility !== false);
  const [lastSeenVisibility, setLastSeenVisibility] = useState((user as any)?.privacy_settings?.last_seen_visibility || "everyone");

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    setSuccess(false);
    try {
      // Update hidden cards configuration in firestore as well
      const hiddenCards = [];
      if (!showHeatmap) hiddenCards.push("activity");
      await apiClient.updateDisplaySettings(["activity", "achievements", "streak"], hiddenCards);

      // Save presence privacy settings
      await apiClient.updatePrivacySettings(
        presenceVisibility,
        activityVisibility,
        lastSeenVisibility,
        showHeatmap,
        showName,
        showEmail,
        profilePrivate
      );
      
      // Reload current user auth state to update display
      await checkAuth();

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-semibold text-foreground" style={{ fontFamily: "var(--font-display)" }}>
          Privacy
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Control your profile visibility and choose what details to share with teammates.
        </p>
      </div>

      <div className="space-y-4">
        {/* Toggle Heatmap */}
        <div className="flex items-start justify-between p-4 border border-border bg-card rounded-lg hover:bg-muted/10 transition-colors">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground">Show Heatmap Graph</span>
              {showHeatmap ? <Eye size={13} className="text-primary" /> : <EyeOff size={13} className="text-muted-foreground" />}
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-md">
              Display your 16-week contribution calendar activity grid on your public profile page.
            </p>
          </div>
          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring mt-0.5 ${showHeatmap ? "bg-primary" : "bg-muted"
              }`}
          >
            <span
              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition ${showHeatmap ? "translate-x-4" : "translate-x-0"
                }`}
            />
          </button>
        </div>

        {/* Toggle Real Name */}
        <div className="flex items-start justify-between p-4 border border-border bg-card rounded-lg hover:bg-muted/10 transition-colors">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground">Show Real Display Name</span>
              {showName ? <Eye size={13} className="text-primary" /> : <EyeOff size={13} className="text-muted-foreground" />}
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-md">
              Expose your display name (e.g. {user?.name || "Your Name"}) to users visiting your profile instead of just username.
            </p>
          </div>
          <button
            onClick={() => setShowName(!showName)}
            className={`relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring mt-0.5 ${showName ? "bg-primary" : "bg-muted"
              }`}
          >
            <span
              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition ${showName ? "translate-x-4" : "translate-x-0"
                }`}
            />
          </button>
        </div>

        {/* Toggle Email */}
        <div className="flex items-start justify-between p-4 border border-border bg-card rounded-lg hover:bg-muted/10 transition-colors">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground">Show Email Address</span>
              {showEmail ? <Eye size={13} className="text-primary" /> : <EyeOff size={13} className="text-muted-foreground" />}
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-md">
              Expose your verified email address publicly on your profile so other builders can contact you.
            </p>
          </div>
          <button
            onClick={() => setShowEmail(!showEmail)}
            className={`relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring mt-0.5 ${showEmail ? "bg-primary" : "bg-muted"
              }`}
          >
            <span
              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition ${showEmail ? "translate-x-4" : "translate-x-0"
                }`}
            />
          </button>
        </div>

        {/* Profile Private Mode */}
        <div className="flex items-start justify-between p-4 border border-border bg-card rounded-lg hover:bg-muted/10 transition-colors">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground">Make Profile Fully Private</span>
              {profilePrivate ? <EyeOff size={13} className="text-red-500" /> : <Eye size={13} className="text-primary" />}
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-md">
              Hides your entire profile page from non-friends and search engines. Teammates must request access.
            </p>
          </div>
          <button
            onClick={() => setProfilePrivate(!profilePrivate)}
            className={`relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring mt-0.5 ${profilePrivate ? "bg-primary" : "bg-muted"
              }`}
          >
            <span
              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition ${profilePrivate ? "translate-x-4" : "translate-x-0"
                }`}
            />
          </button>
        </div>

        {/* Presence & Activity Settings */}
        <div className="border-t border-border pt-5 space-y-4">
          <h3 className="text-sm font-semibold text-foreground">Presence & Activity Privacy</h3>
          
          {/* Presence Status Visibility */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-border bg-card rounded-lg gap-4">
            <div>
              <p className="text-sm font-semibold text-foreground">Online Status Visibility</p>
              <p className="text-xs text-muted-foreground mt-0.5 max-w-md">
                Choose who can see if you are online or away.
              </p>
            </div>
            <select
              value={presenceVisibility}
              onChange={(e) => setPresenceVisibility(e.target.value)}
              className="bg-background border border-border text-sm rounded-md px-3 py-1.5 outline-none focus:ring-2 focus:ring-ring text-foreground"
            >
              <option value="everyone">Everyone</option>
              <option value="friends">Friends Only</option>
              <option value="nobody">Nobody</option>
            </select>
          </div>

          {/* Activity Visibility Toggle */}
          <div className="flex items-start justify-between p-4 border border-border bg-card rounded-lg hover:bg-muted/10 transition-colors">
            <div className="space-y-0.5">
              <span className="text-sm font-semibold text-foreground">Show Current Activity</span>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-md">
                Display what you are working on (e.g. "Editing CodePark", "Browsing Dashboard").
              </p>
            </div>
            <button
              onClick={() => setActivityVisibility(!activityVisibility)}
              className={`relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring mt-0.5 ${activityVisibility ? "bg-primary" : "bg-muted"
                }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition ${activityVisibility ? "translate-x-4" : "translate-x-0"
                  }`}
              />
            </button>
          </div>

          {/* Last Seen Visibility */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-border bg-card rounded-lg gap-4">
            <div>
              <p className="text-sm font-semibold text-foreground">Last Seen Visibility</p>
              <p className="text-xs text-muted-foreground mt-0.5 max-w-md">
                Choose who can see when you were last active.
              </p>
            </div>
            <select
              value={lastSeenVisibility}
              onChange={(e) => setLastSeenVisibility(e.target.value)}
              className="bg-background border border-border text-sm rounded-md px-3 py-1.5 outline-none focus:ring-2 focus:ring-ring text-foreground"
            >
              <option value="everyone">Everyone</option>
              <option value="friends">Friends Only</option>
              <option value="nobody">Nobody</option>
            </select>
          </div>
        </div>
      </div>

      <div className="border-t border-border pt-4 flex items-center justify-between">
        {success && (
          <span className="text-xs text-green-500 flex items-center gap-1.5 font-medium animate-pulse">
            <CheckCircle2 size={14} /> Privacy settings saved successfully!
          </span>
        )}
        <button
          onClick={handleSave}
          disabled={saving}
          className="ml-auto px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save changes"}
        </button>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const [tab, setTab] = useState<SettingsTab>("profile");

  const content: Record<SettingsTab, ReactNode> = {
    profile: <ProfileSettings />,
    appearance: <AppearanceSettings />,
    notifications: <NotificationsSettings />,
    integrations: <IntegrationsSettings />,
    friends: <FriendsSettings />,
    privacy: <PrivacySettings />,
    developer: <SettingsSectionDeveloper />,
  };

  return (
    <div className="min-h-full bg-background">
      <header className="sticky top-0 z-10 bg-background/90 backdrop-blur-sm border-b border-border px-4 md:px-8 h-14 flex items-center">
        <h1 className="text-base font-semibold text-foreground" style={{ fontFamily: "var(--font-display)" }}>
          Settings
        </h1>
      </header>

      {/* Mobile: horizontal scrollable tab bar */}
      <div className="md:hidden border-b border-border px-4">
        <div className="flex overflow-x-auto gap-0.5 py-2 scrollbar-none">
          {SIDEBAR.map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${tab === item.id
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile: content area full-width */}
      <div className="md:hidden px-4 py-6">
        <div className="bg-card border border-border rounded-lg p-5">
          {content[tab]}
        </div>
      </div>

      {/* Desktop: sidebar + content */}
      <div className="hidden md:flex max-w-4xl mx-auto px-8 py-8 gap-8">
        <nav className="w-48 shrink-0">
          <ul className="space-y-0.5">
            {SIDEBAR.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setTab(item.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${tab === item.id
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex-1 min-w-0 bg-card border border-border rounded-lg p-6">
          {content[tab]}
        </div>
      </div>
    </div>
  );
}

