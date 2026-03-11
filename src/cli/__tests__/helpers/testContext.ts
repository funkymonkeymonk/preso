/**
 * Test context helper - eliminates boilerplate across command tests
 */

import { afterEach, beforeEach, mock } from "bun:test";
import { existsSync, mkdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

export interface TestContext {
  testDir: string;
  originalCwd: string;
  mocks: {
    consoleLog: ReturnType<typeof mock>;
    consoleError: ReturnType<typeof mock>;
  };
}

/**
 * Creates a test context with temp directory and mocked console/process.exit
 *
 * Usage:
 * ```ts
 * describe("myCommand", () => {
 *   const ctx = createTestContext();
 *
 *   it("should do something", async () => {
 *     // ctx.testDir is the temp directory
 *     // ctx.mocks.consoleLog captures console.log calls
 *   });
 * });
 * ```
 */
export function createTestContext(): TestContext {
  const ctx: TestContext = {
    testDir: "",
    originalCwd: "",
    mocks: {
      consoleLog: mock(() => {}),
      consoleError: mock(() => {}),
    },
  };

  let originalExit: typeof process.exit;
  let originalConsoleLog: typeof console.log;
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    ctx.testDir = join(
      tmpdir(),
      `preso-test-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    );
    mkdirSync(ctx.testDir, { recursive: true });
    ctx.originalCwd = process.cwd();
    process.chdir(ctx.testDir);

    // Reset mocks
    ctx.mocks.consoleLog = mock(() => {});
    ctx.mocks.consoleError = mock(() => {});

    // Store originals
    originalConsoleLog = console.log;
    originalConsoleError = console.error;
    originalExit = process.exit;

    // Apply mocks
    console.log = ctx.mocks.consoleLog;
    console.error = ctx.mocks.consoleError;
    process.exit = mock((code?: number) => {
      throw new Error(`process.exit called with ${code}`);
    }) as never;
  });

  afterEach(() => {
    process.chdir(ctx.originalCwd);
    if (existsSync(ctx.testDir)) {
      rmSync(ctx.testDir, { recursive: true, force: true });
    }
    // Restore originals
    console.log = originalConsoleLog;
    console.error = originalConsoleError;
    process.exit = originalExit;
  });

  return ctx;
}

/**
 * Get all console.log output as a single string
 */
export function getLogOutput(ctx: TestContext): string {
  return ctx.mocks.consoleLog.mock.calls.map((call) => call[0]).join("\n");
}

/**
 * Get the first console.log call (typically help text)
 */
export function getFirstLogOutput(ctx: TestContext): string {
  return ctx.mocks.consoleLog.mock.calls[0]?.[0] ?? "";
}
