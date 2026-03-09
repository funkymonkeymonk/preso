# How to Troubleshoot the Development Server

This guide helps you diagnose and fix common issues with the preso development server.

## Port 3030 Not Responding

### Step 1: Verify you're in a presentation directory

```bash
preso llm status
```

If this shows `"isPresentation": false`, you need to either:
- Run `preso init` to create a presentation, or
- `cd` to an existing presentation directory

### Step 2: Check what's on the port

```bash
lsof -i :3030
```

If another process is using port 3030, either stop it or use a different port:

```bash
preso serve -p 3031
```

### Step 3: Check server logs

Logs are written to `.preso.log` in the presentation directory:

```bash
cat .preso.log
```

### Step 4: Restart the server

Stop the current server (Ctrl+C) and start again:

```bash
preso serve
```

## Server Not Starting

Check the logs for errors:

```bash
cat .preso.log
```

Common issues:
- Missing `slides.md` - run `preso init`
- Port already in use - use `-p <other-port>`
- Missing dependencies - the server should auto-install them

## Server Running But No Hot Reload

Try restarting the server:

```bash
# Stop with Ctrl+C, then:
preso serve
```

## Quick Diagnosis Table

| Symptom | Check | Fix |
|---------|-------|-----|
| Nothing on port 3030 | `preso llm status` | `preso init` or `cd` to presentation |
| Port conflict | `lsof -i :3030` | `preso serve -p 3031` |
| Server won't start | `cat .preso.log` | Check logs for errors |
| No hot reload | Restart server | Ctrl+C then `preso serve` |

## Getting Debug Info

For detailed troubleshooting information:

```bash
preso llm debug
```

This shows:
- Current directory state
- Port availability
- Log file location
- Configuration details
