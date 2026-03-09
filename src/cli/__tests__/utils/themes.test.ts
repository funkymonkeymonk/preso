/**
 * Tests for theme utilities
 */

import { describe, expect, it } from "bun:test";
import { OFFICIAL_THEMES, isOfficialTheme } from "../../utils/themes";

describe("OFFICIAL_THEMES", () => {
  it("should include default theme", () => {
    expect(OFFICIAL_THEMES).toContain("default");
  });

  it("should include seriph theme", () => {
    expect(OFFICIAL_THEMES).toContain("seriph");
  });

  it("should include apple-basic theme", () => {
    expect(OFFICIAL_THEMES).toContain("apple-basic");
  });

  it("should include bricks theme", () => {
    expect(OFFICIAL_THEMES).toContain("bricks");
  });

  it("should include dracula theme", () => {
    expect(OFFICIAL_THEMES).toContain("dracula");
  });

  it("should include geist theme", () => {
    expect(OFFICIAL_THEMES).toContain("geist");
  });

  it("should include purplin theme", () => {
    expect(OFFICIAL_THEMES).toContain("purplin");
  });

  it("should include shibainu theme", () => {
    expect(OFFICIAL_THEMES).toContain("shibainu");
  });

  it("should include unicorn theme", () => {
    expect(OFFICIAL_THEMES).toContain("unicorn");
  });

  it("should have exactly 9 official themes", () => {
    expect(OFFICIAL_THEMES.length).toBe(9);
  });

  it("should be a readonly tuple (as const assertion)", () => {
    // Verify it's an array with expected length
    // The 'as const' makes it a readonly tuple at compile time
    expect(Array.isArray(OFFICIAL_THEMES)).toBe(true);
    expect(OFFICIAL_THEMES.length).toBe(9);
  });
});

describe("isOfficialTheme", () => {
  it("should return true for default theme", () => {
    expect(isOfficialTheme("default")).toBe(true);
  });

  it("should return true for seriph theme", () => {
    expect(isOfficialTheme("seriph")).toBe(true);
  });

  it("should return true for all official themes", () => {
    for (const theme of OFFICIAL_THEMES) {
      expect(isOfficialTheme(theme)).toBe(true);
    }
  });

  it("should return false for non-official themes", () => {
    expect(isOfficialTheme("custom-theme")).toBe(false);
    expect(isOfficialTheme("my-theme")).toBe(false);
    expect(isOfficialTheme("nonexistent")).toBe(false);
  });

  it("should return false for empty string", () => {
    expect(isOfficialTheme("")).toBe(false);
  });

  it("should be case-sensitive", () => {
    expect(isOfficialTheme("Default")).toBe(false);
    expect(isOfficialTheme("DEFAULT")).toBe(false);
    expect(isOfficialTheme("Seriph")).toBe(false);
  });

  it("should return false for partial matches", () => {
    expect(isOfficialTheme("defaul")).toBe(false);
    expect(isOfficialTheme("defaultt")).toBe(false);
    expect(isOfficialTheme("apple")).toBe(false);
  });
});
