/**
 * Tests for build command
 */

import { describe, expect, it } from "bun:test";
import { createTestContext, getFirstLogOutput } from "../helpers/testContext";

describe("buildCommand", () => {
  const ctx = createTestContext();

  it("should show help with --help flag", async () => {
    const { buildCommand } = await import("../../commands/build");
    await buildCommand(["--help"]);
    expect(ctx.mocks.consoleLog).toHaveBeenCalled();
    const output = getFirstLogOutput(ctx);
    expect(output).toContain("Build the presentation as a static site");
  });

  it("should show help with -h flag", async () => {
    const { buildCommand } = await import("../../commands/build");
    await buildCommand(["-h"]);
    const output = getFirstLogOutput(ctx);
    expect(output).toContain("preso build");
  });

  it("should fail if no slides.md exists", async () => {
    const { buildCommand } = await import("../../commands/build");
    await expect(buildCommand([])).rejects.toThrow("process.exit");
  });
});

describe("build command help text", () => {
  const ctx = createTestContext();

  it("should document out option", async () => {
    const { buildCommand } = await import("../../commands/build");
    await buildCommand(["--help"]);

    const output = getFirstLogOutput(ctx);
    expect(output).toContain("--out");
    expect(output).toContain("-o");
  });

  it("should document base option", async () => {
    const { buildCommand } = await import("../../commands/build");
    await buildCommand(["--help"]);

    const output = getFirstLogOutput(ctx);
    expect(output).toContain("--base");
    expect(output).toContain("-b");
  });

  it("should mention default output directory", async () => {
    const { buildCommand } = await import("../../commands/build");
    await buildCommand(["--help"]);

    const output = getFirstLogOutput(ctx);
    expect(output).toContain("dist");
  });

  it("should include output section", async () => {
    const { buildCommand } = await import("../../commands/build");
    await buildCommand(["--help"]);

    const output = getFirstLogOutput(ctx);
    expect(output).toContain("OUTPUT");
  });
});
