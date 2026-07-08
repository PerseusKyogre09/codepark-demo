import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
// Import images directly to ensure they are bundled or use absolute paths if they are in public
// Assuming assets are in src/assets/badge/, we can import them.
// Note: Vite/Webpack handles imports.
import ownerBadge from '../../assets/badge/owner.png';
import earlyBadge from '../../assets/badge/early.png';
import type { User } from '../../types';
import { Trophy } from 'lucide-react';

interface AchievementsListProps {
    achievements: User['achievements'];
}

// Map icon string names to imported assets
const ICON_MAP: Record<string, string> = {
    'owner': ownerBadge,
    'early': earlyBadge,
};

const AchievementsList: React.FC<AchievementsListProps> = ({ achievements = [] }) => {
    const { themeColors } = useTheme();

    if (!achievements.length) {
        return (
            <div className="p-6 rounded-2xl border backdrop-blur-xl flex flex-col items-center justify-center text-center space-y-2 opacity-60 w-full"
                style={{ background: `${themeColors.cardBg}88`, borderColor: themeColors.border }}>
                <Trophy className="w-8 h-8 opacity-40 text-primary" />
                <p className="text-sm font-medium">No achievements pinned yet. Unlock and pin them from the Achievements tab!</p>
            </div>
        );
    }

    return (
        <div className="flex flex-wrap gap-4">
            {achievements.map((achievement) => {
                const imageSrc = ICON_MAP[achievement.icon];

                return (
                    <div
                        key={achievement.id}
                        className="relative group cursor-help"
                        title={achievement.description} // basic tooltip
                    >
                        {/* Badge Image / Emoji */}
                        <div className="w-12 h-12 transition-transform hover:scale-110 flex items-center justify-center">
                            {imageSrc ? (
                                <img
                                    src={imageSrc}
                                    alt={achievement.name}
                                    className="w-full h-full object-contain drop-shadow-lg"
                                />
                            ) : (
                                <div 
                                    className="w-full h-full flex items-center justify-center rounded-xl bg-muted/80 border border-border shadow-inner text-2xl"
                                    style={{ textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
                                >
                                    {achievement.icon}
                                </div>
                            )}
                        </div>

                        {/* Custom Tooltip (On Hover) */}
                        <div
                            className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-3 py-2 rounded-lg text-xs font-medium bg-black/90 text-white w-48 text-center opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 border border-white/10 shadow-xl"
                        >
                            <div className="font-bold mb-0.5 text-yellow-400">{achievement.name}</div>
                            <div className="text-white/80">{achievement.description}</div>
                            <div className="mt-1 text-[10px] text-white/40">{new Date(achievement.date).toLocaleDateString()}</div>

                            {/* Arrow */}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black/90"></div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default AchievementsList;

