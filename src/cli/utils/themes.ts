/**
 * Theme registry - official Slidev themes
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

export type OfficialTheme = typeof OFFICIAL_THEMES[number];
