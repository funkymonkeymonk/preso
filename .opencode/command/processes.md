---
description: Manage process-compose processes (status, start, stop, restart, logs)
---

Process management command. Interact with process-compose via its Unix socket API.

**Usage:** `/processes <subcommand> [args]`

**Subcommands:**
- `status` - Show all processes with their current state
- `start [name]` - Start all processes or a specific one
- `stop [name]` - Stop all processes or a specific one  
- `restart [name]` - Restart all processes or a specific one
- `logs <name> [lines]` - Show recent logs for a process (default: 50 lines)

**Arguments provided:** $ARGUMENTS

**Important:** Process-compose uses a Unix socket, NOT an HTTP port. First find the socket:

```bash
SOCKET=$(find /var/folders -name "pc.sock" -path "*/devenv-*/pc.sock" 2>/dev/null | head -1)
```

If no socket is found, process-compose is not running. Tell the user to run `devenv up` first.

**API Examples using the socket:**

```bash
# List processes
curl -s --unix-socket "$SOCKET" http://localhost/processes | jq .

# Restart a process
curl -s --unix-socket "$SOCKET" -X POST http://localhost/process/restart/slides

# Stop a process
curl -s --unix-socket "$SOCKET" -X POST http://localhost/process/stop/slides

# Start a process
curl -s --unix-socket "$SOCKET" -X POST http://localhost/process/start/slides

# Get logs (offset 0, limit 50)
curl -s --unix-socket "$SOCKET" "http://localhost/process/logs/slides/0/50" | jq -r '.logs[]'
```

Execute the appropriate action based on the subcommand. Always find the socket first and verify it exists before making API calls.
