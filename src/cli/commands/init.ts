/**
 * init command - Initialize a new presentation in current directory
 */

import { existsSync } from "node:fs";
import { basename, join } from "node:path";
import { parseArgs } from "node:util";

import { findSlidesFile, getGlobalConfig } from "../utils/config";
import {
  ExitCode,
  Spinner,
  error,
  exitWithError,
  header,
  info,
  success,
} from "../utils/output";
import {
  applyTemplateVariables,
  slugToTitle,
  templates,
} from "../utils/templates";

const HELP = `
Create a new presentation in the current directory.

USAGE
  preso init [options]

OPTIONS
  -t, --template <name>   Template: basic, seriph, minimal (default: from config)
  --theme <name>          Theme to use (default: from config)
  -n, --name <title>      Presentation title (default: directory name)
  -h, --help              Show this help

EXAMPLES
  preso init                      # Initialize with defaults
  preso init -t seriph            # Use seriph template
  preso init --theme dracula      # Use dracula theme
  preso init -n "My Talk"         # Set custom title

WHAT IT CREATES
  slides.md          Your presentation content
  package.json       Dependencies (slidev)
  .gitignore         Sensible defaults
`;

export async function initCommand(args: string[]): Promise<void> {
  const { values } = parseArgs({
    args,
    options: {
      template: { type: "string", short: "t" },
      theme: { type: "string" },
      name: { type: "string", short: "n" },
      help: { type: "boolean", short: "h" },
    },
    allowPositionals: true,
  });

  if (values.help) {
    console.log(HELP);
    return;
  }

  const cwd = process.cwd();

  // Check if already a presentation
  if (findSlidesFile(cwd)) {
    exitWithError(
      "This directory already contains a presentation (slides.md exists)",
      { code: ExitCode.GENERAL_ERROR },
    );
  }

  // Get config defaults
  const globalConfig = await getGlobalConfig();
  const templateName =
    values.template || globalConfig.defaultTemplate || "basic";
  const themeName = values.theme || globalConfig.defaultTheme || "default";
  const title = values.name || slugToTitle(basename(cwd));

  // Check if template exists
  const template = templates[templateName];
  if (!template) {
    exitWithError(`Unknown template: ${templateName}`, {
      code: ExitCode.INVALID_ARGUMENT,
      hint: `Available: ${Object.keys(templates).join(", ")}`,
    });
  }

  header(`Creating presentation: ${title}`);

  const spinner = new Spinner("Setting up...").start();

  try {
    // Create slides.md from template, applying the requested theme
    let content = applyTemplateVariables(template, { title });

    // Always set the theme to the requested theme (override template default)
    if (content.match(/^theme:/m)) {
      content = content.replace(/^theme:.*$/m, `theme: ${themeName}`);
    } else if (content.startsWith("---")) {
      content = content.replace(/^---\n/, `---\ntheme: ${themeName}\n`);
    }

    await Bun.write(join(cwd, "slides.md"), content);

    // Create package.json
    const packageJson = {
      name: basename(cwd),
      version: "0.0.1",
      private: true,
      scripts: {
        dev: "slidev",
        build: "slidev build",
        export: "slidev export",
      },
      dependencies: {
        "@slidev/cli": "^51.0.0",
        "@slidev/theme-default": "latest",
        [`@slidev/theme-${themeName}`]: "latest",
      },
    };
    await Bun.write(
      join(cwd, "package.json"),
      JSON.stringify(packageJson, null, 2),
    );

    // Create .gitignore
    const gitignore = `node_modules/
dist/
*.pdf
.preso.log
`;
    await Bun.write(join(cwd, ".gitignore"), gitignore);

    spinner.succeed("Files created");

    // Install dependencies
    const installSpinner = new Spinner("Installing dependencies...").start();
    try {
      const proc = Bun.spawn(["bun", "install"], {
        cwd,
        stdout: "pipe",
        stderr: "pipe",
      });
      const exitCode = await proc.exited;
      if (exitCode === 0) {
        installSpinner.succeed("Dependencies installed");
      } else {
        installSpinner.fail("Install failed - run 'bun install' manually");
      }
    } catch {
      installSpinner.fail(
        "Install failed - run 'npm install' or 'bun install'",
      );
    }

    console.log("");
    success("Presentation ready!");
    console.log("");
    info("Next steps:");
    console.log("  preso serve     # Start dev server");
    console.log("  preso build     # Build for deployment");
    console.log("");
  } catch (err) {
    spinner.fail("Failed");
    if (err instanceof Error) error(err.message);
    process.exit(ExitCode.GENERAL_ERROR);
  }
}
