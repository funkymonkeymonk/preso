/**
 * llm command - LLM-optimized help and discovery
 * 
 * Designed for:
 * - Minimal tokens
 * - Progressive discovery (start minimal, drill down)
 * - Tool chaining hints
 * - Error recovery guidance
 */

import { parseArgs } from "util";
import { findSlidesFile, getLogFile, getConfigPaths, isPortAvailable } from "../utils/config";
import { version } from "../version";

const COMPACT_HELP = `preso v${version} - Slidev presentation CLI

DETECT: slides.md in cwd = presentation exists
WORKFLOW: init -> serve -> [build|pdf|present]

COMMANDS (run with -h for options):
  init     Create slides.md + deps in cwd
  serve    Dev server (localhost:3030)
  build    Static site -> ./dist
  pdf      Export PDF
  present  Speaker view + notes
  theme    list|set|add|browse
  config   show|set|path

COMMON CHAINS:
  mkdir talk && cd talk && preso init && preso serve
  preso build && cd dist && python -m http.server
  preso serve -p 3031  # parallel presentations

ERRORS:
  "No slides.md" -> preso init
  "Port in use"  -> preso serve -p <other>
  PDF fails      -> bunx playwright install chromium

STATE: ~/.config/preso/config.json
LOGS:  .preso.log (cwd)
DOCS:  https://sli.dev`;

export async function llmCommand(args: string[]): Promise<void> {
  const subcommand = args[0];

  if (!subcommand || subcommand === "-h" || subcommand === "--help") {
    console.log(COMPACT_HELP);
    return;
  }

  switch (subcommand) {
    case "status":
      await showStatus();
      break;
    case "debug":
      await showDebug();
      break;
    case "schema":
      showSchema();
      break;
    default:
      console.log(COMPACT_HELP);
  }
}

/**
 * Quick status check - useful for LLM to understand current state
 */
async function showStatus(): Promise<void> {
  const cwd = process.cwd();
  const slidesPath = findSlidesFile(cwd);
  const port3030 = await isPortAvailable(3030);
  const paths = getConfigPaths();

  // JSON output for easy parsing
  const status = {
    cwd,
    isPresentation: slidesPath !== null,
    slidesFile: slidesPath,
    port3030Available: port3030,
    configDir: paths.configDir,
    logFile: getLogFile(cwd),
  };

  console.log(JSON.stringify(status, null, 2));
}

/**
 * Debug info for troubleshooting
 */
async function showDebug(): Promise<void> {
  const cwd = process.cwd();
  const slidesPath = findSlidesFile(cwd);
  const logFile = getLogFile(cwd);
  const paths = getConfigPaths();

  console.log(`=== preso debug ===
version: ${version}
cwd: ${cwd}
slides: ${slidesPath || "NOT FOUND"}
log: ${logFile}
config: ${paths.configFile}

=== port check ===`);

  for (const port of [3030, 3031, 3032]) {
    const available = await isPortAvailable(port);
    console.log(`${port}: ${available ? "available" : "IN USE"}`);
  }

  console.log(`
=== common fixes ===
No slides.md:     preso init
Port conflict:    preso serve -p <port>
PDF export fail:  bunx playwright install chromium
Theme not found:  preso theme list`);
}

/**
 * Schema for structured tool use
 */
function showSchema(): void {
  const schema = {
    name: "preso",
    version,
    commands: {
      init: {
        args: [],
        options: { template: "string", theme: "string", name: "string" },
        creates: ["slides.md", "package.json", ".gitignore"],
        prereq: "empty dir or no slides.md",
      },
      serve: {
        args: [],
        options: { port: "number", open: "boolean" },
        prereq: "slides.md exists",
        starts: "http://localhost:<port>",
      },
      build: {
        args: [],
        options: { out: "string", base: "string" },
        prereq: "slides.md exists",
        creates: "<out>/index.html",
      },
      pdf: {
        args: [],
        options: { out: "string", dark: "boolean" },
        prereq: "slides.md exists, playwright installed",
        creates: "<name>.pdf",
      },
      present: {
        args: [],
        options: { port: "number", remote: "boolean" },
        prereq: "slides.md exists",
        opens: "/presenter view",
      },
      theme: {
        subcommands: ["list", "set <name>", "add <name>", "browse"],
        prereq: {
          set: "slides.md exists",
          list: "none",
          add: "none",
          browse: "none",
        },
      },
      config: {
        subcommands: ["show", "set <key> <val>", "path"],
        keys: ["defaultTheme", "defaultTemplate", "defaultPort", "editor"],
      },
    },
    errorRecovery: {
      "No slides.md found": "preso init",
      "Port .* in use": "preso serve -p <different-port>",
      "playwright": "bunx playwright install chromium",
    },
  };

  console.log(JSON.stringify(schema, null, 2));
}
