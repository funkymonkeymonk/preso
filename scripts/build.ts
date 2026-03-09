/**
 * Build script for preso CLI
 *
 * Creates standalone executables for multiple platforms
 */

// Required to enable top-level await
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
  console.log(`Building for ${target}...`);

  try {
    const result = await Bun.build({
      entrypoints: ["./src/cli/index.ts"],
      outdir: ".",
      naming: {
        entry: outfile,
      },
      target,
      minify: true,
      sourcemap: "linked",
      define: {
        BUILD_VERSION: JSON.stringify(version),
      },
    });

    if (result.success) {
      console.log(`  ✓ ${outfile}`);
    } else {
      console.error(`  ✗ Build failed for ${target}`);
      for (const log of result.logs) {
        console.error(`    ${log}`);
      }
    }
  } catch (error) {
    console.error(`  ✗ Build failed for ${target}: ${error}`);
  }
}

console.log("");
console.log("Build complete!");

// Also create compile versions (single executable)
if (selectedTargets.length === 1 || allPlatforms) {
  console.log("");
  console.log("Creating standalone executables...");

  for (const { target, outfile } of selectedTargets) {
    const compiledOutfile = outfile.replace("dist/", "dist/bin/");
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
        compiledOutfile,
      ],
      {
        stdout: "pipe",
        stderr: "pipe",
      },
    );

    const exitCode = await proc.exited;
    if (exitCode === 0) {
      console.log(`  ✓ ${compiledOutfile}`);
    } else {
      const stderr = await new Response(proc.stderr).text();
      console.error(`  ✗ Compile failed: ${stderr}`);
    }
  }
}
