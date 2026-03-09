/**
 * Tests for theme command
 */

import { describe, expect, it } from "bun:test";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { createTestContext, getFirstLogOutput } from "../helpers/testContext";

describe("themeCommand", () => {
  const ctx = createTestContext();

  it("should show help with --help flag", async () => {
    const { themeCommand } = await import("../../commands/theme");
    await themeCommand(["--help"]);
    expect(ctx.mocks.consoleLog).toHaveBeenCalled();
    const output = getFirstLogOutput(ctx);
    expect(output).toContain("Manage presentation themes");
  });

  it("should show help with -h flag", async () => {
    const { themeCommand } = await import("../../commands/theme");
    await themeCommand(["-h"]);
    const output = getFirstLogOutput(ctx);
    expect(output).toContain("preso theme");
  });

  it("should show help when no subcommand provided", async () => {
    const { themeCommand } = await import("../../commands/theme");
    await themeCommand([]);
    const output = getFirstLogOutput(ctx);
    expect(output).toContain("USAGE");
  });

  it("should list themes with list subcommand", async () => {
    const { themeCommand } = await import("../../commands/theme");
    await themeCommand(["list"]);
    // Should have called console.log with theme list
    expect(ctx.mocks.consoleLog).toHaveBeenCalled();
  });

  it("should fail with unknown subcommand", async () => {
    const { themeCommand } = await import("../../commands/theme");
    await expect(themeCommand(["unknown"])).rejects.toThrow("process.exit");
  });

  it("should fail set without theme name", async () => {
    writeFileSync(
      join(ctx.testDir, "slides.md"),
      "---\ntheme: default\n---\n# Test",
    );
    const { themeCommand } = await import("../../commands/theme");
    await expect(themeCommand(["set"])).rejects.toThrow("process.exit");
  });

  it("should fail set without slides.md", async () => {
    const { themeCommand } = await import("../../commands/theme");
    await expect(themeCommand(["set", "seriph"])).rejects.toThrow(
      "process.exit",
    );
  });

  it("should set theme when slides.md exists", async () => {
    writeFileSync(
      join(ctx.testDir, "slides.md"),
      "---\ntheme: default\n---\n# Test",
    );
    const { themeCommand } = await import("../../commands/theme");
    await themeCommand(["set", "dracula"]);

    const content = readFileSync(join(ctx.testDir, "slides.md"), "utf-8");
    expect(content).toContain("theme: dracula");
  });
});

describe("theme command help text", () => {
  const ctx = createTestContext();

  it("should document list command", async () => {
    const { themeCommand } = await import("../../commands/theme");
    await themeCommand(["--help"]);

    const output = getFirstLogOutput(ctx);
    expect(output).toContain("list");
  });

  it("should document set command", async () => {
    const { themeCommand } = await import("../../commands/theme");
    await themeCommand(["--help"]);

    const output = getFirstLogOutput(ctx);
    expect(output).toContain("set");
  });

  it("should document browse command", async () => {
    const { themeCommand } = await import("../../commands/theme");
    await themeCommand(["--help"]);

    const output = getFirstLogOutput(ctx);
    expect(output).toContain("browse");
  });

  it("should include examples", async () => {
    const { themeCommand } = await import("../../commands/theme");
    await themeCommand(["--help"]);

    const output = getFirstLogOutput(ctx);
    expect(output).toContain("EXAMPLES");
  });
});
