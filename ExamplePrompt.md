# Example Prompt

## User Request

```
make @presentations/what-is-preso/ a presentation about this repo
```

## Agent Process

### 1. Loaded Required Skill

Per AGENTS.md instructions, loaded the `project:taskfile` skill first.

### 2. Gathered Context

Read the following files in parallel:
- `presentations/what-is-preso/slides.md` - existing placeholder content
- `README.md` - project overview and quick start
- `Taskfile.yml` - all task definitions and documentation

### 3. Original Placeholder Content

```markdown
---
theme: seriph
title: What Is Preso
---

# What Is Preso

Your presentation starts here.
```

### 4. Generated Presentation

```markdown
---
theme: seriph
title: What Is PRESO
info: |
  PRESO Renders Engaging Slides On-demand
  An AI-powered presentation repository with integrated agent development
class: text-center
highlighter: shiki
drawings:
  persist: false
transition: slide-left
---

# PRESO

**PRESO Renders Engaging Slides On-demand**

AI-powered markdown presentations with integrated agent development

---

# What is PRESO?

A Slidev-based presentation repository that combines:

- 📝 **Markdown-based slides** - Write presentations in simple markdown
- 🤖 **AI-powered workflow** - OpenCode integration for agent-assisted development  
- 🔧 **Task automation** - Taskfile-driven commands for everything
- 🖥️ **Session management** - Zellij + process-compose for development sessions

---

# Tech Stack

| Tool | Purpose |
|------|---------|
| **Slidev** | Markdown presentation framework with Vue components |
| **Taskfile** | Task runner - primary interface for all operations |
| **devenv/Nix** | Reproducible development environment |
| **process-compose** | Process orchestration with TUI/API |
| **zellij** | Terminal multiplexer for agent sessions |
| **OpenCode** | AI coding assistant |

---

# Project Structure

```
presentations/           # One directory per presentation
  ├── example/
  │   └── slides.md
  └── what-is-preso/
      └── slides.md
shared/                  # Cross-presentation resources
docs/plans/              # Design documents
Taskfile.yml             # All task definitions
devenv.nix               # Nix environment config
```

---

# Working with Presentations

### List presentations
```bash
task slides:list
```

### Select a presentation
```bash
task slides:select NAME=what-is-preso
```

### Create a new presentation
```bash
task slides:new NAME=my-new-talk
```

---

# Development Workflow

### Start dev server (hot reload)
```bash
task slides:dev
```

### Build for deployment
```bash
task slides:build
```

### Export to PDF
```bash
task slides:pdf
```

### Present with remote control
```bash
task slides:present
```

---

# Presentation Selection System

Three ways to set the current presentation:

1. **Environment variable** - `PRESO=my-talk task slides:dev`
2. **Selection file** - `.current-preso` (auto-created by `slides:select`)
3. **Interactive picker** - fzf fallback when nothing is set

Most `slides:*` commands operate on the current selection.

---

# Agent Sessions

PRESO includes a workflow for AI-assisted development:

```bash
# Start a new session
task agent:start

# List active sessions  
task agent:sessions

# Connect to existing session
task agent:connect
```

---

# Agent Session Architecture

```
┌─────────────────────────────────────────────────┐
│                 zellij session                  │
│              (presos-<shortid>)                 │
├───────────────────┬─────────────────────────────┤
│                   │                             │
│  process-compose  │        OpenCode             │
│      (30%)        │         (70%)               │
│                   │                             │
│  TUI for viewing  │   AI coding assistant       │
│  background       │   with full repo access     │
│  processes        │                             │
│                   │                             │
└───────────────────┴─────────────────────────────┘
```

---

# Environment Variables

Available in agent sessions:

| Variable | Description |
|----------|-------------|
| `OPENCODE_ACTIVE_PORT` | process-compose API port |
| `OPENCODE_SESSION_NAME` | Current session name (e.g., `presos-a3f2`) |

Configure defaults in `devenv.nix` or personal overrides at:
`~/.config/opencode/projects/<project-id>/config`

---

# Quick Start

```bash
# Enter the dev environment
devenv shell

# Create a new presentation
task slides:new NAME=my-talk

# Start editing with hot reload
task slides:dev
```

---
layout: center
class: text-center
---

# Learn More

[Slidev Documentation](https://sli.dev) · [Taskfile](https://taskfile.dev) · [devenv](https://devenv.sh)

---
layout: end
---

# Thanks!

Start creating with `task slides:new NAME=your-talk`
```

## Slides Created

1. **Title slide** - PRESO acronym and tagline
2. **What is PRESO** - Overview of the four main features
3. **Tech Stack** - Table of all tools used
4. **Project Structure** - Directory layout
5. **Working with Presentations** - Basic commands
6. **Development Workflow** - Dev, build, PDF, present commands
7. **Presentation Selection System** - The three priority levels
8. **Agent Sessions** - How to start/list/connect
9. **Agent Session Architecture** - Visual diagram of zellij layout
10. **Environment Variables** - Configuration options
11. **Quick Start** - Getting started steps
12. **Learn More** - Links to documentation
13. **Thanks** - Closing slide

## Preview Command

```bash
task slides:select NAME=what-is-preso
task slides:dev
```
