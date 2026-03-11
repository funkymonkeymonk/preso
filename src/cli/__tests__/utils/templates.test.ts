/**
 * Tests for template utilities
 */

import { describe, expect, it } from "bun:test";
import {
  type Template,
  applyTemplateVariables,
  setFrontmatterTheme,
  slugToTitle,
  templates,
} from "../../utils/templates";

describe("templates", () => {
  it("should have basic template", () => {
    expect(templates.basic).toBeDefined();
    expect(templates.basic.name).toBe("basic");
    expect(templates.basic.theme).toBe("default");
    expect(templates.basic.content).toContain("{{title}}");
  });

  it("should have seriph template", () => {
    expect(templates.seriph).toBeDefined();
    expect(templates.seriph.name).toBe("seriph");
    expect(templates.seriph.theme).toBe("seriph");
    expect(templates.seriph.content).toContain("theme: seriph");
  });

  it("should have minimal template", () => {
    expect(templates.minimal).toBeDefined();
    expect(templates.minimal.name).toBe("minimal");
    expect(templates.minimal.theme).toBe("default");
  });

  it("each template should have required properties", () => {
    for (const [key, template] of Object.entries(templates)) {
      expect(template.name).toBe(key);
      expect(typeof template.description).toBe("string");
      expect(typeof template.theme).toBe("string");
      expect(typeof template.content).toBe("string");
    }
  });
});

describe("applyTemplateVariables", () => {
  it("should replace single variable", () => {
    const template: Template = {
      name: "test",
      description: "Test template",
      theme: "default",
      content: "Hello, {{name}}!",
    };

    const result = applyTemplateVariables(template, { name: "World" });
    expect(result).toBe("Hello, World!");
  });

  it("should replace multiple occurrences of same variable", () => {
    const template: Template = {
      name: "test",
      description: "Test template",
      theme: "default",
      content: "{{title}} - {{title}} again",
    };

    const result = applyTemplateVariables(template, { title: "My Talk" });
    expect(result).toBe("My Talk - My Talk again");
  });

  it("should replace multiple different variables", () => {
    const template: Template = {
      name: "test",
      description: "Test template",
      theme: "default",
      content: "{{greeting}}, {{name}}! Welcome to {{place}}.",
    };

    const result = applyTemplateVariables(template, {
      greeting: "Hello",
      name: "Alice",
      place: "Wonderland",
    });
    expect(result).toBe("Hello, Alice! Welcome to Wonderland.");
  });

  it("should leave unreferenced placeholders unchanged", () => {
    const template: Template = {
      name: "test",
      description: "Test template",
      theme: "default",
      content: "{{known}} and {{unknown}}",
    };

    const result = applyTemplateVariables(template, { known: "replaced" });
    expect(result).toBe("replaced and {{unknown}}");
  });

  it("should work with actual basic template", () => {
    const result = applyTemplateVariables(templates.basic, {
      title: "My Presentation",
    });
    expect(result).toContain("# My Presentation");
    expect(result).not.toContain("{{title}}");
  });
});

describe("slugToTitle", () => {
  it("should convert hyphen-separated slug to title case", () => {
    expect(slugToTitle("my-talk")).toBe("My Talk");
  });

  it("should convert underscore-separated slug to title case", () => {
    expect(slugToTitle("my_talk")).toBe("My Talk");
  });

  it("should handle single word", () => {
    expect(slugToTitle("presentation")).toBe("Presentation");
  });

  it("should handle multiple hyphens", () => {
    expect(slugToTitle("my-awesome-talk")).toBe("My Awesome Talk");
  });

  it("should handle mixed separators", () => {
    expect(slugToTitle("my-talk_today")).toBe("My Talk Today");
  });

  it("should handle uppercase letters in input", () => {
    expect(slugToTitle("MY-TALK")).toBe("My Talk");
  });

  it("should handle already capitalized words", () => {
    expect(slugToTitle("My-Talk")).toBe("My Talk");
  });

  it("should handle empty string", () => {
    expect(slugToTitle("")).toBe("");
  });
});

describe("setFrontmatterTheme", () => {
  it("should replace existing theme in frontmatter", () => {
    const content = `---
theme: default
title: My Talk
---

# Content`;

    const result = setFrontmatterTheme(content, "seriph");
    expect(result).toContain("theme: seriph");
    expect(result).not.toContain("theme: default");
  });

  it("should add theme to existing frontmatter without theme", () => {
    const content = `---
title: My Talk
---

# Content`;

    const result = setFrontmatterTheme(content, "dracula");
    expect(result).toContain("theme: dracula");
    expect(result).toContain("title: My Talk");
  });

  it("should add frontmatter with theme when none exists", () => {
    const content = "# My Presentation";

    const result = setFrontmatterTheme(content, "seriph");
    expect(result).toBe(`---
theme: seriph
---

# My Presentation`);
  });

  it("should preserve other frontmatter fields", () => {
    const content = `---
theme: default
title: My Talk
author: John
class: text-center
---

# Content`;

    const result = setFrontmatterTheme(content, "unicorn");
    expect(result).toContain("theme: unicorn");
    expect(result).toContain("title: My Talk");
    expect(result).toContain("author: John");
    expect(result).toContain("class: text-center");
  });

  it("should handle theme at different positions in frontmatter", () => {
    const content = `---
title: My Talk
theme: old-theme
author: John
---

# Content`;

    const result = setFrontmatterTheme(content, "new-theme");
    expect(result).toContain("theme: new-theme");
    expect(result).not.toContain("theme: old-theme");
  });

  it("should not modify theme-like content outside frontmatter", () => {
    const content = `---
theme: default
---

# Theme Guide

Set theme: example in your config`;

    const result = setFrontmatterTheme(content, "seriph");
    expect(result).toContain("theme: seriph");
    // The content outside frontmatter should remain unchanged
    expect(result).toContain("Set theme: example in your config");
  });
});
