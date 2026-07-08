import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useTheme } from '../../../contexts/ThemeContext';
import DisplaySettings from '../DisplaySettings';
import { type User } from '../../../types';
import { showErrorToast, showSuccessToast } from '../../../utils/errorHandling';
import { apiClient } from '../../../services/api';
import { Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SettingsSectionProfileProps {
    viewedUser: User | null;
    setViewedUser: React.Dispatch<React.SetStateAction<User | null>>;
    onUpdateDisplaySettings: (layout: string[], hiddenCards: string[]) => void;
}

export default function SettingsSectionProfile({ viewedUser, setViewedUser, onUpdateDisplaySettings }: SettingsSectionProfileProps) {
    const { user: currentUser, checkAuth } = useAuth();
    const { settings, themeColors } = useTheme();
    const navigate = useNavigate();
    const [editingDisplayName, setEditingDisplayName] = useState(false);
    const [newDisplayName, setNewDisplayName] = useState(currentUser?.name || '');
    const [updating, setUpdating] = useState(false);

    const [editingUsername, setEditingUsername] = useState(false);
    const [newUsername, setNewUsername] = useState(currentUser?.username || '');
    const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken' | 'error'>('idle');
    const [usernameMessage, setUsernameMessage] = useState('');
    const [savingUsername, setSavingUsername] = useState(false);

    const handleSaveDisplayName = async () => {
        if (!newDisplayName.trim()) {
            showErrorToast('Display name cannot be empty', 'Error');
            return;
        }

        setUpdating(true);
        try {
            await apiClient.updateDisplayName(newDisplayName.trim());
            showSuccessToast('Display name updated!');
            setEditingDisplayName(false);
            if (viewedUser) {
                setViewedUser({
                    ...viewedUser,
                    name: newDisplayName.trim()
                });
            }
            await checkAuth();
        } catch (error) {
            showErrorToast(error, 'Failed to update display name');
        } finally {
            setUpdating(false);
        }
    };

    const handleUsernameCheck = async (value: string) => {
        const cleaned = value.toLowerCase().replace(/[^a-z0-9_-]/g, '');
        setNewUsername(cleaned);
        
        if (cleaned.length < 3) {
            setUsernameStatus('idle');
            setUsernameMessage('Username must be at least 3 characters');
            return;
        }
        
        if (cleaned === currentUser?.username) {
            setUsernameStatus('available');
            setUsernameMessage('Your current username');
            return;
        }

        setUsernameStatus('checking');
        try {
            const isAvailable = await apiClient.checkUsernameAvailability(cleaned);
            if (isAvailable) {
                setUsernameStatus('available');
                setUsernameMessage('Username is available');
            } else {
                setUsernameStatus('taken');
                setUsernameMessage('Username is already taken');
            }
        } catch {
            setUsernameStatus('error');
            setUsernameMessage('Error checking availability');
        }
    };

    const handleSaveUsername = async () => {
        if (usernameStatus !== 'available') return;
        if (newUsername === currentUser?.username) {
            setEditingUsername(false);
            return;
        }

        setSavingUsername(true);
        try {
            await apiClient.setUsername(newUsername);
            showSuccessToast('Username updated successfully!');
            setEditingUsername(false);
            
            if (viewedUser) {
                setViewedUser({
                    ...viewedUser,
                    username: newUsername,
                    handle: newUsername
                });
            }
            await checkAuth();
            navigate(`/profile/${newUsername}`);
        } catch (error) {
            showErrorToast(error, 'Failed to set username');
        } finally {
            setSavingUsername(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-semibold mb-1" style={{ color: '#3fff8b', fontFamily: 'Space Mono, monospace' }}>
                    <span style={{ color: '#acaab1' }}>&gt;</span> Public profile
                </h2>
                <p className="text-sm pb-4 border-b" style={{ color: '#acaab1', fontFamily: 'Space Mono, monospace', borderColor: 'rgba(63, 255, 139, 0.1)' }}>
                    manage how others see you on codepark.
                </p>
            </div>

            {/* Name */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <p className="text-xs opacity-60">Your name may appear around CodePark where you contribute or are mentioned.</p>
                </div>
                <div className="md:col-span-2">
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={editingDisplayName ? newDisplayName : (currentUser?.name || '')}
                            onChange={(e) => setNewDisplayName(e.target.value)}
                            disabled={!editingDisplayName}
                            className={`w-full max-w-md px-3 py-2 rounded-lg border transition-all ${editingDisplayName ? 'bg-black/10 focus:ring-2' : 'bg-transparent border-transparent px-0'}`}
                            style={{
                                borderColor: editingDisplayName ? themeColors.border : 'transparent',
                                color: themeColors.text,
                                ['--tw-ring-color' as any]: settings.accentColor
                            }}
                        />
                        {editingDisplayName ? (
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={handleSaveDisplayName}
                                    disabled={updating}
                                    className="p-2 rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500/20 transition-colors"
                                >
                                    <Check size={16} />
                                </button>
                                <button
                                    onClick={() => {
                                        setEditingDisplayName(false);
                                        setNewDisplayName(currentUser?.name || '');
                                    }}
                                    className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => {
                                    setEditingDisplayName(true);
                                    setNewDisplayName(currentUser?.name || '');
                                }}
                                className="p-2 rounded-lg hover:bg-white/5 text-sm font-medium border border-white/10 transition-colors"
                            >
                                Edit
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="border-t opacity-10" />

            {/* Username */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                    <label className="block text-sm font-medium mb-1">Username</label>
                    <p className="text-xs opacity-60">Your unique handle on CodePark.</p>
                </div>
                <div className="md:col-span-2">
                    <div className="flex flex-col gap-2 w-full max-w-md">
                        <div className="flex items-center gap-2 w-full">
                            {editingUsername ? (
                                <div className="relative flex-1">
                                    <input
                                        type="text"
                                        value={newUsername}
                                        onChange={(e) => handleUsernameCheck(e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border bg-black/10 focus:outline-none focus:ring-2 transition-all text-sm"
                                        style={{
                                            borderColor: usernameStatus === 'error' || usernameStatus === 'taken' ? '#ff6b6b' : themeColors.border,
                                            color: themeColors.text,
                                            ['--tw-ring-color' as any]: settings.accentColor
                                        }}
                                        placeholder="new-username"
                                        autoFocus
                                    />
                                    <div className="absolute right-3 top-2.5">
                                        {usernameStatus === 'checking' && <div className="animate-spin h-4 w-4 border-2 border-current rounded-full border-t-transparent" />}
                                        {usernameStatus === 'available' && <Check className="h-4 w-4 text-green-500" />}
                                        {usernameStatus === 'taken' && <X className="h-4 w-4 text-red-500" />}
                                    </div>
                                </div>
                            ) : (
                                <div className="px-3 py-2 rounded-lg border bg-black/5 flex-1 text-sm font-mono" style={{ borderColor: themeColors.border }}>
                                    <span className="opacity-80">@{currentUser?.username || currentUser?.handle}</span>
                                </div>
                            )}

                            {editingUsername ? (
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={handleSaveUsername}
                                        disabled={usernameStatus !== 'available' || savingUsername}
                                        className="p-2 rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500/20 transition-colors disabled:opacity-50"
                                    >
                                        <Check size={16} />
                                    </button>
                                    <button
                                        onClick={() => {
                                            setEditingUsername(false);
                                            setNewUsername(currentUser?.username || '');
                                            setUsernameStatus('idle');
                                            setUsernameMessage('');
                                        }}
                                        className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => {
                                        setEditingUsername(true);
                                        setNewUsername(currentUser?.username || '');
                                        setUsernameStatus('idle');
                                        setUsernameMessage('');
                                    }}
                                    className="p-2 rounded-lg hover:bg-white/5 text-sm font-medium border border-white/10 transition-colors"
                                >
                                    Edit
                                </button>
                            )}
                        </div>
                        {editingUsername && usernameMessage && (
                            <p className={`text-xs mt-1 font-mono ${
                                usernameStatus === 'available' ? 'text-green-500' : 
                                usernameStatus === 'taken' ? 'text-red-500' : 'text-zinc-500'
                            }`}>
                                {usernameMessage}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <div className="border-t opacity-10" />

            {/* Profile Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                    <label className="block text-sm font-medium mb-1">Profile Layout</label>
                    <p className="text-xs opacity-60">
                        Customize widgets on your profile. Drag to reorder, toggle to hide.
                    </p>
                </div>
                <div className="md:col-span-2">
                    <DisplaySettings
                        layout={viewedUser?.profile_layout || ['streak', 'activity', 'achievements']}
                        hiddenCards={viewedUser?.hidden_cards || []}
                        onUpdate={onUpdateDisplaySettings}
                    />
                </div>
            </div>
        </div>
    );
}
