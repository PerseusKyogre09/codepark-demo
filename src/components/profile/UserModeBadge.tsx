import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface UserModeBadgeProps {
    mode?: 'online' | 'idle' | 'dnd' | 'coding' | 'offline';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const UserModeBadge: React.FC<UserModeBadgeProps> = ({ mode = 'offline', size = 'md', className = '' }) => {
    const { themeColors } = useTheme();

    const getModeColor = () => {
        switch (mode) {
            case 'online': return '#22c55e'; // Green
            case 'idle': return '#f59e0b';   // Amber
            case 'dnd': return '#ef4444';    // Red
            case 'coding': return '#3fff8b'; // Neon Green
            default: return '#71717a';       // Gray
        }
    };

    const getModeIcon = () => {
        if (mode === 'dnd') {
            return (
                <div className="w-full h-1 bg-white rounded-full transform -translate-y-[1px]" style={{ width: '60%' }}></div>
            );
        }
        if (mode === 'idle') {
            return (
                <div className="w-full h-full rounded-full bg-transparent border-2 border-white transform -translate-x-[0.5px] -translate-y-[0.5px] scale-75" style={{ borderColor: themeColors.bg }}></div>
            )
        }
        return null;
    };

    const getSizeClasses = () => {
        switch (size) {
            case 'sm': return 'w-3 h-3';
            case 'lg': return 'w-6 h-6 border-4';
            default: return 'w-4 h-4 border-2';
        }
    };

    return (
        <div
            className={`rounded-full flex items-center justify-center relative ${getSizeClasses()} ${className}`}
            style={{
                backgroundColor: getModeColor(),
                borderColor: themeColors.bg,
            }}
            title={`Status: ${mode.charAt(0).toUpperCase() + mode.slice(1)}`}
        >
            {mode === 'coding' && (
                <span className="text-[8px] font-bold text-white leading-none">&lt;/&gt;</span>
            )}
            {getModeIcon()}
        </div>
    );
};

export default UserModeBadge;
