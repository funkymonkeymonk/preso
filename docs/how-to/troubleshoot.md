# How to Troubleshoot Common Issues

This guide helps you diagnose and fix common issues with preso.

## Quick Diagnosis

```bash
preso llm debug
```

This shows:
- Current directory state
- Port availability (3030, 3031, 3032)
- Configuration file location
- Common fixes

## Server Issues

### Port 3030 Not Responding

**Step 1: Verify you're in a presentation directory**

```bash
preso llm status
```

If this shows `"isPresentation": false`, you need to either:
- Run `preso init` to create a presentation, or
- `cd` to an existing presentation directory

**Step 2: Check what's on the port**

```bash
lsof -i :3030
```

If another process is using port 3030, either stop it or use a different port:

```bash
preso serve -p 3031
```

**Step 3: Restart the server**

Stop the current server (Ctrl+C) and start again:

```bash
preso serve
```

### Server Not Starting

| Issue | Solution |
|-------|----------|
| Missing `slides.md` | Run `preso init` |
| Port already in use | Use `-p <other-port>` |
| Theme not found | Check theme name with `preso theme list` |

### No Hot Reload

Try restarting the server:

```bash
# Stop with Ctrl+C, then:
preso serve
```

## Build Issues

### "No slides.md found"

Make sure you're in the presentation directory:

```bash
preso llm status   # Check if slides.md exists
preso build
```

### Build fails with errors

Check for syntax errors in your slides:

```bash
preso serve   # View errors in browser console
```

## PDF Export Issues

### PDF export fails completely

Install Playwright's Chromium:

```bash
bunx playwright install chromium
```

### PDF is missing slides or content

1. Ensure all slides render correctly in the browser first
2. PDF export captures what's visible - check for CSS issues

### Animations not in PDF

PDF export captures the final state of each slide. Use `--with-clicks` to create separate pages for each animation step:

```bash
preso pdf --with-clicks
```

## Theme Issues

### Theme not found

```bash
# List available themes
preso theme list

# For official themes, just use the name
preso theme set dracula

# For custom themes, ensure they're in ~/.config/preso/themes/
ls ~/.config/preso/themes/
```

### Theme changes not appearing

1. Stop the server (Ctrl+C)
2. Restart: `preso serve`

## Quick Reference

| Symptom | Check | Fix |
|---------|-------|-----|
| Nothing on port 3030 | `preso llm status` | `preso init` or `cd` to presentation |
| Port conflict | `lsof -i :3030` | `preso serve -p 3031` |
| Server won't start | `preso llm debug` | Check debug output for errors |
| No hot reload | Restart server | Ctrl+C then `preso serve` |
| PDF fails | Check Playwright | `bunx playwright install chromium` |
| Theme missing | `preso theme list` | Install to `~/.config/preso/themes/` |
