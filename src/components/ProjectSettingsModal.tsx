import { useState, useEffect } from 'react';
import { X, Edit2, Users, Trash2, Save, Shield, User, AlertTriangle, ChevronDown, Search, UserCheck, Loader2, Image as ImageIcon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useProjects } from '../hooks/useProjects';
import { Button } from './ui';
import { SubscriptionGate } from './SubscriptionGate';
import apiClient from '../services/api';

import type { Project } from '../types';

interface ProjectSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    project: Project | null;
    onRename: (projectId: string, newName: string) => Promise<void>;
    onDelete: (projectId: string) => Promise<void>;
    onProjectUpdated?: () => void;
}

interface Collaborator {
    user_id: string;
    name: string;
    username?: string;
    role: string;
    is_owner: boolean;
    picture?: string;
}

export default function ProjectSettingsModal({
    isOpen,
    onClose,
    project,
    onRename,
    onDelete,
    onProjectUpdated,
}: ProjectSettingsModalProps) {
    const { themeColors, settings } = useTheme();
    const { user } = useAuth();

    const [activeTab, setActiveTab] = useState<'general' | 'collaborators' | 'transfer' | 'danger' | 'appearance'>('general');
    const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
    const [loadingCollabs, setLoadingCollabs] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    const [projectName, setProjectName] = useState('');
    const [isRenaming, setIsRenaming] = useState(false);
    const [autoScanEnabled, setAutoScanEnabled] = useState(true);

    const [deleteConfirmation, setDeleteConfirmation] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    // Use projects hook to refresh project list after persisting collaborators
    const { listProjects } = useProjects();

    useEffect(() => {
        if (project) {
            setProjectName(project.name || '');
            setBackgroundImage(project.background_image || null);
            setAutoScanEnabled(project.context_base_auto_scan !== false);
        }
    }, [project]);

    // Transfer state
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUser, setSelectedUser] = useState<any | null>(null);
    const [isTransferring, setIsTransferring] = useState(false);
    const [transferConfirmText, setTransferConfirmText] = useState('');

    useEffect(() => {
        if (isOpen && project) {
            setProjectName(project.name);
            setBackgroundImage(project.background_image || null);
            setDeleteConfirmation('');
            fetchCollaborators();
        }
    }, [isOpen, project]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (!(e.target as HTMLElement).closest('.dropdown-container')) {
                setOpenDropdown(null);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    // Local filter for collaborators (excluding owner) based on search query
    const filteredCollaborators = collaborators.filter(c =>
        !c.is_owner &&
        (c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (c.username?.toLowerCase() || '').includes(searchQuery.toLowerCase()))
    );

    const fetchCollaborators = async () => {
        if (!project) return;
        setLoadingCollabs(true);
        try {
            const data = await apiClient.getProjectCollaborators(project.id);
            const mapped = data.map((c: any) => ({
                ...c,
                user_id: c.uid || c.user_id,
                username: c.handle || c.username,
                is_owner: c.role === 'owner',
            }));
            setCollaborators(mapped);
        } catch (error) {
            console.error('Failed to fetch collaborators:', error);
        } finally {
            setLoadingCollabs(false);
        }
    };

    const handleRename = async () => {
        if (!project || !projectName.trim() || projectName === project.name) return;
        setIsRenaming(true);
        try {
            await onRename(project.id, projectName.trim());
        } finally {
            setIsRenaming(false);
        }
    };

    const handleToggleAutoScan = async (checked: boolean) => {
        if (!project) return;
        setAutoScanEnabled(checked);
        try {
            await apiClient.updateProjectSettings(project.id, { context_base_auto_scan: checked });
            if (onProjectUpdated) {
                onProjectUpdated();
            }
        } catch (error) {
            console.error('Failed to update project settings:', error);
            setAutoScanEnabled(!checked);
        }
    };

    const handleDelete = async () => {
        if (!project || deleteConfirmation !== project.name) return;
        setIsDeleting(true);
        try {
            await onDelete(project.id);
            onClose();
        } finally {
            setIsDeleting(false);
        }
    };

    if (!isOpen || !project) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div
                className="relative w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-[600px] max-h-[90vh]"
                style={{ background: themeColors.cardBg, color: themeColors.text }}
            >
                {/* Close button (Mobile) */}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 md:hidden p-2 rounded-full hover:bg-white/10 z-10"
                >
                    <X size={20} />
                </button>

                {/* Sidebar */}
                <div
                    className="w-full md:w-64 p-6 border-b md:border-b-0 md:border-r flex flex-col gap-2"
                    style={{ borderColor: themeColors.border, background: themeColors.bg }}
                >
                    <h2 className="text-xl font-bold mb-4 px-2">Settings</h2>

                    <button
                        onClick={() => setActiveTab('general')}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${activeTab === 'general' ? 'bg-blue-500/10 text-blue-500 font-medium' : 'hover:bg-white/5 opacity-70 hover:opacity-100'
                            }`}
                    >
                        <Edit2 size={18} />
                        General
                    </button>

                    <button
                        onClick={() => setActiveTab('collaborators')}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${activeTab === 'collaborators' ? 'bg-blue-500/10 text-blue-500 font-medium' : 'hover:bg-white/5 opacity-70 hover:opacity-100'
                            }`}
                    >
                        <Users size={18} />
                        Collaborators
                    </button>

                    <button
                        onClick={() => setActiveTab('appearance')}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${activeTab === 'appearance' ? 'bg-pink-500/10 text-pink-500 font-medium' : 'hover:bg-white/5 opacity-70 hover:opacity-100'
                            }`}
                    >
                        <ImageIcon size={18} />
                        Appearance
                    </button>

                    <button
                        onClick={() => setActiveTab('transfer')}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${activeTab === 'transfer' ? 'bg-purple-500/10 text-purple-500 font-medium' : 'hover:bg-white/5 opacity-70 hover:opacity-100'
                            }`}
                    >
                        <Shield size={18} />
                        Transfer
                    </button>

                    <div className="flex-grow" />

                    <button
                        onClick={() => setActiveTab('danger')}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${activeTab === 'danger' ? 'bg-red-500/10 text-red-500 font-medium' : 'hover:bg-red-500/5 text-red-400 opacity-70 hover:opacity-100'
                            }`}
                    >
                        <Trash2 size={18} />
                        Danger Zone
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 p-6 md:p-8 overflow-y-auto" style={{ overscrollBehavior: 'none' }}>
                    {/* Close button (Desktop) */}
                    <button
                        onClick={onClose}
                        className="hidden md:block absolute right-6 top-6 p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>

                    {activeTab === 'general' && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xl font-bold mb-1">Project Name</h3>
                                <p className="text-sm opacity-60 mb-4">Update your project identifier.</p>

                                <div className="flex gap-3 text-sm">
                                    <input
                                        type="text"
                                        value={projectName}
                                        onChange={(e) => setProjectName(e.target.value)}
                                        className="flex-1 px-4 py-2 rounded-lg bg-black/20 border focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                        style={{ borderColor: themeColors.border }}
                                        placeholder="Project Name"
                                    />
                                    <Button
                                        onClick={handleRename}
                                        disabled={isRenaming || !projectName.trim() || projectName === project.name}
                                        variant="primary"
                                        icon={<Save size={18} />}
                                    >
                                        {isRenaming ? 'Saving...' : 'Save'}
                                    </Button>
                                </div>
                            </div>

                            <div className="pt-6 border-t" style={{ borderColor: themeColors.border }}>
                                <h3 className="text-xl font-bold mb-1">ContextBase Auto-Scanning</h3>
                                <p className="text-sm opacity-60 mb-4">Automatically scan and index imports, service boundaries, and symbols for this project.</p>

                                <div className="flex items-center justify-between p-4 rounded-xl border bg-white/5" style={{ borderColor: themeColors.border }}>
                                    <div>
                                        <div className="font-medium text-sm">Enable automatic indexing</div>
                                        <div className="text-xs opacity-60">Allows codebase navigation and neighborhood queries in the editor</div>
                                    </div>
                                    <button
                                        onClick={() => handleToggleAutoScan(!autoScanEnabled)}
                                        className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none"
                                        style={{ backgroundColor: autoScanEnabled ? settings.accentColor : '#3f3f46' }}
                                    >
                                        <span className={`${autoScanEnabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'collaborators' && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xl font-bold mb-1">Collaborators</h3>
                                <p className="text-sm opacity-60 mb-6">Manage who has access to this project.</p>

                                {loadingCollabs ? (
                                    <div className="flex justify-center py-8">
                                        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                                    </div>
                                ) : collaborators.length === 0 ? (
                                    <div className="text-center py-8 opacity-60">No collaborators found.</div>
                                ) : (
                                    <div className="space-y-3">
                                        {collaborators.map((collab) => (
                                            <div
                                                key={collab.user_id}
                                                className="flex items-center justify-between p-3 rounded-xl border bg-white/5"
                                                style={{ borderColor: themeColors.border }}
                                            >
                                                <div className="flex items-center gap-3">
                                                    {collab.picture ? (
                                                        <img src={collab.picture} alt={collab.name} className="w-10 h-10 rounded-full" />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                                                            <User size={20} className="text-blue-400" />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <div className="font-medium flex items-center gap-2">
                                                            {collab.name}
                                                            {collab.is_owner && (
                                                                <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 flex items-center gap-1">
                                                                    <Shield size={10} /> Owner
                                                                </span>
                                                            )}
                                                        </div>
                                                        {!collab.is_owner && (
                                                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm opacity-70">
                                                                <span className="capitalize">{collab.role || 'Viewer'}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Role Dropdown for Owners (with Revoke) */}
                                                {!collab.is_owner && project?.owner_id === user?.uid && (
                                                    <div className="flex items-center gap-2">
                                                        <div className="relative dropdown-container">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setOpenDropdown(openDropdown === collab.user_id ? null : collab.user_id);
                                                                }}
                                                                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm group"
                                                                style={{ color: themeColors.text }}
                                                            >
                                                                <span className="capitalize">{collab.role || 'viewer'}</span>
                                                                <ChevronDown size={14} className={`opacity-50 group-hover:opacity-100 transition-transform ${openDropdown === collab.user_id ? 'rotate-180' : ''}`} />
                                                            </button>

                                                            {openDropdown === collab.user_id && (
                                                                <div
                                                                    className="absolute right-0 mt-2 w-32 rounded-xl border shadow-2xl z-[100] overflow-hidden backdrop-blur-md animate-in fade-in zoom-in duration-200"
                                                                    style={{
                                                                        background: `${themeColors.cardBg}ee`,
                                                                        borderColor: themeColors.border,
                                                                        boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)'
                                                                    }}
                                                                >
                                                                    {(['editor', 'viewer'] as const).map((role) => (
                                                                        <button
                                                                            key={role}
                                                                            onClick={async () => {
                                                                                const result = await apiClient.updateProjectCollaboratorRole(project.id, collab.user_id, role);
                                                                                if (result.success) {
                                                                                    setCollaborators(prev => prev.map(c =>
                                                                                        c.user_id === collab.user_id ? { ...c, role: role } : c
                                                                                    ));
                                                                                } else {
                                                                                    alert(result.error);
                                                                                }
                                                                                setOpenDropdown(null);
                                                                            }}
                                                                            className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm transition-colors hover:bg-white/10 ${(collab.role || 'viewer') === role ? 'text-blue-400 font-medium' : 'opacity-70 hover:opacity-100'
                                                                                }`}
                                                                        >
                                                                            {role === 'editor' ? <Edit2 size={14} /> : <User size={14} />}
                                                                            <span className="capitalize">{role}</span>
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Revoke Button */}
                                                        <button
                                                            onClick={async () => {
                                                                if (!confirm(`Remove ${collab.name} from collaborators? This will revoke their access.`)) return;
                                                                try {
                                                                    const ok = await apiClient.deleteProjectCollaborator(project.id, collab.user_id);
                                                                    if (ok) {
                                                                        setCollaborators(prev => prev.filter(c => c.user_id !== collab.user_id));
                                                                        try { listProjects(); } catch (e) { /* ignore */ }
                                                                    } else {
                                                                        console.error('Failed to remove collaborator');
                                                                    }
                                                                } catch (err) {
                                                                    console.error('Error removing collaborator', err);
                                                                }
                                                            }}
                                                            className="px-3 py-1.5 rounded-lg bg-red-600/10 hover:bg-red-600/20 text-sm text-red-400 transition-colors"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}

                            </div>
                        </div>
                    )}


                    {activeTab === 'appearance' && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xl font-bold mb-1">Appearance</h3>
                                <p className="text-sm opacity-60 mb-6">Customize how your project looks on the dashboard.</p>

                                <div className="space-y-4">
                                    <h4 className="font-medium">Project Background</h4>

                                    <SubscriptionGate
                                        fallback={
                                            <div className="p-6 rounded-xl border border-dashed text-center opacity-60" style={{ borderColor: themeColors.border }}>
                                                <div className="flex justify-center mb-2">
                                                    <div className="p-3 rounded-full bg-white/5">
                                                        <ImageIcon size={24} />
                                                    </div>
                                                </div>
                                                <h5 className="font-medium mb-1">Custom Backgrounds</h5>
                                                <p className="text-sm">Upgrade to Pro to upload custom project covers.</p>
                                            </div>
                                        }
                                    >
                                        <div className="space-y-4">
                                            {/* Preview */}
                                            <div
                                                className="relative w-full h-40 rounded-xl overflow-hidden border bg-black/20"
                                                style={{ borderColor: themeColors.border }}
                                            >
                                                {backgroundImage ? (
                                                    <img
                                                        src={backgroundImage}
                                                        alt="Project Background"
                                                        className="w-full h-full object-cover opacity-60"
                                                    />
                                                ) : (
                                                    <div className="absolute inset-0 flex items-center justify-center opacity-40">
                                                        <span className="text-sm">No background set</span>
                                                    </div>
                                                )}

                                                {/* Overlay Text Preview */}
                                                <div className="absolute bottom-4 left-4 font-bold text-xl drop-shadow-md">
                                                    {project.name}
                                                </div>
                                            </div>

                                            {/* Upload Control */}
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="file"
                                                    id="bg-upload"
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={async (e) => {
                                                        const file = e.target.files?.[0];
                                                        if (!file) return;

                                                        setUploadingImage(true);
                                                        try {
                                                            const res = await apiClient.uploadProjectBackground(project.id, file);
                                                            if (res.success) {
                                                                setBackgroundImage(res.image_url || null);
                                                                // Trigger parent refresh
                                                                if (onProjectUpdated) {
                                                                    onProjectUpdated();
                                                                }
                                                                // Also refresh local list if needed, though parent update should propagate down
                                                                await listProjects();
                                                            }
                                                        } catch (err) {
                                                            console.error('Upload failed', err);
                                                            alert('Failed to upload image');
                                                        } finally {
                                                            setUploadingImage(false);
                                                        }
                                                    }}
                                                />
                                                <Button
                                                    onClick={() => document.getElementById('bg-upload')?.click()}
                                                    variant="primary"
                                                    disabled={uploadingImage}
                                                    icon={uploadingImage ? <Loader2 className="animate-spin" size={18} /> : <ImageIcon size={18} />}
                                                >
                                                    {uploadingImage ? 'Uploading...' : 'Upload Image'}
                                                </Button>

                                                {backgroundImage && (
                                                    <button
                                                        onClick={() => setBackgroundImage(null)}
                                                        className="text-sm text-red-400 hover:text-red-300 px-3 py-2"
                                                    >
                                                        Remove
                                                    </button>
                                                )}
                                            </div>
                                            <p className="text-xs opacity-50">
                                                Recommended: 1200x600px or larger. JPG, PNG, WEBP.
                                            </p>
                                        </div>
                                    </SubscriptionGate>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'transfer' && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xl font-bold mb-1">Transfer Ownership</h3>
                                <p className="text-sm opacity-60 mb-6">Type a username to find the new owner.</p>

                                {!selectedUser ? (
                                    <div className="space-y-4">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
                                            <input
                                                type="text"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                placeholder="Search by username..."
                                                className="w-full pl-10 pr-4 py-2 bg-white/5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                                style={{ borderColor: themeColors.border }}
                                            />
                                        </div>

                                        {searchQuery.trim().length > 0 && filteredCollaborators.length > 0 && (
                                            <div
                                                className="rounded-xl border border-white/10 overflow-hidden divide-y divide-white/10 animate-in fade-in slide-in-from-top-2 duration-200"
                                                style={{ background: `${themeColors.bg}80` }}
                                            >
                                                {filteredCollaborators.map((result) => (
                                                    <button
                                                        key={result.user_id}
                                                        onClick={() => setSelectedUser(result)}
                                                        className="w-full flex items-center justify-between p-3 hover:bg-white/5 transition-colors group"
                                                    >
                                                        <div className="flex items-center gap-3 text-left">
                                                            <img
                                                                src={result.picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${result.user_id}`}
                                                                className="w-8 h-8 rounded-full border border-white/10"
                                                                alt={result.name}
                                                            />
                                                            <div>
                                                                <p className="text-sm font-medium">{result.name}</p>
                                                                <p className="text-xs opacity-50">@{result.username || 'unknown'}</p>
                                                            </div>
                                                        </div>
                                                        <UserCheck size={16} className="opacity-0 group-hover:opacity-60 transition-opacity" />
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                        {searchQuery.trim().length > 0 && filteredCollaborators.length === 0 && (
                                            <p className="text-center py-4 text-sm opacity-50">No collaborators found matching "{searchQuery}".</p>
                                        )}
                                        {searchQuery.trim().length === 0 && (
                                            <div className="space-y-2">
                                                <p className="text-xs font-bold uppercase tracking-widest opacity-30 mt-2">All Collaborators</p>
                                                <div
                                                    className="rounded-xl border border-white/10 overflow-hidden divide-y divide-white/10"
                                                    style={{ background: `${themeColors.bg}80` }}
                                                >
                                                    {collaborators.filter(c => !c.is_owner).map((result) => (
                                                        <button
                                                            key={result.user_id}
                                                            onClick={() => setSelectedUser(result)}
                                                            className="w-full flex items-center justify-between p-3 hover:bg-white/5 transition-colors group"
                                                        >
                                                            <div className="flex items-center gap-3 text-left">
                                                                <img
                                                                    src={result.picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${result.user_id}`}
                                                                    className="w-8 h-8 rounded-full border border-white/10"
                                                                    alt={result.name}
                                                                />
                                                                <div>
                                                                    <p className="text-sm font-medium">{result.name}</p>
                                                                    <p className="text-xs opacity-50">@{result.username || 'unknown'}</p>
                                                                </div>
                                                            </div>
                                                            <UserCheck size={16} className="opacity-0 group-hover:opacity-60 transition-opacity" />
                                                        </button>
                                                    ))}
                                                    {collaborators.filter(c => !c.is_owner).length === 0 && (
                                                        <p className="text-center py-4 text-sm opacity-50">No other collaborators to transfer to.</p>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        <div
                                            className="flex items-center justify-between p-4 rounded-xl border animate-in zoom-in-95 duration-200"
                                            style={{ background: `${themeColors.bg}80`, borderColor: themeColors.border }}
                                        >
                                            <div className="flex items-center gap-4">
                                                <img
                                                    src={selectedUser.picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedUser.user_id || selectedUser.uid}`}
                                                    className="w-12 h-12 rounded-full border-2 border-purple-500/20 shadow-lg shadow-purple-500/10"
                                                    alt={selectedUser.name}
                                                />
                                                <div>
                                                    <p className="font-bold text-lg">{selectedUser.name}</p>
                                                    <p className="text-sm opacity-60">@{selectedUser.username}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setSelectedUser(null)}
                                                className="text-sm text-blue-400 hover:underline px-2 py-1"
                                            >
                                                Change
                                            </button>
                                        </div>

                                        <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
                                            <div className="flex items-start gap-3">
                                                <AlertTriangle className="text-purple-400 shrink-0 mt-0.5" />
                                                <div>
                                                    <h4 className="font-bold text-purple-400 mb-1">Confirm Transfer</h4>
                                                    <p className="text-sm text-purple-300/80 mb-3">
                                                        You are about to transfer ownership of <span className="font-bold">{project.name}</span> to <span className="font-bold">@{selectedUser.username}</span>.
                                                        You will remain an editor, but you will no longer be the owner.
                                                    </p>
                                                    <p className="text-xs text-purple-400/60 uppercase tracking-widest font-bold mb-2">Verification Required</p>
                                                    <div className="flex gap-2">
                                                        <input
                                                            type="text"
                                                            value={transferConfirmText}
                                                            onChange={(e) => setTransferConfirmText(e.target.value)}
                                                            placeholder={`Type "${project.name}" to confirm`}
                                                            className="flex-1 px-3 py-1.5 rounded-lg bg-black/40 border border-purple-500/30 focus:outline-none focus:ring-1 focus:ring-purple-500/50 text-sm"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <Button
                                            onClick={async () => {
                                                if (transferConfirmText !== project.name) return;
                                                setIsTransferring(true);
                                                try {
                                                    const res = await apiClient.transferProject(project.id, selectedUser.user_id);
                                                    if (res.success) {
                                                        onClose();
                                                        // Force a reload or update local state as needed
                                                        window.location.reload();
                                                    }
                                                } catch (error) {
                                                    console.error('Transfer failed:', error);
                                                } finally {
                                                    setIsTransferring(false);
                                                }
                                            }}
                                            variant="primary"
                                            className="w-full bg-purple-600 hover:bg-purple-700 text-white border-none py-3 shadow-lg shadow-purple-500/20"
                                            disabled={isTransferring || transferConfirmText !== project.name}
                                            icon={isTransferring ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield size={18} />}
                                        >
                                            {isTransferring ? 'Transferring...' : 'Transfer Project'}
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'danger' && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xl font-bold text-red-500 mb-1">Delete Project</h3>
                                <p className="text-sm opacity-60 mb-6">Permanently remove this project and all its data.</p>

                                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 mb-6">
                                    <div className="flex items-start gap-3">
                                        <AlertTriangle className="text-red-400 shrink-0 mt-0.5" />
                                        <div>
                                            <h4 className="font-bold text-red-400 mb-1">Warning</h4>
                                            <p className="text-sm text-red-300/80">
                                                This action is irreversible. Please verify by typing the project name below.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-sm font-medium opacity-70">
                                        Type <span className="font-bold select-all">{project.name}</span> to confirm:
                                    </label>
                                    <input
                                        type="text"
                                        value={deleteConfirmation}
                                        onChange={(e) => setDeleteConfirmation(e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg bg-black/20 border border-red-500/30 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                                        placeholder={project.name}
                                    />
                                    <Button
                                        onClick={handleDelete}
                                        disabled={isDeleting || deleteConfirmation !== project.name}
                                        className="w-full bg-red-600 hover:bg-red-700 text-white border-none"
                                    >
                                        {isDeleting ? 'Deleting...' : 'Delete Project'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
