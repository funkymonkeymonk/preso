/**
 * theme command - Manage themes
 */

import { existsSync } from "node:fs";

import { getConfigPaths, requireSlides } from "../utils/config";
import {
  ExitCode,
  colors,
  exitWithError,
  header,
  info,
  success,
} from "../utils/output";
import { setFrontmatterTheme } from "../utils/templates";
import { OFFICIAL_THEMES, isOfficialTheme } from "../utils/themes";

const HELP = `
Manage presentation themes.

USAGE
  preso theme <command> [options]

COMMANDS
  list              Show available themes
  set <name>        Apply theme to current presentation
  browse            Open theme gallery in browser

OPTIONS
  -h, --help        Show this help

EXAMPLES
  preso theme list           # List themes
  preso theme set dracula    # Apply dracula theme
  preso theme browse         # Open gallery

THEME SOURCES
  Official Slidev themes are auto-installed when used.
  Custom themes can be referenced by path in your slides.md frontmatter.
`;

export async function themeCommand(args: string[]): Promise<void> {
  const subcommand = args[0];
  const subArgs = args.slice(1);

  if (!subcommand || subcommand === "-h" || subcommand === "--help") {
    console.log(HELP);
    return;
  }

  switch (subcommand) {
    case "list":
      await listThemes();
      break;
    case "set":
      await setTheme(subArgs);
      break;
    case "browse":
      await browseThemes();
      break;
    default:
      exitWithError(`Unknown command: ${subcommand}`, {
        code: ExitCode.INVALID_ARGUMENT,
        hint: "Run 'preso theme --help' for usage",
      });
  }
}

async function listThemes(): Promise<void> {
  const paths = getConfigPaths();

  header("Available themes");
  console.log("");

  // Official themes
  console.log(
    `${colors.dim}Official (auto-installed when used):${colors.reset}`,
  );
  for (const name of OFFICIAL_THEMES) {
    console.log(`    ${name}`);
  }
  console.log("");

  // Check for custom themes
  if (existsSync(paths.themesDir)) {
    const glob = new Bun.Glob("*/");
    const customThemes: string[] = [];
    for await (const dir of glob.scan(paths.themesDir)) {
      customThemes.push(dir.replace(/\/$/, ""));
    }
    if (customThemes.length > 0) {
      console.log(
        `${colors.dim}Custom (~/.config/preso/themes/):${colors.reset}`,
      );
      for (const name of customThemes) {
        console.log(`    ${name}`);
      }
      console.log("");
    }
  }

  info("Set default: preso config set defaultTheme <name>");
}

async function setTheme(args: string[]): Promise<void> {
  const name = args[0];
  if (!name) {
    exitWithError("Theme name required", {
      code: ExitCode.INVALID_ARGUMENT,
      hint: "Usage: preso theme set <name>",
    });
  }

  const cwd = process.cwd();
  const slidesPath = requireSlides(cwd);

  // Update slides.md frontmatter
  const file = Bun.file(slidesPath);
  const content = await file.text();
  const updatedContent = setFrontmatterTheme(content, name);
  await Bun.write(slidesPath, updatedContent);

  success(`Theme set to: ${name}`);

  if (!isOfficialTheme(name)) {
    info("Note: Non-official themes are installed automatically by Slidev");
  }
}

async function browseThemes(): Promise<void> {
  const url = "https://sli.dev/resources/theme-gallery";
  info(`Opening: ${url}`);

  // Cross-platform open command
  const platform = process.platform;
  const openCmd =
    platform === "darwin"
      ? "open"
      : platform === "win32"
        ? "start"
        : "xdg-open";

  const proc = Bun.spawn([openCmd, url], { stdout: "pipe", stderr: "pipe" });
  await proc.exited.catch(() => console.log(`Visit: ${url}`));
}
