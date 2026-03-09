/**
 * Configuration utilities
 * 
 * Two config levels:
 * 1. Global config: ~/.config/preso/config.json (themes, templates, preferences)
 * 2. Local presentation: slides.md in current directory
 */

import { existsSync, mkdirSync } from "fs";
import { join, basename } from "path";
import { homedir } from "os";

// ============================================================================
// Global Config (~/.config/preso/)
// ============================================================================

export interface GlobalConfig {
  defaultTheme: string;
  defaultTemplate: string;
  defaultPort: number;
  themes: string[];           // Favorite/installed themes
  editor?: string;            // Preferred editor command
}

const CONFIG_DIR = join(homedir(), ".config", "preso");
const CONFIG_FILE = join(CONFIG_DIR, "config.json");
const THEMES_DIR = join(CONFIG_DIR, "themes");

const DEFAULT_GLOBAL_CONFIG: GlobalConfig = {
  defaultTheme: "default",
  defaultTemplate: "basic",
  defaultPort: 3030,
  themes: ["default", "seriph", "apple-basic", "dracula"],
};

/**
 * Ensure config directory exists
 */
export function ensureConfigDir(): void {
  if (!existsSync(CONFIG_DIR)) {
    mkdirSync(CONFIG_DIR, { recursive: true });
  }
  if (!existsSync(THEMES_DIR)) {
    mkdirSync(THEMES_DIR, { recursive: true });
  }
}

/**
 * Get global configuration
 */
export async function getGlobalConfig(): Promise<GlobalConfig> {
  ensureConfigDir();
  
  if (!existsSync(CONFIG_FILE)) {
    await saveGlobalConfig(DEFAULT_GLOBAL_CONFIG);
    return DEFAULT_GLOBAL_CONFIG;
  }
  
  try {
    const file = Bun.file(CONFIG_FILE);
    const data = await file.json();
    return { ...DEFAULT_GLOBAL_CONFIG, ...data };
  } catch {
    return DEFAULT_GLOBAL_CONFIG;
  }
}

/**
 * Save global configuration
 */
export async function saveGlobalConfig(config: Partial<GlobalConfig>): Promise<void> {
  ensureConfigDir();
  
  const existing = existsSync(CONFIG_FILE)
    ? await Bun.file(CONFIG_FILE).json().catch(() => DEFAULT_GLOBAL_CONFIG)
    : DEFAULT_GLOBAL_CONFIG;
  
  await Bun.write(
    CONFIG_FILE,
    JSON.stringify({ ...existing, ...config }, null, 2)
  );
}

/**
 * Get config directory paths
 */
export function getConfigPaths() {
  return {
    configDir: CONFIG_DIR,
    configFile: CONFIG_FILE,
    themesDir: THEMES_DIR,
  };
}

// ============================================================================
// Local Presentation Detection
// ============================================================================

/**
 * Find slides.md in current directory or parent directories
 */
export function findSlidesFile(startDir: string = process.cwd()): string | null {
  // First check current directory
  const localSlides = join(startDir, "slides.md");
  if (existsSync(localSlides)) {
    return localSlides;
  }
  
  // Also check for presentation.md as alternative
  const altSlides = join(startDir, "presentation.md");
  if (existsSync(altSlides)) {
    return altSlides;
  }
  
  return null;
}

/**
 * Find slides.md or exit with helpful error message
 */
export function requireSlidesFile(cwd: string = process.cwd()): string {
  const slidesPath = findSlidesFile(cwd);
  if (!slidesPath) {
    // Use dynamic import to avoid circular dependency
    const { error, info } = require("./output");
    error("No slides.md found in current directory");
    console.log("");
    info("To create a presentation:");
    console.log("  preso init");
    process.exit(1);
  }
  return slidesPath;
}

/**
 * Check if a port is available
 */
export async function isPortAvailable(port: number): Promise<boolean> {
  try {
    const server = Bun.serve({
      port,
      fetch() { return new Response(""); },
    });
    server.stop();
    return true;
  } catch {
    return false;
  }
}

/**
 * Get log file path for current presentation
 */
export function getLogFile(dir: string = process.cwd()): string {
  return join(dir, ".preso.log");
}

/**
 * Parse port from string, returning default if not provided
 */
export function parsePort(portStr: string | undefined, defaultPort: number): number {
  return portStr ? parseInt(portStr, 10) : defaultPort;
}

/**
 * Validate port number, exit with error if invalid
 */
export function validatePort(port: number, portStr: string | undefined): void {
  if (isNaN(port) || port < 1 || port > 65535) {
    const { error } = require("./output");
    error(`Invalid port: ${portStr}`);
    process.exit(1);
  }
}
