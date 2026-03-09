# How to Start an Agent Session

> **Note:** This guide is for contributors developing the preso CLI itself. Regular users don't need agent sessions - just use `preso` commands directly.

This guide shows you how to start an AI-assisted development session using OpenCode within the preso development environment.

## Prerequisites

- [devenv](https://devenv.sh) installed
- Working in the preso repository

## Start a New Session

```bash
devenv shell
agent-start
```

This creates a zellij terminal session with:
- **Left pane (30%):** process-compose TUI showing running processes
- **Right pane (70%):** OpenCode AI coding assistant

The session is named `<repo>-<shortid>` (e.g., `preso-a3f2`).

## List Active Sessions

See all sessions for this repository:

```bash
agent-sessions
```

## Connect to an Existing Session

Reconnect to a previous session:

```bash
agent-connect <short-id>
```

For example:
```bash
agent-connect a3f2
```

## What Happens at Startup

When you run `agent-start`:
1. Validates the current presentation selection (for testing)
2. Creates a new zellij session
3. Starts process-compose in the left pane
4. Launches OpenCode in the right pane
5. Both tools share the same working directory

## Environment Variables in Sessions

Inside an agent session:
- `OPENCODE_SESSION_NAME` - Current session name (e.g., `preso-a3f2`)
- `OPENCODE_ACTIVE_PORT` - Configured process-compose port

## Exiting Sessions

- **Detach (keep running):** `Ctrl+b, d` (zellij default)
- **Exit completely:** `Ctrl+q` in zellij, or close all panes

> For architecture details, see [Agent Session Architecture](../explanation/agent-sessions.md).
