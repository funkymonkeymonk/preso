# How to Apply Themes

This guide shows you how to change the visual appearance of your presentation using themes.

## List Available Themes

```bash
preso theme list
```

This shows:
- Official Slidev themes (auto-installed when used)
- Custom themes in `~/.config/preso/themes/` (this is where `preso theme list` looks; themes can be stored anywhere and referenced by path)

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

`default`, `seriph`, `apple-basic`, `bricks`, `dracula`, `geist`, `purplin`, `shibainu`, `unicorn`

Slidev automatically downloads and installs official themes when you use them.

## Using Custom Themes

You can use themes from anywhere by specifying a path in your `slides.md` frontmatter.

### Local Path (Relative)

```yaml
---
theme: ./my-theme
---
```

### Home Directory Path

```yaml
---
theme: ~/themes/my-company-theme
---
```

### npm Package

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
