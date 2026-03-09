# Process-Compose Integration

> **Note:** This document describes the development environment for contributors working on the preso CLI itself. Regular users don't need process-compose - just use `preso serve` directly.

This document explains how the preso development environment uses process-compose to manage background services during CLI development.

## The Problem

When developing the preso CLI, you need to:
- Run test presentations to verify changes
- Keep the server running while editing CLI code
- Restart when configuration changes
- Manage logs and status

Manually managing this is tedious and error-prone.

## The Solution: Process-Compose in devenv

The preso development environment provides two ways to run test servers:

### 1. Interactive Mode (for humans): `devenv up`

Uses [process-compose](https://github.com/F1bonacc1/process-compose) via [devenv](https://devenv.sh):

- Shows a TUI with process status
- Interactive controls (restart, view logs)
- Great for humans working in a terminal

### 2. Background Mode (for agents): `slides-serve`

A simple script that runs Slidev in the background:

- Starts immediately, returns when server is ready
- Logs to `.devenv/slides.log`
- No TUI or interactive elements
- Ideal for AI agents and automation

## Why Two Modes?

The devenv 2.0 native process manager has issues with daemon mode (`devenv up -d`):
- Processes may not persist reliably
- Socket-based API can be complex for simple tasks
- TUI errors when running headless

The `slides-serve` script provides a simpler, more reliable alternative for background operation.

## When to Use Each Mode

| Mode | Command | Best For |
|------|---------|----------|
| Interactive | `devenv up` | Humans developing the CLI |
| Background | `slides-serve` | AI agents, automation, scripts |

## For Regular Users

If you're just creating presentations (not developing the CLI), none of this applies. Simply use:

```bash
preso serve
```

This runs the server directly without process-compose.
