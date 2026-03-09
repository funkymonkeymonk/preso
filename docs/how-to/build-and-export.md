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

### Custom Output Directory

```bash
preso build -o public          # Build to ./public
preso build --base /slides/    # Set base path for subdirectory hosting
```

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

### PDF Options

```bash
preso pdf --dark           # Use dark theme
preso pdf --with-clicks    # Separate pages for click animations
preso pdf --with-toc       # Include table of contents
```

**Note:** PDF export requires Playwright. If not installed:

```bash
bunx playwright install chromium
```

## Build vs PDF Comparison

| Format | Best For | Interactivity |
|--------|----------|---------------|
| Static build | Web deployment, online sharing | Full (animations, Monaco editor, etc.) |
| PDF | Offline sharing, printing, email | None (static images) |

## Quick Reference

| Task | Command |
|------|---------|
| Build static site | `preso build` |
| Build to custom dir | `preso build -o public` |
| Export to PDF | `preso pdf` |
| Custom PDF name | `preso pdf -o name.pdf` |
| PDF with click pages | `preso pdf --with-clicks` |

> For troubleshooting export issues, see [Troubleshooting](troubleshoot-server.md).
> For all CLI options, see [CLI Reference](../reference/cli-commands.md).
