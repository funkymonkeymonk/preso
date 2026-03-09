# Project Structure Reference

Reference for preso presentation and configuration file organization.

## Presentation Structure

Each presentation is a standalone directory:

```
my-presentation/
├── slides.md           # Presentation content (required)
├── package.json        # Dependencies (created by preso init)
├── .gitignore          # Git ignore rules (created by preso init)
├── node_modules/       # Installed packages (after bun install)
├── dist/               # Built static site (after preso build)
└── my-presentation.pdf # Exported PDF (after preso pdf)
```

## Global Configuration

User-level configuration and themes:

```
~/.config/preso/
├── config.json         # Global settings
└── themes/             # Custom themes
    └── my-theme/
        ├── package.json
        └── styles/
```

## Configuration File

`~/.config/preso/config.json`:

```json
{
  "defaultTheme": "default",
  "defaultTemplate": "basic",
  "defaultPort": 3030
}
```

Manage with:
```bash
preso config show
preso config set defaultTheme dracula
```

## Presentation File (slides.md)

The `slides.md` file contains frontmatter and content:

```markdown
---
theme: seriph
title: My Presentation
---

# First Slide

Content here

---

# Second Slide

More content
```

## Related

- [Theme Structure Reference](theme-structure.md) - Custom theme file organization
- [Contributing Guide](../contributing/getting-started.md) - Repository structure for contributors
