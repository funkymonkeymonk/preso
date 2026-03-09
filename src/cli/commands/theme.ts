/**
 * theme command - Manage themes
 */

import { existsSync, readFileSync, writeFileSync } from "node:fs";

import {
  getConfigPaths,
  getGlobalConfig,
  requireSlides,
  saveGlobalConfig,
} from "../utils/config";
import {
  ExitCode,
  colors,
  error,
  exitWithError,
  header,
  info,
  success,
} from "../utils/output";
import { OFFICIAL_THEMES, isOfficialTheme } from "../utils/themes";

const HELP = `
Manage presentation themes.

USAGE
  preso theme <command> [options]

COMMANDS
  list              Show available themes
  set <name>        Apply theme to current presentation
  add <name>        Add theme to favorites (config)
  browse            Open theme gallery in browser

OPTIONS
  -h, --help        Show this help

EXAMPLES
  preso theme list           # List themes
  preso theme set dracula    # Apply dracula theme
  preso theme add seriph     # Add to favorites
  preso theme browse         # Open gallery

THEME SOURCES
  Official Slidev themes are auto-installed when used.
  Custom themes can be placed in ~/.config/preso/themes/
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
    case "add":
      await addTheme(subArgs);
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
  const config = await getGlobalConfig();
  const paths = getConfigPaths();

  header("Available themes");
  console.log("");

  // Official themes
  console.log(`${colors.dim}Official (auto-installed):${colors.reset}`);
  for (const name of OFFICIAL_THEMES) {
    const isFavorite = config.themes.includes(name);
    const marker = isFavorite ? `${colors.green}*${colors.reset} ` : "  ";
    console.log(`  ${marker}${name}`);
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

  console.log(`${colors.dim}* = in your favorites${colors.reset}`);
  console.log("");
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

  const slidesPath = requireSlides();

  // Update slides.md frontmatter
  let content = readFileSync(slidesPath, "utf-8");

  if (content.match(/^theme:/m)) {
    content = content.replace(/^theme:.*$/m, `theme: ${name}`);
  } else if (content.startsWith("---")) {
    content = content.replace(/^---\n/, `---\ntheme: ${name}\n`);
  } else {
    content = `---\ntheme: ${name}\n---\n\n${content}`;
  }

  writeFileSync(slidesPath, content);

  success(`Theme set to: ${name}`);

  if (!isOfficialTheme(name)) {
    info("Note: Non-official themes are installed automatically by Slidev");
  }
}

async function addTheme(args: string[]): Promise<void> {
  const name = args[0];
  if (!name) {
    exitWithError("Theme name required", {
      code: ExitCode.INVALID_ARGUMENT,
      hint: "Usage: preso theme add <name>",
    });
  }

  const config = await getGlobalConfig();

  if (config.themes.includes(name)) {
    info(`Theme '${name}' is already in favorites`);
    return;
  }

  config.themes.push(name);
  await saveGlobalConfig({ themes: config.themes });

  success(`Added '${name}' to favorites`);
}

async function browseThemes(): Promise<void> {
  const url = "https://sli.dev/resources/theme-gallery";
  info(`Opening: ${url}`);
  const proc = Bun.spawn(["open", url], { stdout: "pipe", stderr: "pipe" });
  await proc.exited.catch(() => console.log(`Visit: ${url}`));
}
