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

### Step 3: Check server logs

If using `slides-serve` (background mode):

```bash
cat .devenv/slides.log
```

If using `devenv up` (foreground mode), logs appear in the TUI.

### Step 4: Restart the server

```bash
# For background mode
slides-stop
slides-serve

# For foreground mode
# Press Ctrl+C in the TUI, then run:
devenv up
```

## Multiple Slidev Processes Running

Check for orphan processes:

```bash
pgrep -fl slidev
```

Kill all slidev processes and restart:

```bash
slides-stop
# or
pkill -f "slidev presentations"

# Then restart
slides-serve
```

## Server Not Starting

Check the logs for errors:

```bash
# Background mode logs
cat .devenv/slides.log

# Or check if slidev can start manually
slides-dev
```

## Wrong Presentation Showing

Check and fix the current selection:

```bash
slides-current
slides-select <correct-name>
```

If using `slides-serve`, restart the server:

```bash
slides-stop
slides-serve
```

## Server Running But No Hot Reload

Try restarting the server:

```bash
slides-stop
slides-serve
```

Or if using `devenv up`, press `r` in the TUI to restart the process.

## Quick Diagnosis Table

| Symptom | Check | Fix |
|---------|-------|-----|
| Nothing on port 3030 | `slides-validate` | `slides-select <valid-name>` then `slides-serve` |
| Wrong presentation | `slides-current` | `slides-select <correct-name>` |
| Multiple processes | `pgrep -fl slidev` | `slides-stop` |
| Server won't start | `cat .devenv/slides.log` | Check logs for errors |

## Background vs Foreground Mode

| Mode | Command | Best For | Logs |
|------|---------|----------|------|
| Background | `slides-serve` | Agents, automation | `.devenv/slides.log` |
| Foreground | `devenv up` | Humans, debugging | TUI display |

> For details on how the server architecture works, see [Process-Compose Integration](../explanation/process-compose-integration.md).
