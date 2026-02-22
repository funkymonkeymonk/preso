# How to Troubleshoot the Development Server

This guide helps you diagnose and fix common issues with the Slidev development server.

## Port 3030 Not Responding

### Step 1: Validate the presentation selection

```bash
slides-validate
```

If this shows an error, fix the selection:

```bash
slides-select example
```

### Step 2: Check what's on the port

```bash
lsof -i :3030
```

If another process is using port 3030, stop it or restart PRESO.

### Step 3: Check process-compose logs

```bash
SOCKET=$(find /var/folders -name "pc.sock" -path "*/devenv-*/pc.sock" 2>/dev/null | head -1)
curl -s --unix-socket "$SOCKET" "http://localhost/process/logs/slides/0/50" | jq -r '.logs[]'
```

## Multiple Slidev Processes Running

Check for orphan processes:

```bash
pgrep -fl slidev
```

Kill all slidev processes and restart:

```bash
pkill -f "slidev presentations"
devenv up
```

## Process-Compose Socket Not Found

The socket only exists when process-compose is running:

```bash
# Start process-compose
devenv up
```

For background mode (agents):
```bash
devenv up -d
```

## Wrong Presentation Showing

Check and fix the current selection:

```bash
slides-current
slides-select <correct-name>
```

The server automatically restarts after selection changes.

## Server Running But No Hot Reload

Try manually restarting the slides process:

```bash
SOCKET=$(find /var/folders -name "pc.sock" -path "*/devenv-*/pc.sock" 2>/dev/null | head -1)
curl -s --unix-socket "$SOCKET" -X POST http://localhost/process/restart/slides
```

## Quick Diagnosis Table

| Symptom | Check | Fix |
|---------|-------|-----|
| Nothing on port 3030 | `slides-validate` | `slides-select <valid-name>` |
| Wrong presentation | `slides-current` | `slides-select <correct-name>` |
| Multiple processes | `pgrep -fl slidev` | `pkill -f "slidev presentations"` |
| Socket not found | Is `devenv up` running? | Run `devenv up` |

> For details on how process-compose works, see [Process-Compose Integration](../explanation/process-compose-integration.md).
