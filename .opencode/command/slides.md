---
description: Manage presentations (list, select, theme, new, build, pdf, present, validate, start, stop, restart, status, logs)
---

Presentation management command. Run devenv scripts for slide operations and manage the presentation server.

**Arguments provided:** $ARGUMENTS

**Instructions:**

Parse the arguments and determine which action to take:

## No arguments → Show action selector

If `$ARGUMENTS` is empty, present a selection UI to the user using the `question` tool with these options:

| Action | Description |
|--------|-------------|
| `list` | Show all presentations (marks current with *) |
| `select` | Select a presentation to work on |
| `current` | Show currently selected presentation |
| `validate` | Verify current selection is valid |
| `new` | Create a new presentation |
| `theme` | Apply a theme or list available themes |
| `build` | Build static site for current presentation |
| `pdf` | Export current presentation to PDF |
| `present` | Start presenter mode with remote control |
| `start` | Start the presentation server |
| `stop` | Stop the presentation server |
| `restart` | Restart the presentation server |
| `status` | Show server status |
| `logs` | Show server logs |

After they select, proceed with that action (prompting for required args if needed).

## With arguments → Execute action

Parse the first argument as the action, remaining as args.

### Presentation Management Actions

| Action | Command | Required Args |
|--------|---------|---------------|
| `list` | `slides-list` | none |
| `select` | `slides-select <name>` | name (if missing, run without arg for fzf picker) |
| `current` | `slides-current` | none |
| `validate` | `slides-validate` | none |
| `new` | `slides-new <name>` | name (if missing, ask user) |
| `theme` | `slides-theme [name\|list]` | optional (if missing, run without arg for fzf picker) |
| `build` | `slides-build` | none |
| `pdf` | `slides-pdf` | none |
| `present` | `slides-present` | none |

### Server Management Actions

These actions control the Slidev dev server via devenv process management commands.

| Action | Command | Description |
|--------|---------|-------------|
| `start` | `devenv up -d` | Start process-compose in daemon mode |
| `stop` | `devenv processes stop` | Stop all processes |
| `restart` | `devenv processes stop && devenv up -d` | Restart process-compose |
| `status` | `devenv processes status` | Show process status |
| `logs [lines]` | `tail -n ${lines:-50} .devenv/processes.log` | Show recent logs |

After start/stop/restart, report the result to the user.

## Handling missing required arguments

For actions that need arguments (`select`, `new`, `theme`):

- **select**: If no name provided, run `slides-select` without args (triggers fzf picker)
- **new**: If no name provided, ask user "What should the presentation be called?" then run `slides-new <response>`
- **theme**: If no arg provided, run `slides-theme` without args (triggers fzf picker). If arg is `list`, run `slides-theme list`

## Unknown action

If the action doesn't match any known action, show an error and list available actions.

**Examples:**
- `/slides` → Shows action selector
- `/slides list` → Runs `slides-list`
- `/slides select` → Runs `slides-select` (fzf picker)
- `/slides select my-talk` → Runs `slides-select my-talk`
- `/slides new` → Asks for name, then runs `slides-new <name>`
- `/slides new my-talk` → Runs `slides-new my-talk`
- `/slides theme` → Runs `slides-theme` (fzf picker)
- `/slides theme list` → Runs `slides-theme list`
- `/slides theme dracula` → Runs `slides-theme dracula`
- `/slides build` → Runs `slides-build`
- `/slides start` → Starts the slides server
- `/slides stop` → Stops the slides server
- `/slides restart` → Restarts the slides server
- `/slides status` → Shows server status
- `/slides logs` → Shows last 50 lines of logs
- `/slides logs 100` → Shows last 100 lines of logs

**Important behaviors:**
- Always run commands via `devenv shell -- <command>` or directly if in devenv shell
- After `/slides select`, the slides process auto-restarts if running
- Use `/slides validate` before expecting the dev server to work
- Private themes are in `shared/themes/` and applied with relative paths
- Server logs are written to `.devenv/processes.log`
