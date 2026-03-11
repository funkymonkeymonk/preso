/**
 * Tests for config command
 */

import { describe, expect, it } from "bun:test";
import { createTestContext, getFirstLogOutput } from "../helpers/testContext";

describe("configCommand", () => {
  const ctx = createTestContext();

  it("should show help with --help flag", async () => {
    const { configCommand } = await import("../../commands/config");
    await configCommand(["--help"]);
    expect(ctx.mocks.consoleLog).toHaveBeenCalled();
    const output = getFirstLogOutput(ctx);
    expect(output).toContain("Manage preso configuration");
  });

  it("should show help with -h flag", async () => {
    const { configCommand } = await import("../../commands/config");
    await configCommand(["-h"]);
    const output = getFirstLogOutput(ctx);
    expect(output).toContain("preso config");
  });

  it("should show help when no subcommand provided", async () => {
    const { configCommand } = await import("../../commands/config");
    await configCommand([]);
    const output = getFirstLogOutput(ctx);
    expect(output).toContain("USAGE");
  });

  it("should show config with show subcommand", async () => {
    const { configCommand } = await import("../../commands/config");
    await configCommand(["show"]);
    expect(ctx.mocks.consoleLog).toHaveBeenCalled();
  });

  it("should show path with path subcommand", async () => {
    const { configCommand } = await import("../../commands/config");
    await configCommand(["path"]);
    expect(ctx.mocks.consoleLog).toHaveBeenCalled();
    const output = getFirstLogOutput(ctx);
    expect(output).toContain("preso");
    expect(output).toContain("config.json");
  });

  it("should fail with unknown subcommand", async () => {
    const { configCommand } = await import("../../commands/config");
    await expect(configCommand(["unknown"])).rejects.toThrow("process.exit");
  });

  it("should fail set without key", async () => {
    const { configCommand } = await import("../../commands/config");
    await expect(configCommand(["set"])).rejects.toThrow("process.exit");
  });

  it("should fail set without value", async () => {
    const { configCommand } = await import("../../commands/config");
    await expect(configCommand(["set", "defaultTheme"])).rejects.toThrow(
      "process.exit",
    );
  });

  it("should fail set with invalid key", async () => {
    const { configCommand } = await import("../../commands/config");
    await expect(configCommand(["set", "invalidKey", "value"])).rejects.toThrow(
      "process.exit",
    );
  });

  it("should fail set defaultPort with invalid port", async () => {
    const { configCommand } = await import("../../commands/config");
    await expect(
      configCommand(["set", "defaultPort", "notanumber"]),
    ).rejects.toThrow("process.exit");
  });

  it("should fail set defaultPort with out of range port", async () => {
    const { configCommand } = await import("../../commands/config");
    await expect(
      configCommand(["set", "defaultPort", "99999"]),
    ).rejects.toThrow("process.exit");
  });
});

describe("config command help text", () => {
  const ctx = createTestContext();

  it("should document show command", async () => {
    const { configCommand } = await import("../../commands/config");
    await configCommand(["--help"]);

    const output = getFirstLogOutput(ctx);
    expect(output).toContain("show");
  });

  it("should document set command", async () => {
    const { configCommand } = await import("../../commands/config");
    await configCommand(["--help"]);

    const output = getFirstLogOutput(ctx);
    expect(output).toContain("set");
  });

  it("should document path command", async () => {
    const { configCommand } = await import("../../commands/config");
    await configCommand(["--help"]);

    const output = getFirstLogOutput(ctx);
    expect(output).toContain("path");
  });

  it("should list configurable values", async () => {
    const { configCommand } = await import("../../commands/config");
    await configCommand(["--help"]);

    const output = getFirstLogOutput(ctx);
    expect(output).toContain("defaultTheme");
    expect(output).toContain("defaultTemplate");
    expect(output).toContain("defaultPort");
  });
});
