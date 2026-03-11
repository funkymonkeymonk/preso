/**
 * Tests for config utilities
 */

import { afterEach, beforeEach, describe, expect, it, mock } from "bun:test";
import { existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  type GlobalConfig,
  findSlidesFile,
  resolvePort,
} from "../../utils/config";

describe("findSlidesFile", () => {
  let testDir: string;

  beforeEach(() => {
    testDir = join(
      tmpdir(),
      `preso-test-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    );
    mkdirSync(testDir, { recursive: true });
  });

  afterEach(() => {
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true, force: true });
    }
  });

  it("should return path when slides.md exists", () => {
    writeFileSync(join(testDir, "slides.md"), "# Test");
    const result = findSlidesFile(testDir);
    expect(result).toBe(join(testDir, "slides.md"));
  });

  it("should return null when slides.md does not exist", () => {
    const result = findSlidesFile(testDir);
    expect(result).toBeNull();
  });

  it("should return null for empty directory", () => {
    const result = findSlidesFile(testDir);
    expect(result).toBeNull();
  });

  it("should not find slides.md in subdirectories", () => {
    const subdir = join(testDir, "subdir");
    mkdirSync(subdir);
    writeFileSync(join(subdir, "slides.md"), "# Test");
    const result = findSlidesFile(testDir);
    expect(result).toBeNull();
  });

  it("should find slides.md regardless of content", () => {
    writeFileSync(join(testDir, "slides.md"), "");
    const result = findSlidesFile(testDir);
    expect(result).toBe(join(testDir, "slides.md"));
  });
});

describe("resolvePort", () => {
  const defaultConfig: GlobalConfig = {
    defaultTheme: "default",
    defaultTemplate: "basic",
    defaultPort: 3030,
  };

  it("should return parsed port when argument provided", () => {
    const result = resolvePort("4000", defaultConfig);
    expect(result).toBe(4000);
  });

  it("should return config default when no argument", () => {
    const result = resolvePort(undefined, defaultConfig);
    expect(result).toBe(3030);
  });

  it("should return config default for custom port", () => {
    const customConfig = { ...defaultConfig, defaultPort: 8080 };
    const result = resolvePort(undefined, customConfig);
    expect(result).toBe(8080);
  });

  it("should parse port string correctly", () => {
    expect(resolvePort("1", defaultConfig)).toBe(1);
    expect(resolvePort("65535", defaultConfig)).toBe(65535);
    expect(resolvePort("8080", defaultConfig)).toBe(8080);
  });

  it("should return NaN for non-numeric strings (validation happens elsewhere)", () => {
    const result = resolvePort("abc", defaultConfig);
    expect(Number.isNaN(result)).toBe(true);
  });

  it("should return default for empty string (treated as falsy)", () => {
    // Empty string is falsy, so falls back to config default
    const result = resolvePort("", defaultConfig);
    expect(result).toBe(3030);
  });
});
