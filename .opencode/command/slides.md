---
description: Manage presentations (list, select, new, build, pdf, present, validate, serve, stop)
---

Presentation management command. Run devenv scripts for slide operations.

**Usage:** `/slides <action> [args]`

**Actions:**
- `list` - Show all presentations (marks current with *)
- `select <name>` - Select a presentation to work on
- `current` - Show currently selected presentation
- `validate` - Verify current selection is valid
- `new <name>` - Create a new presentation
- `serve` - Start dev server in background (recommended for agents)
- `stop` - Stop background dev server
- `build` - Build static site for current presentation
- `pdf` - Export current presentation to PDF
- `present` - Start presenter mode with remote control

**Arguments provided:** $ARGUMENTS

**Instructions:**

1. Parse the action from arguments
2. Run the corresponding devenv script:
   - `list` → `slides-list`
   - `select <name>` → `slides-select <name>`
   - `current` → `slides-current`
   - `validate` → `slides-validate`
   - `new <name>` → `slides-new <name>`
   - `serve` → `slides-serve`
   - `stop` → `slides-stop`
   - `build` → `slides-build`
   - `pdf` → `slides-pdf`
   - `present` → `slides-present`

3. If no action provided, show available actions

**Examples:**
- `/slides list` - List all presentations
- `/slides select my-talk` - Select "my-talk" presentation
- `/slides new kubernetes-intro` - Create new presentation
- `/slides serve` - Start dev server in background
- `/slides stop` - Stop background server
- `/slides build` - Build current presentation

**Important for agents:**
- Always run `/slides validate` before expecting the dev server to work
- Use `/slides select <name>` with the name argument to avoid interactive prompts
- After `/slides select`, the slides process auto-restarts if running
- Use `/slides serve` for background server (not `devenv up -d`)
- Logs are written to `.devenv/slides.log` when using `slides-serve`
