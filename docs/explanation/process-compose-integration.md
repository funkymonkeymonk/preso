# Process-Compose Integration

This document explains how PRESO uses process-compose to manage the development server and why this architecture was chosen.

## The Problem

Running a presentation development server involves:
- Starting Slidev with the correct presentation file
- Keeping the server running while you edit
- Restarting when configuration changes
- Managing logs and status

Manually managing this is tedious and error-prone.

## The Solution: Process-Compose via devenv

PRESO uses [devenv](https://devenv.sh) which includes [process-compose](https://github.com/F1bonacc1/process-compose) for process orchestration.

When you run `devenv up`:
1. process-compose starts with the configuration from `devenv.nix`
2. The `slides` process starts, reading `.current-preso`
3. A TUI shows process status (or runs in background with `-d`)

## Unix Socket vs HTTP

**Important:** Process-compose uses a Unix socket for its API, not an HTTP port.

The socket location is dynamic:
```bash
find /var/folders -name "pc.sock" -path "*/devenv-*/pc.sock"
```

This design:
- Avoids port conflicts
- Provides better security (file permissions vs network)
- Works without network stack

The HTTP port configured in `devenv.nix` is for process-compose's internal use and shouldn't be used for API calls.

## How the slides Process Works

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

## Restarting on Selection Change

When `.current-preso` changes, the running process still has the old value. The `slides-select` script automatically restarts the process by calling:

```bash
curl -s --unix-socket "$SOCKET" -X POST http://localhost/process/restart/slides
```

## TUI vs Daemon Mode

| Mode | Command | Use Case |
|------|---------|----------|
| TUI | `devenv up` | Humans watching logs |
| Daemon | `devenv up -d` | Agents, background work |

The TUI blocks the terminal and provides interactive process control. Daemon mode returns immediately and runs in background.

## Why Not Just Run Slidev Directly?

You could run `npx slidev presentations/my-talk/slides.md`, but:
- No integration with selection system
- No automatic restart on selection change
- No centralized log viewing
- Orphan processes if terminal closes
- Harder for agents to control programmatically

Process-compose provides a management layer that makes the server predictable and controllable.

## Design Decisions

### Why process-compose over alternatives?

- **systemd:** Platform-specific, heavy for dev use
- **pm2:** Requires Node.js, separate tool to install
- **Docker:** Overhead for simple dev server
- **process-compose:** Lightweight, cross-platform, great TUI, simple API

### Why devenv wraps process-compose?

devenv provides:
- Declarative configuration in Nix
- Reproducible environments
- Scripts and processes in one place
- Language tooling integration

> For step-by-step troubleshooting, see [How to Troubleshoot the Development Server](../how-to/troubleshoot-server.md).
> For API reference, see [Process-Compose API Reference](../reference/process-compose-api.md).
