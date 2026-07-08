import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { UserSettings } from '../types';

import { apiClient } from '../services/api';

const BRAND_ACCENT = '#289c56';



// Theme definitions for global UI (dark/light only)
export const uiThemes = {
  dark: {
    bg: '#151917',
    bgColor: '#151917',
    cardBg: 'rgba(36, 42, 38, 0.6)',
    text: '#E8EDE9',
    textSecondary: '#9BA89D',
    border: 'rgba(255, 255, 255, 0.1)',
    navBg: 'rgba(21, 25, 23, 0.8)',
    primary: BRAND_ACCENT,
    success: '#4CAF7D',
    error: '#C0624A',
    warning: '#D4A84B',
    accent: BRAND_ACCENT,
    inputBg: 'rgba(36, 42, 38, 0.8)',
    // Terminal aesthetic colors (dark mode)
    terminalPrimary: '#4CAF7D',
    terminalSecondary: '#9BA89D',
    terminalAccent: '#5B9BD4',
    terminalWarning: '#D4A84B',
    terminalError: '#C0624A',
    terminalBg: '#151917',
    terminalCardBg: '#151917',
    terminalBorder: 'rgba(76, 175, 125, 0.2)',
    terminalBorderHover: 'rgba(76, 175, 125, 0.5)',
  },
  light: {
    bg: '#F6F5EF',
    bgColor: '#F6F5EF',
    cardBg: 'rgba(253, 251, 246, 0.8)',
    text: '#2B2F2C',
    textSecondary: '#666A67',
    border: 'rgba(0, 0, 0, 0.1)',
    navBg: 'rgba(246, 245, 239, 0.9)',
    primary: BRAND_ACCENT,
    success: '#2E7D52',
    error: '#A04030',
    warning: '#A07030',
    accent: BRAND_ACCENT,
    inputBg: 'rgba(253, 251, 246, 0.9)',
    // Terminal aesthetic colors (light mode)
    terminalPrimary: '#2E7D52',
    terminalSecondary: '#666A67',
    terminalAccent: '#3A6EA8',
    terminalWarning: '#A07030',
    terminalError: '#A04030',
    terminalBg: '#FDFBF6',
    terminalCardBg: '#FDFBF6',
    terminalBorder: 'rgba(46, 125, 82, 0.2)',
    terminalBorderHover: 'rgba(46, 125, 82, 0.5)',
  },
};

// Editor theme palette (extends UI palette with additional styles)
export const editorThemes = {
  dark: {
    bg: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%)',
    bgColor: '#0a0a0f',
    cardBg: 'rgba(26, 26, 46, 0.6)',
    text: '#ffffff',
    textSecondary: '#a0a0b0',
    border: 'rgba(255, 255, 255, 0.1)',
    navBg: 'rgba(10, 10, 15, 0.8)',
  },
  light: {
    bg: 'linear-gradient(135deg, #ffffff 0%, #f0f4f8 100%)',
    bgColor: '#ffffff',
    cardBg: 'rgba(255, 255, 255, 0.8)',
    text: '#1a1a2e',
    textSecondary: '#5a5a6e',
    border: 'rgba(0, 0, 0, 0.1)',
    navBg: 'rgba(255, 255, 255, 0.9)',
  },
  forest: {
    bg: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
    bgColor: '#0f2027',
    cardBg: 'rgba(32, 58, 67, 0.6)',
    text: '#e8f5e9',
    textSecondary: '#a5d6a7',
    border: 'rgba(165, 214, 167, 0.2)',
    navBg: 'rgba(15, 32, 39, 0.8)',
  },
  ocean: {
    bg: 'linear-gradient(135deg, #0a192f 0%, #172a45 50%, #1e3a5f 100%)',
    bgColor: '#0a192f',
    cardBg: 'rgba(23, 42, 69, 0.6)',
    text: '#e0f2fe',
    textSecondary: '#7dd3fc',
    border: 'rgba(125, 211, 252, 0.2)',
    navBg: 'rgba(10, 25, 47, 0.8)',
  },
  sunset: {
    bg: 'linear-gradient(135deg, #1a0a2e 0%, #3a1a5f 50%, #5a2a7f 100%)',
    bgColor: '#1a0a2e',
    cardBg: 'rgba(58, 26, 95, 0.6)',
    text: '#fef3c7',
    textSecondary: '#fbbf24',
    border: 'rgba(251, 191, 36, 0.2)',
    navBg: 'rgba(26, 10, 46, 0.8)',
  },
  midnight: {
    bg: 'linear-gradient(135deg, #000000 0%, #1a1a2e 50%, #2d2d44 100%)',
    bgColor: '#000000',
    cardBg: 'rgba(26, 26, 46, 0.7)',
    text: '#e0e0ff',
    textSecondary: '#9090cc',
    border: 'rgba(144, 144, 204, 0.2)',
    navBg: 'rgba(0, 0, 0, 0.9)',
  },
  cyberpunk: {
    bg: 'linear-gradient(135deg, #0f0326 0%, #1a0b3d 50%, #2d1654 100%)',
    bgColor: '#0f0326',
    cardBg: 'rgba(26, 11, 61, 0.6)',
    text: '#00ff9f',
    textSecondary: '#ff006e',
    border: 'rgba(0, 255, 159, 0.3)',
    navBg: 'rgba(15, 3, 38, 0.8)',
  },
  rose: {
    bg: 'linear-gradient(135deg, #2d1b2e 0%, #4a2545 50%, #6b395c 100%)',
    bgColor: '#2d1b2e',
    cardBg: 'rgba(74, 37, 69, 0.6)',
    text: '#fce7f3',
    textSecondary: '#f9a8d4',
    border: 'rgba(249, 168, 212, 0.2)',
    navBg: 'rgba(45, 27, 46, 0.8)',
  },
  'forest-light': {
    bg: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
    bgColor: '#e8f5e9',
    cardBg: 'rgba(232, 245, 233, 0.8)',
    text: '#1b5e20',
    textSecondary: '#2e7d32',
    border: 'rgba(27, 94, 32, 0.1)',
    navBg: 'rgba(255, 255, 255, 0.9)',
  },
  'ocean-light': {
    bg: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)',
    bgColor: '#e0f2fe',
    cardBg: 'rgba(224, 242, 254, 0.8)',
    text: '#0c4a6e',
    textSecondary: '#0284c7',
    border: 'rgba(12, 74, 110, 0.1)',
    navBg: 'rgba(255, 255, 255, 0.9)',
  },
  'sunny-light': {
    bg: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)',
    bgColor: '#fff7ed',
    cardBg: 'rgba(255, 247, 237, 0.8)',
    text: '#7c2d12',
    textSecondary: '#c2410c',
    border: 'rgba(124, 45, 18, 0.1)',
    navBg: 'rgba(255, 255, 255, 0.9)',
  },
  'beach-light': {
    bg: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)', // Sandy/Warm
    bgColor: '#fffbeb',
    cardBg: 'rgba(255, 251, 235, 0.8)',
    text: '#0e7490', // Cyan-700
    textSecondary: '#0891b2', // Cyan-600
    border: 'rgba(14, 116, 144, 0.1)',
    navBg: 'rgba(255, 255, 255, 0.9)',
  },
  'anime-light': {
    bg: 'linear-gradient(135deg, #fae8ff 0%, #f0abfc 100%)',
    bgColor: '#fae8ff',
    cardBg: 'rgba(250, 232, 255, 0.8)',
    text: '#701a75',
    textSecondary: '#a21caf',
    border: 'rgba(112, 26, 117, 0.1)',
    navBg: 'rgba(255, 255, 255, 0.9)',
  },
  'rose-light': {
    bg: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)',
    bgColor: '#fff1f2',
    cardBg: 'rgba(255, 241, 242, 0.8)',
    text: '#881337',
    textSecondary: '#be123c',
    border: 'rgba(136, 19, 55, 0.1)',
    navBg: 'rgba(255, 255, 255, 0.9)',
  },
};

export type UIThemeName = keyof typeof uiThemes;
export type ThemeName = keyof typeof editorThemes;
export type ThemeColors = typeof uiThemes[UIThemeName];
export type EditorThemeColors = typeof editorThemes[ThemeName];

// Default settings
export const defaultSettings: UserSettings = {
  uiTheme: 'dark',
  editorTheme: 'dark',
  accentColor: BRAND_ACCENT,
  collaboratorColor: '#4ECDC4', // Default teal color
  fontSize: 'medium',
  animations: true,
  compactMode: false,
  editorFont: 'cascadia',
  lineHeight: 'normal',
  minimap: true,
  lineNumbers: 'on',
  wordWrap: 'on',
  streakTrackingEnabled: true,
  contextBaseAutoScan: true,
};

// LocalStorage key
const SETTINGS_STORAGE_KEY = 'codepark-settings';

interface ThemeContextType {
  settings: UserSettings;
  updateSettings: (newSettings: Partial<UserSettings>, persistToBackend?: boolean) => void;
  themeColors: ThemeColors;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings) as Partial<UserSettings & { theme?: string }>;

        const normalized: UserSettings = {
          ...defaultSettings,
          ...parsed,
        };

        normalized.accentColor = BRAND_ACCENT;

        // Normalize persisted theme data from older settings records if present
        if (!parsed.uiTheme && parsed.theme) {
          normalized.uiTheme = parsed.theme === 'light' ? 'light' : 'dark';
        }

        if (!parsed.editorTheme && parsed.theme) {
          normalized.editorTheme = isEditorThemeName(parsed.theme)
            ? parsed.theme
            : defaultSettings.editorTheme;
        }

        if (!normalized.uiTheme) {
          normalized.uiTheme = defaultSettings.uiTheme;
        }

        if (!normalized.editorTheme || !isEditorThemeName(normalized.editorTheme)) {
          normalized.editorTheme = defaultSettings.editorTheme;
        }

        setSettings(normalized);
      } catch (error) {
        console.error('Failed to parse saved settings:', error);
      }
    }
  }, []);

  // Update settings and persist to localStorage (and optionally Firestore)
  const updateSettings = (newSettings: Partial<UserSettings>, persistToBackend: boolean = true) => {
    const updated = { ...settings, ...newSettings };
    if (updated.uiTheme !== 'dark' && updated.uiTheme !== 'light') {
      updated.uiTheme = defaultSettings.uiTheme;
    }
    if (!isEditorThemeName(updated.editorTheme)) {
      updated.editorTheme = defaultSettings.editorTheme;
    }
    updated.accentColor = BRAND_ACCENT;
    setSettings(updated);
    const { uiTheme, editorTheme, ...rest } = updated;
    localStorage.setItem(
      SETTINGS_STORAGE_KEY,
      JSON.stringify({ ...rest, uiTheme, editorTheme })
    );

    if (persistToBackend) {
      apiClient.updateUISettings(updated).catch((err) => {
        console.error('[ThemeContext] Failed to persist settings to Firestore:', err);
      });
    }
  };

  // Get current theme colors
  const themeColors = uiThemes[settings.uiTheme] || uiThemes.dark;

  return (
    <ThemeContext.Provider value={{ settings, updateSettings, themeColors }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook to use theme context
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

function isEditorThemeName(value: unknown): value is ThemeName {
  return typeof value === 'string' && value in editorThemes;
}
