# Server Management

Guide for starting and stopping the Slidev presentation server.

## When to Use

- Starting the dev server
- Stopping or restarting the server
- Checking server status
- Troubleshooting server issues

## Starting the Server

### Via Process-Compose (Recommended)

```bash
# Start process manager with slides server
devenv up
```

This starts process-compose with the `slides` process, which:
1. Reads `.current-preso` to determine which presentation to serve
2. Runs Slidev on port 3030
3. Provides TUI for monitoring

### Standalone (Without Process Manager)

```bash
# Direct slidev start (not managed)
slides-dev
```

**Warning:** Prefer `devenv up` over `slides-dev &` to avoid orphan processes.

## Stopping the Server

### Via Process-Compose TUI

Press `q` in the process-compose TUI to quit all processes.

### Via Unix Socket API

```bash
# Find the socket
SOCKET=$(find /var/folders -name "pc.sock" -path "*/devenv-*/pc.sock" 2>/dev/null | head -1)

# Stop slides process
curl -s --unix-socket "$SOCKET" -X POST http://localhost/process/stop/slides

# Stop all processes
curl -s --unix-socket "$SOCKET" -X POST http://localhost/shutdown
```

### Kill Orphan Processes

If slidev processes are running outside process-compose:

```bash
# Find slidev processes
pgrep -fl slidev

# Kill all slidev processes
pkill -f "slidev presentations"
```

## Restarting the Server

### After Changing Presentation

`slides-select` automatically restarts the server. Manual restart:

```bash
SOCKET=$(find /var/folders -name "pc.sock" -path "*/devenv-*/pc.sock" 2>/dev/null | head -1)
curl -s --unix-socket "$SOCKET" -X POST http://localhost/process/restart/slides
```

### After Editing Configuration

The dev server has hot-reload for content changes, but config changes (frontmatter theme, etc.) may require restart:

```bash
curl -s --unix-socket "$SOCKET" -X POST http://localhost/process/restart/slides
```

## Checking Server Status

### Process Status

```bash
SOCKET=$(find /var/folders -name "pc.sock" -path "*/devenv-*/pc.sock" 2>/dev/null | head -1)

# All processes
curl -s --unix-socket "$SOCKET" http://localhost/processes | jq .

# Slides process info
curl -s --unix-socket "$SOCKET" http://localhost/process/info/slides | jq .
```

### Port Status

```bash
# Check what's on port 3030
lsof -i :3030

# Quick connectivity test
curl -s -o /dev/null -w "%{http_code}" http://localhost:3030
```

### View Logs

```bash
SOCKET=$(find /var/folders -name "pc.sock" -path "*/devenv-*/pc.sock" 2>/dev/null | head -1)

# Last 50 log lines
curl -s --unix-socket "$SOCKET" "http://localhost/process/logs/slides/0/50" | jq -r '.logs[]'

# Last 100 lines
curl -s --unix-socket "$SOCKET" "http://localhost/process/logs/slides/0/100" | jq -r '.logs[]'
```

## Process-Compose API Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/processes` | GET | List all processes with status |
| `/process/info/{name}` | GET | Detailed process info |
| `/process/logs/{name}/{offset}/{limit}` | GET | Get process logs |
| `/process/start/{name}` | POST | Start a stopped process |
| `/process/stop/{name}` | POST | Stop a running process |
| `/process/restart/{name}` | POST | Restart a process |
| `/shutdown` | POST | Stop all processes and exit |

## Troubleshooting

### Socket Not Found

Process-compose isn't running:

```bash
# Start it
devenv up
```

### Port 3030 Not Responding

1. **Check if process is running:**
   ```bash
   curl -s --unix-socket "$SOCKET" http://localhost/processes | jq '.[] | select(.name=="slides")'
   ```

2. **Check logs for errors:**
   ```bash
   curl -s --unix-socket "$SOCKET" "http://localhost/process/logs/slides/0/20" | jq -r '.logs[]'
   ```

3. **Validate presentation selection:**
   ```bash
   slides-validate
   ```

4. **Common causes:**
   - `.current-preso` references non-existent presentation
   - Missing `slides.md` in presentation directory
   - Another process grabbed port 3030

### Multiple Slidev Instances

```bash
# Check for multiple processes
pgrep -fl slidev

# Kill all and restart managed one
pkill -f "slidev presentations"
curl -s --unix-socket "$SOCKET" -X POST http://localhost/process/restart/slides
```

## Agent Session Context

When running in an agent session (`agent-start`):

- Process-compose runs in the left pane
- OpenCode runs in the right pane
- Server is already started automatically
- Use socket API for control, not TUI

Environment variables available:
- `OPENCODE_SESSION_NAME` - Current session name
- `OPENCODE_ACTIVE_PORT` - Configured port (but use socket, not HTTP)
