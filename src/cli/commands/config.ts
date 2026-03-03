/**
 * config command - Manage global configuration
 */

import { parseArgs } from "util";
import { success, error, info, header, colors } from "../utils/output";
import { getGlobalConfig, saveGlobalConfig, getConfigPaths } from "../utils/config";

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
  editor            Editor command for 'preso edit'

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
      error(`Unknown command: ${subcommand}`);
      console.log(HELP);
      process.exit(1);
  }
}

async function showConfig(): Promise<void> {
  const config = await getGlobalConfig();

  header("Configuration");
  console.log("");
  console.log(`  defaultTheme:    ${config.defaultTheme}`);
  console.log(`  defaultTemplate: ${config.defaultTemplate}`);
  console.log(`  defaultPort:     ${config.defaultPort}`);
  console.log(`  editor:          ${config.editor || "(not set)"}`);
  console.log("");
  console.log(`  themes:          ${config.themes.join(", ")}`);
  console.log("");
  
  const paths = getConfigPaths();
  console.log(`${colors.dim}Config file: ${paths.configFile}${colors.reset}`);
}

async function setConfig(args: string[]): Promise<void> {
  const [key, ...valueParts] = args;
  const value = valueParts.join(" ");

  if (!key || !value) {
    error("Both key and value required");
    console.log("Usage: preso config set <key> <value>");
    process.exit(1);
  }

  const validKeys = ["defaultTheme", "defaultTemplate", "defaultPort", "editor"];
  if (!validKeys.includes(key)) {
    error(`Unknown config key: ${key}`);
    console.log(`Valid keys: ${validKeys.join(", ")}`);
    process.exit(1);
  }

  const config = await getGlobalConfig();

  // Type-specific handling
  if (key === "defaultPort") {
    const port = parseInt(value, 10);
    if (isNaN(port) || port < 1 || port > 65535) {
      error("Port must be a number between 1-65535");
      process.exit(1);
    }
    await saveGlobalConfig({ defaultPort: port });
  } else {
    await saveGlobalConfig({ [key]: value });
  }

  success(`Set ${key} = ${value}`);
}

function showPath(): void {
  const paths = getConfigPaths();
  console.log(paths.configFile);
}
