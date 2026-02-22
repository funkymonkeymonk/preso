# Slidev Syntax Reference

Quick reference for Slidev markdown syntax used in presentations.

## Frontmatter (First Slide)

```yaml
---
theme: seriph                    # Theme name or relative path
title: My Presentation           # Browser tab title
layout: cover                    # Layout for first slide
transition: slide-left           # Default transition
mdc: true                        # Enable MDC syntax
class: text-center               # CSS classes for first slide
---
```

## Slide Separators

```markdown
# Slide 1

Content here

---

# Slide 2

More content

---
layout: center
class: text-center
---

# Slide 3 with Config

This slide has custom layout and class
```

## Built-in Layouts

| Layout | Description |
|--------|-------------|
| `default` | Standard content slide |
| `cover` | Title/cover slide (first slide default) |
| `center` | Centered content |
| `two-cols` | Two columns (use `::right::` slot) |
| `two-cols-header` | Header + two columns |
| `image` | Full-bleed image |
| `image-left` | Image left, content right |
| `image-right` | Content left, image right |
| `iframe` | Embedded webpage |
| `iframe-left` / `iframe-right` | Iframe with content |
| `quote` | Quotation display |
| `section` | Section divider |
| `fact` / `statement` | Big text/data display |
| `intro` / `end` | Intro/outro slides |
| `full` | Full-screen content (no padding) |
| `none` | No styling |

## Two-Column Layout

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

## Image Layouts

```yaml
---
layout: image-right
image: /path/to/image.png
class: my-class
---

# Content on Left

The image appears on the right.
```

## Click Animations

```markdown
<v-click>This appears on click 1</v-click>
<v-click>This appears on click 2</v-click>

<v-clicks>

- Item 1 (click 1)
- Item 2 (click 2)
- Item 3 (click 3)

</v-clicks>
```

## Code Blocks

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

## Transitions

Set default in frontmatter:
```yaml
transition: slide-left
```

Per-slide:
```yaml
---
transition: fade
---
```

Options: `fade`, `fade-out`, `slide-left`, `slide-right`, `slide-up`, `slide-down`

## Presenter Notes

```markdown
# Slide Title

Content visible to audience

<!--
These are presenter notes.
Only visible in presenter view.
-->
```

## Keyboard Shortcuts (Browser)

| Key | Action |
|-----|--------|
| `Space` / `Right` | Next slide/click |
| `Left` | Previous slide |
| `o` | Overview mode |
| `p` | Presenter mode |
| `d` | Dark mode toggle |
| `f` | Fullscreen |
| `g` | Go to slide (type number) |

## URLs

| URL | View |
|-----|------|
| `/` | Slides |
| `/overview` | All slides as thumbnails |
| `/presenter` | Speaker view with notes |
| `/<n>` | Go to slide n |
