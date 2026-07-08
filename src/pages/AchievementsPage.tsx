import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2, Trophy, Lock, Pin, PinOff, X } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { apiClient } from "../services/api";
import type { AchievementFamilyProgress, User } from "../types";
import { toast } from "sonner";

const tierOrder: ('bronze' | 'silver' | 'gold' | 'platinum')[] = ['bronze', 'silver', 'gold', 'platinum'];

const metalColors = {
  bronze: 'bg-amber-700/10 border-amber-700/40 text-amber-600 dark:text-amber-500',
  silver: 'bg-slate-400/10 border-slate-400/40 text-slate-500 dark:text-slate-300',
  gold: 'bg-yellow-500/10 border-yellow-500/40 text-yellow-600 dark:text-yellow-400',
  platinum: 'bg-teal-400/10 border-teal-400/40 text-teal-600 dark:text-teal-400',
  none: 'bg-muted/30 border-border/50 text-muted-foreground/30'
};

const getEmoji = (familyId: string, tierId: string) => {
  const emojis: Record<string, Record<string, string>> = {
    collaboration: { bronze: '🤝', silver: '👥', gold: '🌐', platinum: '👑' },
    projects_created: { bronze: '🌱', silver: '🌿', gold: '🌲', platinum: '🌴' },
    deployments: { bronze: '🚀', silver: '🛸', gold: '🛰️', platinum: '🌌' },
    ai_usage: { bronze: '🤖', silver: '🧠', gold: '☄️', platinum: '🔮' },
    active_days: { bronze: '📅', silver: '📆', gold: '🗓️', platinum: '⏳' },
    friend_network: { bronze: '🧸', silver: '🤜', gold: '💫', platinum: '🪐' },
    documentation: { bronze: '📝', silver: '📚', gold: '🏛️', platinum: '🏆' }
  };
  return emojis[familyId]?.[tierId] || '🏆';
};

export default function AchievementsPage() {
  const { username } = useParams<{ username?: string }>();
  const navigate = useNavigate();
  const { user: currentUser, checkAuth } = useAuth();

  const [targetUser, setTargetUser] = useState<User | null>(null);
  const [achievements, setAchievements] = useState<AchievementFamilyProgress[]>(() => {
    const cacheKey = `cached_achievements_${username || "me"}`;
    const cached = localStorage.getItem(cacheKey);
    return cached ? JSON.parse(cached) : [];
  });
  const [loading, setLoading] = useState(() => {
    const cacheKey = `cached_achievements_${username || "me"}`;
    return !localStorage.getItem(cacheKey);
  });
  const [selectedFamily, setSelectedFamily] = useState<AchievementFamilyProgress | null>(null);

  const isOwnPage = !username || username === currentUser?.username;

  useEffect(() => {
    async function loadAchievements() {
      if (achievements.length === 0) {
        setLoading(true);
      }
      try {
        let userObj = currentUser;
        if (!isOwnPage && username) {
          userObj = await apiClient.getUserProfile(username);
        }
        setTargetUser(userObj);

        if (userObj?.username) {
          const achData = await apiClient.getUserAchievements(userObj.username);
          setAchievements(achData);
          const cacheKey = `cached_achievements_${username || "me"}`;
          localStorage.setItem(cacheKey, JSON.stringify(achData));
        }
      } catch (err) {
        console.error("Failed to load achievements", err);
      } finally {
        setLoading(false);
      }
    }
    loadAchievements();
  }, [username, currentUser, isOwnPage]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="animate-spin text-primary size-8" />
      </div>
    );
  }

  const pinnedIds = targetUser?.pinned_achievements || [];

  const handleTogglePin = async (achievementId: string) => {
    if (!isOwnPage) return;

    let newPinned = [...pinnedIds];
    if (pinnedIds.includes(achievementId)) {
      newPinned = newPinned.filter((id) => id !== achievementId);
      toast.success("Achievement unpinned from profile");
    } else {
      if (newPinned.length >= 5) {
        toast.error("You can pin a maximum of 5 achievements");
        return;
      }
      newPinned.push(achievementId);
      toast.success("Achievement pinned to profile");
    }

    try {
      await apiClient.pinAchievements(newPinned);
      await checkAuth(); // Refresh local auth user state
      // Update local state for targetUser so UI refreshes immediately
      if (targetUser) {
        setTargetUser({
          ...targetUser,
          pinned_achievements: newPinned
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update pinned achievements");
    }
  };

  return (
    <div className="min-h-full bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-10 bg-background/90 backdrop-blur-sm border-b border-border px-4 md:px-8 h-14 flex items-center justify-between">
        <div>
          <h1
            className="text-base font-semibold text-foreground"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {isOwnPage ? "My Achievements" : `${targetUser?.name || targetUser?.username}'s Achievements`}
          </h1>
        </div>
        <button
          onClick={() => navigate(targetUser?.username ? `/profile/${targetUser.username}` : "/profile")}
          className="text-xs text-primary hover:underline font-medium"
        >
          Back to Profile
        </button>
      </header>

      <div className="max-w-4xl mx-auto px-4 md:px-8 py-6 md:py-8">
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="text-yellow-500 w-6 h-6" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Badges Earned
            </h2>
          </div>
          <p className="text-xs text-muted-foreground mb-6">
            Click on any badge below to view progress details, unlock requirements, and pin achievements to your profile.
          </p>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {achievements.map((family) => {
              const currentTier = family.current_tier;
              const hasCompletedAny = currentTier !== "none";
              const currentEmoji = hasCompletedAny ? getEmoji(family.family_id, currentTier) : null;
              const currentTierObj = hasCompletedAny ? family.tiers[currentTier] : null;

              return (
                <div
                  key={family.family_id}
                  onClick={() => setSelectedFamily(family)}
                  className="flex items-center gap-4 p-4 rounded-xl border border-border/80 bg-muted/10 hover:bg-muted/30 transition-all cursor-pointer group"
                >
                  <div className="relative shrink-0">
                    {hasCompletedAny ? (
                      <div className={`w-14 h-14 flex items-center justify-center rounded-2xl border text-3xl shadow-md ${metalColors[currentTier]} transition-transform group-hover:scale-105`}>
                        {currentEmoji}
                      </div>
                    ) : (
                      <div className="w-14 h-14 flex items-center justify-center rounded-2xl border border-border bg-muted/65 text-muted-foreground/35 shadow-inner">
                        <Lock className="w-6 h-6" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-xs font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                      {family.name}
                    </h3>
                    <p className="text-[10px] text-muted-foreground mt-0.5 truncate">
                      {hasCompletedAny ? currentTierObj?.name : "Locked"}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[10px] font-bold text-primary">
                        Score: {family.progress}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedFamily && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-card border border-border rounded-xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col relative max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-5 border-b border-border flex justify-between items-start">
              <div>
                <h3 className="text-sm font-bold text-foreground">{selectedFamily.name}</h3>
                <p className="text-[10px] text-muted-foreground mt-1">{selectedFamily.description}</p>
              </div>
              <button
                onClick={() => setSelectedFamily(null)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 overflow-y-auto space-y-5">
              {/* Progress Summary */}
              <div className="bg-muted/20 border border-border/60 rounded-xl p-4 flex justify-between items-center">
                <div>
                  <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Current Score</p>
                  <p className="text-xl font-extrabold text-primary mt-1">{selectedFamily.progress}</p>
                </div>
                {(() => {
                  let nextTarget = 0;
                  let prevTarget = 0;
                  let reachedAll = true;

                  for (const tId of tierOrder) {
                    const tier = selectedFamily.tiers[tId];
                    if (!tier.completed) {
                      nextTarget = tier.target;
                      reachedAll = false;
                      break;
                    }
                    prevTarget = tier.target;
                  }

                  const percent = reachedAll 
                    ? 100 
                    : Math.min(100, Math.max(0, ((selectedFamily.progress - prevTarget) / (nextTarget - prevTarget)) * 100));

                  return (
                    <div className="flex-1 max-w-[200px] ml-4">
                      <div className="flex justify-between text-[9px] text-muted-foreground mb-1">
                        <span>{reachedAll ? 'Max Tier' : `Next Req: ${nextTarget}`}</span>
                        <span>{Math.round(percent)}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="bg-primary h-full rounded-full transition-all duration-500" 
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Tiers List */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Progression Tiers</h4>
                <div className="space-y-2">
                  {tierOrder.map((tId) => {
                    const tier = selectedFamily.tiers[tId];
                    const unlocked = tier.completed;
                    const achievementId = `${selectedFamily.family_id}-${tId}`;
                    const isPinned = pinnedIds.includes(achievementId);

                    return (
                      <div
                        key={tId}
                        className={`flex items-center gap-3 p-3 rounded-lg border ${unlocked ? 'border-border bg-muted/10' : 'border-border/40 bg-muted/5 opacity-55'}`}
                      >
                        <div className={`w-10 h-10 shrink-0 flex items-center justify-center rounded-xl border text-xl ${unlocked ? metalColors[tId] : metalColors.none}`}>
                          {unlocked ? getEmoji(selectedFamily.family_id, tId) : <Lock className="w-4 h-4" />}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-xs font-semibold text-foreground truncate">{tier.name}</p>
                            <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider ${
                              tId === 'bronze' ? 'bg-amber-700/10 border-amber-700/20 text-amber-600' :
                              tId === 'silver' ? 'bg-slate-400/10 border-slate-400/20 text-slate-500' :
                              tId === 'gold' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-600' :
                              'bg-teal-400/10 border-teal-400/20 text-teal-600'
                            }`}>
                              {tId}
                            </span>
                          </div>
                          <p className="text-[10px] text-muted-foreground mt-0.5">
                            {unlocked ? "Unlocked!" : `Requires target of ${tier.target}`}
                          </p>
                        </div>

                        {unlocked && isOwnPage && (
                          <button
                            onClick={() => handleTogglePin(achievementId)}
                            className={`p-1.5 rounded-lg border transition-all ${
                              isPinned 
                                ? 'bg-primary/10 border-primary/30 text-primary hover:bg-primary/20' 
                                : 'bg-transparent border-border hover:bg-muted text-muted-foreground hover:text-foreground'
                            }`}
                            title={isPinned ? "Unpin from profile" : "Pin to profile"}
                          >
                            {isPinned ? <PinOff className="w-3.5 h-3.5" /> : <Pin className="w-3.5 h-3.5" />}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
