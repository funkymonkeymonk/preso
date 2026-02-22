/**
 * Theme registry - fetch themes from GitHub/npm
 */

import { existsSync } from "fs";
import { join } from "path";
import { Spinner, success, error as logError, info } from "./output";

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

export interface ThemeInfo {
  name: string;
  source: "official" | "npm" | "local" | "shared";
  installed: boolean;
  path?: string;
  description?: string;
}

// Theme registry URL (GitHub-based)
const THEME_REGISTRY_URL = "https://raw.githubusercontent.com/slidevjs/themes/main/registry.json";

/**
 * Fetch available themes from the online registry
 */
export async function fetchThemeRegistry(): Promise<ThemeInfo[]> {
  const themes: ThemeInfo[] = [];
  
  // Add official themes
  for (const name of OFFICIAL_THEMES) {
    themes.push({
      name,
      source: "official",
      installed: true, // Official themes are auto-installed by Slidev
      description: `Official Slidev theme: ${name}`,
    });
  }
  
  // Try to fetch community themes from registry
  try {
    const response = await fetch(THEME_REGISTRY_URL);
    if (response.ok) {
      const registry = await response.json() as { themes?: Array<{name: string, description?: string}> };
      if (registry.themes) {
        for (const theme of registry.themes) {
          if (!OFFICIAL_THEMES.includes(theme.name as OfficialTheme)) {
            themes.push({
              name: theme.name,
              source: "npm",
              installed: false,
              description: theme.description,
            });
          }
        }
      }
    }
  } catch {
    // Registry unavailable, just use official themes
  }
  
  return themes;
}

/**
 * Get locally installed themes
 */
export async function getLocalThemes(projectRoot: string): Promise<ThemeInfo[]> {
  const themes: ThemeInfo[] = [];
  
  // Check local/themes directory
  const localThemesDir = join(projectRoot, "local", "themes");
  if (existsSync(localThemesDir)) {
    const glob = new Bun.Glob("*/");
    for await (const dir of glob.scan(localThemesDir)) {
      const name = dir.replace(/\/$/, "");
      themes.push({
        name,
        source: "local",
        installed: true,
        path: join(localThemesDir, name),
      });
    }
  }
  
  // Check shared/themes directory
  const sharedThemesDir = join(projectRoot, "shared", "themes");
  if (existsSync(sharedThemesDir)) {
    const glob = new Bun.Glob("*/");
    for await (const dir of glob.scan(sharedThemesDir)) {
      const name = dir.replace(/\/$/, "");
      themes.push({
        name,
        source: "shared",
        installed: true,
        path: join(sharedThemesDir, name),
      });
    }
  }
  
  return themes;
}

/**
 * Install a theme from npm
 */
export async function installTheme(name: string, projectRoot: string): Promise<boolean> {
  // Official themes don't need installation
  if (OFFICIAL_THEMES.includes(name as OfficialTheme)) {
    info(`Theme '${name}' is an official Slidev theme and will be auto-installed when used.`);
    return true;
  }
  
  const spinner = new Spinner(`Installing theme '${name}'...`).start();
  
  try {
    const themePkg = name.startsWith("@") || name.startsWith("slidev-theme-") 
      ? name 
      : `slidev-theme-${name}`;
    
    const proc = Bun.spawn(["bun", "add", themePkg], {
      cwd: projectRoot,
      stdout: "pipe",
      stderr: "pipe",
    });
    
    const exitCode = await proc.exited;
    
    if (exitCode === 0) {
      spinner.succeed(`Installed theme '${name}'`);
      return true;
    } else {
      const stderr = await new Response(proc.stderr).text();
      spinner.fail(`Failed to install theme '${name}'`);
      logError(stderr);
      return false;
    }
  } catch (err) {
    spinner.fail(`Failed to install theme '${name}'`);
    if (err instanceof Error) logError(err.message);
    return false;
  }
}

/**
 * Get the theme value to use in frontmatter
 * Returns the appropriate path for local/shared themes, or just the name for npm themes
 */
export function getThemeValue(theme: ThemeInfo, presentationPath: string, projectRoot: string): string {
  if (theme.source === "local" && theme.path) {
    // Calculate relative path from presentation to theme
    const presDir = presentationPath.replace(projectRoot, "").replace(/^\//, "");
    const depth = presDir.split("/").filter(Boolean).length;
    const prefix = "../".repeat(depth);
    return `${prefix}local/themes/${theme.name}`;
  }
  
  if (theme.source === "shared" && theme.path) {
    const presDir = presentationPath.replace(projectRoot, "").replace(/^\//, "");
    const depth = presDir.split("/").filter(Boolean).length;
    const prefix = "../".repeat(depth);
    return `${prefix}shared/themes/${theme.name}`;
  }
  
  // For official and npm themes, just use the name
  return theme.name;
}
