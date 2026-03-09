# How to Build and Export Presentations

This guide shows you how to create distributable versions of your presentation.

## Build a Static Website

Generate a static HTML site for deployment:

```bash
cd my-presentation
preso build
```

The output is saved to `./dist/`.

You can deploy this folder to any static hosting service (Netlify, Vercel, GitHub Pages, etc.).

## Export to PDF

Create a PDF version for sharing:

```bash
preso pdf
```

The output is saved as `<directory-name>.pdf` in the current directory.

To use a custom filename:

```bash
preso pdf -o my-slides.pdf
```

**Note:** PDF export requires Playwright. If not installed, the command will prompt you to install it:

```bash
bunx playwright install chromium
```

## Start Presenter Mode

For presenting with speaker notes and controls:

```bash
preso present
```

This opens:
- **Main window:** Full-screen presentation for the audience
- **Presenter window:** Speaker view with notes, timer, and slide preview

## Build vs PDF Comparison

| Format | Best For | Interactivity |
|--------|----------|---------------|
| Static build | Web deployment, online sharing | Full (animations, Monaco editor, etc.) |
| PDF | Offline sharing, printing, email | None (static images) |

## Troubleshooting

### Build fails with "No slides.md found"

Make sure you're in the presentation directory:

```bash
preso llm status   # Check if slides.md exists
preso build
```

### PDF is missing slides

Ensure all slides render correctly in the browser first. PDF export captures what's visible.

### Animations not in PDF

PDF export captures the final state of each slide. Click-through animations become separate pages.

### PDF export fails

Install Playwright's Chromium:

```bash
bunx playwright install chromium
```

## Quick Reference

| Task | Command |
|------|---------|
| Build static site | `preso build` |
| Export to PDF | `preso pdf` |
| Custom PDF name | `preso pdf -o name.pdf` |
| Presenter mode | `preso present` |

> For reference on all available commands, see [CLI Reference](../reference/cli-commands.md).
