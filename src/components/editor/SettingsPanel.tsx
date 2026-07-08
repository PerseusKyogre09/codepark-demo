import { Palette, Type, AlignLeft } from 'lucide-react';
import { useTheme, editorThemes } from '../../contexts/ThemeContext';

export function SettingsPanel() {
  const { settings, updateSettings, themeColors } = useTheme();

  const uiThemeOptions = [
    { id: 'dark' as const, name: 'Dark' },
    { id: 'light' as const, name: 'Light' },
  ];

  const allEditorThemes = [
    // Dark Themes
    { id: 'forest' as const, name: 'Forest', type: 'dark' },
    { id: 'ocean' as const, name: 'Ocean', type: 'dark' },
    { id: 'sunset' as const, name: 'Sunset', type: 'dark' },
    { id: 'midnight' as const, name: 'Midnight', type: 'dark' },
    { id: 'cyberpunk' as const, name: 'Cyberpunk', type: 'dark' },
    { id: 'rose' as const, name: 'Rose', type: 'dark' },

    // Light Themes
    { id: 'forest-light' as const, name: 'Forest Light', type: 'light' },
    { id: 'ocean-light' as const, name: 'Ocean Light', type: 'light' },
    { id: 'sunny-light' as const, name: 'Sunny', type: 'light' },
    { id: 'beach-light' as const, name: 'Beach', type: 'light' },
    { id: 'anime-light' as const, name: 'Anime', type: 'light' },
    { id: 'rose-light' as const, name: 'Rose Light', type: 'light' },
  ];

  const editorThemeOptions = allEditorThemes.filter(t => t.type === settings.uiTheme);

  const fontSizeOptions = [
    { id: 'small' as const, name: 'Small', value: '12px' },
    { id: 'medium' as const, name: 'Medium', value: '14px' },
    { id: 'large' as const, name: 'Large', value: '16px' },
  ];

  const lineHeightOptions = [
    { id: 'compact' as const, name: 'Compact', value: '1.4' },
    { id: 'normal' as const, name: 'Normal', value: '1.6' },
    { id: 'relaxed' as const, name: 'Relaxed', value: '1.8' },
  ];

  const fontOptions = [
    { id: 'cascadia' as const, name: 'Cascadia Code' },
    { id: 'fira' as const, name: 'Fira Code' },
    { id: 'jetbrains' as const, name: 'JetBrains Mono' },
    { id: 'space' as const, name: 'Space Mono' },
    { id: 'ibm' as const, name: 'IBM Plex Mono' },
    { id: 'consolas' as const, name: 'Consolas' },
  ];

  return (
    <div className="h-full overflow-auto" style={{ overscrollBehavior: 'none' }}>
      <div className="p-3 border-b" style={{ borderColor: themeColors.border }}>
        <h2 className="text-xs uppercase tracking-wide font-semibold" style={{ color: settings.accentColor }}>
          Settings
        </h2>
      </div>

      <div className="p-4 space-y-6">
        {/* UI Theme Selection */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Palette size={16} style={{ color: settings.accentColor }} />
            <h3 className="text-sm font-semibold" style={{ color: themeColors.text }}>UI Mode</h3>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {uiThemeOptions.map(t => (
              <button
                key={t.id}
                onClick={() => {
                  // Auto-switch editor theme logic
                  let newEditorTheme = settings.editorTheme;

                  if (t.id === 'light') {
                    // Switching to Light Mode
                    if (settings.editorTheme === 'forest') newEditorTheme = 'forest-light';
                    else if (settings.editorTheme === 'ocean') newEditorTheme = 'ocean-light';
                    else if (settings.editorTheme === 'sunset') newEditorTheme = 'sunny-light';
                    else if (settings.editorTheme === 'midnight') newEditorTheme = 'anime-light'; // No direct match, choosing thematic close
                    else if (settings.editorTheme === 'cyberpunk') newEditorTheme = 'beach-light'; // No direct match
                    else if (settings.editorTheme === 'rose') newEditorTheme = 'rose-light';
                    else if (settings.editorTheme === 'dark') newEditorTheme = 'forest-light'; // Default fallback
                  } else {
                    // Switching to Dark Mode
                    if (settings.editorTheme === 'forest-light') newEditorTheme = 'forest';
                    else if (settings.editorTheme === 'ocean-light') newEditorTheme = 'ocean';
                    else if (settings.editorTheme === 'sunny-light') newEditorTheme = 'sunset';
                    else if (settings.editorTheme === 'beach-light') newEditorTheme = 'cyberpunk';
                    else if (settings.editorTheme === 'anime-light') newEditorTheme = 'midnight';
                    else if (settings.editorTheme === 'rose-light') newEditorTheme = 'rose';
                    else if (settings.editorTheme === 'light') newEditorTheme = 'forest'; // Default fallback
                  }

                  updateSettings({ uiTheme: t.id, editorTheme: newEditorTheme });
                }}
                className={`relative overflow-hidden rounded-lg border-2 transition-all hover:scale-105 h-12 text-xs font-medium flex items-center justify-center`}
                style={{
                  borderColor: settings.uiTheme === t.id ? settings.accentColor : themeColors.border,
                  background: editorThemes[t.id].bg,
                  color: editorThemes[t.id].text
                }}
              >
                {t.name}
                {settings.uiTheme === t.id && (
                  <div className="absolute top-1 right-1 w-4 h-4 rounded-full flex items-center justify-center" style={{ background: settings.accentColor }}>
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Editor Theme Selection */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Palette size={16} style={{ color: settings.accentColor }} />
            <h3 className="text-sm font-semibold" style={{ color: themeColors.text }}>Editor Theme</h3>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {editorThemeOptions.map(t => (
              <button
                key={t.id}
                onClick={() => updateSettings({ editorTheme: t.id })}
                className={`relative overflow-hidden rounded-lg border-2 transition-all hover:scale-105 h-12 text-xs font-medium flex items-center justify-center`}
                style={{
                  borderColor: settings.editorTheme === t.id ? settings.accentColor : themeColors.border,
                  background: editorThemes[t.id].bg,
                  color: editorThemes[t.id].text
                }}
              >
                {t.name}
                {settings.editorTheme === t.id && (
                  <div className="absolute top-1 right-1 w-4 h-4 rounded-full flex items-center justify-center" style={{ background: settings.accentColor }}>
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Font Size */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Type size={16} style={{ color: settings.accentColor }} />
            <h3 className="text-sm font-semibold" style={{ color: themeColors.text }}>Font Size</h3>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {fontSizeOptions.map(option => (
              <button
                key={option.id}
                onClick={() => updateSettings({ fontSize: option.id })}
                className={`px-3 py-2 rounded-lg border-2 transition-all hover:scale-105 text-xs font-medium`}
                style={{
                  borderColor: settings.fontSize === option.id ? settings.accentColor : themeColors.border,
                  color: settings.fontSize === option.id ? settings.accentColor : themeColors.text,
                  background: settings.fontSize === option.id ? `${settings.accentColor}15` : 'transparent'
                }}
              >
                {option.name}
              </button>
            ))}
          </div>
        </div>

        {/* Line Height */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <AlignLeft size={16} style={{ color: settings.accentColor }} />
            <h3 className="text-sm font-semibold" style={{ color: themeColors.text }}>Line Height</h3>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {lineHeightOptions.map(option => (
              <button
                key={option.id}
                onClick={() => updateSettings({ lineHeight: option.id })}
                className={`px-3 py-2 rounded-lg border-2 transition-all hover:scale-105 text-xs font-medium`}
                style={{
                  borderColor: settings.lineHeight === option.id ? settings.accentColor : themeColors.border,
                  color: settings.lineHeight === option.id ? settings.accentColor : themeColors.text,
                  background: settings.lineHeight === option.id ? `${settings.accentColor}15` : 'transparent'
                }}
              >
                {option.name}
              </button>
            ))}
          </div>
        </div>

        {/* Font Family */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-3">
            <Type size={16} style={{ color: settings.accentColor }} />
            <h3 className="text-sm font-semibold" style={{ color: themeColors.text }}>Font Family</h3>
          </div>
          <select
            value={settings.editorFont}
            onChange={(event) => updateSettings({ editorFont: event.target.value as any })}
            className="w-full px-4 py-2 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 appearance-none"
            style={{
              borderColor: themeColors.border,
              background: settings.uiTheme === 'dark' ? '#10151c' : '#f3f4f6',
              color: themeColors.text,
            }}
          >
            {fontOptions.map(option => (
              <option key={option.id} value={option.id}>{option.name}</option>
            ))}
          </select>
        </div>

        {/* Quick Toggles */}
        <div className="space-y-3">
          <label className="flex items-center justify-between p-3 rounded-lg border hover:bg-white/5 cursor-pointer transition-colors" style={{ borderColor: themeColors.border }}>
            <span className="text-sm" style={{ color: themeColors.text }}>Animations</span>
            <input
              type="checkbox"
              checked={settings.animations}
              onChange={(e) => updateSettings({ animations: e.target.checked })}
              className="w-5 h-5 rounded cursor-pointer"
              style={{ accentColor: settings.accentColor }}
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-lg border hover:bg-white/5 cursor-pointer transition-colors" style={{ borderColor: themeColors.border }}>
            <span className="text-sm" style={{ color: themeColors.text }}>Compact Mode</span>
            <input
              type="checkbox"
              checked={settings.compactMode}
              onChange={(e) => updateSettings({ compactMode: e.target.checked })}
              className="w-5 h-5 rounded cursor-pointer"
              style={{ accentColor: settings.accentColor }}
            />
          </label>
        </div>

        {/* Info */}
        <div className="p-4 rounded-lg border" style={{
          borderColor: themeColors.border,
          background: `${settings.accentColor}11`
        }}>
          <p className="text-xs leading-relaxed" style={{ color: themeColors.textSecondary }}>
            For more customization options, visit the Settings page from the home screen.
          </p>
        </div>
      </div>
    </div>
  );
}
