/**
 * Tests for serve command
 */

import { describe, expect, it } from "bun:test";
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { createTestContext, getFirstLogOutput } from "../helpers/testContext";

describe("serveCommand", () => {
  const ctx = createTestContext();

  it("should show help with --help flag", async () => {
    const { serveCommand } = await import("../../commands/serve");
    await serveCommand(["--help"]);
    expect(ctx.mocks.consoleLog).toHaveBeenCalled();
    const output = getFirstLogOutput(ctx);
    expect(output).toContain("Start the Slidev development server");
  });

  it("should show help with -h flag", async () => {
    const { serveCommand } = await import("../../commands/serve");
    await serveCommand(["-h"]);
    const output = getFirstLogOutput(ctx);
    expect(output).toContain("preso serve");
  });

  it("should fail if no slides.md exists", async () => {
    const { serveCommand } = await import("../../commands/serve");
    await expect(serveCommand([])).rejects.toThrow("process.exit");
  });
});

describe("serve command help text", () => {
  const ctx = createTestContext();

  it("should document port option", async () => {
    const { serveCommand } = await import("../../commands/serve");
    await serveCommand(["--help"]);

    const output = getFirstLogOutput(ctx);
    expect(output).toContain("--port");
    expect(output).toContain("-p");
  });

  it("should document open option", async () => {
    const { serveCommand } = await import("../../commands/serve");
    await serveCommand(["--help"]);

    const output = getFirstLogOutput(ctx);
    expect(output).toContain("--open");
    expect(output).toContain("-o");
  });

  it("should mention default port", async () => {
    const { serveCommand } = await import("../../commands/serve");
    await serveCommand(["--help"]);

    const output = getFirstLogOutput(ctx);
    expect(output).toContain("3030");
  });

  it("should include troubleshooting section", async () => {
    const { serveCommand } = await import("../../commands/serve");
    await serveCommand(["--help"]);

    const output = getFirstLogOutput(ctx);
    expect(output).toContain("TROUBLESHOOTING");
  });
});
