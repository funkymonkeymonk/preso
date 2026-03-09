/**
 * build command - Build static site
 */

import { basename, join } from "node:path";
import { parseArgs } from "node:util";

import { requireSlides, runSlidevBuild } from "../utils/config";
import { ExitCode, Spinner, info } from "../utils/output";

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
  const slidesPath = requireSlides(cwd);

  const outDir = values.out!;
  const base = values.base!;
  const name = basename(cwd);

  const spinner = new Spinner(`Building: ${name}`).start();

  const result = await runSlidevBuild({
    slidesPath,
    args: ["build", "--out", outDir, "--base", base],
    cwd,
  });

  if (result.success) {
    const outputPath = join(cwd, outDir);
    spinner.succeed(`Built: ${outputPath}`);
    console.log("");
    info("To preview:");
    console.log(`  cd ${outDir} && bunx serve`);
  } else {
    spinner.fail("Build failed");
    if (result.stderr) console.error(result.stderr);
    process.exit(ExitCode.BUILD_FAILED);
  }
}
