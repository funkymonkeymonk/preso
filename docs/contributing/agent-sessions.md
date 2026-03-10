# Agent Session Architecture

> **Note:** This document describes the development environment for contributors working on the preso CLI itself. Regular users don't need agent sessions.

This document explains how preso's agent sessions work for CLI development and the design decisions behind them.

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

The preso development environment creates an integrated session using three tools:

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

### Why Process-Compose in a Pane?

With process-compose visible:
- Humans can see server status at a glance
- Log output is visible without additional commands
- The TUI doesn't block OpenCode (they're in separate panes)

### Why the 30/70 Split?

- Process-compose TUI needs minimal width for status display
- OpenCode benefits from more horizontal space for code editing
- 70% gives comfortable width for most code files

## Session Lifecycle

### Starting

`agent-start`:
1. Validates current presentation selection (for testing)
2. Generates a unique short ID
3. Creates zellij session with the layout
4. Starts process-compose in left pane
5. Launches OpenCode in right pane

### Reconnecting

After detaching or closing terminal:
```bash
agent-sessions          # List sessions
agent-connect a3f2      # Reconnect by short ID
```

## For Regular Users

If you're just creating presentations (not developing the CLI), none of this applies. Simply use the `preso` command directly:

```bash
preso serve
```

No zellij, process-compose, or devenv needed.

> For step-by-step instructions, see [How to Start an Agent Session](start-agent-session.md).
