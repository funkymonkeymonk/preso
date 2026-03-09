/**
 * build command - Build static site
 */

import { join, basename } from "path";
import { parseArgs } from "util";
import { success, error, info, Spinner } from "../utils/output";
import { requireSlidesFile } from "../utils/config";

const HELP = `
Build the presentation as a static site.

USAGE
  preso build [options]

OPTIONS
  -o, --out <dir>     Output directory (default: dist)
  -b, --base <path>   Base URL path (default: /)
  -h, --help          Show this help

EXAMPLES
  preso build                    # Build to ./dist
  preso build -o public          # Build to ./public
  preso build --base /slides/    # Set base path for hosting

OUTPUT
  Creates a static site in the output directory.
  Deploy to any static hosting (Netlify, Vercel, GitHub Pages).
`;

export async function buildCommand(args: string[]): Promise<void> {
  const { values } = parseArgs({
    args,
    options: {
      out: { type: "string", short: "o", default: "dist" },
      base: { type: "string", short: "b", default: "/" },
      help: { type: "boolean", short: "h" },
    },
    allowPositionals: true,
  });

  if (values.help) {
    console.log(HELP);
    return;
  }

  const cwd = process.cwd();
  const slidesPath = requireSlidesFile(cwd);

  const outDir = values.out || "dist";
  const base = values.base || "/";
  const name = basename(cwd);

  const spinner = new Spinner(`Building: ${name}`).start();

  const slidevArgs = [
    "slidev", "build",
    slidesPath,
    "--out", outDir,
    "--base", base,
  ];

  try {
    const proc = Bun.spawn(["bunx", ...slidevArgs], {
      cwd,
      stdout: "pipe",
      stderr: "pipe",
    });

    const exitCode = await proc.exited;

    if (exitCode === 0) {
      const outputPath = join(cwd, outDir);
      spinner.succeed(`Built: ${outputPath}`);
      console.log("");
      info("To preview:");
      console.log(`  cd ${outDir} && bunx serve`);
    } else {
      spinner.fail("Build failed");
      const stderr = await new Response(proc.stderr).text();
      if (stderr) console.error(stderr);
      process.exit(1);
    }
  } catch (err) {
    spinner.fail("Build failed");
    if (err instanceof Error) error(err.message);
    process.exit(1);
  }
}
