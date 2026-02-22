# Agent Session Architecture

This document explains how PRESO's agent sessions work and the design decisions behind them.

## The Problem

AI coding assistants like OpenCode work best when they can:
- See the state of running processes
- Control background services
- Have full access to the codebase
- Work non-interactively (no blocking prompts)

But terminal-based agents struggle with:
- Multiple terminal windows
- Interactive TUIs that block input
- Background processes they can't monitor
- State that requires visual inspection

## The Solution: Zellij + Process-Compose + OpenCode

PRESO creates an integrated session using three tools:

```
┌─────────────────────────────────────────────────┐
│                 zellij session                  │
│              (preso-<shortid>)                  │
├───────────────────┬─────────────────────────────┤
│                   │                             │
│  process-compose  │        OpenCode             │
│      (30%)        │         (70%)               │
│                   │                             │
│  TUI for viewing  │   AI coding assistant       │
│  background       │   with full repo access     │
│  processes        │                             │
│                   │                             │
└───────────────────┴─────────────────────────────┘
```

### Why Zellij?

Zellij provides:
- **Session persistence:** Detach and reconnect without losing state
- **Pane management:** Predictable split layouts
- **Named sessions:** Easy to find and reconnect to specific sessions

The session name format `<repo>-<shortid>` (e.g., `preso-a3f2`) makes it easy to identify sessions per repository while allowing multiple sessions.

### Why Process-Compose in a Pane?

With process-compose visible:
- Humans can see server status at a glance
- Log output is visible without additional commands
- The TUI doesn't block OpenCode (they're in separate panes)

For the agent, the TUI is informational. The agent uses the Unix socket API for actual control.

### Why the 30/70 Split?

- Process-compose TUI needs minimal width for status display
- OpenCode benefits from more horizontal space for code editing
- 70% gives comfortable width for most code files

## Session Lifecycle

### Starting

`agent-start`:
1. Validates current presentation (auto-fixes if invalid)
2. Generates a unique short ID
3. Creates zellij session with the layout
4. Starts process-compose in left pane
5. Launches OpenCode in right pane

### Working

During the session:
- Edit code in OpenCode
- See process status in left pane
- Use OpenCode's tools to restart processes via API
- Hot-reload works automatically for content changes

### Reconnecting

After detaching or closing terminal:
```bash
agent-sessions          # List sessions
agent-connect a3f2      # Reconnect by short ID
```

Zellij preserves the session state, including running processes and OpenCode context.

## Environment Variables

Inside a session:

| Variable | Purpose |
|----------|---------|
| `OPENCODE_SESSION_NAME` | Current session name for logging/identification |
| `OPENCODE_ACTIVE_PORT` | Configured port (use socket API instead) |

These help tools identify which session they're in and avoid conflicts.

## Design Trade-offs

### Why not tmux?

Zellij provides:
- Better default keybindings
- Easier configuration
- Modern Rust implementation
- Better pane management API

tmux would work, but zellij is more ergonomic for this use case.

### Why not run OpenCode without the TUI?

The TUI provides valuable context:
- Immediate visibility into server state
- Log output without explicit queries
- Visual confirmation that processes are running

For fully automated scenarios, agents can use `devenv up -d` and skip the session entirely.

### Why validate on startup?

A session with an invalid presentation selection would immediately fail. Pre-flight validation:
- Catches the most common issue (bad `.current-preso`)
- Auto-fixes by defaulting to `example`
- Provides a known-good starting state

> For step-by-step instructions, see [How to Start an Agent Session](../how-to/start-agent-session.md).
