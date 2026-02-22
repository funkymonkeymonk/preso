# How to Build and Export Presentations

This guide shows you how to create distributable versions of your presentation.

## Build a Static Website

Generate a static HTML site for deployment:

```bash
slides-build
```

The output is saved to `presentations/<name>/dist/`.

You can deploy this folder to any static hosting service (Netlify, Vercel, GitHub Pages, etc.).

## Export to PDF

Create a PDF version for sharing:

```bash
slides-pdf
```

The output is saved to `presentations/<name>/<name>.pdf`.

**Note:** PDF export requires Playwright. If not installed, the command will prompt you to install it.

## Start Presenter Mode

For presenting with speaker notes and controls:

```bash
slides-present
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

### Build fails with "presentation not found"

Validate your selection first:

```bash
slides-validate
slides-build
```

### PDF is missing slides

Ensure all slides render correctly in the browser first. PDF export captures what's visible.

### Animations not in PDF

PDF export captures the final state of each slide. Click-through animations become separate pages.

> For reference on all available commands, see [CLI Reference](../reference/cli-commands.md).
