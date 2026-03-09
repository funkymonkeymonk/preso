/**
 * Tests for pdf command
 */

import { describe, expect, it } from "bun:test";
import { createTestContext, getFirstLogOutput } from "../helpers/testContext";

describe("pdfCommand", () => {
  const ctx = createTestContext();

  it("should show help with --help flag", async () => {
    const { pdfCommand } = await import("../../commands/pdf");
    await pdfCommand(["--help"]);
    expect(ctx.mocks.consoleLog).toHaveBeenCalled();
    const output = getFirstLogOutput(ctx);
    expect(output).toContain("Export the presentation to PDF");
  });

  it("should show help with -h flag", async () => {
    const { pdfCommand } = await import("../../commands/pdf");
    await pdfCommand(["-h"]);
    const output = getFirstLogOutput(ctx);
    expect(output).toContain("preso pdf");
  });

  it("should fail if no slides.md exists", async () => {
    const { pdfCommand } = await import("../../commands/pdf");
    await expect(pdfCommand([])).rejects.toThrow("process.exit");
  });
});

describe("pdf command help text", () => {
  const ctx = createTestContext();

  it("should document out option", async () => {
    const { pdfCommand } = await import("../../commands/pdf");
    await pdfCommand(["--help"]);

    const output = getFirstLogOutput(ctx);
    expect(output).toContain("--out");
    expect(output).toContain("-o");
  });

  it("should document dark option", async () => {
    const { pdfCommand } = await import("../../commands/pdf");
    await pdfCommand(["--help"]);

    const output = getFirstLogOutput(ctx);
    expect(output).toContain("--dark");
  });

  it("should document with-clicks option", async () => {
    const { pdfCommand } = await import("../../commands/pdf");
    await pdfCommand(["--help"]);

    const output = getFirstLogOutput(ctx);
    expect(output).toContain("--with-clicks");
  });

  it("should document with-toc option", async () => {
    const { pdfCommand } = await import("../../commands/pdf");
    await pdfCommand(["--help"]);

    const output = getFirstLogOutput(ctx);
    expect(output).toContain("--with-toc");
  });

  it("should include requirements section", async () => {
    const { pdfCommand } = await import("../../commands/pdf");
    await pdfCommand(["--help"]);

    const output = getFirstLogOutput(ctx);
    expect(output).toContain("REQUIREMENTS");
    expect(output).toContain("playwright");
  });
});
