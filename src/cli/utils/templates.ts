/**
 * Template utilities - embedded default templates
 */

export interface Template {
  name: string;
  description: string;
  theme: string;
  content: string;
}

/**
 * Default embedded templates
 */
export const templates: Record<string, Template> = {
  basic: {
    name: "basic",
    description: "A minimal starter template",
    theme: "default",
    content: `---
theme: default
title: {{title}}
---

# {{title}}

Your presentation starts here.

---

# Slide 2

Add your content.

---

# Thank You

Questions?
`,
  },
  seriph: {
    name: "seriph",
    description: "Clean and elegant theme with animations",
    theme: "seriph",
    content: `---
theme: seriph
title: {{title}}
background: https://cover.sli.dev
class: text-center
---

# {{title}}

Presentation slides made simple

<div class="pt-12">
  <span @click="$slidev.nav.next" class="px-2 py-1 rounded cursor-pointer" hover="bg-white bg-opacity-10">
    Press Space for next page <carbon:arrow-right class="inline"/>
  </span>
</div>

---

# What is Slidev?

Slidev is a slides maker and presenter designed for developers.

- **Text-based** - focus on content with Markdown
- **Themeable** - themes can be shared and used with npm packages
- **Developer Friendly** - code highlighting, live coding

---
layout: center
class: text-center
---

# Learn More

[Documentation](https://sli.dev) · [GitHub](https://github.com/slidevjs/slidev)

---
layout: end
---

# Thank You!
`,
  },
  minimal: {
    name: "minimal",
    description: "Ultra-minimal template for quick notes",
    theme: "default",
    content: `---
theme: default
title: {{title}}
---

# {{title}}

---

# 
`,
  },
};

/**
 * Get a template by name
 */
export function getTemplate(name: string): Template | undefined {
  return templates[name];
}

/**
 * List available templates
 */
export function listTemplates(): Template[] {
  return Object.values(templates);
}

/**
 * Apply template variables
 */
export function applyTemplateVariables(template: Template, vars: Record<string, string>): string {
  let content = template.content;
  for (const [key, value] of Object.entries(vars)) {
    content = content.replace(new RegExp(`{{${key}}}`, "g"), value);
  }
  return content;
}

/**
 * Convert slug to title case
 */
export function slugToTitle(slug: string): string {
  return slug
    .split(/[-_]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}
