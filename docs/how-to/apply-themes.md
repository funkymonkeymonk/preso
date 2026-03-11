# How to Apply Themes

This guide shows you how to change the visual appearance of your presentation using themes.

## List Available Themes

```bash
preso theme list
```

This shows:
- **Official themes** - Auto-installed by Slidev when used (default, seriph, dracula, etc.)
- **Custom themes** - Stored in `~/.config/preso/themes/`

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

Official themes are referenced by name. Common options:

| Theme | Description |
|-------|-------------|
| `default` | Clean, minimal default theme |
| `seriph` | Elegant with nice typography |
| `apple-basic` | Apple keynote inspired |
| `bricks` | Bold geometric style |
| `dracula` | Dark theme with purple accents |
| `geist` | Modern, Vercel-inspired |
| `purplin` | Purple gradient style |
| `shibainu` | Playful with illustrations |
| `unicorn` | Colorful gradient backgrounds |

Slidev automatically downloads and installs official themes when you use them.

## Using Custom Themes

Custom themes must be stored in `~/.config/preso/themes/` for `preso theme list` to discover them.

### Installing a Custom Theme

```bash
# Create themes directory if it doesn't exist
mkdir -p ~/.config/preso/themes

# Clone or copy your theme
git clone https://github.com/example/my-theme ~/.config/preso/themes/my-theme
```

### Using a Custom Theme

Once installed in the themes directory:

```bash
preso theme set my-theme
```

Or reference it directly in your `slides.md` frontmatter:

```yaml
---
theme: ~/.config/preso/themes/my-theme
---
```

### Using npm Themes

Slidev automatically installs themes from npm when referenced by name:

```yaml
---
theme: my-custom-theme
---
```

This installs `slidev-theme-my-custom-theme` or `@org/slidev-theme-my-custom-theme`.

## Set a Default Theme

Set the theme used by `preso init` for new presentations:

```bash
preso config set defaultTheme dracula
```

## After Changing Themes

The development server hot-reloads most changes. If the theme doesn't update:

1. Stop the server (Ctrl+C)
2. Restart: `preso serve`

> For creating custom themes, see [How to Create a Custom Theme](create-custom-theme.md).
> For theme file structure details, see [Theme Structure Reference](../reference/theme-structure.md).
