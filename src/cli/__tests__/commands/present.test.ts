/**
 * Tests for present command
 */

import { describe, expect, it } from "bun:test";
import { createTestContext, getFirstLogOutput } from "../helpers/testContext";

describe("presentCommand", () => {
  const ctx = createTestContext();

  it("should show help with --help flag", async () => {
    const { presentCommand } = await import("../../commands/present");
    await presentCommand(["--help"]);
    expect(ctx.mocks.consoleLog).toHaveBeenCalled();
    const output = getFirstLogOutput(ctx);
    expect(output).toContain("Start presenter mode");
  });

  it("should show help with -h flag", async () => {
    const { presentCommand } = await import("../../commands/present");
    await presentCommand(["-h"]);
    const output = getFirstLogOutput(ctx);
    expect(output).toContain("preso present");
  });

  it("should fail if no slides.md exists", async () => {
    const { presentCommand } = await import("../../commands/present");
    await expect(presentCommand([])).rejects.toThrow("process.exit");
  });
});

describe("present command help text", () => {
  const ctx = createTestContext();

  it("should document port option", async () => {
    const { presentCommand } = await import("../../commands/present");
    await presentCommand(["--help"]);

    const output = getFirstLogOutput(ctx);
    expect(output).toContain("--port");
    expect(output).toContain("-p");
  });

  it("should document remote option", async () => {
    const { presentCommand } = await import("../../commands/present");
    await presentCommand(["--help"]);

    const output = getFirstLogOutput(ctx);
    expect(output).toContain("--remote");
  });

  it("should include presenter view section", async () => {
    const { presentCommand } = await import("../../commands/present");
    await presentCommand(["--help"]);

    const output = getFirstLogOutput(ctx);
    expect(output).toContain("PRESENTER VIEW");
    expect(output).toContain("/presenter");
  });
});
