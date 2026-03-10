/**
 * Build script for preso CLI
 *
 * Creates standalone executables for multiple platforms
 */

export {};

type BunTarget =
  | "bun-darwin-arm64"
  | "bun-darwin-x64"
  | "bun-linux-x64"
  | "bun-linux-arm64"
  | "bun-windows-x64";

const pkg = await Bun.file("package.json").json();
const version = pkg.version || "0.0.1";

interface BuildTarget {
  target: BunTarget;
  outfile: string;
}

const targets: BuildTarget[] = [
  { target: "bun-darwin-arm64", outfile: "dist/preso-darwin-arm64" },
  { target: "bun-darwin-x64", outfile: "dist/preso-darwin-x64" },
  { target: "bun-linux-x64", outfile: "dist/preso-linux-x64" },
  { target: "bun-linux-arm64", outfile: "dist/preso-linux-arm64" },
  { target: "bun-windows-x64", outfile: "dist/preso-windows-x64.exe" },
];

const args = process.argv.slice(2);
const allPlatforms = args.includes("--all") || args.includes("-a");

/**
 * Get build targets for the current platform
 */
function getCurrentPlatformTargets(): BuildTarget[] {
  const platform =
    process.platform === "darwin"
      ? "darwin"
      : process.platform === "win32"
        ? "windows"
        : "linux";
  const arch = process.arch === "arm64" ? "arm64" : "x64";
  return targets.filter(
    (t) => t.target.includes(platform) && t.target.includes(arch),
  );
}

const selectedTargets = allPlatforms ? targets : getCurrentPlatformTargets();

console.log(`Building preso v${version}...`);
console.log("");

for (const { target, outfile } of selectedTargets) {
  console.log(`Compiling for ${target}...`);

  const proc = Bun.spawn(
    [
      "bun",
      "build",
      "--compile",
      `--target=${target}`,
      "--minify",
      `--define=BUILD_VERSION="${version}"`,
      "./src/cli/index.ts",
      "--outfile",
      outfile,
    ],
    {
      stdout: "pipe",
      stderr: "pipe",
    },
  );

  const exitCode = await proc.exited;
  if (exitCode === 0) {
    console.log(`  ✓ ${outfile}`);
  } else {
    const stderr = await new Response(proc.stderr).text();
    console.error(`  ✗ Compile failed: ${stderr}`);
  }
}

console.log("");
console.log("Build complete!");
