# Process-Compose API Reference

Reference for the process-compose Unix socket API used to control background processes.

## Socket Location

Process-compose uses a Unix socket, NOT an HTTP port. Find it with:

```bash
SOCKET=$(find /var/folders -name "pc.sock" -path "*/devenv-*/pc.sock" 2>/dev/null | head -1)
```

Or check the devenv state directory:
```bash
ls .devenv/state/*/pc.sock 2>/dev/null
```

## API Endpoints

### List Processes

```bash
curl -s --unix-socket "$SOCKET" http://localhost/processes | jq .
```

**Response:** Array of process objects with `name`, `status`, `pid`, etc.

### Process Info

```bash
curl -s --unix-socket "$SOCKET" http://localhost/process/info/<name> | jq .
```

**Response:** Detailed process information including configuration.

### Process Logs

```bash
curl -s --unix-socket "$SOCKET" "http://localhost/process/logs/<name>/<offset>/<limit>" | jq -r '.logs[]'
```

**Parameters:**
- `name`: Process name (e.g., `slides`)
- `offset`: Starting line (0 = from beginning)
- `limit`: Number of lines to return

**Example:** Last 50 lines of slides logs:
```bash
curl -s --unix-socket "$SOCKET" "http://localhost/process/logs/slides/0/50" | jq -r '.logs[]'
```

### Start Process

```bash
curl -s --unix-socket "$SOCKET" -X POST http://localhost/process/start/<name>
```

### Stop Process

```bash
curl -s --unix-socket "$SOCKET" -X POST http://localhost/process/stop/<name>
```

### Restart Process

```bash
curl -s --unix-socket "$SOCKET" -X POST http://localhost/process/restart/<name>
```

## Endpoint Summary

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/processes` | GET | List all processes with status |
| `/process/info/{name}` | GET | Detailed process info |
| `/process/logs/{name}/{offset}/{limit}` | GET | Get process logs |
| `/process/start/{name}` | POST | Start a stopped process |
| `/process/stop/{name}` | POST | Stop a running process |
| `/process/restart/{name}` | POST | Restart a process |

## Process Names

In PRESO, the main process is:
- `slides` - Slidev development server

## Common Operations

### Check if slides is running

```bash
curl -s --unix-socket "$SOCKET" http://localhost/processes | jq '.[] | select(.name=="slides") | .status'
```

### Restart slides after changing presentation

```bash
slides-select new-presentation
# Auto-restarts, or manually:
curl -s --unix-socket "$SOCKET" -X POST http://localhost/process/restart/slides
```

### View recent errors

```bash
curl -s --unix-socket "$SOCKET" "http://localhost/process/logs/slides/0/100" | jq -r '.logs[]' | grep -i error
```

## Notes

- The socket only exists when process-compose is running (`devenv up`)
- Use `devenv up -d` for daemon mode (background, no TUI)
- The HTTP port in `devenv.nix` is for process-compose internal use; always use the socket for API calls
