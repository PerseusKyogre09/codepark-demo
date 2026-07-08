import { useTheme } from '../contexts/ThemeContext';

/**
 * Test page to verify theme system functionality
 * This page demonstrates:
 * - Theme context usage
 * - Settings persistence
 * - Profile settings (customization moved to profile) integration
 */
export default function ThemeTestPage() {
  const { settings, themeColors } = useTheme();

  return (
    <div 
      className="min-h-screen p-8"
      style={{ background: themeColors.bg }}
    >
      <div className="max-w-4xl mx-auto">
        <h1 
          className="text-4xl font-bold mb-4"
          style={{ color: themeColors.text }}
        >
          Theme System Test
        </h1>
        
        <p 
          className="text-lg mb-8"
          style={{ color: themeColors.textSecondary }}
        >
          This page tests the theme system implementation
        </p>

        <div 
          className="p-6 rounded-lg mb-6"
          style={{ 
            background: themeColors.cardBg,
            borderColor: themeColors.border,
            borderWidth: '1px',
            borderStyle: 'solid'
          }}
        >
          <h2 
            className="text-2xl font-semibold mb-4"
            style={{ color: themeColors.text }}
          >
            Current Settings
          </h2>
          
          <div className="space-y-2">
            <p style={{ color: themeColors.textSecondary }}>
              <strong style={{ color: themeColors.text }}>UI Theme:</strong> {settings.uiTheme}
            </p>
            <p style={{ color: themeColors.textSecondary }}>
              <strong style={{ color: themeColors.text }}>Editor Theme:</strong> {settings.editorTheme}
            </p>
            <p style={{ color: themeColors.textSecondary }}>
              <strong style={{ color: themeColors.text }}>Accent Color:</strong>{' '}
              <span 
                className="inline-block w-4 h-4 rounded"
                style={{ background: settings.accentColor }}
              />
              {' '}{settings.accentColor}
            </p>
            <p style={{ color: themeColors.textSecondary }}>
              <strong style={{ color: themeColors.text }}>Font Size:</strong> {settings.fontSize}
            </p>
            <p style={{ color: themeColors.textSecondary }}>
              <strong style={{ color: themeColors.text }}>Editor Font:</strong> {settings.editorFont}
            </p>
            <p style={{ color: themeColors.textSecondary }}>
              <strong style={{ color: themeColors.text }}>Line Height:</strong> {settings.lineHeight}
            </p>
            <p style={{ color: themeColors.textSecondary }}>
              <strong style={{ color: themeColors.text }}>Animations:</strong> {settings.animations ? 'Enabled' : 'Disabled'}
            </p>
            <p style={{ color: themeColors.textSecondary }}>
              <strong style={{ color: themeColors.text }}>Compact Mode:</strong> {settings.compactMode ? 'Enabled' : 'Disabled'}
            </p>
          </div>
        </div>



        <div className="mt-8 p-4 rounded-lg" style={{ background: themeColors.cardBg }}>
          <h3 className="text-xl font-semibold mb-2" style={{ color: themeColors.text }}>
            LocalStorage Test
          </h3>
          <p style={{ color: themeColors.textSecondary }}>
            Settings are automatically saved to localStorage. Try changing settings and refreshing the page.
          </p>
          <pre 
            className="mt-4 p-4 rounded overflow-auto text-sm"
            style={{ 
              background: 'rgba(0,0,0,0.2)',
              color: themeColors.text,
              overscrollBehavior: 'none'
            }}
          >
            {JSON.stringify(settings, null, 2)}
          </pre>
        </div>
      </div>


    </div>
  );
}
