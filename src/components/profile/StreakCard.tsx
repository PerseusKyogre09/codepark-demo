import { motion } from 'motion/react'
import { Zap } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'

interface StreakCardProps {
    current: number
    max: number
    className?: string
}

export default function StreakCard({ current, max, className = '' }: StreakCardProps) {
    const { themeColors, settings } = useTheme()

    // Intensity calculation for flame animation
    const intensity = Math.min(current / 7, 1); // Cap at 7 days for max intensity visual

    return (
        <div
            className={`relative overflow-hidden rounded-lg border p-6 ${className}`}
            style={{
                background: settings.uiTheme === 'dark' ? 'rgba(20, 20, 25, 0.6)' : 'rgba(243, 244, 246, 0.8)',
                borderColor: themeColors.terminalBorder,
            }}
        >
            <div className="flex items-start justify-between relative z-10">
                <div>
                    <h3 className="text-sm font-semibold flex items-center gap-2 mb-0" style={{ color: themeColors.terminalPrimary, fontFamily: 'Space Mono, monospace' }}>
                        <span style={{ color: themeColors.terminalSecondary }}>&gt;</span>
                        <Zap className="w-4 h-4" style={{ color: themeColors.terminalPrimary }} />
                        <span>activity_streak</span>
                    </h3>
                </div>

                <div className="text-right text-xs" style={{ color: themeColors.terminalSecondary, fontFamily: 'Space Mono, monospace' }}>
                    <div className="opacity-60">best: {max} days</div>
                </div>
            </div>

            <div className="mt-6 flex items-end justify-between">
                {/* Flame Visual */}
                <div className="relative">
                    <img
                        src="/src/assets/animated/streak-fire.gif"
                        alt="Streak Fire"
                        className="w-16 h-16 object-contain drop-shadow-lg"
                        style={{ filter: `drop-shadow(0 0 ${10 + (intensity * 10)}px ${settings.accentColor})` }}
                    />
                </div>

                {/* Current Count */}
                <div className="text-right">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-6xl font-bold leading-none"
                        style={{ color: current > 0 ? themeColors.terminalPrimary : themeColors.terminalSecondary }}
                    >
                        {current}
                    </motion.div>
                    <div className="text-xs font-medium mt-1 uppercase tracking-wider" style={{ color: themeColors.terminalSecondary, fontFamily: 'Space Mono, monospace' }}>
                        current streak
                    </div>
                </div>
            </div>

            {/* Background Gradient */}
            <div
                className="absolute bottom-0 right-0 w-32 h-32 opacity-10 blur-3xl rounded-full pointer-events-none"
                style={{ background: themeColors.terminalPrimary }}
            />
        </div>
    )
}
