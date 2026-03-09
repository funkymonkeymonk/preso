/**
 * Tests for init command
 */

import { describe, expect, it } from "bun:test";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { createTestContext, getFirstLogOutput } from "../helpers/testContext";

describe("initCommand", () => {
  const ctx = createTestContext();

  it("should show help with --help flag", async () => {
    const { initCommand } = await import("../../commands/init");
    await initCommand(["--help"]);
    expect(ctx.mocks.consoleLog).toHaveBeenCalled();
    const output = getFirstLogOutput(ctx);
    expect(output).toContain("Create a new presentation");
    expect(output).toContain("USAGE");
  });

  it("should show help with -h flag", async () => {
    const { initCommand } = await import("../../commands/init");
    await initCommand(["-h"]);
    expect(ctx.mocks.consoleLog).toHaveBeenCalled();
    const output = getFirstLogOutput(ctx);
    expect(output).toContain("preso init");
  });

  it("should fail if slides.md already exists", async () => {
    writeFileSync(join(ctx.testDir, "slides.md"), "# Existing");
    const { initCommand } = await import("../../commands/init");

    await expect(initCommand([])).rejects.toThrow("process.exit");
  });

  it("should create slides.md with basic template", async () => {
    const { initCommand } = await import("../../commands/init");
    await initCommand([]);

    expect(existsSync(join(ctx.testDir, "slides.md"))).toBe(true);
    const content = readFileSync(join(ctx.testDir, "slides.md"), "utf-8");
    expect(content).toContain("theme:");
    expect(content).toContain("# ");
  });

  it("should create package.json", async () => {
    const { initCommand } = await import("../../commands/init");
    await initCommand([]);

    expect(existsSync(join(ctx.testDir, "package.json"))).toBe(true);
    const pkg = JSON.parse(
      readFileSync(join(ctx.testDir, "package.json"), "utf-8"),
    );
    expect(pkg.dependencies).toHaveProperty("@slidev/cli");
  });

  it("should create .gitignore", async () => {
    const { initCommand } = await import("../../commands/init");
    await initCommand([]);

    expect(existsSync(join(ctx.testDir, ".gitignore"))).toBe(true);
    const gitignore = readFileSync(join(ctx.testDir, ".gitignore"), "utf-8");
    expect(gitignore).toContain("node_modules");
    expect(gitignore).toContain("dist");
  });

  it("should use seriph template structure when specified", async () => {
    const { initCommand } = await import("../../commands/init");
    await initCommand(["-t", "seriph"]);

    const content = readFileSync(join(ctx.testDir, "slides.md"), "utf-8");
    // Seriph template has distinctive features like background cover
    expect(content).toContain("background: https://cover.sli.dev");
    expect(content).toContain("What is Slidev?");
  });

  it("should use seriph theme with seriph template when theme specified", async () => {
    const { initCommand } = await import("../../commands/init");
    await initCommand(["-t", "seriph", "--theme", "seriph"]);

    const content = readFileSync(join(ctx.testDir, "slides.md"), "utf-8");
    expect(content).toContain("theme: seriph");
  });

  it("should override theme regardless of template", async () => {
    const { initCommand } = await import("../../commands/init");
    await initCommand(["--theme", "dracula"]);

    const content = readFileSync(join(ctx.testDir, "slides.md"), "utf-8");
    expect(content).toContain("theme: dracula");
  });

  it("should use custom title when specified", async () => {
    const { initCommand } = await import("../../commands/init");
    await initCommand(["-n", "My Custom Talk"]);

    const content = readFileSync(join(ctx.testDir, "slides.md"), "utf-8");
    expect(content).toContain("My Custom Talk");
  });

  it("should add theme dependency for non-default themes", async () => {
    const { initCommand } = await import("../../commands/init");
    await initCommand(["--theme", "seriph"]);

    const pkg = JSON.parse(
      readFileSync(join(ctx.testDir, "package.json"), "utf-8"),
    );
    expect(pkg.dependencies).toHaveProperty("@slidev/theme-seriph");
  });
});

describe("init command help text", () => {
  const ctx = createTestContext();

  it("should document template option", async () => {
    const { initCommand } = await import("../../commands/init");
    await initCommand(["--help"]);

    const output = getFirstLogOutput(ctx);
    expect(output).toContain("--template");
    expect(output).toContain("-t");
  });

  it("should document theme option", async () => {
    const { initCommand } = await import("../../commands/init");
    await initCommand(["--help"]);

    const output = getFirstLogOutput(ctx);
    expect(output).toContain("--theme");
  });

  it("should document name option", async () => {
    const { initCommand } = await import("../../commands/init");
    await initCommand(["--help"]);

    const output = getFirstLogOutput(ctx);
    expect(output).toContain("--name");
    expect(output).toContain("-n");
  });

  it("should show examples", async () => {
    const { initCommand } = await import("../../commands/init");
    await initCommand(["--help"]);

    const output = getFirstLogOutput(ctx);
    expect(output).toContain("EXAMPLES");
  });
});
