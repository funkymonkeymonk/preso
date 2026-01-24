# AGENTS.md

> **PRESO** - *PRESO Renders Engaging Slides On-demand*

## Project Overview

PRESO is an AI-powered Slidev presentation repository with integrated OpenCode process control for agent development sessions. This project uses **devenv** for all automation - scripts, processes, and environment management are defined in `devenv.nix`.

## Tech Stack

- **Slidev** - Markdown-based presentation framework
- **devenv/Nix** - Development environment management + scripts + processes
- **process-compose** - Process orchestration with TUI/API (via devenv)
- **zellij** - Terminal multiplexer for session management

## Key Files

| File | Purpose |
|------|---------|
| `devenv.nix` | **Primary entry point** - all scripts, processes, and environment config |
| `presentations/*/slides.md` | Presentation content (one per presentation) |
| `.current-preso` | Currently selected presentation name |
| `docs/plans/` | Design documents and implementation plans |

## Quick Reference: Common Commands

### Working with Presentations

```bash
# List all presentations (shows which is current)
slides-list

# Select a presentation to work on
slides-select my-talk

# Show currently selected presentation
slides-current

# Create a new presentation
slides-new my-new-talk

# Start development server (via process-compose)
devenv up

# Build static site
slides-build

# Export to PDF
slides-pdf

# Start presenter mode
slides-present
```

### Managing Agent Sessions

```bash
# Start a new agent session (creates zellij + process-compose + opencode)
agent-start

# List all active sessions for this repo
agent-sessions

# Connect to an existing session
agent-connect [short-id]
```

## Presentation Selection System

The project maintains a "current presentation" context stored in `.current-preso`. The `slides` process reads this file on startup.

**Selection Priority (highest to lowest):**
1. `PRESO` environment variable
2. `.current-preso` file in project root
3. Interactive fzf picker (fallback for humans)

### Critical: Validation

The `.current-preso` file must reference an **existing** presentation directory. If it references a non-existent presentation, the slides process will start but Slidev won't bind to any port.

**Before starting slides, always verify:**
```bash
# Check current selection exists
slides-current

# List available presentations
slides-list

# If invalid, select a valid one
slides-select example
```

## Process-Compose Integration

### How It Works

When you run `devenv up`, process-compose starts and manages the `slides` process. The slides process:
1. Reads `.current-preso` to get the presentation name
2. Runs `npm run dev -- presentations/$PRESO/slides.md`
3. Serves on port 3030 (default Slidev port)

### Unix Socket API (Not HTTP Port)

**Important:** Process-compose uses a Unix socket, NOT the HTTP port configured in devenv.nix. The socket location is dynamic:

```bash
# Find the socket
SOCKET=$(find /var/folders -name "pc.sock" -path "*/devenv-*/pc.sock" 2>/dev/null | head -1)

# Query processes
curl -s --unix-socket "$SOCKET" http://localhost/processes | jq .

# Restart slides after changing .current-preso
curl -s --unix-socket "$SOCKET" -X POST http://localhost/process/restart/slides

# Get process logs
curl -s --unix-socket "$SOCKET" "http://localhost/process/logs/slides/0/100" | jq .
```

### Useful API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/processes` | GET | List all processes with status |
| `/process/restart/{name}` | POST | Restart a process |
| `/process/stop/{name}` | POST | Stop a process |
| `/process/start/{name}` | POST | Start a process |
| `/process/logs/{name}/{offset}/{limit}` | GET | Get process logs |
| `/process/info/{name}` | GET | Get detailed process info |

### Changing Presentations

To switch presentations while `devenv up` is running:

```bash
# 1. Update selection
slides-select other-presentation

# 2. The slides-select script automatically restarts the process
#    Or manually restart via API:
curl -s --unix-socket "$SOCKET" -X POST http://localhost/process/restart/slides
```

## Troubleshooting

### Slides not accessible on port 3030

**Symptoms:** Process shows "Running" but nothing on port 3030

**Diagnosis:**
```bash
# Check what's on port 3030
lsof -i :3030

# Check process logs
SOCKET=$(find /var/folders -name "pc.sock" -path "*/devenv-*/pc.sock" 2>/dev/null | head -1)
curl -s --unix-socket "$SOCKET" "http://localhost/process/logs/slides/0/50" | jq -r '.logs[]'
```

**Common causes:**
1. `.current-preso` references non-existent presentation
2. Presentation's `slides.md` file is missing
3. Another slidev instance grabbed the port

**Fix:**
```bash
# Verify and fix selection
ls presentations/
slides-select <valid-name>
```

### Multiple slidev processes

If you see multiple slidev processes (check with `pgrep -fl slidev`), kill orphans:
```bash
pkill -f "slidev presentations"
# Then restart via process-compose
curl -s --unix-socket "$SOCKET" -X POST http://localhost/process/restart/slides
```

## For Agents: Important Guidelines

1. **Validate before starting** - Always verify `.current-preso` references an existing presentation before expecting slides to work

2. **Never use `slides-dev &`** - Use `devenv up` for the managed process. Running `slides-dev` in background creates orphan processes

3. **Use the Unix socket** - The process-compose API is on a Unix socket, not HTTP port 8080

4. **Pass arguments** - Use `slides-select my-talk` not `slides-select` to avoid interactive prompts

5. **Check logs on failure** - If slides isn't working, check process-compose logs via the API

6. **Restart after selection change** - After modifying `.current-preso`, restart the slides process

## Quick Fixes

| Symptom | Diagnosis | Fix |
|---------|-----------|-----|
| Port 3030 not responding | `slides-validate` | `slides-select example` |
| Wrong presentation showing | `slides-current` | `slides-select <correct-name>` |
| Multiple slidev processes | `pgrep -fl slidev` | `pkill -f "slidev presentations"` |
| Process-compose not running | Check if `devenv up` running | Run `devenv up` |
| Socket not found | Process-compose not started | Run `devenv up` |
| Build fails | Check slides-validate | Fix selection, then `slides-build` |

## Available Skills

This project includes OpenCode skills in `.opencode/skills/`:

| Skill | Purpose |
|-------|---------|
| `slidev-authoring` | Slidev markdown syntax, layouts, transitions, components |
| `presentation-workflow` | Selecting, building, exporting presentations |

Load a skill when you need detailed guidance on these topics.

## Agent Session Architecture

The `agent-start` script creates a zellij session with:
- **Left/Top pane (30%)**: process-compose TUI for process visibility
- **Right/Bottom pane (70%)**: OpenCode for coding

Sessions are named `<repo>-<shortid>` (e.g., `preso-a3f2`).

### Environment Variables in Agent Sessions

When running inside an agent session:
- `OPENCODE_ACTIVE_PORT` - Intended for process-compose (but socket is used instead)
- `OPENCODE_SESSION_NAME` - The current session name

## When Editing

- Presentation content: `presentations/<name>/slides.md`
- Scripts and processes: `devenv.nix`
- Design docs: `docs/plans/`
- Shared assets: `shared/` (for cross-presentation resources)
- Private themes: `local/themes/<theme-name>/` (gitignored)

## Slidev Syntax Quick Reference

### Slide Structure

```md
---
theme: ../../local/themes/my-theme   # Theme path relative to slides.md
layout: cover                           # Layout for this slide
---

# Slide Title

Content here

---

# Next Slide

More content
```

### Built-in Layouts

| Layout | Purpose |
|--------|---------|
| `cover` | Title/cover slide (first slide default) |
| `default` | Standard content slide |
| `center` | Centered content |
| `two-cols` | Two columns (use `::right::` slot) |
| `two-cols-header` | Header + two columns |
| `image` / `image-left` / `image-right` | Image layouts |
| `quote` | Quotation display |
| `section` | Section divider |
| `fact` / `statement` | Big text/data display |
| `intro` / `end` | Intro/outro slides |

### Animations

```md
<v-click>This appears on click</v-click>

<v-clicks>

- Item 1 (click 1)
- Item 2 (click 2)
- Item 3 (click 3)

</v-clicks>
```

### Code Highlighting

````md
```ts {2,3}           # Highlight lines 2-3
```ts {1|2-3|all}     # Click to reveal: line 1, then 2-3, then all
```ts {monaco}        # Interactive Monaco editor
```ts {monaco-run}    # Runnable code
````

### Two-Column Layout

```md
---
layout: two-cols
---

# Left Column

Content on the left

::right::

# Right Column

Content on the right
```

### Presenter Notes

```md
# Slide Title

Content visible to audience

<!--
These are presenter notes.
Only visible in presenter view.
-->
```

## Theme Development

### Theme Structure

```
local/themes/<theme-name>/
├── package.json           # Theme metadata + slidev config
├── styles/
│   ├── index.ts          # Style imports
│   ├── layouts.css       # Layout-specific styles  
│   ├── code.css          # Syntax highlighting
│   └── base.css          # Base styles + fonts
└── setup/
    └── unocss.ts         # UnoCSS overrides (bg-main, shortcuts)
```

### Theme Path Resolution

Theme paths in slides.md are **relative to the slides.md file location**:

```md
# In presentations/my-talk/slides.md
---
theme: ../../shared/themes/my-theme   # Goes up to project root
---
```

### Key Theme Files

**package.json** - Theme metadata:
```json
{
  "name": "slidev-theme-name",
  "slidev": {
    "colorSchema": "both",
    "defaults": {
      "fonts": { "sans": "CustomFont", "local": "CustomFont" }
    }
  }
}
```

**setup/unocss.ts** - Override UnoCSS shortcuts:
```ts
import { defineUnoSetup } from '@slidev/types'

export default defineUnoSetup(() => ({
  shortcuts: {
    'bg-main': 'bg-[#fafbfc] text-[#1c1d1f] dark:bg-[#192133] dark:text-white',
  },
}))
```

**styles/layouts.css** - Layout styling:
```css
:root {
  --slidev-theme-primary: #0075de;
}

.slidev-layout h1 {
  color: var(--slidev-theme-primary);
}

.slidev-layout.cover {
  background: linear-gradient(...) !important;
  color: white !important;
}
```

### Important: bg-main Shortcut

The slide background is controlled by UnoCSS's `bg-main` shortcut, NOT CSS on `.slidev-layout`. To change the background color, override `bg-main` in `setup/unocss.ts`.

## Custom Themes

Custom themes can be stored in `local/themes/<theme-name>/` (gitignored for proprietary themes) or `shared/themes/` (committed).

### Using a Custom Theme

```md
---
theme: ../../local/themes/my-theme
layout: cover
---

# My Presentation
```
