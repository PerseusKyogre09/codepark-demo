# Theme System Documentation

## Overview

The theme system provides a centralized way to manage application appearance and user preferences. It includes:

- **ThemeProvider**: React context provider for theme state management
- **useTheme**: Custom hook to access theme context
- **Profile Settings**: UI for user customization (moved to the profile page)
- **localStorage persistence**: Automatic saving and loading of user preferences

## Features

### Supported Themes

#just to see if merge worked properly

The system includes 8 pre-defined themes:
- `dark` - Default dark theme
- `light` - Light theme
- `forest` - Green nature-inspired theme
- `ocean` - Blue ocean-inspired theme
- `sunset` - Purple/orange sunset theme
- `midnight` - Deep dark blue theme
- `cyberpunk` - Neon green/pink theme
- `rose` - Pink/purple rose theme

### Customization Options

Each theme can be customized with:
- **Accent Color**: 8 predefined colors (blue, purple, pink, green, orange, red, cyan, emerald)
- **Font Size**: small, medium, large
- **Editor Font**: Cascadia Code, Fira Code, JetBrains Mono, Consolas
- **Line Height**: compact, normal, relaxed
- **Animations**: Enable/disable animations
- **Compact Mode**: Enable/disable compact UI mode

## Usage

### Basic Setup

Wrap your application with `ThemeProvider`:

```tsx
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      {/* Your app components */}
    </ThemeProvider>
  );
}
```

### Using the Theme Hook

Access theme settings and colors in any component:

```tsx
import { useTheme } from './contexts/ThemeContext';

function MyComponent() {
  const { settings, updateSettings, themeColors } = useTheme();

  return (
    <div style={{ background: themeColors.bg, color: themeColors.text }}>
      <h1>Current theme: {settings.theme}</h1>
      <button onClick={() => updateSettings({ theme: 'ocean' })}>
        Switch to Ocean Theme
      </button>
    </div>
  );
}
```

### Customization via Profile Settings

Customization options are now available in the **Profile Settings** page. Open your profile (or navigate to `/profile`) to change accent colors, fonts, spacing, animations, and other preferences.

### Getting Theme Colors

Use the utility function to get colors for any theme:

```tsx
import { getThemeColors } from './utils/theme';

const oceanColors = getThemeColors('ocean');
console.log(oceanColors.bg); // Ocean theme background gradient
```

## Theme Colors Structure

Each theme provides the following color properties:

```typescript
{
  bg: string;           // Background gradient
  cardBg: string;       // Card/panel background (with transparency)
  text: string;         // Primary text color
  textSecondary: string; // Secondary text color
  border: string;       // Border color (with transparency)
  navBg: string;        // Navigation background (with transparency)
}
```

## LocalStorage Persistence

Settings are automatically persisted to localStorage under the key `codepark-settings`.

### Manual Access

```typescript
// Load settings
const savedSettings = localStorage.getItem('codepark-settings');
const settings = savedSettings ? JSON.parse(savedSettings) : defaultSettings;

// Save settings
localStorage.setItem('codepark-settings', JSON.stringify(settings));
```

## Default Settings

```typescript
{
  theme: 'dark',
  accentColor: '#3b82f6',
  fontSize: 'medium',
  animations: true,
  compactMode: false,
  editorFont: 'cascadia',
  lineHeight: 'normal'
}
```

## Testing

Visit `/theme-test` route to see a test page demonstrating all theme system features.

## Requirements Validation

This implementation satisfies the following requirements:

- **1.3**: Application loads and applies user's saved theme and customization settings from localStorage
- **10.1**: Customization settings display all available themes and options
- **10.2**: Theme changes apply immediately
- **10.3**: Font size updates in real-time
- **10.4**: Settings are saved to localStorage
- **10.5**: Saved customization settings are restored on application load
