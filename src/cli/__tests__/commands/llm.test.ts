/**
 * Tests for llm command
 */

import { describe, expect, it } from "bun:test";
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  createTestContext,
  getFirstLogOutput,
  getLogOutput,
} from "../helpers/testContext";

describe("llmCommand", () => {
  const ctx = createTestContext();

  it("should show compact help with no subcommand", async () => {
    const { llmCommand } = await import("../../commands/llm");
    await llmCommand([]);
    expect(ctx.mocks.consoleLog).toHaveBeenCalled();
    const output = getFirstLogOutput(ctx);
    expect(output).toContain("preso");
    expect(output).toContain("COMMANDS");
  });

  it("should show compact help with --help flag", async () => {
    const { llmCommand } = await import("../../commands/llm");
    await llmCommand(["--help"]);
    const output = getFirstLogOutput(ctx);
    expect(output).toContain("WORKFLOW");
  });

  it("should show compact help with -h flag", async () => {
    const { llmCommand } = await import("../../commands/llm");
    await llmCommand(["-h"]);
    const output = getFirstLogOutput(ctx);
    expect(output).toContain("DETECT");
  });

  it("should show status as JSON with status subcommand", async () => {
    const { llmCommand } = await import("../../commands/llm");
    await llmCommand(["status"]);
    expect(ctx.mocks.consoleLog).toHaveBeenCalled();
    const output = getFirstLogOutput(ctx);

    // Should be valid JSON
    const parsed = JSON.parse(output);
    expect(parsed).toHaveProperty("cwd");
    expect(parsed).toHaveProperty("isPresentation");
    expect(parsed).toHaveProperty("port3030Available");
    expect(parsed).toHaveProperty("configDir");
  });

  it("should show isPresentation: false when no slides.md", async () => {
    const { llmCommand } = await import("../../commands/llm");
    await llmCommand(["status"]);
    const output = getFirstLogOutput(ctx);
    const parsed = JSON.parse(output);
    expect(parsed.isPresentation).toBe(false);
    expect(parsed.slidesFile).toBeNull();
  });

  it("should show isPresentation: true when slides.md exists", async () => {
    writeFileSync(join(ctx.testDir, "slides.md"), "# Test");
    const { llmCommand } = await import("../../commands/llm");
    await llmCommand(["status"]);
    const output = getFirstLogOutput(ctx);
    const parsed = JSON.parse(output);
    expect(parsed.isPresentation).toBe(true);
    expect(parsed.slidesFile).toContain("slides.md");
  });

  it("should show debug info with debug subcommand", async () => {
    const { llmCommand } = await import("../../commands/llm");
    await llmCommand(["debug"]);
    expect(ctx.mocks.consoleLog).toHaveBeenCalled();
    const output = getFirstLogOutput(ctx);
    expect(output).toContain("preso debug");
    expect(output).toContain("version");
    expect(output).toContain("cwd");
  });

  it("should show port status in debug output", async () => {
    const { llmCommand } = await import("../../commands/llm");
    await llmCommand(["debug"]);
    // Debug output is spread across multiple console.log calls
    const allOutput = getLogOutput(ctx);
    expect(allOutput).toContain("port check");
    expect(allOutput).toContain("3030");
    expect(allOutput).toContain("3031");
    expect(allOutput).toContain("3032");
  });

  it("should show common fixes in debug output", async () => {
    const { llmCommand } = await import("../../commands/llm");
    await llmCommand(["debug"]);
    // Debug output is spread across multiple console.log calls
    const allOutput = getLogOutput(ctx);
    expect(allOutput).toContain("common fixes");
  });

  it("should show schema as JSON with schema subcommand", async () => {
    const { llmCommand } = await import("../../commands/llm");
    await llmCommand(["schema"]);
    expect(ctx.mocks.consoleLog).toHaveBeenCalled();
    const output = getFirstLogOutput(ctx);

    // Should be valid JSON
    const parsed = JSON.parse(output);
    expect(parsed).toHaveProperty("name", "preso");
    expect(parsed).toHaveProperty("version");
    expect(parsed).toHaveProperty("commands");
  });

  it("should include all commands in schema", async () => {
    const { llmCommand } = await import("../../commands/llm");
    await llmCommand(["schema"]);
    const output = getFirstLogOutput(ctx);
    const parsed = JSON.parse(output);

    expect(parsed.commands).toHaveProperty("init");
    expect(parsed.commands).toHaveProperty("serve");
    expect(parsed.commands).toHaveProperty("build");
    expect(parsed.commands).toHaveProperty("pdf");
    expect(parsed.commands).toHaveProperty("present");
    expect(parsed.commands).toHaveProperty("theme");
    expect(parsed.commands).toHaveProperty("config");
  });

  it("should include error recovery in schema", async () => {
    const { llmCommand } = await import("../../commands/llm");
    await llmCommand(["schema"]);
    const output = getFirstLogOutput(ctx);
    const parsed = JSON.parse(output);

    expect(parsed).toHaveProperty("errorRecovery");
  });

  it("should fall back to help for unknown subcommand", async () => {
    const { llmCommand } = await import("../../commands/llm");
    await llmCommand(["unknown"]);
    const output = getFirstLogOutput(ctx);
    expect(output).toContain("COMMANDS");
  });
});

describe("llm compact help content", () => {
  const ctx = createTestContext();

  it("should include workflow guidance", async () => {
    const { llmCommand } = await import("../../commands/llm");
    await llmCommand([]);

    const output = getFirstLogOutput(ctx);
    expect(output).toContain("init");
    expect(output).toContain("serve");
    expect(output).toContain("build");
    expect(output).toContain("pdf");
  });

  it("should include error recovery tips", async () => {
    const { llmCommand } = await import("../../commands/llm");
    await llmCommand([]);

    const output = getFirstLogOutput(ctx);
    expect(output).toContain("ERRORS");
    expect(output).toContain("No slides.md");
    expect(output).toContain("Port in use");
  });

  it("should include common command chains", async () => {
    const { llmCommand } = await import("../../commands/llm");
    await llmCommand([]);

    const output = getFirstLogOutput(ctx);
    expect(output).toContain("COMMON CHAINS");
  });
});
