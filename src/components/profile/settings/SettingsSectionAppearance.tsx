import { useEffect, useState } from 'react';
import { useTheme, editorThemes, type ThemeName } from '../../../contexts/ThemeContext';
import { useSubscription } from '../../../hooks/useSubscription';
import { useAuth } from '../../../contexts/AuthContext';
import { Check, Monitor, Type, Code, Layout, Users } from 'lucide-react';

const HEX_COLOR_PATTERN = /^#([A-Fa-f0-9]{6})$/;

export default function SettingsSectionAppearance() {
    const { settings, updateSettings, themeColors } = useTheme();
    const { isPro } = useSubscription();
    const { user } = useAuth();
    const [manualColorInput, setManualColorInput] = useState(settings.collaboratorColor);
    const [manualColorError, setManualColorError] = useState('');

    const DARK_THEMES: ThemeName[] = ['dark', 'forest', 'ocean', 'sunset', 'midnight', 'cyberpunk', 'rose'];
    const LIGHT_THEMES: ThemeName[] = ['light', 'forest-light', 'ocean-light', 'sunny-light', 'beach-light', 'anime-light', 'rose-light'];

    const availableThemes = settings.uiTheme === 'dark' ? DARK_THEMES : LIGHT_THEMES;

    useEffect(() => {
        setManualColorInput(settings.collaboratorColor);
        setManualColorError('');
    }, [settings.collaboratorColor]);

    const submitManualColor = () => {
        if (!isPro) return;
        const value = manualColorInput.trim();
        if (HEX_COLOR_PATTERN.test(value)) {
            updateSettings({ collaboratorColor: value });
            setManualColorError('');
        } else {
            setManualColorError('Enter a 6-digit hex code (e.g., #1A2B3C).');
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-semibold mb-1" style={{ color: '#3fff8b', fontFamily: 'Space Mono, monospace' }}>
                    <span style={{ color: '#acaab1' }}>&gt;</span> Appearance
                </h2>
                <p className="text-sm pb-4 border-b" style={{ borderColor: 'rgba(63, 255, 139, 0.1)', color: '#acaab1', fontFamily: 'Space Mono, monospace' }}>
                    customize the look and feel of the application and editor.
                </p>
            </div>

            {/* UI Theme - Restored */}
            <div className="space-y-4">
                <div>
                    <h3 className="text-lg font-medium flex items-center gap-2">
                        <Monitor size={20} /> Interface Theme
                    </h3>
                    <p className="text-xs opacity-60">Select the overall application theme.</p>
                </div>
                <div className="grid grid-cols-2 gap-4 max-w-md">
                    <button
                        onClick={() => {
                            // Switch UI theme and auto-switch to a corresponding editor theme defaults
                            updateSettings({
                                uiTheme: 'dark',
                                editorTheme: 'dark'
                            });
                        }}
                        className={`p-4 rounded border text-left transition-all ${settings.uiTheme === 'dark' ? 'ring-2' : 'opacity-60'}`}
                        style={{ borderColor: settings.uiTheme === 'dark' ? 'rgba(63, 255, 139, 0.4)' : 'rgba(63, 255, 139, 0.2)', backgroundColor: settings.uiTheme === 'dark' ? 'rgba(63, 255, 139, 0.1)' : 'rgba(63, 255, 139, 0.05)' }}
                    >
                        <div className="w-full h-24 rounded-lg bg-[#0a0a0f] mb-3 relative overflow-hidden border" style={{ borderColor: themeColors.border }}>
                            <div className="absolute top-0 left-0 w-8 h-full bg-[#1a1a2e]/50 border-r border-white/10" />
                            <div className="absolute top-3 left-10 w-20 h-2 rounded bg-white/10" />
                        </div>
                        <div className="font-medium">Dark Mode</div>
                    </button>
                    <button
                        onClick={() => {
                            // Switch UI theme and auto-switch to light editor theme default
                            updateSettings({
                                uiTheme: 'light',
                                editorTheme: 'light'
                            });
                        }}
                        className={`p-4 rounded border text-left transition-all ${settings.uiTheme === 'light' ? 'ring-2' : 'opacity-60'}`}
                        style={{ borderColor: settings.uiTheme === 'light' ? 'rgba(63, 255, 139, 0.4)' : 'rgba(63, 255, 139, 0.2)', backgroundColor: settings.uiTheme === 'light' ? 'rgba(63, 255, 139, 0.1)' : 'rgba(63, 255, 139, 0.05)' }}
                    >
                        <div className="w-full h-24 rounded-lg bg-[#f0f4f8] mb-3 relative overflow-hidden border" style={{ borderColor: themeColors.border }}>
                            <div className="absolute top-0 left-0 w-8 h-full bg-white border-r border-black/10" />
                            <div className="absolute top-3 left-10 w-20 h-2 rounded bg-black/10" />
                        </div>
                        <div className="font-medium">Light Mode</div>
                    </button>
                </div>
            </div>

            <div className="border-t opacity-10" />

            {/* Collaborator Color */}
            <div className="space-y-4">
                <div>
                    <h3 className="text-lg font-medium flex items-center gap-2">
                        <Users size={20} /> Collaborator Color
                    </h3>
                    <p className="text-xs opacity-60">Choose your cursor color for collaborative editing.</p>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                    <input
                        type="color"
                        value={isPro ? settings.collaboratorColor : (user?.color || settings.collaboratorColor)}
                        onChange={(e) => updateSettings({ collaboratorColor: e.target.value })}
                        className={`w-12 h-12 rounded-lg border-2 transition duration-150 ${isPro ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}`}
                        style={{ borderColor: themeColors.border }}
                        disabled={!isPro}
                        aria-disabled={!isPro}
                    />
                    <div className="flex flex-col gap-1 min-w-[150px]">
                        <label className="text-xs font-medium" htmlFor="collaborator-color-hex">
                            Hex Code
                        </label>
                        <input
                            id="collaborator-color-hex"
                            type="text"
                            value={isPro ? manualColorInput : (user?.color || settings.collaboratorColor)}
                            onChange={(e) => setManualColorInput(e.target.value)}
                            onBlur={submitManualColor}
                            onKeyDown={(event) => {
                                if (event.key === 'Enter') {
                                    event.preventDefault();
                                    submitManualColor();
                                }
                            }}
                            maxLength={7}
                            placeholder="#1A2B3C"
                            className={`px-3 py-2 rounded-lg border transition duration-150 ${isPro ? 'cursor-text' : 'cursor-not-allowed opacity-60'}`}
                            style={{
                                borderColor: themeColors.border,
                                backgroundColor: settings.uiTheme === 'dark' ? '#0a0a0f' : '#ffffff',
                                color: themeColors.text,
                            }}
                            disabled={!isPro}
                            aria-disabled={!isPro}
                            aria-invalid={Boolean(manualColorError)}
                        />
                        {manualColorError && (
                            <p className="text-[11px] text-pink-400">
                                {manualColorError}
                            </p>
                        )}
                    </div>
                    <div className="flex-1">
                        <div className="text-sm font-medium">Selected Color</div>
                        <div className="text-xs opacity-60">
                            {isPro ? settings.collaboratorColor : (user?.color || settings.collaboratorColor)}
                        </div>
                    </div>
                    <div
                        className="w-8 h-8 rounded-full border-2"
                        style={{
                            backgroundColor: isPro ? settings.collaboratorColor : (user?.color || settings.collaboratorColor),
                            borderColor: themeColors.border
                        }}
                    />
                </div>
                {!isPro && (
                    <p className="text-xs text-yellow-300 opacity-80">
                        Collaborator cursor colors are reserved for Pro members. Upgrade to select freely.
                    </p>
                )}
            </div>

            <div className="border-t opacity-10" />

            {/* Editor Theme - Dynamic Grid */}
            <div className="space-y-4">
                <div>
                    <h3 className="text-lg font-medium flex items-center gap-2">
                        <Code size={20} /> Editor Theme
                    </h3>
                    <p className="text-xs opacity-60">Choose a syntax highlighting theme for the code editor.</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {availableThemes.map((theme) => {
                        const themeData = editorThemes[theme];
                        // If themeData is undefined (e.g. while hot-reloading context), skip
                        if (!themeData) return null;

                        const isActive = settings.editorTheme === theme;

                        // Clean up display name (e.g., 'forest-light' -> 'Forest')
                        const displayName = theme.replace('-light', '');

                        return (
                            <button
                                key={theme}
                                onClick={() => updateSettings({ editorTheme: theme })}
                                className={`group relative p-3 rounded border text-left transition-all ${isActive ? 'ring-2' : 'hover:scale-[1.02]'}`}
                                style={{
                                    background: isActive ? `${themeData.navBg}` : 'transparent',
                                    borderColor: isActive ? themeColors.border : 'transparent'
                                }}
                            >
                                {/* Preview Box */}
                                <div
                                    className="w-full aspect-video rounded-lg mb-3 shadow-lg overflow-hidden relative border"
                                    style={{ background: themeData.bg, borderColor: themeColors.border }}
                                >
                                    <div className="absolute inset-0 p-2 text-[8px] font-mono leading-relaxed opacity-80" style={{ color: themeData.text }}>
                                        <div style={{ color: themeData.textSecondary }}>import</div>
                                        <div><span style={{ color: displayName.toLowerCase() === 'light' ? '#0000ff' : themeData.textSecondary === '#a0a0b0' ? '#569cd6' : themeData.textSecondary }}>const</span> App = () ={'>'} {'{'}</div>
                                        <div className="pl-2">return <span style={{ color: displayName.toLowerCase() === 'light' ? '#a31515' : '#ce9178' }}>"Hello"</span>;</div>
                                        <div>{'}'}</div>
                                    </div>

                                    {/* Active Checkmark */}
                                    {isActive && (
                                        <div className="absolute top-1 right-1 bg-blue-500 text-white rounded-full p-0.5">
                                            <Check size={10} />
                                        </div>
                                    )}
                                </div>
                                <div className="font-medium text-sm capitalize">{displayName}</div>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="border-t opacity-10" />

            {/* Font Settings */}
            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-medium flex items-center gap-2">
                        <Type size={20} /> Typography
                    </h3>
                    <p className="text-xs opacity-60">Adjust font size and family.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Font Family */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Font Family</label>
                        <select
                            value={settings.editorFont}
                            onChange={(e) => updateSettings({ editorFont: e.target.value as any })}
                            className="w-full px-3 py-2 rounded-lg border transition-all focus:ring-2 focus:ring-blue-500 outline-none"
                            style={{
                                borderColor: themeColors.border,
                                color: themeColors.text,
                                backgroundColor: settings.uiTheme === 'dark' ? '#0a0a0f' : '#ffffff'
                            }}
                        >
                            <option value="cascadia">Cascadia Code</option>
                            <option value="fira">Fira Code</option>
                            <option value="jetbrains">JetBrains Mono</option>
                            <option value="space">Space Mono</option>
                            <option value="ibm">IBM Plex Mono</option>
                            <option value="consolas">Consolas</option>
                        </select>
                    </div>

                    {/* Font Size */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Font Size</label>
                        <div className="flex rounded-lg p-1 border" style={{ borderColor: themeColors.border, backgroundColor: settings.uiTheme === 'dark' ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.05)' }}>
                            {(['small', 'medium', 'large'] as const).map((size) => (
                                <button
                                    key={size}
                                    onClick={() => updateSettings({ fontSize: size })}
                                    className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-all ${settings.fontSize === size ? 'bg-white/10 shadow-sm font-semibold' : 'opacity-60 hover:opacity-100'}`}
                                    style={{
                                        color: settings.fontSize === size ? themeColors.text : themeColors.textSecondary,
                                        backgroundColor: settings.fontSize === size ? (settings.uiTheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'white') : 'transparent'
                                    }}
                                >
                                    {size.charAt(0).toUpperCase() + size.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Line Height */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Line Height</label>
                        <div className="flex rounded-lg p-1 border" style={{ borderColor: themeColors.border, backgroundColor: settings.uiTheme === 'dark' ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.05)' }}>
                            {(['compact', 'normal', 'relaxed'] as const).map((height) => (
                                <button
                                    key={height}
                                    onClick={() => updateSettings({ lineHeight: height })}
                                    className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-all ${settings.lineHeight === height ? 'bg-white/10 shadow-sm font-semibold' : 'opacity-60 hover:opacity-100'}`}
                                    style={{
                                        color: settings.lineHeight === height ? themeColors.text : themeColors.textSecondary,
                                        backgroundColor: settings.lineHeight === height ? (settings.uiTheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'white') : 'transparent'
                                    }}
                                >
                                    {height.charAt(0).toUpperCase() + height.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-t opacity-10" />

            {/* Editor Toggles */}
            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-medium flex items-center gap-2">
                        <Layout size={20} /> Editor Layout
                    </h3>
                    <p className="text-xs opacity-60">Toggle editor interface elements.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Minimap */}
                    <div className="flex items-center justify-between p-4 rounded border" style={{ borderColor: 'rgba(63, 255, 139, 0.3)', backgroundColor: 'rgba(63, 255, 139, 0.08)' }}>
                        <div>
                            <div className="font-medium">Minimap</div>
                            <div className="text-xs opacity-60">Show code visualization on the right</div>
                        </div>
                        <button
                            onClick={() => updateSettings({ minimap: !settings.minimap })}
                            className={`w-12 h-6 rounded-full transition-colors relative ${settings.minimap ? 'bg-blue-500' : 'bg-black/10'}`}
                            style={{ backgroundColor: settings.minimap ? settings.accentColor : (settings.uiTheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)') }}
                        >
                            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${settings.minimap ? 'left-7' : 'left-1'}`} />
                        </button>
                    </div>

                    {/* Line Numbers */}
                    <div className="flex items-center justify-between p-4 rounded border" style={{ borderColor: 'rgba(63, 255, 139, 0.3)', backgroundColor: 'rgba(63, 255, 139, 0.08)' }}>
                        <div>
                            <div className="font-medium">Line Numbers</div>
                            <div className="text-xs opacity-60">Show line numbers in gutter</div>
                        </div>
                        <button
                            onClick={() => updateSettings({ lineNumbers: settings.lineNumbers === 'on' ? 'off' : 'on' })}
                            className={`w-12 h-6 rounded-full transition-colors relative`}
                            style={{ backgroundColor: settings.lineNumbers === 'on' ? settings.accentColor : (settings.uiTheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)') }}
                        >
                            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${settings.lineNumbers === 'on' ? 'left-7' : 'left-1'}`} />
                        </button>
                    </div>

                    {/* Word Wrap */}
                    <div className="flex items-center justify-between p-4 rounded border" style={{ borderColor: 'rgba(63, 255, 139, 0.3)', backgroundColor: 'rgba(63, 255, 139, 0.08)' }}>
                        <div>
                            <div className="font-medium">Word Wrap</div>
                            <div className="text-xs opacity-60">Wrap long lines</div>
                        </div>
                        <button
                            onClick={() => updateSettings({ wordWrap: settings.wordWrap === 'on' ? 'off' : 'on' })}
                            className={`w-12 h-6 rounded-full transition-colors relative`}
                            style={{ backgroundColor: settings.wordWrap === 'on' ? settings.accentColor : (settings.uiTheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)') }}
                        >
                            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${settings.wordWrap === 'on' ? 'left-7' : 'left-1'}`} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
