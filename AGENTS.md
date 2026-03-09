# AGENTS.md

> **PRESO** - Slidev presentation CLI

Quick reference for AI agents. For detailed help: `preso llm`

## Key Concept

**One directory = one presentation.** The current working directory is the presentation.

## Essential Commands

```bash
# Create presentation
mkdir my-talk && cd my-talk
preso init

# Develop
preso serve              # Start dev server on :3030
preso serve -p 3031      # Use different port

# Export
preso build              # Static site -> ./dist
preso pdf                # PDF export

# Present
preso present            # Speaker notes view
```

## LLM-Optimized Discovery

```bash
preso llm                # Compact help (minimal tokens)
preso llm status         # JSON: cwd, slides exist, port status
preso llm debug          # Troubleshooting info
preso llm schema         # Structured command schema for tool use
```

## Quick Fixes

| Problem | Solution |
|---------|----------|
| "No slides.md" | `preso init` |
| "Port in use" | `preso serve -p <other>` |
| PDF fails | `bunx playwright install chromium` |

## File Locations

| Item | Location |
|------|----------|
| Presentation | `./slides.md` (current directory) |
| Global config | `~/.config/preso/config.json` |
| Custom themes | `~/.config/preso/themes/` |
| Logs | `./.preso.log` |

## Slidev Syntax

```markdown
---
theme: seriph
---

# Slide Title

Content here

---

# Next Slide
```

### Layouts
`cover`, `default`, `center`, `two-cols`, `image-right`, `section`, `quote`

### Code
````markdown
```ts {2,3}           # Highlight lines
```ts {1|2-3|all}     # Click to reveal
````

### Notes
```markdown
# Slide

Content

<!--
Speaker notes here
-->
```

## CLI Architecture

```
src/cli/
├── index.ts           # Entry, command routing
├── version.ts         # Build-time version
├── commands/
│   ├── init.ts        # preso init
│   ├── serve.ts       # preso serve
│   ├── build.ts       # preso build
│   ├── pdf.ts         # preso pdf
│   ├── present.ts     # preso present
│   ├── theme.ts       # preso theme
│   ├── config.ts      # preso config
│   └── llm.ts         # preso llm
└── utils/
    ├── config.ts      # Global + local config
    ├── output.ts      # Console helpers
    ├── templates.ts   # Embedded templates
    └── themes.ts      # Theme registry
```

## Building (Contributors Only)

For contributors developing the preso CLI itself using [devenv](https://devenv.sh):

```bash
devenv shell
preso-dev serve          # Run in dev mode
preso-build              # Build current platform
preso-build-all          # Build all platforms
```
