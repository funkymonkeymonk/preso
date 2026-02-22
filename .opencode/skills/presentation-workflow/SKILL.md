# Presentation Workflow

Guide for managing presentations in the PRESO repository.

## When to Use

- Starting work on a presentation
- Switching between presentations
- Building or exporting presentations
- Troubleshooting dev server issues

## Quick Start

```bash
# 1. List available presentations
slides-list

# 2. Select one to work on
slides-select my-talk

# 3. Validate selection
slides-validate

# 4. Start dev server
devenv up

# 5. Open browser to http://localhost:3030
```

## Selection System

The repository maintains a "current presentation" in `.current-preso`.

**Priority (highest to lowest):**
1. `PRESO` environment variable
2. `.current-preso` file
3. Interactive fzf picker (humans only)

**For agents:** Always pass the name argument to avoid interactive prompts:
```bash
slides-select my-talk     # Good - non-interactive
slides-select             # Bad - opens fzf picker
```

## Creating a New Presentation

```bash
slides-new my-new-talk
```

This:
1. Creates `presentations/my-new-talk/slides.md` with template
2. Sets it as current (updates `.current-preso`)
3. Restarts slides process if running

## Applying Themes

```bash
# List available themes
slides-theme list

# Apply a theme interactively (fzf picker)
slides-theme

# Apply a specific theme
slides-theme dracula
```

**Theme sources:**
- **Official**: `default`, `seriph`, `dracula`, etc. (auto-installed)
- **Private**: `local/themes/<name>/` (gitignored)
- **Shared**: `shared/themes/<name>/` (committed)

**For agents:** Always pass the theme name argument to avoid interactive prompts:
```bash
slides-theme dracula    # Good - non-interactive
slides-theme            # Bad - opens fzf picker
```

## Building & Exporting

```bash
# Build static HTML site
slides-build
# Output: presentations/<name>/dist/

# Export to PDF
slides-pdf
# Output: presentations/<name>/<name>.pdf
```

## Process Management

The slides dev server runs via process-compose:

```bash
# Start process manager (includes slides)
devenv up

# The slides process reads .current-preso on startup
# After slides-select, it auto-restarts
```

### Manual Process Control

Use the Unix socket API:

```bash
SOCKET=$(find /var/folders -name "pc.sock" -path "*/devenv-*/pc.sock" 2>/dev/null | head -1)

# Check status
curl -s --unix-socket "$SOCKET" http://localhost/processes | jq .

# Restart slides
curl -s --unix-socket "$SOCKET" -X POST http://localhost/process/restart/slides

# View logs
curl -s --unix-socket "$SOCKET" "http://localhost/process/logs/slides/0/50" | jq -r '.logs[]'
```

## Troubleshooting

### Port 3030 not responding

```bash
# 1. Validate selection
slides-validate

# 2. Check what's on the port
lsof -i :3030

# 3. Check process logs
SOCKET=$(find /var/folders -name "pc.sock" -path "*/devenv-*/pc.sock" 2>/dev/null | head -1)
curl -s --unix-socket "$SOCKET" "http://localhost/process/logs/slides/0/20" | jq -r '.logs[]'
```

### Multiple slidev processes

```bash
# Kill orphans
pkill -f "slidev presentations"

# Restart managed process
curl -s --unix-socket "$SOCKET" -X POST http://localhost/process/restart/slides
```

### Selection shows wrong presentation

```bash
# Check current
slides-current

# Re-select
slides-select correct-name
```
