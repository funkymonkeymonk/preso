/**
 * present command - Start presenter mode
 */

import { basename } from "node:path";
import { parseArgs } from "node:util";

import {
  getGlobalConfig,
  requireAvailablePort,
  requireSlides,
  startSlidev,
} from "../utils/config";
import { info } from "../utils/output";

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
  const slidesPath = requireSlides(cwd);

  const globalConfig = await getGlobalConfig();
  const port = values.port
    ? Number.parseInt(values.port, 10)
    : globalConfig.defaultPort;
  await requireAvailablePort(port, values.port, "present");

  const name = basename(cwd);
  info(`Presenting: ${name}`);
  console.log(`  Presenter: http://localhost:${port}/presenter`);
  if (values.remote) {
    console.log(`  Audience:  http://localhost:${port}`);
  }
  console.log("");

  await startSlidev({
    slidesPath,
    port,
    open: "/presenter",
    remote: values.remote,
  });
}
