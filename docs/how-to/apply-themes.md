# How to Apply Themes

This guide shows you how to change the visual appearance of your presentation using themes.

## List Available Themes

```bash
preso theme list
```

This shows:
- Official Slidev themes (auto-installed when used)
- Custom themes in `~/.config/preso/themes/`

## Apply a Theme

```bash
preso theme set <theme-name>
```

For example:
```bash
preso theme set dracula
```

This updates the `theme:` field in your presentation's frontmatter.

## Using Official Themes

Official themes are referenced by name in `slides.md`:

```yaml
---
theme: seriph
---
```

Common options: `default`, `seriph`, `dracula`, `apple-basic`, `bricks`

## Using Custom Themes

### Add a Theme to Favorites

```bash
preso theme add <theme-name>
```

This adds the theme to your favorites list in the global config. Favorites are shown with a `*` marker in `preso theme list`.

### Apply a Custom Theme

```bash
preso theme set my-theme
```

Or edit `slides.md` directly:

```yaml
---
theme: ./path/to/my-theme
---
```

## Theme Storage Location

| Location | Purpose |
|----------|---------|
| `~/.config/preso/themes/` | User's custom themes |

## Set a Default Theme

Set the theme used by `preso init`:

```bash
preso config set defaultTheme dracula
```

## After Changing Themes

The development server hot-reloads most changes. If the theme doesn't update:

1. Stop the server (Ctrl+C)
2. Restart: `preso serve`

> For details on creating custom themes, see [Theme Structure Reference](../reference/theme-structure.md).
