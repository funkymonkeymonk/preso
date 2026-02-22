# How to Create a Custom Theme

This guide shows you how to create a custom Slidev theme for your presentations.

## Create the Theme Directory

For private themes (gitignored):
```bash
mkdir -p local/themes/my-theme
```

For shared themes (committed):
```bash
mkdir -p shared/themes/my-theme
```

## Required Files

Create the basic structure:

```
my-theme/
├── package.json
├── styles/
│   └── index.ts
└── setup/
    └── unocss.ts
```

### package.json

```json
{
  "name": "slidev-theme-my-theme",
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

### styles/index.ts

```typescript
import './base.css'
import './layouts.css'
```

### styles/base.css

```css
:root {
  --slidev-theme-primary: #0075de;
}
```

### styles/layouts.css

```css
.slidev-layout h1 {
  color: var(--slidev-theme-primary);
}

.slidev-layout.cover {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}
```

### setup/unocss.ts

```typescript
import { defineUnoSetup } from '@slidev/types'

export default defineUnoSetup(() => ({
  shortcuts: {
    'bg-main': 'bg-white text-gray-900 dark:bg-gray-900 dark:text-white',
  },
}))
```

## Use Your Theme

In your presentation's frontmatter:

```yaml
---
theme: ../../local/themes/my-theme
---
```

## Key Customization Points

| What to Change | Where to Edit |
|----------------|---------------|
| Background color | `setup/unocss.ts` (`bg-main` shortcut) |
| Primary color | `styles/base.css` (`--slidev-theme-primary`) |
| Cover slide styling | `styles/layouts.css` (`.slidev-layout.cover`) |
| Fonts | `package.json` (`slidev.defaults.fonts`) |

## Important Notes

- Background is controlled by UnoCSS's `bg-main` shortcut, NOT CSS on `.slidev-layout`
- Theme paths are relative to `slides.md`
- Restart the dev server after theme changes

> For complete theme structure reference, see [Theme Structure Reference](../reference/theme-structure.md).
