import { uiThemes } from '../contexts/ThemeContext';
import type { UIThemeName, ThemeColors } from '../contexts/ThemeContext';

/**
 * Get theme colors for a specific theme
 * @param themeName - The name of the theme
 * @returns Theme colors object
 */
export function getThemeColors(themeName: UIThemeName): ThemeColors {
  return uiThemes[themeName] || uiThemes.dark;
}
