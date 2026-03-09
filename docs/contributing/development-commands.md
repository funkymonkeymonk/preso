# Development Commands Reference

Reference for commands available when developing the preso CLI itself.

> **Note:** These commands require [devenv](https://devenv.sh) and are only for contributors. Regular users should use `preso` commands directly.

## Prerequisites

```bash
devenv shell
```

## CLI Development Commands

| Command | Description |
|---------|-------------|
| `preso-dev <cmd>` | Run CLI in development mode |
| `preso-build` | Build binary for current platform |
| `preso-build-all` | Build binaries for all platforms |
| `preso-typecheck` | Type-check source code |
| `preso-lint` | Lint and format code |
| `preso-lint-check` | Check code without fixing |

### Examples

```bash
preso-dev serve           # Test serve command
preso-dev init            # Test init command
preso-build               # Build for current platform
preso-build-all           # Build for all platforms
```

## Slide Management Scripts

These scripts manage test presentations within the preso repository:

| Command | Description |
|---------|-------------|
| `slides-list` | List presentations in `presentations/` |
| `slides-select <name>` | Select a presentation for testing |
| `slides-serve` | Start dev server in background |
| `slides-stop` | Stop background server |
| `slides-validate` | Validate current selection |

### Examples

```bash
slides-list                    # See available presentations
slides-select example          # Select 'example' presentation
slides-serve                   # Start background server
slides-stop                    # Stop server
```

## Agent Session Scripts

| Command | Description |
|---------|-------------|
| `agent-start` | Start zellij session with OpenCode |
| `agent-sessions` | List active sessions |
| `agent-connect [id]` | Connect to existing session |

### Examples

```bash
agent-start                    # New session
agent-sessions                 # List sessions
agent-connect a3f2             # Connect by short ID
```

## Process Management

| Command | Description |
|---------|-------------|
| `devenv up` | Start process-compose with TUI |

The TUI shows running processes and their logs. Use this for interactive development.

> For background on these tools, see [Agent Session Architecture](agent-sessions.md) and [Process-Compose Integration](process-compose-integration.md).
