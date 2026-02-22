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

These actions control the Slidev dev server via devenv process management.

| Action | Command | Description |
|--------|---------|-------------|
| `start` | `devenv up -d` | Start process-compose in background (daemon mode) |
| `stop` | `devenv processes down` | Stop all background processes |
| `restart` | Restart via socket API | Restart the slides process |
| `status` | Query socket API | Show process status |
| `logs [lines]` | Query socket API | Show recent logs |

**Important:** Process-compose uses a Unix socket, not an HTTP port. Find it with:
```bash
SOCKET=$(find /var/folders -name "pc.sock" -path "*/devenv-*/pc.sock" 2>/dev/null | head -1)
```

For `restart`, `status`, and `logs`, use the Unix socket API:
```bash
# Restart
curl -s --unix-socket "$SOCKET" -X POST http://localhost/process/restart/slides

# Status  
curl -s --unix-socket "$SOCKET" http://localhost/processes | jq '.[] | select(.name=="slides")'

# Logs (last N lines)
curl -s --unix-socket "$SOCKET" "http://localhost/process/logs/slides/0/${lines:-50}" | jq -r '.logs[]'
```

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
- Always run scripts via the devenv shell (they're available after `devenv shell` or when using the commands directly in an active shell)
- After `/slides select`, the slides process auto-restarts if running
- Use `/slides validate` before expecting the dev server to work
- Private themes are in `local/themes/` (gitignored) or `shared/themes/` (committed)
- Process-compose uses a Unix socket for API communication, not HTTP
