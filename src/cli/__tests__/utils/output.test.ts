/**
 * Tests for output utilities
 */

import { afterEach, beforeEach, describe, expect, it, mock } from "bun:test";
import {
  ExitCode,
  Spinner,
  colors,
  error,
  header,
  info,
  success,
} from "../../utils/output";

describe("ExitCode", () => {
  it("should have correct exit code values", () => {
    expect(ExitCode.SUCCESS).toBe(0);
    expect(ExitCode.GENERAL_ERROR).toBe(1);
    expect(ExitCode.INVALID_ARGUMENT).toBe(2);
    expect(ExitCode.FILE_NOT_FOUND).toBe(3);
    expect(ExitCode.PORT_IN_USE).toBe(4);
    expect(ExitCode.DEPENDENCY_MISSING).toBe(5);
    expect(ExitCode.BUILD_FAILED).toBe(6);
    expect(ExitCode.EXPORT_FAILED).toBe(7);
  });
});

describe("colors", () => {
  it("should have ANSI escape codes for each color", () => {
    expect(colors.reset).toBe("\x1b[0m");
    expect(colors.bold).toBe("\x1b[1m");
    expect(colors.dim).toBe("\x1b[2m");
    expect(colors.red).toBe("\x1b[31m");
    expect(colors.green).toBe("\x1b[32m");
    expect(colors.yellow).toBe("\x1b[33m");
    expect(colors.blue).toBe("\x1b[34m");
    expect(colors.magenta).toBe("\x1b[35m");
    expect(colors.cyan).toBe("\x1b[36m");
  });
});

describe("output functions", () => {
  let consoleLogSpy: ReturnType<typeof mock>;
  let consoleErrorSpy: ReturnType<typeof mock>;

  beforeEach(() => {
    consoleLogSpy = mock(() => {});
    consoleErrorSpy = mock(() => {});
    console.log = consoleLogSpy;
    console.error = consoleErrorSpy;
  });

  describe("success", () => {
    it("should output green text", () => {
      success("Test message");
      expect(consoleLogSpy).toHaveBeenCalledWith(
        `${colors.green}Test message${colors.reset}`,
      );
    });
  });

  describe("error", () => {
    it("should output red error text to stderr", () => {
      error("Test error");
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        `${colors.red}Error: Test error${colors.reset}`,
      );
    });
  });

  describe("info", () => {
    it("should output blue text", () => {
      info("Test info");
      expect(consoleLogSpy).toHaveBeenCalledWith(
        `${colors.blue}Test info${colors.reset}`,
      );
    });
  });

  describe("header", () => {
    it("should output bold text with newline", () => {
      header("Test header");
      expect(consoleLogSpy).toHaveBeenCalledWith(
        `\n${colors.bold}Test header${colors.reset}`,
      );
    });
  });
});

describe("Spinner", () => {
  let stdoutWriteSpy: ReturnType<typeof mock>;
  let originalStdoutWrite: typeof process.stdout.write;

  beforeEach(() => {
    originalStdoutWrite = process.stdout.write;
    stdoutWriteSpy = mock(() => true);
    process.stdout.write = stdoutWriteSpy as typeof process.stdout.write;
  });

  afterEach(() => {
    process.stdout.write = originalStdoutWrite;
  });

  it("should display initial frame on start", () => {
    const spinner = new Spinner("Loading");
    spinner.start();
    expect(stdoutWriteSpy).toHaveBeenCalledWith("⠋ Loading");
    spinner.stop();
  });

  it("should clear and display final message on stop", () => {
    const spinner = new Spinner("Loading");
    spinner.start();
    stdoutWriteSpy.mockClear();
    spinner.stop("Done!");
    // Should clear the line and print final message
    expect(stdoutWriteSpy).toHaveBeenCalled();
  });

  it("should show success icon on succeed", () => {
    const consoleLogSpy = mock(() => {});
    console.log = consoleLogSpy;

    const spinner = new Spinner("Loading");
    spinner.start();
    spinner.succeed("Completed");

    expect(consoleLogSpy).toHaveBeenCalledWith(
      `${colors.green}✔${colors.reset} Completed`,
    );
  });

  it("should show failure icon on fail", () => {
    const consoleLogSpy = mock(() => {});
    console.log = consoleLogSpy;

    const spinner = new Spinner("Loading");
    spinner.start();
    spinner.fail("Failed");

    expect(consoleLogSpy).toHaveBeenCalledWith(
      `${colors.red}✖${colors.reset} Failed`,
    );
  });

  it("should use original message when no message provided to succeed", () => {
    const consoleLogSpy = mock(() => {});
    console.log = consoleLogSpy;

    const spinner = new Spinner("Original message");
    spinner.start();
    spinner.succeed();

    expect(consoleLogSpy).toHaveBeenCalledWith(
      `${colors.green}✔${colors.reset} Original message`,
    );
  });

  it("should use original message when no message provided to fail", () => {
    const consoleLogSpy = mock(() => {});
    console.log = consoleLogSpy;

    const spinner = new Spinner("Original message");
    spinner.start();
    spinner.fail();

    expect(consoleLogSpy).toHaveBeenCalledWith(
      `${colors.red}✖${colors.reset} Original message`,
    );
  });

  it("should return this from start for chaining", () => {
    const spinner = new Spinner("Loading");
    const result = spinner.start();
    expect(result).toBe(spinner);
    spinner.stop();
  });
});
