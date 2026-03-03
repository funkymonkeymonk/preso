---
description: Manage processes (status, start, stop, restart, logs)
---

Process management command for the dev server and other processes.

**Usage:** `/processes <subcommand> [args]`

**Subcommands:**
- `up` - Start all processes (foreground)
- `up -d` - Start all processes (background/detached)
- `down` - Stop all background processes
- `status` - Show process status
- `restart [name]` - Restart a specific process
- `logs <name> [lines]` - Show recent logs (default: 50 lines)

**Arguments provided:** $ARGUMENTS

## Simple Operations (use devenv CLI)

```bash
# Start processes in foreground
devenv up

# Start processes in background (detached)
devenv up -d

# Stop background processes  
devenv processes down

# Start only the slides process
devenv up slides
```

## Advanced Operations (process-compose socket API)

For restart, status, and logs, use the process-compose Unix socket:

```bash
# Find the socket first
SOCKET=$(find /var/folders -name "pc.sock" -path "*/devenv-*/pc.sock" 2>/dev/null | head -1)

# If no socket found, processes aren't running - tell user to run `devenv up -d` first
```

**Socket API commands:**

```bash
# Status - list all processes
curl -s --unix-socket "$SOCKET" http://localhost/processes | jq .

# Restart a process
curl -s --unix-socket "$SOCKET" -X POST http://localhost/process/restart/slides

# Get logs (offset 0, limit 50)
curl -s --unix-socket "$SOCKET" "http://localhost/process/logs/slides/0/50" | jq -r '.logs[]'
```

## Quick Reference

| Action | Command |
|--------|---------|
| Start (foreground) | `devenv up` |
| Start (background) | `devenv up -d` |
| Stop background | `devenv processes down` |
| Restart slides | Socket API: `POST /process/restart/slides` |
| View logs | Socket API: `GET /process/logs/slides/0/50` |

**Tip for agents:** Use `devenv up -d` for background processes so you can continue working.
