# How to Apply Themes

This guide shows you how to change the visual appearance of your presentation using themes.

## List Available Themes

```bash
slides-theme list
```

This shows:
- Official Slidev themes (auto-installed when used)
- Private themes in `local/themes/`
- Shared themes in `shared/themes/`

## Apply a Theme Interactively

```bash
slides-theme
```

This opens an fzf picker to select a theme.

## Apply a Specific Theme

```bash
slides-theme dracula
```

This updates the `theme:` field in your presentation's frontmatter.

## Using Official Themes

Official themes are referenced by name:

```yaml
---
theme: seriph
---
```

Common options: `default`, `seriph`, `dracula`, `apple-basic`, `bricks`

## Using Custom Themes

Custom themes use relative paths from your `slides.md`:

```yaml
---
theme: ../../local/themes/my-theme
---
```

The path must be relative to where `slides.md` is located.

## Theme Storage Locations

| Location | Purpose | Git Status |
|----------|---------|------------|
| `local/themes/` | Private/proprietary themes | Gitignored |
| `shared/themes/` | Shared themes for the repo | Committed |

## After Changing Themes

The development server hot-reloads most changes, but theme changes may require a restart:

```bash
# If using process-compose
SOCKET=$(find /var/folders -name "pc.sock" -path "*/devenv-*/pc.sock" 2>/dev/null | head -1)
curl -s --unix-socket "$SOCKET" -X POST http://localhost/process/restart/slides
```

> For details on creating custom themes, see [Theme Structure Reference](../reference/theme-structure.md).
