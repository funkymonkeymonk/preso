# CLI Commands Reference

All commands are available after running `devenv shell`.

## Presentation Management

| Command | Description |
|---------|-------------|
| `slides-list` | List all presentations (marks current with `*`) |
| `slides-select <name>` | Select a presentation to work on |
| `slides-current` | Show currently selected presentation |
| `slides-validate` | Verify current selection is valid |
| `slides-new <name>` | Create a new presentation |
| `slides-theme [name\|list]` | Apply a theme or list available themes |
| `slides-serve` | Start dev server in background (for agents) |
| `slides-stop` | Stop background dev server |
| `slides-build` | Build static site for deployment |
| `slides-pdf` | Export presentation to PDF |
| `slides-present` | Open in presenter mode with remote control |
| `slides-dev` | Start dev server standalone (prefer `devenv up` or `slides-serve`) |

## Agent Sessions

| Command | Description |
|---------|-------------|
| `agent-start` | Start new session (zellij + process-compose + OpenCode) |
| `agent-sessions` | List active sessions for this repository |
| `agent-connect [id]` | Connect to an existing session by short ID |

## Development Environment

| Command | Description |
|---------|-------------|
| `devenv shell` | Enter the development environment |
| `devenv up` | Start process-compose with TUI (foreground, for humans) |
| `devenv up -d` | Start process-compose in daemon mode (unreliable, prefer `slides-serve`) |
| `devenv processes down` | Stop all background processes |
| `devenv info` | Show environment information |

## Server Management

### For Agents (Background)

```bash
slides-serve    # Start in background, waits until ready
slides-stop     # Stop background server
```

Logs are written to `.devenv/slides.log`.

### For Humans (Interactive)

```bash
devenv up       # Start with TUI for interactive control
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `PRESO` | Override current presentation selection |
| `OPENCODE_SESSION_NAME` | Current agent session name (set automatically) |
| `OPENCODE_ACTIVE_PORT` | Configured process-compose port (use socket instead) |
