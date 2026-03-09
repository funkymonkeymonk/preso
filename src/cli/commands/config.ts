/**
 * config command - Manage global configuration
 */

import { parseArgs } from "node:util";

import {
  type GlobalConfig,
  getConfigPaths,
  getGlobalConfig,
  saveGlobalConfig,
} from "../utils/config";
import {
  ExitCode,
  colors,
  exitWithError,
  header,
  success,
} from "../utils/output";

const HELP = `
Manage preso configuration.

USAGE
  preso config <command> [options]

COMMANDS
  show              Show current configuration
  set <key> <val>   Set a configuration value
  path              Show config file location

CONFIGURABLE VALUES
  defaultTheme      Theme for new presentations (default: default)
  defaultTemplate   Template for new presentations (default: basic)
  defaultPort       Port for dev server (default: 3030)

EXAMPLES
  preso config show                    # View config
  preso config set defaultTheme seriph # Change default theme
  preso config set defaultPort 4000    # Change default port
  preso config path                    # Show config location
`;

export async function configCommand(args: string[]): Promise<void> {
  const subcommand = args[0];
  const subArgs = args.slice(1);

  if (!subcommand || subcommand === "-h" || subcommand === "--help") {
    console.log(HELP);
    return;
  }

  switch (subcommand) {
    case "show":
      await showConfig();
      break;
    case "set":
      await setConfig(subArgs);
      break;
    case "path":
      showPath();
      break;
    default:
      exitWithError(`Unknown command: ${subcommand}`, {
        code: ExitCode.INVALID_ARGUMENT,
        hint: "Run 'preso config --help' for usage",
      });
  }
}

async function showConfig(): Promise<void> {
  const config = await getGlobalConfig();

  header("Configuration");
  console.log("");
  console.log(`  defaultTheme:    ${config.defaultTheme}`);
  console.log(`  defaultTemplate: ${config.defaultTemplate}`);
  console.log(`  defaultPort:     ${config.defaultPort}`);
  console.log("");

  const paths = getConfigPaths();
  console.log(`${colors.dim}Config file: ${paths.configFile}${colors.reset}`);
}

async function setConfig(args: string[]): Promise<void> {
  const [key, ...valueParts] = args;
  const value = valueParts.join(" ");

  if (!key || !value) {
    exitWithError("Both key and value required", {
      code: ExitCode.INVALID_ARGUMENT,
      hint: "Usage: preso config set <key> <value>",
    });
  }

  const validKeys: (keyof Pick<
    GlobalConfig,
    "defaultTheme" | "defaultTemplate" | "defaultPort"
  >)[] = ["defaultTheme", "defaultTemplate", "defaultPort"];
  if (!validKeys.includes(key as (typeof validKeys)[number])) {
    exitWithError(`Unknown config key: ${key}`, {
      code: ExitCode.INVALID_ARGUMENT,
      hint: `Valid keys: ${validKeys.join(", ")}`,
    });
  }

  // Type-specific handling
  if (key === "defaultPort") {
    const port = Number.parseInt(value, 10);
    if (Number.isNaN(port) || port < 1 || port > 65535) {
      exitWithError("Port must be a number between 1-65535", {
        code: ExitCode.INVALID_ARGUMENT,
      });
    }
    await saveGlobalConfig({ defaultPort: port });
  } else {
    await saveGlobalConfig({
      [key]: value,
    } as Partial<{ defaultTheme: string; defaultTemplate: string }>);
  }

  success(`Set ${key} = ${value}`);
}

function showPath(): void {
  const paths = getConfigPaths();
  console.log(paths.configFile);
}
