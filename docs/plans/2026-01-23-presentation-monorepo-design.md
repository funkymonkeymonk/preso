# Presentation Monorepo Design

## Overview

Transform this repo into a presentation monorepo where multiple presentations share common tooling and build processes, with easy switching between them.

## Directory Structure

```
presos/
├── presentations/
│   ├── opencode-talk/
│   │   └── slides.md
│   └── example/              # current slides.md moves here
│       └── slides.md
├── shared/                   # future: themes, components, layouts
├── .current-preso            # tracks selected presentation (gitignored)
└── Taskfile.yml              # updated with picker logic
```

Each presentation is a self-contained directory under `presentations/`. The `shared/` directory is a placeholder for future shared assets.

## Selection Logic

Priority (highest to lowest):
1. `PRESO` environment variable (for scripting/automation)
2. `.current-preso` file contents (remembers last selection)
3. Interactive fzf picker (when neither exists)

The picker updates `.current-preso` after selection, so subsequent commands use the same presentation.

## Tasks

| Task | Description |
|------|-------------|
| `slides:dev` | Dev server for selected presentation |
| `slides:build` | Build static site to `presentations/<name>/dist/` |
| `slides:pdf` | Export PDF to `presentations/<name>/<name>.pdf` |
| `slides:present` | Presenter mode for selected presentation |
| `slides:list` | List all available presentations |
| `slides:select` | Open picker, set `.current-preso` |
| `slides:current` | Show currently selected presentation |
| `slides:new` | Create new presentation from template |

## New Presentation Template

```yaml
---
theme: seriph
title: <Name (title-cased)>
---

# <Name (title-cased)>

Your presentation starts here.
```

## Implementation Steps

1. Create `presentations/` directory
2. Move `slides.md` → `presentations/example/slides.md`
3. Create empty `shared/` directory
4. Add `.current-preso` to `.gitignore`
5. Update `Taskfile.yml` with new task structure and selection logic
