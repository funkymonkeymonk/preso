---
description: Manage test presentations in devenv (list, select, serve, stop, validate)
---

Presentation management for CLI development. These scripts help test the preso CLI by managing presentations in the `presentations/` directory.

> **Note:** These are devenv scripts for CLI development only. Regular users should use the `preso` command directly.

**Usage:** `/slides <action> [args]`

**Available Actions:**
- `list` - Show all presentations (marks current with *)
- `select <name>` - Select a presentation to work on
- `validate` - Verify current selection is valid
- `serve` - Start dev server in background
- `stop` - Stop background dev server

**Arguments provided:** $ARGUMENTS

**Instructions:**

1. Parse the action from arguments
2. Run the corresponding devenv script:
   - `list` → `slides-list`
   - `select <name>` → `slides-select <name>`
   - `validate` → `slides-validate`
   - `serve` → `slides-serve`
   - `stop` → `slides-stop`

3. If no action provided, show available actions

**Examples:**
- `/slides list` - List all presentations
- `/slides select example` - Select "example" presentation
- `/slides serve` - Start dev server in background
- `/slides stop` - Stop background server

**For creating/building presentations, use preso commands:**
- `preso init` - Create new presentation (in current directory)
- `preso build` - Build static site
- `preso pdf` - Export to PDF
- `preso present` - Start presenter mode

**Important for agents:**
- Always run `slides-validate` before expecting the dev server to work
- Use `slides-select <name>` with the name argument to avoid interactive prompts
- Logs are written to `.devenv/slides.log` when using `slides-serve`
