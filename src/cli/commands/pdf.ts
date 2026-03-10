/**
 * pdf command - Export presentation to PDF
 */

import { basename } from "node:path";
import { parseArgs } from "node:util";

import { requireSlides, runSlidevBuild } from "../utils/config";
import { ExitCode, Spinner, exitMissingDependency } from "../utils/output";

const HELP = `
Export the presentation to PDF.

USAGE
  preso pdf [options]

OPTIONS
  -o, --out <file>      Output file (default: <name>.pdf)
  --dark                Use dark theme
  --with-clicks         Separate pages for click animations
  --with-toc            Include table of contents
  -h, --help            Show this help

EXAMPLES
  preso pdf                      # Export to <dirname>.pdf
  preso pdf -o slides.pdf        # Custom filename
  preso pdf --with-clicks        # Include click animations

REQUIREMENTS
  Playwright must be installed:
    bunx playwright install chromium
`;

export async function pdfCommand(args: string[]): Promise<void> {
  const { values } = parseArgs({
    args,
    options: {
      out: { type: "string", short: "o" },
      dark: { type: "boolean", default: false },
      "with-clicks": { type: "boolean", default: false },
      "with-toc": { type: "boolean", default: false },
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

  const name = basename(cwd);
  const outputPath = values.out || `${name}.pdf`;

  const spinner = new Spinner(`Exporting: ${name}`).start();

  const exportArgs = ["export", "--output", outputPath];
  if (values.dark) exportArgs.push("--dark");
  if (values["with-clicks"]) exportArgs.push("--with-clicks");
  if (values["with-toc"]) exportArgs.push("--with-toc");

  const result = await runSlidevBuild({
    slidesPath,
    args: exportArgs,
    cwd,
  });

  if (result.success) {
    spinner.succeed(`Exported: ${outputPath}`);
  } else {
    spinner.fail("Export failed");
    if (result.stderr) {
      console.error(result.stderr);
      if (
        result.stderr.includes("playwright") ||
        result.stderr.includes("chromium")
      ) {
        exitMissingDependency("Playwright", "bunx playwright install chromium");
      }
    }
    process.exit(ExitCode.EXPORT_FAILED);
  }
}
