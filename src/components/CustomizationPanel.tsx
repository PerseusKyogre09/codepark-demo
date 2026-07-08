import { X, Palette, Type, Zap, Layout } from 'lucide-react';
import type { UserSettings } from '../types';
import { getThemeColors } from '../utils/theme';
import type { UIThemeName } from '../contexts/ThemeContext';

interface CustomizationPanelProps {
  settings: UserSettings;
  onUpdateSettings: (settings: Partial<UserSettings>) => void;
  onClose: () => void;
}

export function CustomizationPanel({ settings, onUpdateSettings, onClose }: CustomizationPanelProps) {
  // This panel is intentionally not rendered; profile settings now own customization.
   
  return null;
  const themeColors = getThemeColors(settings.uiTheme);

  const accentColors = [
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Purple', value: '#8b5cf6' },
    { name: 'Pink', value: '#ec4899' },
    { name: 'Green', value: '#10b981' },
    { name: 'Orange', value: '#f59e0b' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Cyan', value: '#06b6d4' },
    { name: 'Emerald', value: '#059669' },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div 
        className="rounded-2xl p-6 shadow-2xl max-w-2xl w-full border max-h-[90vh] overflow-auto"
        style={{ 
          background: themeColors.cardBg,
          borderColor: themeColors.border
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ background: `${settings.accentColor}33` }}
            >
              <Palette className="w-5 h-5" style={{ color: settings.accentColor }} />
            </div>
            <div>
              <h2 className="text-2xl font-bold" style={{ color: themeColors.text }}>
                Customization
              </h2>
              <p className="text-sm" style={{ color: themeColors.textSecondary }}>
                Make CodePark truly yours
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" style={{ color: themeColors.textSecondary }} />
          </button>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {/* Theme Selection */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Palette className="w-4 h-4" style={{ color: settings.accentColor }} />
              <h3 className="font-semibold" style={{ color: themeColors.text }}>Theme</h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {(['dark', 'light'] as UIThemeName[]).map((theme) => (
                <button
                  key={theme}
                  onClick={() => onUpdateSettings({ uiTheme: theme })}
                  className="relative overflow-hidden rounded-lg border-2 transition-all hover:scale-105 h-16"
                  style={{ 
                    borderColor: settings.uiTheme === theme ? settings.accentColor : themeColors.border
                  }}
                >
                  <div 
                    className="absolute inset-0"
                    style={{ background: getThemeColors(theme).bg }}
                  />
                  <div className="relative h-full flex items-center justify-center">
                    <span className="text-xs font-medium capitalize text-white drop-shadow">
                      {theme}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Accent Color */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div 
                className="w-4 h-4 rounded-full"
                style={{ background: settings.accentColor }}
              />
              <h3 className="font-semibold" style={{ color: themeColors.text }}>Accent Color</h3>
            </div>
            <div className="grid grid-cols-8 gap-2">
              {accentColors.map((color) => (
                <button
                  key={color.value}
                  onClick={() => onUpdateSettings({ accentColor: color.value })}
                  className="relative w-full aspect-square rounded-lg transition-all hover:scale-110"
                  style={{ background: color.value }}
                  title={color.name}
                >
                  {settings.accentColor === color.value && (
                    <svg className="absolute inset-0 m-auto w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Font Size */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Type className="w-4 h-4" style={{ color: settings.accentColor }} />
              <h3 className="font-semibold" style={{ color: themeColors.text }}>Font Size</h3>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(['small', 'medium', 'large'] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => onUpdateSettings({ fontSize: size })}
                  className="px-4 py-3 rounded-lg border transition-all hover:bg-white/5 capitalize"
                  style={{ 
                    borderColor: settings.fontSize === size ? settings.accentColor : themeColors.border,
                    background: settings.fontSize === size ? `${settings.accentColor}22` : 'transparent',
                    color: settings.fontSize === size ? settings.accentColor : themeColors.text
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Editor Font */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Type className="w-4 h-4" style={{ color: settings.accentColor }} />
              <h3 className="font-semibold" style={{ color: themeColors.text }}>Editor Font</h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'cascadia' as const, name: 'Cascadia Code' },
                { id: 'fira' as const, name: 'Fira Code' },
                { id: 'jetbrains' as const, name: 'JetBrains Mono' },
                { id: 'space' as const, name: 'Space Mono' },
                { id: 'ibm' as const, name: 'IBM Plex Mono' },
                { id: 'consolas' as const, name: 'Consolas' }
              ].map((font) => (
                <button
                  key={font.id}
                  onClick={() => onUpdateSettings({ editorFont: font.id })}
                  className="px-4 py-3 rounded-lg border transition-all hover:bg-white/5 text-left"
                  style={{ 
                    borderColor: settings.editorFont === font.id ? settings.accentColor : themeColors.border,
                    background: settings.editorFont === font.id ? `${settings.accentColor}22` : 'transparent',
                    color: settings.editorFont === font.id ? settings.accentColor : themeColors.text
                  }}
                >
                  {font.name}
                </button>
              ))}
            </div>
          </div>

          {/* Line Height */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Layout className="w-4 h-4" style={{ color: settings.accentColor }} />
              <h3 className="font-semibold" style={{ color: themeColors.text }}>Line Height</h3>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(['compact', 'normal', 'relaxed'] as const).map((height) => (
                <button
                  key={height}
                  onClick={() => onUpdateSettings({ lineHeight: height })}
                  className="px-4 py-3 rounded-lg border transition-all hover:bg-white/5 capitalize"
                  style={{ 
                    borderColor: settings.lineHeight === height ? settings.accentColor : themeColors.border,
                    background: settings.lineHeight === height ? `${settings.accentColor}22` : 'transparent',
                    color: settings.lineHeight === height ? settings.accentColor : themeColors.text
                  }}
                >
                  {height}
                </button>
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4" style={{ color: settings.accentColor }} />
              <h3 className="font-semibold" style={{ color: themeColors.text }}>Preferences</h3>
            </div>
            
            <label className="flex items-center justify-between p-3 rounded-lg border hover:bg-white/5 cursor-pointer" style={{ borderColor: themeColors.border }}>
              <span style={{ color: themeColors.text }}>Animations</span>
              <input
                type="checkbox"
                checked={settings.animations}
                onChange={(e) => onUpdateSettings({ animations: e.target.checked })}
                className="w-5 h-5 rounded accent-blue-600 cursor-pointer"
                style={{ accentColor: settings.accentColor }}
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-lg border hover:bg-white/5 cursor-pointer" style={{ borderColor: themeColors.border }}>
              <span style={{ color: themeColors.text }}>Compact Mode</span>
              <input
                type="checkbox"
                checked={settings.compactMode}
                onChange={(e) => onUpdateSettings({ compactMode: e.target.checked })}
                className="w-5 h-5 rounded accent-blue-600 cursor-pointer"
                style={{ accentColor: settings.accentColor }}
              />
            </label>
          </div>

          {/* Apply Button */}
          <button 
            onClick={onClose}
            className="w-full px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all text-white"
            style={{ background: `linear-gradient(135deg, ${settings.accentColor}, ${settings.accentColor}dd)` }}
          >
            Apply Changes
          </button>
        </div>
      </div>
    </div>
  );
}
