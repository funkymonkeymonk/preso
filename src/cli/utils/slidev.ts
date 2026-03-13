/**
 * Slidev integration module
 *
 * Runs Slidev from the presentation's local node_modules/.bin/slidev
 * using Node.js, avoiding any dependency on bunx/npx being in PATH.
 */

import { existsSync } from "node:fs";
import { join } from "node:path";

import { ExitCode, exitWithError } from "./output";

/**
 * Get the path to the local slidev binary
 */
function getSlidevBinPath(cwd: string): string | null {
  const slidevPath = join(cwd, "node_modules", ".bin", "slidev");
  if (existsSync(slidevPath)) {
    return slidevPath;
  }
  return null;
}

/**
 * Get the path to node executable
 */
function getNodePath(): string | null {
  // Try to find node in PATH
  const nodePath = Bun.which("node");
  if (nodePath) {
    return nodePath;
  }

  // Check common locations
  const commonPaths = [
    "/usr/local/bin/node",
    "/usr/bin/node",
    "/opt/homebrew/bin/node",
  ];

  for (const path of commonPaths) {
    if (existsSync(path)) {
      return path;
    }
  }

  return null;
}

/**
 * Run slidev command with given arguments
 */
async function runSlidev(
  cwd: string,
  args: string[],
  options: { interactive?: boolean } = {},
): Promise<{ success: boolean; stderr?: string }> {
  const slidevBin = getSlidevBinPath(cwd);
  if (!slidevBin) {
    exitWithError("@slidev/cli not found. Run 'npm install' first.", {
      code: ExitCode.DEPENDENCY_MISSING,
    });
  }

  const nodePath = getNodePath();
  if (!nodePath) {
    exitWithError("Node.js not found. Please install Node.js.", {
      code: ExitCode.DEPENDENCY_MISSING,
    });
  }

  const proc = Bun.spawn([nodePath, slidevBin, ...args], {
    cwd,
    stdio: options.interactive
      ? ["inherit", "inherit", "inherit"]
      : ["pipe", "pipe", "pipe"],
    env: {
      ...process.env,
      // Ensure node_modules resolution works
      NODE_PATH: join(cwd, "node_modules"),
    },
  });

  if (options.interactive) {
    // For interactive mode, just wait for exit
    await proc.exited;
    return { success: true };
  }

  const exitCode = await proc.exited;

  if (exitCode === 0) {
    return { success: true };
  }

  const stderr = await new Response(proc.stderr).text();
  return { success: false, stderr };
}

// ============================================================================
// Public API
// ============================================================================

export interface ServeOptions {
  slidesPath: string;
  port: number;
  open?: boolean | string;
  remote?: boolean;
  cwd?: string;
}

/**
 * Start Slidev dev server
 */
export async function serve(options: ServeOptions): Promise<void> {
  const { slidesPath, port, open, remote, cwd = process.cwd() } = options;

  const args = [slidesPath, "--port", String(port)];

  if (open === true) {
    args.push("--open");
  } else if (typeof open === "string") {
    args.push("--open", open);
  }

  if (remote) {
    args.push("--remote");
  }

  await runSlidev(cwd, args, { interactive: true });
}

export interface BuildOptions {
  slidesPath: string;
  outDir?: string;
  base?: string;
  cwd?: string;
}

export interface BuildResult {
  success: boolean;
  error?: string;
}

/**
 * Build static site
 */
export async function build(options: BuildOptions): Promise<BuildResult> {
  const {
    slidesPath,
    outDir = "dist",
    base = "/",
    cwd = process.cwd(),
  } = options;

  const args = ["build", slidesPath, "--out", outDir, "--base", base];

  const result = await runSlidev(cwd, args);

  if (result.success) {
    return { success: true };
  }

  return { success: false, error: result.stderr };
}

export interface ExportOptions {
  slidesPath: string;
  output?: string;
  format?: "pdf" | "png" | "pptx";
  dark?: boolean;
  withClicks?: boolean;
  cwd?: string;
}

export interface ExportResult {
  success: boolean;
  outputPath?: string;
  error?: string;
}

/**
 * Export slides to PDF/PNG/PPTX
 */
export async function exportSlides(
  options: ExportOptions,
): Promise<ExportResult> {
  const {
    slidesPath,
    output,
    dark = false,
    withClicks = false,
    cwd = process.cwd(),
  } = options;

  const args = ["export", slidesPath];

  if (output) {
    args.push("--output", output);
  }

  if (dark) {
    args.push("--dark");
  }

  if (withClicks) {
    args.push("--with-clicks");
  }

  const result = await runSlidev(cwd, args);

  if (result.success) {
    return { success: true, outputPath: output };
  }

  return { success: false, error: result.stderr };
}
