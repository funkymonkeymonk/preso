/**
 * Tests for version module
 */

import { describe, expect, it } from "bun:test";
import { version } from "../version";

describe("version", () => {
  it("should be a non-empty string", () => {
    expect(typeof version).toBe("string");
    expect(version.length).toBeGreaterThan(0);
  });

  it("should follow semver format or be dev version", () => {
    // Version should be either:
    // - semantic version: x.y.z
    // - dev version: 0.0.0-dev
    // - dev version with commit: 0.0.0-dev+abc1234
    const semverPattern = /^\d+\.\d+\.\d+(-[\w.+]+)?$/;
    expect(version).toMatch(semverPattern);
  });

  it("should be 0.0.0-dev in development (when BUILD_VERSION not defined)", () => {
    // In test environment, BUILD_VERSION is typically not defined
    // so it should fall back to dev version
    expect(version).toBe("0.0.0-dev");
  });
});
