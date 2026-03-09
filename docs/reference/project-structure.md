# Project Structure Reference

Reference for preso presentation and configuration file organization.

## Presentation Structure

Each presentation is a standalone directory:

```
my-presentation/
├── slides.md           # Presentation content (required)
├── dist/               # Built static site (after preso build)
├── my-presentation.pdf # Exported PDF (after preso pdf)
└── .preso.log          # Server logs
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
  "defaultTheme": "seriph",
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

## Theme Structure

Custom themes follow Slidev's theme format:

```
my-theme/
├── package.json
├── styles/
│   ├── index.ts
│   ├── base.css
│   └── layouts.css
└── setup/
    └── unocss.ts
```

---

## Development Repository Structure

> **Note:** This section is only relevant for contributors developing the preso CLI itself.

```
preso/                      # CLI source repository
├── src/cli/                # CLI source code
│   ├── index.ts            # Entry point
│   ├── commands/           # Command implementations
│   └── utils/              # Shared utilities
├── presentations/          # Test presentations
│   └── example/
│       └── slides.md
├── docs/                   # Documentation
├── devenv.nix              # Development environment
├── .current-preso          # Current test presentation
├── AGENTS.md               # Agent instructions
└── README.md               # Project overview
```
