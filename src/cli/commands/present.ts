/**
 * present command - Start presenter mode
 */

import { existsSync } from "fs";
import { join, basename } from "path";
import { parseArgs } from "util";
import { success, error, info } from "../utils/output";
import { findSlidesFile, getGlobalConfig, isPortAvailable } from "../utils/config";

const HELP = `
Start presenter mode with speaker notes and controls.

USAGE
  preso present [options]

OPTIONS
  -p, --port <number>   Port to use (default: 3030)
  --remote              Enable remote control for audience
  -h, --help            Show this help

EXAMPLES
  preso present              # Open presenter view
  preso present --remote     # Enable audience remote viewing

PRESENTER VIEW
  Shows speaker notes, timer, and slide preview.
  Opens at http://localhost:<port>/presenter
`;

export async function presentCommand(args: string[]): Promise<void> {
  const { values } = parseArgs({
    args,
    options: {
      port: { type: "string", short: "p" },
      remote: { type: "boolean", default: false },
      help: { type: "boolean", short: "h" },
    },
    allowPositionals: true,
  });

  if (values.help) {
    console.log(HELP);
    return;
  }

  const cwd = process.cwd();
  const slidesPath = findSlidesFile(cwd);

  if (!slidesPath) {
    error("No slides.md found in current directory");
    console.log("");
    info("To create a presentation:");
    console.log("  preso init");
    process.exit(1);
  }

  const globalConfig = await getGlobalConfig();
  const port = values.port ? parseInt(values.port, 10) : globalConfig.defaultPort;

  if (isNaN(port) || port < 1 || port > 65535) {
    error(`Invalid port: ${values.port}`);
    process.exit(1);
  }

  const portAvailable = await isPortAvailable(port);
  if (!portAvailable) {
    error(`Port ${port} is already in use`);
    console.log("");
    info("Solutions:");
    console.log(`  preso present -p ${port + 1}   # Use different port`);
    process.exit(1);
  }

  const name = basename(cwd);
  info(`Presenting: ${name}`);
  console.log(`  Presenter: http://localhost:${port}/presenter`);
  if (values.remote) {
    console.log(`  Audience:  http://localhost:${port}`);
  }
  console.log("");

  const slidevArgs = [
    "slidev",
    slidesPath,
    "--port", String(port),
    "--open", "/presenter",
  ];

  if (values.remote) {
    slidevArgs.push("--remote");
  }

  const proc = Bun.spawn(["bunx", ...slidevArgs], {
    cwd,
    stdio: ["inherit", "inherit", "inherit"],
  });

  process.on("SIGINT", () => {
    proc.kill();
    process.exit(0);
  });

  process.on("SIGTERM", () => {
    proc.kill();
    process.exit(0);
  });

  await proc.exited;
}
