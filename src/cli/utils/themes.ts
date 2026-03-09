/**
 * Theme utilities
 */

// Official Slidev themes that are auto-installed by Slidev
export const OFFICIAL_THEMES = [
  "default",
  "seriph",
  "apple-basic",
  "bricks",
  "dracula",
  "geist",
  "purplin",
  "shibainu",
  "unicorn",
] as const;

export type OfficialTheme = (typeof OFFICIAL_THEMES)[number];

/**
 * Type guard to check if a theme name is an official Slidev theme
 */
export function isOfficialTheme(name: string): name is OfficialTheme {
  return OFFICIAL_THEMES.includes(name as OfficialTheme);
}
