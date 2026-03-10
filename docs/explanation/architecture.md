# Why PRESO?

This document explains the design decisions behind PRESO and why it works the way it does.

## The Problem PRESO Solves

[Slidev](https://sli.dev) is an excellent presentation tool for developers, but using it directly requires:

1. Installing Node.js and npm/yarn/pnpm
2. Creating a `package.json` with the right dependencies
3. Running `npx slidev` with the correct arguments
4. Understanding Vite configuration for customization

PRESO wraps all of this into a single binary that handles the complexity.

## Design Principles

### One Directory = One Presentation

The core mental model is simple: **the current working directory IS the presentation.**

This design choice has several benefits:

- **No project configuration files** - No need to track which presentation is "active"
- **No ambiguity** - `preso serve` always serves the current directory
- **Simple parallelism** - Multiple presentations = multiple terminals on different ports
- **Git-friendly** - Each presentation can be its own repository

Alternative approaches we avoided:

- **Workspace model** (one project, multiple presentations): Adds complexity for organizing presentations that could just be separate directories
- **Global presentation registry**: Requires tracking state across sessions

### Thin Wrapper Over Slidev

PRESO adds value by simplifying the interface, not by reimplementing Slidev:

- `preso init` creates the right files so Slidev works
- `preso serve` runs `slidev` with sensible defaults
- `preso build` and `preso pdf` pass through to Slidev's build tools

This means:

- **Full Slidev compatibility** - All Slidev features work
- **Documentation reuse** - Slidev docs cover slide syntax, themes, etc.
- **Minimal maintenance** - Updates to Slidev automatically benefit PRESO users

### Bun-Powered Standalone Binary

PRESO compiles to a standalone executable using Bun's compile feature:

- **No runtime dependencies** - Download and run
- **Fast startup** - Native binary, not interpreted JavaScript
- **Cross-platform** - Builds for macOS (ARM64, x64), Linux (ARM64, x64), Windows

The tradeoff is larger binary size (~90MB) compared to a Node.js script, but the improved user experience is worth it.

## Why Not Just Use Slidev Directly?

You can! PRESO is for users who want:

- **Simpler commands** - `preso serve` vs `npx slidev slides.md --port 3030`
- **Automatic setup** - `preso init` creates everything needed
- **No Node.js required** - The binary includes the runtime
- **Opinionated defaults** - Sensible choices made for you

If you're already comfortable with Node.js tooling and want full control, using Slidev directly is a valid choice.

## Configuration Philosophy

PRESO uses a minimal configuration approach:

| Setting | Scope | Purpose |
|---------|-------|---------|
| `~/.config/preso/config.json` | Global | Default theme, port, template |
| `slides.md` frontmatter | Per-presentation | Theme, title, Slidev options |

There's no per-presentation config file beyond `slides.md` itself. This keeps presentations self-contained and portable.

## LLM-First Design

The `preso llm` commands exist because AI coding assistants are a primary use case:

- **Token efficiency** - `preso llm` outputs minimal, structured help
- **Machine-readable status** - `preso llm status` returns JSON
- **Error recovery hints** - Schema includes common fixes

This makes PRESO work well with tools like OpenCode, Claude Code, and Cursor.
