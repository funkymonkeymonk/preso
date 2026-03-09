---
theme: seriph
title: What Is PRESO
info: |
  PRESO Renders Engaging Slides On-demand
  A standalone CLI for Slidev presentations
class: text-center
highlighter: shiki
drawings:
  persist: false
transition: slide-left
---

# PRESO

**PRESO Renders Engaging Slides On-demand**

A standalone CLI for creating and presenting Slidev presentations

---

# What is PRESO?

A standalone CLI that wraps Slidev for easy presentation management:

- **Markdown-based slides** - Write presentations in simple markdown
- **Zero configuration** - One directory = one presentation
- **Multiple platforms** - macOS, Linux, Windows binaries
- **LLM-optimized** - Token-efficient help for AI agents

---

# Quick Start

```bash
# Install (macOS Apple Silicon)
curl -L https://github.com/wweaver/preso/releases/latest/download/preso-darwin-arm64 -o preso
chmod +x preso && sudo mv preso /usr/local/bin/

# Create a presentation
mkdir my-talk && cd my-talk
preso init

# Start dev server
preso serve
```

---

# Core Commands

| Command | Description |
|---------|-------------|
| `preso init` | Create slides.md in current directory |
| `preso serve` | Start development server on :3030 |
| `preso build` | Build static site to ./dist |
| `preso pdf` | Export to PDF |
| `preso present` | Start presenter mode with notes |
| `preso theme` | Manage themes (list/set/add) |
| `preso config` | Manage global configuration |

---

# Key Concept

**One directory = one presentation**

```
~/talks/
├── quarterly-review/
│   └── slides.md          # preso serve -p 3030
├── product-demo/
│   └── slides.md          # preso serve -p 3031
└── team-onboarding/
    └── slides.md          # preso serve -p 3032
```

Each presentation is self-contained. Run multiple on different ports.

---

# For AI Agents

Token-efficient commands for LLM assistants:

```bash
preso llm              # Compact command reference
preso llm status       # JSON: cwd, slides exist, port status
preso llm debug        # Troubleshooting information
preso llm schema       # Structured command schema
```

---

# Tech Stack

| Tool | Purpose |
|------|---------|
| **Slidev** | Markdown presentation framework |
| **Bun** | JavaScript runtime & bundler |
| **TypeScript** | Type-safe CLI implementation |

Built as standalone binaries - no Node.js required!

---

# File Locations

| Item | Path |
|------|------|
| Presentation content | `./slides.md` |
| Global config | `~/.config/preso/config.json` |
| Custom themes | `~/.config/preso/themes/` |
| Build output | `./dist/` |
| PDF export | `./<dirname>.pdf` |

---
layout: center
class: text-center
---

# Learn More

[Slidev Documentation](https://sli.dev) · [PRESO on GitHub](https://github.com/wweaver/preso)

---
layout: end
---

# Thanks!

Start creating with `mkdir my-talk && cd my-talk && preso init`
