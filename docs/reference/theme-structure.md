# Theme Structure Reference

Reference for custom Slidev theme structure.

## Directory Layout

```
<theme-name>/
├── package.json           # Theme metadata + Slidev config
├── styles/
│   ├── index.ts          # Style imports
│   ├── base.css          # Base styles + CSS variables
│   ├── layouts.css       # Layout-specific styles
│   └── code.css          # Syntax highlighting (optional)
└── setup/
    └── unocss.ts         # UnoCSS overrides
```

## Theme Location

Custom themes are stored at `~/.config/preso/themes/`:

```
~/.config/preso/
├── config.json
└── themes/
    └── my-theme/
        ├── package.json
        └── styles/
```

Add themes with:
```bash
preso theme add /path/to/my-theme
```

## package.json

```json
{
  "name": "slidev-theme-<name>",
  "version": "1.0.0",
  "slidev": {
    "colorSchema": "both",
    "defaults": {
      "fonts": {
        "sans": "Inter",
        "local": "Inter"
      }
    }
  }
}
```

### slidev Configuration

| Field | Type | Description |
|-------|------|-------------|
| `colorSchema` | `"light"` \| `"dark"` \| `"both"` | Supported color schemes |
| `defaults.fonts.sans` | string | Primary font family |
| `defaults.fonts.local` | string | Local font to load |
| `defaults.fonts.mono` | string | Monospace font |

## styles/index.ts

Entry point for style imports:

```typescript
import './base.css'
import './layouts.css'
import './code.css'
```

## styles/base.css

CSS custom properties and base styles:

```css
:root {
  --slidev-theme-primary: #0075de;
  --slidev-theme-accent: #f59e0b;
}

.dark {
  --slidev-theme-primary: #60a5fa;
}
```

## styles/layouts.css

Layout-specific styling:

```css
.slidev-layout h1 {
  color: var(--slidev-theme-primary);
  font-weight: 600;
}

.slidev-layout.cover {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.slidev-layout.cover h1 {
  color: white;
  font-size: 3rem;
}

.slidev-layout.section {
  background: var(--slidev-theme-primary);
  color: white;
}
```

## setup/unocss.ts

Override UnoCSS shortcuts (critical for background color):

```typescript
import { defineUnoSetup } from '@slidev/types'

export default defineUnoSetup(() => ({
  shortcuts: {
    'bg-main': 'bg-white text-gray-900 dark:bg-gray-900 dark:text-white',
  },
}))
```

### Important

The slide background is controlled by the `bg-main` UnoCSS shortcut, NOT CSS on `.slidev-layout`. Always override `bg-main` in `setup/unocss.ts` to change background colors.

## Using a Theme

### Official Themes (by name)

```yaml
---
theme: seriph
---
```

### Custom Themes (by path)

After adding with `preso theme add`:
```yaml
---
theme: my-theme
---
```

Or reference directly by path:
```yaml
---
theme: ~/.config/preso/themes/my-theme
---
```

## Common Customizations

| Customization | File | Property/Selector |
|---------------|------|-------------------|
| Background color | `setup/unocss.ts` | `bg-main` shortcut |
| Primary color | `styles/base.css` | `--slidev-theme-primary` |
| Heading styles | `styles/layouts.css` | `.slidev-layout h1` |
| Cover slide | `styles/layouts.css` | `.slidev-layout.cover` |
| Section dividers | `styles/layouts.css` | `.slidev-layout.section` |
| Fonts | `package.json` | `slidev.defaults.fonts` |
