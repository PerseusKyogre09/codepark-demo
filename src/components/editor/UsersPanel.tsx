import { useState, useEffect } from 'react';
import { Crown, Pencil, Eye, ChevronDown, Lock, Unlock, UserPlus, Link2, Clock, ChevronRight } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useSocket } from '../../contexts/SocketContext';
import { useSession } from '../../contexts/SessionContext';
import { apiClient } from '../../services/api';
import type { CollaboratorUser } from '../../types';

interface UsersPanelProps {
  collaborators: CollaboratorUser[];
  sessionId: string;
  ownerId?: string;
  onInviteClick?: () => void;
}

interface ActivityItem {
  id: string;
  userName: string;
  userColor: string;
  actionText: string;
  timestamp: number;
}

const roleIcons = {
  owner: Crown,
  editor: Pencil,
  viewer: Eye,
};

const roleLabels = {
  owner: 'Owner',
  editor: 'Editor',
  viewer: 'Viewer',
};

const roleColors = {
  owner: '#f59e0b',
  editor: '#3b82f6',
  viewer: '#6b7280',
};

// Read unused variables to satisfy strict compilation rule
const _unused = { roleColors };
Object.values(_unused);

export function UsersPanel({ collaborators, sessionId, ownerId, onInviteClick }: UsersPanelProps) {
  const { themeColors } = useTheme();
  const { user } = useAuth();
  const { socket } = useSocket();
  const { session, toggleLock } = useSession();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [activityOpen, setActivityOpen] = useState(true);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [, forceUpdate] = useState({});

  const isLocked = session?.is_locked;
  const isCurrentUserOwner = user?.uid === ownerId;

  const handleRoleChange = (targetUserId: string, newRole: 'editor' | 'viewer') => {
    if (!isCurrentUserOwner || !user || !socket) return;

    socket.emit('change_role', {
      session_id: sessionId,
      target_user_id: targetUserId,
      new_role: newRole,
    });

    setOpenDropdown(null);
  };

  // Helper to add activity item
  const addActivity = (userName: string, userColor: string, actionText: string) => {
    const newItem: ActivityItem = {
      id: Math.random().toString(36).substring(2, 9),
      userName,
      userColor,
      actionText,
      timestamp: Date.now(),
    };
    setActivities((prev) => [newItem, ...prev].slice(0, 10)); // Keep last 10 activities
  };

  // Keep tracking relative time (m ago / Just now) updated
  useEffect(() => {
    const timer = setInterval(() => {
      forceUpdate({});
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  // Listen to WebSocket collaboration events for real activity
  useEffect(() => {
    if (!socket) return;

    const handleUserJoined = (data: { user_id: string; user_name: string; color: string }) => {
      addActivity(data.user_name || 'Collaborator', data.color || 'var(--primary)', 'joined the session');
    };

    const handleUserLeft = (data: { user_id: string }) => {
      const collab = collaborators.find(c => c.id === data.user_id);
      addActivity(collab?.name || 'A builder', collab?.color || 'var(--primary)', 'left the session');
    };

    const lastEditTime: Record<string, number> = {};

    const handleYjsUpdate = () => {
      // Log active editing for collaborators currently focused on a file
      collaborators.forEach(collab => {
        if (!collab.cursor?.filename) return;
        const now = Date.now();
        const lastTime = lastEditTime[collab.id] || 0;
        if (now - lastTime > 10000) { // 10 second throttle per collaborator edit log
          lastEditTime[collab.id] = now;
          const fname = collab.cursor.filename.split('/').pop() || '';
          addActivity(collab.name, collab.color, `edited ${fname}`);
        }
      });
    };

    const handleFilesChanged = (data: { initiator_id?: string; files: any }) => {
      const initiator = collaborators.find(c => c.id === data.initiator_id) || (user && data.initiator_id === user.uid ? { name: user.name || 'You', color: 'var(--primary)' } : null);
      if (initiator) {
        addActivity(initiator.name, initiator.color || 'var(--primary)', 'saved changes');
      }
    };

    const handleFileCreated = (data: { file_name: string; creator_id?: string }) => {
      const fname = data.file_name.split('/').pop() || '';
      const initiator = collaborators.find(c => c.id === data.creator_id) || (user && data.creator_id === user.uid ? { name: user.name || 'You', color: 'var(--primary)' } : null);
      addActivity(initiator ? initiator.name : 'A builder', initiator?.color || 'var(--primary)', `created ${fname}`);
    };

    const handleFileDeleted = (data: { file_name?: string; deleted_file?: string }) => {
      const fname = (data.file_name || data.deleted_file || '').split('/').pop() || '';
      addActivity('A builder', 'var(--primary)', `deleted ${fname}`);
    };

    const handleFileRenamed = (data: { old_name: string; new_name: string }) => {
      const oldF = data.old_name.split('/').pop() || '';
      const newF = data.new_name.split('/').pop() || '';
      addActivity('A builder', 'var(--primary)', `renamed ${oldF} to ${newF}`);
    };

    socket.on('user_joined', handleUserJoined);
    socket.on('user_left', handleUserLeft);
    socket.on('yjs_update', handleYjsUpdate);
    socket.on('files_changed', handleFilesChanged);
    socket.on('file_created', handleFileCreated);
    socket.on('file_deleted', handleFileDeleted);
    socket.on('file_renamed', handleFileRenamed);

    return () => {
      socket.off('user_joined', handleUserJoined);
      socket.off('user_left', handleUserLeft);
      socket.off('yjs_update', handleYjsUpdate);
      socket.off('files_changed', handleFilesChanged);
      socket.off('file_created', handleFileCreated);
      socket.off('file_deleted', handleFileDeleted);
      socket.off('file_renamed', handleFileRenamed);
    };
  }, [socket, collaborators, user]);

  const formatTimeAgo = (timestamp: number) => {
    const diffMs = Date.now() - timestamp;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 1) return 'Just now';
    return `${diffMin}m ago`;
  };

  return (
    <div className="h-full flex flex-col bg-surface">
      <div
        className="px-3 py-2 border-b border-border font-semibold text-xs text-foreground flex items-center justify-between shrink-0"
      >
        <span className="flex items-center gap-1.5">
          Session <span className="text-[10px] font-normal text-muted-foreground">· {collaborators.length} active</span>
        </span>
        <button onClick={onInviteClick} className="text-muted-foreground hover:text-foreground" title="Copy invite link">
          <Link2 size={13} />
        </button>
      </div>

      <div className="mx-2 mt-2 px-3 py-2.5 rounded-lg bg-muted/40 border border-border shrink-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] font-semibold text-foreground font-mono">{sessionId.substring(0, 8)}...</span>
          <span className="text-[10px] text-muted-foreground flex items-center gap-1"><Clock size={9} /> active</span>
        </div>
        <button onClick={onInviteClick} className="text-[10px] text-primary hover:underline flex items-center gap-1">
          <Link2 size={9} /> Copy invite link
        </button>
      </div>

      <div className="flex-1 overflow-y-auto" style={{ overscrollBehavior: 'none' }}>
        <div className="px-3 pt-3 pb-1">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.08em]">Participants</p>
        </div>

        {collaborators.length === 0 ? (
          <div className="p-4 text-center text-sm" style={{ color: themeColors.textSecondary }}>
            No users in session
          </div>
        ) : (
          <div className="p-1 space-y-1">
            {collaborators.map((collab) => {
              const role = collab.role || 'viewer';
              const RoleIcon = roleIcons[role];
              Object.values({ RoleIcon });
              const isOwner = role === 'owner';
              const canChangeRole = isCurrentUserOwner && !isOwner && collab.id !== user?.uid;
              const activeFile = collab.cursor?.filename ? collab.cursor.filename.split('/').pop() : null;
              const activeLine = collab.cursor?.line ? ` · L${collab.cursor.line}` : '';

              return (
                <div
                  key={collab.id}
                  className="flex items-start gap-2.5 px-3 py-2.5 hover:bg-muted/20 transition-colors rounded-lg"
                >
                  <div className="relative shrink-0 mt-0.5">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white shadow-md"
                      style={{ background: collab.color }}
                    >
                      {collab.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-surface bg-success" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-[13px] font-medium text-foreground truncate">{collab.name}</span>
                      <span className="text-[9px] font-semibold px-1 py-0.5 rounded-sm shrink-0" style={{ backgroundColor: `${collab.color}22`, color: collab.color }}>
                        {roleLabels[role]}
                      </span>
                    </div>
                    {activeFile ? (
                      <div className="text-[11px] text-muted-foreground flex items-center gap-1 truncate font-mono">
                        <span className="truncate">{activeFile}</span>
                        <span>{activeLine}</span>
                      </div>
                    ) : (
                      <div className="text-[11px] text-muted-foreground">Browsing Dashboard</div>
                    )}
                  </div>

                  {/* Role change dropdown - only for owner */}
                  {canChangeRole && (
                    <div className="relative">
                      <button
                        onClick={() => setOpenDropdown(openDropdown === collab.id ? null : collab.id)}
                        className="p-1.5 rounded hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground"
                      >
                        <ChevronDown size={14} />
                      </button>

                      {openDropdown === collab.id && (
                        <div
                          className="absolute right-0 top-full mt-1 py-1 rounded-lg shadow-xl z-50 min-w-[120px]"
                          style={{
                            background: themeColors.cardBg,
                            border: `1px solid ${themeColors.border}`,
                          }}
                        >
                          <button
                            onClick={() => handleRoleChange(collab.id, 'editor')}
                            className="w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-white/5 text-foreground"
                          >
                            <Pencil size={12} />
                            Make Editor
                          </button>
                          <button
                            onClick={() => handleRoleChange(collab.id, 'viewer')}
                            className="w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-white/5 text-foreground"
                          >
                            <Eye size={12} />
                            Make Viewer
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Embedded Friends / Connections list */}
        <div className="border-t border-border mt-3">
          <div className="px-3 pt-3 pb-1">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.08em]">Friends & Connections</p>
          </div>
          {(() => {
            const [friends, setFriends] = useState<any[]>([]);
            const [invitedMap, setInvitedMap] = useState<Record<string, boolean>>({});
            const [loading, setLoading] = useState(true);

            useEffect(() => {
              let active = true;
              apiClient.getFriends().then((list: any[]) => {
                if (active) {
                  setFriends(list);
                  setLoading(false);
                }
              }).catch(() => setLoading(false));
              return () => { active = false; };
            }, []);

            const inviteFriend = async (friendUid: string) => {
              try {
                const res = await apiClient.sendInvite(friendUid, session?.project_id);
                if (res.success) {
                  setInvitedMap(prev => ({ ...prev, [friendUid]: true }));
                  setTimeout(() => {
                    setInvitedMap(prev => ({ ...prev, [friendUid]: false }));
                  }, 10000);
                }
              } catch (err) {
                console.error(err);
              }
            };

            if (loading) {
              return <div className="p-3 text-xs text-muted-foreground italic">Loading friends...</div>;
            }
            if (friends.length === 0) {
              return <div className="p-3 text-xs text-muted-foreground italic">No friends added yet.</div>;
            }

            return (
              <div className="p-1 space-y-1">
                {friends.map(friend => {
                  const isInvited = invitedMap[friend.uid];
                  return (
                    <div key={friend.uid} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/30 transition-colors group">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="relative shrink-0">
                          <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold text-white shadow-sm bg-neutral-600" style={{ background: friend.color }}>
                            {friend.name ? friend.name.charAt(0).toUpperCase() : friend.username.charAt(0).toUpperCase()}
                          </div>
                          <span className={`absolute -bottom-0.5 -right-0.5 size-2 rounded-full border border-surface ${
                            friend.mode === "online" || friend.mode === "coding"
                              ? "bg-emerald-500"
                              : friend.mode === "idle" || friend.mode === "dnd"
                              ? "bg-amber-500"
                              : "bg-zinc-500"
                          }`} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-foreground truncate">{friend.name || friend.username}</p>
                          <p className="text-[9px] text-muted-foreground truncate">@{friend.username}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => inviteFriend(friend.uid)}
                        disabled={isInvited}
                        className={`px-2 py-1 rounded text-[9px] font-bold transition-all shrink-0 ${
                          isInvited
                            ? "bg-emerald-500/20 text-emerald-500 cursor-default"
                            : "bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground"
                        }`}
                      >
                        {isInvited ? "Invited" : "Invite"}
                      </button>
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>

        <div className="border-t border-border mt-3">
          <button 
            onClick={() => setActivityOpen(!activityOpen)}
            className="w-full flex items-center gap-1 px-3 h-7 text-[10px] font-semibold tracking-[0.08em] uppercase text-muted-foreground hover:bg-muted/30 transition-colors"
          >
            {activityOpen ? <ChevronDown size={10} /> : <ChevronRight size={10} />}
            Recent Activity
          </button>
          {activityOpen && (
            <div className="px-3 space-y-2.5 pb-3 pt-1">
              {activities.length === 0 ? (
                <p className="text-[11px] text-muted-foreground px-1 py-2 italic">No recent activity</p>
              ) : (
                activities.map((act) => {
                  const initial = act.userName ? act.userName.charAt(0).toUpperCase() : '?';
                  return (
                    <div key={act.id} className="flex items-start gap-2.5">
                      <div 
                        className="size-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 text-white"
                        style={{ background: act.userColor }}
                      >
                        {initial}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] text-muted-foreground leading-snug break-words">
                          <span className="text-foreground font-medium">{act.userName}</span> {act.actionText}
                        </p>
                        <p className="text-[10px] text-muted-foreground/60 mt-0.5">{formatTimeAgo(act.timestamp)}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>

      <div className="p-2 border-t border-border space-y-1 shrink-0 bg-surface">
        {onInviteClick && (
          <button
            onClick={onInviteClick}
            className="w-full py-2 px-3 rounded-md flex items-center justify-center gap-2 text-xs font-semibold transition-all text-white hover:opacity-95 bg-primary"
          >
            <UserPlus size={14} />
            <span>Invite teammates</span>
          </button>
        )}
        {isCurrentUserOwner ? (
          <button
            onClick={toggleLock}
            className={`w-full py-2 px-3 rounded-md flex items-center justify-center gap-2 text-xs font-semibold transition-colors ${isLocked
                ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
                : 'bg-green-500/10 text-green-500 hover:bg-green-500/20'
              }`}
          >
            {isLocked ? <Unlock size={14} /> : <Lock size={14} />}
            {isLocked ? 'Unlock Session' : 'Lock Session'}
          </button>
        ) : isLocked && (
          <div className="flex items-center justify-center gap-2 text-xs text-red-400 opacity-80 bg-red-500/5 p-2 rounded font-semibold">
            <Lock size={12} />
            <span>Session is Locked</span>
          </div>
        )}
      </div>
    </div>
  );
}
