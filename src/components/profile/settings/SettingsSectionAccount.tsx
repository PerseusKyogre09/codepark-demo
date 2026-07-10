import { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useTheme } from '../../../contexts/ThemeContext';
import { apiClient } from '../../../services/api';
import { showErrorToast, showSuccessToast } from '../../../utils/errorHandling';
import { useNavigate } from 'react-router-dom';
import {
    Check,
    Lock,
    Eye,
    EyeOff,
    AlertTriangle,
    X,
    Crown,
    Trash2,
    LogOut
} from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';

export default function SettingsSectionAccount() {
    const {
        logout,
        linkAccount,
        unlinkAccount,
        updatePassword,
        reauthenticate,
        reauthenticatePopup,
        isGithubLinked,
        isGoogleLinked,
        user
    } = useAuth();
    const { themeColors, settings } = useTheme();
    const navigate = useNavigate();
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
    const [unlinkConfirmation, setUnlinkConfirmation] = useState<{ open: boolean, provider: 'google' | 'github' }>({ open: false, provider: 'github' });
    const [deleting, setDeleting] = useState(false);
    const [unlinking, setUnlinking] = useState(false);

    // Password state
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [updatingPassword, setUpdatingPassword] = useState(false);

    // Verification state
    const [isVerified, setIsVerified] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [verifying, setVerifying] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);

    const hasPassword = user?.providerData?.some(p => p.providerId === 'password');

    const handleLinkAccount = async (provider: 'google' | 'github') => {
        try {
            await linkAccount(provider);
        } catch (error) {
            console.error('Linking failed:', error);
        }
    };

    const handleUnlinkAccount = async () => {
        setUnlinking(true);
        try {
            await unlinkAccount(unlinkConfirmation.provider);
            setUnlinkConfirmation({ open: false, provider: 'github' });
        } catch (error) {
            console.error('Unlinking failed:', error);
        } finally {
            setUnlinking(false);
        }
    };

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            showErrorToast(new Error('Passwords do not match'), 'Validation');
            return;
        }

        if (newPassword.length < 6) {
            showErrorToast(new Error('Password must be at least 6 characters'), 'Validation');
            return;
        }

        setUpdatingPassword(true);
        try {
            await updatePassword(newPassword);
            setNewPassword('');
            setConfirmPassword('');
            setIsVerified(false); // Reset verification after successful change
        } catch (error) {
            console.error('Password update failed:', error);
        } finally {
            setUpdatingPassword(false);
        }
    };

    const handleVerifyPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setVerifying(true);
        try {
            await reauthenticate(currentPassword);
            setIsVerified(true);
            setCurrentPassword('');
        } catch (error) {
            console.error('Verification failed:', error);
        } finally {
            setVerifying(false);
        }
    };

    const handleVerifySocial = async (provider: 'google' | 'github') => {
        setVerifying(true);
        try {
            await reauthenticatePopup(provider);
            setIsVerified(true);
        } catch (error) {
            console.error('Social verification failed:', error);
        } finally {
            setVerifying(false);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const handleDeleteAccount = async () => {
        setDeleting(true);
        try {
            await apiClient.deleteAccount();
            await logout();
            navigate('/');
            showSuccessToast('Account deleted successfully');
        } catch (error) {
            showErrorToast(error, 'Failed to delete account');
            setDeleteConfirmationOpen(false);
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-semibold mb-1" style={{ color: '#3fff8b', fontFamily: 'Space Mono, monospace' }}>
                    <span style={{ color: '#acaab1' }}>&gt;</span> Account
                </h2>
                <p className="text-sm pb-4 border-b" style={{ borderColor: 'rgba(63, 255, 139, 0.1)', color: '#acaab1', fontFamily: 'Space Mono, monospace' }}>
                    manage your account settings and integrations.
                </p>
            </div>

            {/* Connectors */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                    <label className="block text-sm font-medium mb-1">Connectors</label>
                    <p className="text-xs opacity-60">Connect external accounts for easier sign-in and integration.</p>
                </div>
                <div className="md:col-span-2 space-y-3">
                    {/* GitHub */}
                    <div className="flex items-center justify-between p-4 rounded border" style={{ borderColor: 'rgba(63, 255, 139, 0.3)', backgroundColor: 'rgba(63, 255, 139, 0.08)' }}>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                <FontAwesomeIcon icon={faGithub} className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="font-medium">GitHub</div>
                                <div className="text-xs opacity-60">Source code integration</div>
                            </div>
                        </div>
                        {isGithubLinked ? (
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-medium border border-green-500/20">
                                    <Check className="w-3 h-3" /> Connected
                                </div>
                                <button
                                    onClick={() => setUnlinkConfirmation({ open: true, provider: 'github' })}
                                    className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-red-400 transition-colors"
                                    title="Disconnect GitHub"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => handleLinkAccount('github')}
                                className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-medium transition-colors border border-white/5"
                            >
                                Connect
                            </button>
                        )}
                    </div>

                    {/* Google */}
                    <div className="flex items-center justify-between p-4 rounded border" style={{ borderColor: 'rgba(63, 255, 139, 0.3)', backgroundColor: 'rgba(63, 255, 139, 0.08)' }}>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                <FontAwesomeIcon icon={faGoogle} className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="font-medium">Google</div>
                                <div className="text-xs opacity-60">Sign-in provider</div>
                            </div>
                        </div>
                        {isGoogleLinked ? (
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-medium border border-green-500/20">
                                    <Check className="w-3 h-3" /> Connected
                                </div>
                                <button
                                    onClick={() => setUnlinkConfirmation({ open: true, provider: 'google' })}
                                    className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-red-400 transition-colors"
                                    title="Disconnect Google"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => handleLinkAccount('google')}
                                className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-medium transition-colors border border-white/5"
                            >
                                Connect
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="border-t opacity-10" />

            {/* Subscription */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                    <label className="block text-sm font-medium mb-1">Subscription</label>
                    <p className="text-xs opacity-60">Manage your plan and billing.</p>
                </div>
                <div className="md:col-span-2">
                    <div className="flex items-center justify-between p-4 rounded border" style={{ borderColor: 'rgba(63, 255, 139, 0.3)', backgroundColor: 'rgba(63, 255, 139, 0.08)' }}>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <Crown className="w-5 h-5 text-primary" style={{ color: settings.accentColor }} />
                            </div>
                            <div>
                                <div className="font-medium flex items-center gap-2">
                                    Current Plan:
                                    {user?.subscription === 'pro' ? (
                                        <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg tracking-wider border border-white/10 ml-2" style={{ boxShadow: '0 0 10px rgba(63, 255, 139, 0.3)' }}>
                                            PRO
                                        </span>
                                    ) : (
                                        <span className="text-primary ml-2" style={{ color: settings.accentColor }}>Free</span>
                                    )}
                                </div>
                                <div className="text-xs opacity-60">Unlimited projects, 10 collaborators</div>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate('/pro')}
                            className="px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-sm font-medium transition-all"
                            style={{ color: settings.accentColor, backgroundColor: `${settings.accentColor}11` }}
                        >
                            Manage
                        </button>
                    </div>
                </div>
            </div>

            <div className="border-t opacity-10" />

            {/* Security */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                    <label className="block text-sm font-medium mb-1">Security</label>
                    <p className="text-xs opacity-60">
                        {hasPassword
                            ? "Change your account password."
                            : "Set a password to enable email sign-in alongside social login."}
                    </p>
                </div>
                <div className="md:col-span-2">
                    {!isVerified ? (
                        <div className="space-y-4 max-w-sm">
                            <div className="p-4 rounded border mb-4" style={{ borderColor: 'rgba(63, 255, 139, 0.2)', backgroundColor: 'rgba(63, 255, 139, 0.05)' }}>
                                <p className="text-sm font-medium mb-1" style={{ fontFamily: 'Space Mono, monospace', color: '#3fff8b' }}>&gt; Verify Identity</p>
                                <p className="text-xs" style={{ color: '#acaab1', fontFamily: 'Space Mono, monospace' }}>to set or change your password, please verify it's you first.</p>
                            </div>

                            {hasPassword ? (
                                <form onSubmit={handleVerifyPassword} className="space-y-3">
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
                                        <input
                                            type={showCurrentPassword ? "text" : "password"}
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            placeholder="Current Password"
                                            className="w-full pl-10 pr-10 py-2.5 rounded-xl border bg-black/5 dark:bg-black/20 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                            style={{ borderColor: themeColors.border }}
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-md transition-colors"
                                        >
                                            {showCurrentPassword ? <EyeOff className="w-4 h-4 opacity-40" /> : <Eye className="w-4 h-4 opacity-40" />}
                                        </button>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={verifying || !currentPassword}
                                        className="w-full px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-sm transition-all disabled:opacity-50"
                                    >
                                        {verifying ? 'Verifying...' : 'Verify with Password'}
                                    </button>
                                </form>
                            ) : (
                                <div className="space-y-2">
                                    {isGoogleLinked && (
                                        <button
                                            onClick={() => handleVerifySocial('google')}
                                            disabled={verifying}
                                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-medium text-sm transition-all disabled:opacity-50"
                                        >
                                            <FontAwesomeIcon icon={faGoogle} className="w-4 h-4" /> {verifying ? 'Verifying...' : 'Verify with Google'}
                                        </button>
                                    )}
                                    {isGithubLinked && (
                                        <button
                                            onClick={() => handleVerifySocial('github')}
                                            disabled={verifying}
                                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-medium text-sm transition-all disabled:opacity-50"
                                        >
                                            <FontAwesomeIcon icon={faGithub} className="w-4 h-4" /> {verifying ? 'Verifying...' : 'Verify with GitHub'}
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    ) : (
                        <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-sm animate-in slide-in-from-bottom-2 duration-300">
                            <div className="flex items-center gap-2 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 text-xs mb-4">
                                <Check className="w-4 h-4" /> Identity Verified. You can now update your password.
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium opacity-50 uppercase tracking-wider">
                                    {hasPassword ? "New Password" : "Set Password"}
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full pl-10 pr-10 py-2.5 rounded-xl border bg-black/5 dark:bg-black/20 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        style={{ borderColor: themeColors.border }}
                                        autoFocus
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-md transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4 opacity-40" /> : <Eye className="w-4 h-4 opacity-40" />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-medium opacity-50 uppercase tracking-wider">Confirm Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full pl-10 pr-10 py-2.5 rounded-xl border bg-black/5 dark:bg-black/20 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        style={{ borderColor: themeColors.border }}
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    disabled={updatingPassword || !newPassword || newPassword !== confirmPassword}
                                    className="px-6 py-2.5 rounded-xl bg-white text-black dark:bg-zinc-100 dark:hover:bg-white font-medium text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-white/5"
                                >
                                    {updatingPassword ? 'Saving...' : hasPassword ? 'Update Password' : 'Set Password'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsVerified(false)}
                                    className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium text-sm transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>

            <div className="border-t opacity-10" />

            <div className="border-t opacity-10" />

            {/* Danger Zone */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                    <label className="block text-sm font-medium mb-1" style={{ color: '#ff6b6b' }}>Danger Zone</label>
                    <p className="text-xs" style={{ color: '#acaab1' }}>irreversible and destructive actions.</p>
                </div>
                <div className="md:col-span-2 space-y-3">
                    {/* Sign Out */}
                    <div className="rounded border p-4 flex items-center justify-between" style={{ borderColor: 'rgba(255, 107, 107, 0.3)', backgroundColor: 'rgba(255, 107, 107, 0.08)' }}>
                        <div>
                            <div className="font-medium flex items-center gap-2" style={{ color: '#ff6b6b' }}><LogOut className="w-4 h-4" /> Sign Out</div>
                            <p className="text-xs" style={{ color: '#acaab1' }}>sign out of your active session.</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="p-2 rounded transition-colors"
                            style={{ color: '#ff6b6b', backgroundColor: 'rgba(255, 107, 107, 0.1)' }}
                            title="Sign Out"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                    {/* Delete Account */}
                    <div className="rounded border p-4 flex items-center justify-between" style={{ borderColor: 'rgba(255, 107, 107, 0.3)', backgroundColor: 'rgba(255, 107, 107, 0.08)' }}>
                        <div>
                            <div className="font-medium flex items-center gap-2" style={{ color: '#ff6b6b' }}><Trash2 className="w-4 h-4" /> Delete Account</div>
                            <p className="text-xs" style={{ color: '#acaab1' }}>permanently delete your account and data.</p>
                        </div>
                        <button
                            onClick={() => setDeleteConfirmationOpen(true)}
                            className="p-2 rounded transition-colors"
                            style={{ color: '#ff6b6b', backgroundColor: 'rgba(255, 107, 107, 0.1)' }}
                            title="Delete Account"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            {deleteConfirmationOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteConfirmationOpen(false)} />
                    <div className="relative z-10 w-full max-w-md bg-zinc-900 border border-white/10 rounded-2xl p-6 shadow-xl animate-in zoom-in-95 duration-200">
                        <h3 className="text-xl font-bold text-white mb-2">Delete Account?</h3>
                        <p className="text-white/60 text-sm mb-6">
                            This action cannot be undone. All your data, including projects and profile information, will be permanently deleted.
                        </p>
                        <div className="flex items-center justify-end gap-3">
                            <button
                                onClick={() => setDeleteConfirmationOpen(false)}
                                className="px-4 py-2 text-sm font-medium text-white/50 hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteAccount}
                                disabled={deleting}
                                className="px-4 py-2 text-sm font-medium bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors shadow-lg shadow-red-500/20"
                            >
                                {deleting ? 'Deleting...' : 'Delete Account'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Unlink Confirmation Dialog */}
            {unlinkConfirmation.open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setUnlinkConfirmation({ ...unlinkConfirmation, open: false })} />
                    <div className="relative z-10 w-full max-w-md bg-zinc-900 border border-white/10 rounded-2xl p-6 shadow-xl animate-in zoom-in-95 duration-200">
                        <div className="flex items-center gap-3 mb-4 text-amber-500">
                            <AlertTriangle className="w-6 h-6" />
                            <h3 className="text-xl font-bold text-white">Disconnect {unlinkConfirmation.provider === 'github' ? 'GitHub' : 'Google'}?</h3>
                        </div>

                        <div className="space-y-4 mb-6">
                            <p className="text-white/60 text-sm">
                                Are you sure you want to disconnect your {unlinkConfirmation.provider === 'github' ? 'GitHub' : 'Google'} account?
                            </p>

                            {unlinkConfirmation.provider === 'github' && (
                                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs leading-relaxed">
                                    <span className="font-bold text-amber-500 uppercase block mb-1">Important</span>
                                    Disconnecting GitHub might prevent you from upstreaming new projects to your repositories. You will need to re-authenticate if you want to use GitHub features later.
                                </div>
                            )}

                            {!hasPassword && (user?.providerData?.length || 0) <= 1 && (
                                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-200 text-xs">
                                    <span className="font-bold text-red-500 uppercase block mb-1">Warning</span>
                                    You cannot disconnect this account because it's your only login method. Please set a password or link another account first.
                                </div>
                            )}
                        </div>

                        <div className="flex items-center justify-end gap-3">
                            <button
                                onClick={() => setUnlinkConfirmation({ ...unlinkConfirmation, open: false })}
                                className="px-4 py-2 text-sm font-medium text-white/50 hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUnlinkAccount}
                                disabled={unlinking || (!hasPassword && (user?.providerData?.length || 0) <= 1)}
                                className="px-4 py-2 text-sm font-medium bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors shadow-lg shadow-red-500/20 disabled:opacity-50"
                            >
                                {unlinking ? 'Disconnecting...' : 'Disconnect'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
