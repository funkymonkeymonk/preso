# How to Troubleshoot Common Issues

This guide helps you diagnose and fix common issues with preso.

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

### Step 3: Restart the server

Stop the current server (Ctrl+C) and start again:

```bash
preso serve
```

## Server Not Starting

Common issues:
- Missing `slides.md` - run `preso init`
- Port already in use - use `-p <other-port>`
- Missing dependencies - run `bun install` in the presentation directory

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
| Server won't start | `preso llm debug` | Check debug output for errors |
| No hot reload | Restart server | Ctrl+C then `preso serve` |

## Getting Debug Info

For detailed troubleshooting information:

```bash
preso llm debug
```

This shows:
- Current directory state
- Port availability (3030, 3031, 3032)
- Configuration file location

## Build and Export Issues

### Build fails with "No slides.md found"

Make sure you're in the presentation directory:

```bash
preso llm status   # Check if slides.md exists
preso build
```

### PDF is missing slides

Ensure all slides render correctly in the browser first. PDF export captures what's visible.

### Animations not in PDF

PDF export captures the final state of each slide. Use `--with-clicks` to create separate pages for each click state:

```bash
preso pdf --with-clicks
```

### PDF export fails

Install Playwright's Chromium:

```bash
bunx playwright install chromium
```
