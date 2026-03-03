# Process-Compose Integration

This document explains how PRESO uses process-compose and the `slides-serve` script to manage the development server.

## The Problem

Running a presentation development server involves:
- Starting Slidev with the correct presentation file
- Keeping the server running while you edit
- Restarting when configuration changes
- Managing logs and status

Manually managing this is tedious and error-prone.

## The Solution: Multiple Server Modes

PRESO provides two ways to run the development server:

### 1. Interactive Mode (for humans): `devenv up`

Uses [process-compose](https://github.com/F1bonacc1/process-compose) via [devenv](https://devenv.sh) for interactive development:

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

## How slides-serve Works

```bash
slides-serve
```

1. Reads the current presentation from `.current-preso`
2. Kills any existing slidev processes
3. Starts slidev with `nohup` in the background
4. Waits for port 3030 to respond (up to 30 seconds)
5. Reports success or failure

To stop:

```bash
slides-stop
```

Logs are written to `.devenv/slides.log`.

## How the slides Process Works (devenv up)

The `slides` process in `devenv.nix`:

1. Reads the presentation name from `.current-preso` (or `$PRESO` env var)
2. Constructs the path: `presentations/$PRESO/slides.md`
3. Runs: `npm run dev -- presentations/$PRESO/slides.md`
4. Slidev starts on port 3030

### Failure Modes

If `.current-preso` references a non-existent presentation:
- The process starts (status shows "Running")
- But Slidev can't find the slides file
- Port 3030 never binds
- No obvious error unless you check logs

This is why validation is important.

## When to Use Each Mode

| Mode | Command | Best For |
|------|---------|----------|
| Interactive | `devenv up` | Humans developing presentations |
| Background | `slides-serve` | AI agents, automation, scripts |

## Design Decisions

### Why not just use devenv up -d?

The devenv 2.0 daemon mode has reliability issues:
- Native process manager may exit prematurely
- Process-compose TUI errors in headless environments
- Complex socket API for simple start/stop operations

The `slides-serve` script provides a more predictable experience.

### Why process-compose for interactive mode?

Process-compose provides:
- Great TUI for humans
- Interactive controls (restart, logs)
- Process health monitoring
- Declarative configuration in Nix

### Why nohup for background mode?

Simple and reliable:
- Works in any shell environment
- No dependencies beyond bash
- Predictable behavior
- Easy to debug

> For step-by-step troubleshooting, see [How to Troubleshoot the Development Server](../how-to/troubleshoot-server.md).
> For CLI reference, see [CLI Commands Reference](../reference/cli-commands.md).
