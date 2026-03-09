/**
 * Configuration utilities
 *
 * Two config levels:
 * 1. Global config: ~/.config/preso/config.json (themes, preferences)
 * 2. Local presentation: slides.md in current directory
 */

import { existsSync, mkdirSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

import {
  ExitCode,
  exitInvalidPort,
  exitNoSlides,
  exitPortInUse,
} from "./output";

// ============================================================================
// Global Config (~/.config/preso/)
// ============================================================================

export interface GlobalConfig {
  defaultTheme: string;
  defaultTemplate: string;
  defaultPort: number;
  themes: string[]; // Favorite/installed themes
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
export async function saveGlobalConfig(
  config: Partial<GlobalConfig>,
): Promise<void> {
  ensureConfigDir();

  const existing = existsSync(CONFIG_FILE)
    ? await Bun.file(CONFIG_FILE)
        .json()
        .catch(() => DEFAULT_GLOBAL_CONFIG)
    : DEFAULT_GLOBAL_CONFIG;

  await Bun.write(
    CONFIG_FILE,
    JSON.stringify({ ...existing, ...config }, null, 2),
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
 * Find slides.md in current directory
 */
export function findSlidesFile(
  startDir: string = process.cwd(),
): string | null {
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
 * Check if a port is available
 */
export async function isPortAvailable(port: number): Promise<boolean> {
  try {
    const server = Bun.serve({
      port,
      fetch() {
        return new Response("");
      },
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

// ============================================================================
// Command Helpers
// ============================================================================

/**
 * Require slides.md to exist, exit with helpful error if not found
 */
export function requireSlides(cwd: string = process.cwd()): string {
  const slidesPath = findSlidesFile(cwd);
  if (!slidesPath) {
    exitNoSlides();
  }
  return slidesPath;
}

/**
 * Validate and require an available port, exit with helpful error if invalid or in use
 */
export async function requireAvailablePort(
  port: number,
  portStr: string | undefined,
  command: string,
): Promise<number> {
  if (Number.isNaN(port) || port < 1 || port > 65535) {
    exitInvalidPort(portStr);
  }

  const available = await isPortAvailable(port);
  if (!available) {
    exitPortInUse(port, command);
  }

  return port;
}

/**
 * Setup graceful shutdown handlers for a subprocess
 */
export function setupGracefulShutdown(proc: { kill(): void }): void {
  const handler = () => {
    proc.kill();
    process.exit(ExitCode.SUCCESS);
  };
  process.on("SIGINT", handler);
  process.on("SIGTERM", handler);
}

// ============================================================================
// Slidev Process Management
// ============================================================================

export interface SlidevOptions {
  slidesPath: string;
  port: number;
  open?: string | boolean; // true, false, or path like "/presenter"
  remote?: boolean;
}

/**
 * Start Slidev dev server with given options
 */
export async function startSlidev(options: SlidevOptions): Promise<void> {
  const { slidesPath, port, open, remote } = options;
  const cwd = process.cwd();

  const slidevArgs = ["slidev", slidesPath, "--port", String(port)];

  if (open === true) {
    slidevArgs.push("--open");
  } else if (typeof open === "string") {
    slidevArgs.push("--open", open);
  }

  if (remote) {
    slidevArgs.push("--remote");
  }

  const proc = Bun.spawn(["bunx", ...slidevArgs], {
    cwd,
    stdio: ["inherit", "inherit", "inherit"],
  });

  setupGracefulShutdown(proc);
  await proc.exited;
}
