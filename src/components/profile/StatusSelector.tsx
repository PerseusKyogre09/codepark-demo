import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { X, Check } from 'lucide-react';
import UserModeBadge from './UserModeBadge';
import type { User } from '../../types';

interface StatusSelectorProps {
    currentMode: User['mode'];
    currentStatus?: User['status'];
    onSave: (mode: User['mode'], status: User['status']) => Promise<void>;
    onClose: () => void;
}

const MODES: { id: User['mode']; label: string; description: string }[] = [
    { id: 'online', label: 'Online', description: 'Available for collaboration' },
    { id: 'idle', label: 'Idle', description: 'Away from keyboard' },
    { id: 'dnd', label: 'Do Not Disturb', description: 'Disable notifications' },
    { id: 'coding', label: 'Coding', description: 'Deep in the zone' },
    { id: 'offline', label: 'Invisible', description: 'Appear offline' },
];

const StatusSelector: React.FC<StatusSelectorProps> = ({ currentMode = 'online', currentStatus, onSave, onClose }) => {
    const { themeColors, settings } = useTheme();

    const [selectedMode, setSelectedMode] = useState<User['mode']>(currentMode);
    const [statusText, setStatusText] = useState(currentStatus?.text || '');
    const [statusEmoji, setStatusEmoji] = useState(currentStatus?.emoji || '💬');
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await onSave(selectedMode, statusText ? { text: statusText, emoji: statusEmoji } : undefined);
            onClose();
        } catch (e) {
            console.error("Failed to save status", e);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>

            <div
                className="relative w-full max-w-md rounded-2xl border shadow-2xl overflow-hidden"
                style={{ background: themeColors.cardBg, borderColor: themeColors.border, color: themeColors.text }}
            >
                <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: themeColors.border }}>
                    <h3 className="font-semibold text-lg">Set Status</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-4 space-y-6">
                    {/* Status Message Input */}
                    <div>
                        <label className="block text-xs font-medium uppercase tracking-wider mb-2 opacity-70">Custom Status</label>
                        <div className="flex gap-2">
                            <button
                                className="w-10 h-10 rounded-lg flex items-center justify-center text-xl bg-black/20 hover:bg-black/30 border border-white/10 transition-colors"
                            // Emoji picker trigger would go here
                            >
                                {statusEmoji}
                            </button>
                            <input
                                type="text"
                                value={statusText}
                                onChange={(e) => setStatusText(e.target.value)}
                                placeholder="What's happening?"
                                className="flex-1 px-3 py-2 rounded-lg bg-black/20 border border-white/10 focus:outline-none focus:border-white/30 transition-all"
                                style={{ color: themeColors.text }}
                            />
                            {statusText && (
                                <button
                                    onClick={() => { setStatusText(''); setStatusEmoji('💬'); }}
                                    className="p-2 text-white/40 hover:text-white transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Mode Selection */}
                    <div>
                        <label className="block text-xs font-medium uppercase tracking-wider mb-2 opacity-70">User Mode</label>
                        <div className="space-y-1">
                            {MODES.map((mode) => (
                                <button
                                    key={mode.id}
                                    onClick={() => setSelectedMode(mode.id)}
                                    className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-3 transition-all ${selectedMode === mode.id ? 'bg-white/10' : 'hover:bg-white/5'}`}
                                >
                                    <UserModeBadge mode={mode.id} size="sm" />
                                    <div className="flex-1">
                                        <div className="font-medium text-sm">{mode.label}</div>
                                        <div className="text-xs opacity-50">{mode.description}</div>
                                    </div>
                                    {selectedMode === mode.id && <Check size={16} className="text-green-500" />}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t flex justify-end gap-2" style={{ borderColor: themeColors.border }}>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/5 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-6 py-2 rounded-lg text-sm font-medium text-white transition-all active:scale-95 disabled:opacity-50"
                        style={{ background: settings.accentColor, boxShadow: '0 0 10px rgba(63, 255, 139, 0.3)' }}
                    >
                        {isSaving ? 'Saving...' : 'Save Status'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StatusSelector;
