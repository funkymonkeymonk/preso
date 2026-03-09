# How to Deploy Your Presentation

This guide shows you how to deploy your presentation to various hosting platforms.

## Build for Deployment

First, create a static build:

```bash
preso build
```

This creates a `dist/` directory with all the files needed to host your presentation.

## GitHub Pages

### Option 1: Manual Deployment

1. Build your presentation:
   ```bash
   preso build --base /your-repo-name/
   ```

2. Push the `dist/` folder to a `gh-pages` branch:
   ```bash
   cd dist
   git init
   git add .
   git commit -m "Deploy presentation"
   git branch -M gh-pages
   git remote add origin https://github.com/username/your-repo-name.git
   git push -f origin gh-pages
   ```

3. Enable GitHub Pages in your repository settings:
   - Go to Settings > Pages
   - Source: Deploy from a branch
   - Branch: `gh-pages` / `/ (root)`

### Option 2: GitHub Actions

Add `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: oven-sh/setup-bun@v2
        with:
          bun-version: latest

      - run: bun install
      - run: bunx slidev build slides.md --base /${{ github.event.repository.name }}/

      - uses: actions/configure-pages@v4
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

      - uses: actions/deploy-pages@v4
```

## Netlify

### Option 1: Drag and Drop

1. Build locally: `preso build`
2. Go to [netlify.com](https://netlify.com)
3. Drag the `dist/` folder to the deploy zone

### Option 2: Git Integration

1. Connect your repository to Netlify
2. Set build settings:
   - Build command: `bunx slidev build slides.md`
   - Publish directory: `dist`

## Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Build and deploy:
   ```bash
   preso build
   cd dist
   vercel
   ```

Or connect your repository:
- Build command: `bunx slidev build slides.md`
- Output directory: `dist`

## Cloudflare Pages

1. Connect your repository to Cloudflare Pages
2. Set build settings:
   - Build command: `bunx slidev build slides.md`
   - Build output directory: `dist`

## Self-Hosting

After building, the `dist/` directory contains static files that can be served by any web server:

```bash
preso build

# Preview locally
cd dist && python -m http.server 8000

# Or with Node
npx serve dist

# Or copy to your web server
rsync -avz dist/ user@server:/var/www/presentation/
```

## Base Path Configuration

If your presentation won't be at the root of a domain, set the base path:

```bash
# For https://example.com/slides/
preso build --base /slides/

# For https://username.github.io/repo-name/
preso build --base /repo-name/
```

## Tips

- **Test the build locally** before deploying: `cd dist && python -m http.server`
- **Use relative assets** - images and files should use relative paths
- **Check the base path** - wrong base path causes blank pages or missing assets
