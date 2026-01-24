# PRESO

**PRESO Renders Engaging Slides On-demand**

AI-powered markdown presentations using [Slidev](https://sli.dev), with integrated agent development environment.

## Quick Start

```bash
# Enter the dev environment
devenv shell

# Select a presentation
slides-select example

# Start the dev server (runs via process-compose)
devenv up

# Open http://localhost:3030 in your browser
```

## Available Commands

All commands are available after entering the devenv shell.

### Presentation Management

| Command | Description |
|---------|-------------|
| `slides-list` | List all presentations (marks current) |
| `slides-select <name>` | Select a presentation to work on |
| `slides-current` | Show currently selected presentation |
| `slides-new <name>` | Create a new presentation |
| `slides-build` | Build static site for deployment |
| `slides-pdf` | Export presentation to PDF |
| `slides-present` | Open in presenter mode with remote control |

### Development

| Command | Description |
|---------|-------------|
| `devenv up` | Start dev server via process-compose (recommended) |
| `slides-dev` | Start dev server standalone (for debugging) |

### Agent Sessions

| Command | Description |
|---------|-------------|
| `agent-start` | Start new session (zellij + process-compose + opencode) |
| `agent-sessions` | List active sessions for this repo |
| `agent-connect [id]` | Connect to an existing session |

## Project Structure

```
presentations/           # All presentations
  example/
    slides.md           # Presentation content
  my-talk/
    slides.md
.current-preso          # Currently selected presentation
devenv.nix              # Scripts, processes, environment
docs/plans/             # Design documents
shared/                 # Cross-presentation assets
```

## Working with Presentations

### Creating a New Presentation

```bash
slides-new my-awesome-talk
# Creates presentations/my-awesome-talk/slides.md
# Auto-selects it as current
```

### Switching Presentations

```bash
# See what's available
slides-list

# Switch to a different one
slides-select other-talk

# If devenv up is running, slides auto-restart
```

### Editing

Edit `presentations/<name>/slides.md` using standard Markdown with Slidev extensions. See the [Slidev documentation](https://sli.dev) for syntax and features.

Slides are separated by `---` and support:
- Code highlighting with line numbers
- Vue components
- Layouts and themes
- Presenter notes (use `<!--` comments after slide content)

## Agent Development Sessions

Sessions provide a split terminal with:
- **process-compose TUI** - View/control background processes
- **OpenCode** - AI coding assistant

```bash
# Start a new session
agent-start

# Later, reconnect to it
agent-sessions        # See active sessions
agent-connect a3f2    # Connect by short ID
```

## Requirements

- [devenv](https://devenv.sh) - Manages all other dependencies automatically

## Troubleshooting

### Slides not loading on port 3030

Most likely `.current-preso` references a non-existent presentation:

```bash
# Check what's selected
slides-current

# List what exists
slides-list

# Fix by selecting a valid one
slides-select example
```

### Multiple slidev processes running

Kill orphans and restart:

```bash
pkill -f "slidev presentations"
devenv up
```
