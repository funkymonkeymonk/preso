/**
 * serve command - Start development server
 */

import { existsSync } from "fs";
import { join, basename } from "path";
import { parseArgs } from "util";
import { success, error, info, warn } from "../utils/output";
import { findSlidesFile, getGlobalConfig, isPortAvailable, getLogFile } from "../utils/config";

const HELP = `
Start the Slidev development server.

USAGE
  preso serve [options]

OPTIONS
  -p, --port <number>   Port to use (default: 3030)
  -o, --open            Open browser automatically
  -h, --help            Show this help

EXAMPLES
  preso serve              # Start on port 3030
  preso serve -p 4000      # Start on port 4000
  preso serve -o           # Open browser automatically

MULTIPLE PRESENTATIONS
  Run multiple presentations on different ports:
    cd ~/talks/talk-a && preso serve -p 3030
    cd ~/talks/talk-b && preso serve -p 3031

TROUBLESHOOTING
  Port in use?  Use -p to specify a different port
  Not starting? Check .preso.log in current directory
`;

export async function serveCommand(args: string[]): Promise<void> {
  const { values } = parseArgs({
    args,
    options: {
      port: { type: "string", short: "p" },
      open: { type: "boolean", short: "o", default: false },
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

  // Determine port
  const globalConfig = await getGlobalConfig();
  const port = values.port ? parseInt(values.port, 10) : globalConfig.defaultPort;

  if (isNaN(port) || port < 1 || port > 65535) {
    error(`Invalid port: ${values.port}`);
    process.exit(1);
  }

  // Check port availability - FAIL if in use (no auto-increment)
  const portAvailable = await isPortAvailable(port);
  if (!portAvailable) {
    error(`Port ${port} is already in use`);
    console.log("");
    info("Solutions:");
    console.log(`  preso serve -p ${port + 1}    # Use different port`);
    console.log(`  lsof -i :${port}              # Find what's using it`);
    process.exit(1);
  }

  const name = basename(cwd);
  info(`Starting: ${name}`);
  console.log(`  File: ${slidesPath}`);
  console.log(`  URL:  http://localhost:${port}`);
  console.log("");

  // Build slidev command
  const slidevArgs = ["slidev", slidesPath, "--port", String(port)];
  if (values.open) {
    slidevArgs.push("--open");
  }

  // Run slidev
  const proc = Bun.spawn(["bunx", ...slidevArgs], {
    cwd,
    stdio: ["inherit", "inherit", "inherit"],
  });

  // Handle graceful shutdown
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
