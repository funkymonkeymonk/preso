# Slidev Authoring

Guide for creating and editing Slidev presentations in this repository.

## When to Use

- Creating new slides or presentations
- Editing existing presentation content
- Adding layouts, transitions, or components
- Working with custom themes
- Troubleshooting Slidev markdown issues

## Presentation Structure

Each presentation lives in `presentations/<name>/slides.md`:

```
presentations/
  example/
    slides.md       # Main presentation file
    dist/           # Built output (after slides-build)
  my-talk/
    slides.md
local/
  themes/
    my-theme/       # Custom themes (gitignored)
shared/
  themes/           # Shared themes (committed to repo)
```

## Slidev Markdown Syntax

### Headmatter (First Slide Config)

```yaml
---
theme: ../../shared/themes/my-theme  # Theme path (relative to slides.md)
title: My Presentation                # Browser tab title
layout: cover                         # Layout for first slide
transition: slide-left                # Default transition
mdc: true                             # Enable MDC syntax
---
```

### Slide Separators

```markdown
# First Slide

Content here

---

# Second Slide

More content

---
layout: center
class: text-center
---

# Centered Slide

This slide has custom layout and class
```

### Built-in Layouts

| Layout | Purpose |
|--------|---------|
| `cover` | Title/cover slide (default for slide 1) |
| `default` | Standard content slide |
| `center` | Centered content |
| `two-cols` | Two columns (use `::right::` slot) |
| `two-cols-header` | Header + two columns |
| `image` / `image-left` / `image-right` | Image layouts |
| `iframe` / `iframe-left` / `iframe-right` | Embed web pages |
| `quote` | Quotation display |
| `section` | Section divider |
| `fact` / `statement` | Big text/data display |
| `intro` / `end` | Intro/outro slides |
| `full` | Full-screen content (no padding) |
| `none` | No styling at all |

### Two-Column Example

```markdown
---
layout: two-cols
---

# Left Column

Content on the left side.

::right::

# Right Column

Content on the right side.
```

### Image Layouts

```yaml
---
layout: image-right
image: /path/to/image.png
class: my-class
---

# Content on Left

The image appears on the right.
```

### Animations (v-click)

```markdown
<v-click>This appears on click 1</v-click>
<v-click>This appears on click 2</v-click>

<v-clicks>

- Item 1 (click 1)
- Item 2 (click 2)  
- Item 3 (click 3)

</v-clicks>
```

### Code Blocks

````markdown
```ts {2,3}
// Line 1
// Lines 2-3 are highlighted
// Line 4
```

```ts {1|2-3|all}
// Click 1: line 1 highlighted
// Click 2: lines 2-3 highlighted
// Click 3: all lines highlighted
```

```ts {monaco}
// Interactive Monaco editor
```

```ts {monaco-run}
// Runnable code block
```
````

### Presenter Notes

```markdown
# Slide Title

Content visible to audience

<!--
These are presenter notes.
Only visible in presenter view (http://localhost:3030/presenter)
-->
```

### Transitions

Per-slide: `transition: fade` or `transition: slide-up`

Options: `fade`, `fade-out`, `slide-left`, `slide-right`, `slide-up`, `slide-down`

## Theme Usage

### Using a Custom Theme

```yaml
---
theme: ../../local/themes/my-theme
layout: cover
---

# My Presentation
```

Custom themes provide:
- **Cover/Intro slides**: Custom background, styled text
- **Section slides**: Themed section dividers
- **Default slides**: Consistent background color
- **Font**: Custom typography
- **Primary color**: Brand colors

### Theme Locations

Themes can be stored in two locations:

| Location | Purpose | Git Status |
|----------|---------|------------|
| `local/themes/` | Private/proprietary themes | Gitignored |
| `shared/themes/` | Shared themes for the repo | Committed |

### Theme Path Resolution

Theme paths are **relative to the slides.md file**:

```
presentations/my-talk/slides.md
  theme: ../../local/themes/my-theme
         ↑↑ goes up 2 directories to project root
```

## Workflow

1. **Select presentation:** `slides-select <name>` or `/slides select <name>`
2. **Start dev server:** `devenv up` or `/slides start`
3. **Edit:** Modify `presentations/<name>/slides.md`
4. **Preview:** Open http://localhost:3030
5. **Overview:** http://localhost:3030/overview (see all slides)
6. **Presenter:** http://localhost:3030/presenter (with notes)
7. **Build:** `slides-build` or `/slides build`
8. **Export:** `slides-pdf` or `/slides pdf`

## Common Issues

### Slide not rendering
- Check for unclosed code blocks (``` must match)
- Verify frontmatter YAML is valid
- Look for syntax errors in Vue components

### Layout not applying
- Ensure `layout:` is in the slide's frontmatter block (after `---`)
- Check layout name spelling (case-sensitive)

### Theme not loading
- Verify theme path is correct relative to slides.md
- Check theme has valid `package.json` and `styles/index.ts`
- Restart dev server after theme changes: `/slides restart`

### Background color not changing
- Background is controlled by UnoCSS `bg-main` shortcut
- Override in theme's `setup/unocss.ts`, not in CSS

### Transitions not working
- Add `transition:` to headmatter (first slide) for default
- Add to individual slide frontmatter for per-slide control

## Resources

- [Slidev Documentation](https://sli.dev)
- [Slidev Themes](https://sli.dev/resources/theme-gallery)
- [Slidev Syntax](https://sli.dev/guide/syntax)
- [Built-in Layouts](https://sli.dev/builtin/layouts)
- [Writing Themes](https://sli.dev/guide/write-theme)
