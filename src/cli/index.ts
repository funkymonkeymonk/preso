#!/usr/bin/env bun
/**
 * PRESO CLI - Slidev presentation tool
 *
 * PRESO Renders Engaging Slides On-demand
 */

import { buildCommand } from "./commands/build";
import { configCommand } from "./commands/config";
import { initCommand } from "./commands/init";
import { llmCommand } from "./commands/llm";
import { pdfCommand } from "./commands/pdf";
import { presentCommand } from "./commands/present";
import { serveCommand } from "./commands/serve";
import { themeCommand } from "./commands/theme";
import { ExitCode, error, exitWithError } from "./utils/output";
import { version } from "./version";

const HELP = `
preso - Create and present Slidev presentations

USAGE
  preso <command> [options]

COMMANDS
  init              Create a new presentation in current directory
  serve             Start development server
  build             Build static site for deployment
  pdf               Export to PDF
  present           Start presenter mode with speaker notes
  theme             Manage themes (list, set, browse)
  config            Manage global configuration

OPTIONS
  -h, --help        Show help for any command
  -v, --version     Show version number

QUICK START
  mkdir my-talk && cd my-talk
  preso init
  preso serve

MULTIPLE PRESENTATIONS
  Each presentation lives in its own directory.
  Run on different ports for simultaneous work:
    preso serve -p 3030    # In first directory
    preso serve -p 3031    # In second directory

FOR AI/LLM AGENTS
  preso llm              # Token-optimized help
  preso llm status       # JSON status of current directory
  preso llm debug        # Troubleshooting info
  preso llm schema       # Structured command schema

DOCUMENTATION
  https://sli.dev        # Slidev documentation
  docs/index.md          # PRESO documentation
`;

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === "-h" || args[0] === "--help") {
    console.log(HELP);
    process.exit(ExitCode.SUCCESS);
  }

  if (args[0] === "-v" || args[0] === "--version") {
    console.log(`preso ${version}`);
    process.exit(ExitCode.SUCCESS);
  }

  const command = args[0];
  const commandArgs = args.slice(1);

  try {
    switch (command) {
      case "init":
        await initCommand(commandArgs);
        break;
      case "serve":
        await serveCommand(commandArgs);
        break;
      case "build":
        await buildCommand(commandArgs);
        break;
      case "pdf":
        await pdfCommand(commandArgs);
        break;
      case "present":
        await presentCommand(commandArgs);
        break;
      case "theme":
        await themeCommand(commandArgs);
        break;
      case "config":
        await configCommand(commandArgs);
        break;
      case "llm":
        await llmCommand(commandArgs);
        break;
      default:
        exitWithError(`Unknown command: ${command}`, {
          code: ExitCode.INVALID_ARGUMENT,
          hint: "Run 'preso --help' for usage",
        });
    }
  } catch (err) {
    if (err instanceof Error) {
      error(err.message);
    } else {
      error("An unexpected error occurred");
    }
    process.exit(ExitCode.GENERAL_ERROR);
  }
}

main();
