---
theme: seriph
title: What Is PRESO
info: |
  PRESO Renders Engaging Slides On-demand
  A standalone CLI for creating Slidev presentations
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

A command-line tool that wraps Slidev for easy presentation creation:

- **Markdown-based slides** - Write presentations in simple markdown
- **One directory = one presentation** - Simple, predictable structure
- **LLM-optimized** - Built-in commands for AI agent discovery
- **Zero config** - Works out of the box

---

# Installation

```bash
# macOS (Apple Silicon)
curl -L https://github.com/wweaver/preso/releases/latest/download/preso-darwin-arm64 -o preso
chmod +x preso && sudo mv preso /usr/local/bin/

# Verify
preso --version
```

Also available for macOS Intel, Linux x64, and Linux ARM64.

---

# Quick Start

```bash
# Create a new presentation
mkdir my-talk && cd my-talk
preso init

# Start development server
preso serve

# Open http://localhost:3030
```

That's it! Edit `slides.md` and see changes instantly.

---

# Core Commands

| Command | Description |
|---------|-------------|
| `preso init` | Create slides.md in current directory |
| `preso serve` | Start development server |
| `preso build` | Build static site for deployment |
| `preso pdf` | Export to PDF |
| `preso present` | Start presenter mode with notes |
| `preso theme` | Manage themes |
| `preso config` | Global configuration |

---

# Multiple Presentations

Each presentation lives in its own directory.
Run multiple presentations on different ports:

```bash
# Terminal 1
cd ~/talks/talk-a
preso serve -p 3030

# Terminal 2
cd ~/talks/talk-b
preso serve -p 3031
```

---

# For AI Agents

PRESO includes LLM-optimized discovery commands:

```bash
preso llm              # Compact help (minimal tokens)
preso llm status       # JSON status of current directory
preso llm debug        # Troubleshooting info
preso llm schema       # Structured command schema
```

Perfect for AI coding assistants like OpenCode or Claude.

---

# Slidev Syntax

```markdown
---
theme: seriph
---

# First Slide

Content here

---

# Second Slide

- Bullet points
- Code highlighting
- Speaker notes in HTML comments
```

---

# File Structure

A presentation is just a directory:

```
my-talk/
├── slides.md      # Your presentation
├── package.json   # Dependencies (auto-created)
└── .gitignore     # Sensible defaults
```

Global config lives at `~/.config/preso/config.json`

---
layout: center
class: text-center
---

# Learn More

[Slidev Documentation](https://sli.dev) | [PRESO on GitHub](https://github.com/wweaver/preso)

---
layout: end
---

# Get Started

```bash
mkdir my-talk && cd my-talk && preso init && preso serve
```
