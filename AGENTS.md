# AGENTS.md

> **PRESO** - *PRESO Renders Engaging Slides On-demand*

Quick reference for AI agents working in this repository.

## Key Files

| File | Purpose |
|------|---------|
| `devenv.nix` | All scripts, processes, and environment config |
| `presentations/*/slides.md` | Presentation content |
| `.current-preso` | Currently selected presentation name |

## Essential Commands

```bash
# Validate before working
slides-validate

# List/select presentations
slides-list
slides-select <name>    # Always pass name argument

# Start server (daemon mode for agents)
devenv up -d

# Build/export
slides-build
slides-pdf
```

## Critical Rules

1. **Always validate first:** Run `slides-validate` before expecting the server to work
2. **Pass arguments:** Use `slides-select my-talk` not `slides-select` (avoids fzf prompt)
3. **Use daemon mode:** Run `devenv up -d` not `devenv up` (TUI blocks agents)
4. **Use Unix socket:** Process-compose API is on a socket, not HTTP port

## Process-Compose Socket

```bash
# Find the socket
SOCKET=$(find /var/folders -name "pc.sock" -path "*/devenv-*/pc.sock" 2>/dev/null | head -1)

# Common operations
curl -s --unix-socket "$SOCKET" http://localhost/processes | jq .
curl -s --unix-socket "$SOCKET" -X POST http://localhost/process/restart/slides
curl -s --unix-socket "$SOCKET" "http://localhost/process/logs/slides/0/50" | jq -r '.logs[]'
```

## Quick Fixes

| Symptom | Fix |
|---------|-----|
| Port 3030 not responding | `slides-validate` then `slides-select example` |
| Wrong presentation | `slides-select <correct-name>` |
| Multiple slidev processes | `pkill -f "slidev presentations"` |
| Socket not found | `devenv up -d` |

## Available Skills

| Skill | When to Load |
|-------|--------------|
| `slidev-authoring` | Creating/editing slides |
| `presentation-workflow` | Managing presentations |
| `server-management` | Server issues |
| `devenv` | devenv.nix or process issues |

## OpenCode Commands

| Command | Purpose |
|---------|---------|
| `/slides` | Presentation management |
| `/processes` | Process-compose control |

## File Locations

| Content Type | Location |
|--------------|----------|
| Presentations | `presentations/<name>/slides.md` |
| Private themes | `local/themes/<name>/` (gitignored) |
| Shared themes | `shared/themes/<name>/` |
| Design docs | `docs/plans/` |

## Slidev Syntax Quick Reference

### Slide Structure

```markdown
---
theme: seriph
layout: cover
---

# Title

Content

---

# Next Slide
```

### Common Layouts

`cover`, `default`, `center`, `two-cols`, `image-right`, `section`, `quote`

### Two Columns

```markdown
---
layout: two-cols
---

# Left

::right::

# Right
```

### Code Highlighting

````markdown
```ts {2,3}           # Highlight lines 2-3
```ts {1|2-3|all}     # Click to reveal
````

### Presenter Notes

```markdown
# Slide

Content

<!--
Notes here
-->
```

## Theme Paths

Relative to `slides.md`:

```yaml
theme: ../../local/themes/my-theme
```

## Documentation

Full documentation in `docs/`:
- `docs/tutorials/` - Learning guides
- `docs/how-to/` - Task guides  
- `docs/reference/` - Technical reference
- `docs/explanation/` - Conceptual explanations
