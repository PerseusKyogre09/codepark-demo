import { useState } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { ShieldAlert } from 'lucide-react';

export default function SettingsSectionDeveloper() {
    const { settings, updateSettings } = useTheme();
    const [devMode, setDevMode] = useState(() => {
        try {
            return localStorage.getItem('codepark_dev_mode') === 'true';
        } catch {
            return false;
        }
    });

    const toggleDevMode = () => {
        const newValue = !devMode;
        setDevMode(newValue);
        try {
            localStorage.setItem('codepark_dev_mode', String(newValue));
            window.dispatchEvent(new Event('storage'));
        } catch (e) {
            console.error('Failed to save dev mode preference', e);
        }
    };

    const autoScanEnabled = settings.contextBaseAutoScan !== false;
    const toggleAutoScan = () => {
        updateSettings({ contextBaseAutoScan: !autoScanEnabled });
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-base font-semibold text-foreground" style={{ fontFamily: "var(--font-display)" }}>
                    Developer Settings
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                    Advanced tools and configuration settings for developers.
                </p>
            </div>

            <div className="space-y-4">
                {/* Enable Dev Mode Card */}
                <div className="flex items-start justify-between p-4 border border-border bg-card rounded-lg hover:bg-muted/10 transition-colors">
                    <div className="space-y-0.5">
                        <span className="text-sm font-semibold text-foreground">Enable Dev Mode</span>
                        <p className="text-xs text-muted-foreground leading-relaxed max-w-md">
                            Allows copying User IDs from profiles for troubleshooting and advanced debugging.
                        </p>
                    </div>
                    <button
                        onClick={toggleDevMode}
                        className={`relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring mt-0.5 ${
                            devMode ? "bg-primary" : "bg-muted"
                        }`}
                    >
                        <span
                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition ${
                                devMode ? "translate-x-4" : "translate-x-0"
                            }`}
                        />
                    </button>
                </div>

                {/* ContextBase Auto-Scanning Card */}
                <div className="flex items-start justify-between p-4 border border-border bg-card rounded-lg hover:bg-muted/10 transition-colors">
                    <div className="space-y-0.5">
                        <span className="text-sm font-semibold text-foreground">ContextBase Auto-Scanning</span>
                        <p className="text-xs text-muted-foreground leading-relaxed max-w-md">
                            Observe and index imports, service boundaries, and symbols when files change.
                        </p>
                    </div>
                    <button
                        onClick={toggleAutoScan}
                        className={`relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring mt-0.5 ${
                            autoScanEnabled ? "bg-primary" : "bg-muted"
                        }`}
                    >
                        <span
                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition ${
                                autoScanEnabled ? "translate-x-4" : "translate-x-0"
                            }`}
                        />
                    </button>
                </div>

                {/* Warning note */}
                <div className="p-4 rounded-lg border border-yellow-500/20 bg-yellow-500/5 text-yellow-600/80 text-xs flex gap-3 leading-relaxed">
                    <ShieldAlert className="w-5 h-5 shrink-0 text-yellow-500" />
                    <div>
                        <strong>Note:</strong> Dev Mode is intended for advanced troubleshooting. When enabled, you can right-click (or use the options menu) on any profile to copy their internal User ID. This handle is permanent and does not change with username renames.
                    </div>
                </div>
            </div>
        </div>
    );
}
