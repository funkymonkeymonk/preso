# CLI Commands Reference

Reference for all `preso` commands.

## User Commands

These commands are available to all users with the `preso` binary installed.

### Presentation Management

| Command | Description |
|---------|-------------|
| `preso init` | Create slides.md in current directory |
| `preso init --theme <theme>` | Create with specific theme |
| `preso init -n "Title"` | Create with custom title |
| `preso serve` | Start development server on port 3030 |
| `preso serve -p <port>` | Start on a specific port |
| `preso build` | Build static site to `./dist` |
| `preso pdf` | Export to PDF |
| `preso pdf -o <file>` | Export with custom filename |
| `preso present` | Open presenter mode with speaker notes |

### Theme Management

| Command | Description |
|---------|-------------|
| `preso theme list` | List available themes |
| `preso theme set <name>` | Apply a theme to current presentation |
| `preso theme add <name>` | Add theme to favorites |

### Configuration

| Command | Description |
|---------|-------------|
| `preso config show` | Show current configuration |
| `preso config set <key> <value>` | Set a configuration value |

Common settings:
- `defaultTheme` - Theme for new presentations
- `defaultPort` - Default server port

### LLM/Agent Commands

| Command | Description |
|---------|-------------|
| `preso llm` | Compact help (minimal tokens) |
| `preso llm status` | JSON status of current directory |
| `preso llm debug` | Troubleshooting information |
| `preso llm schema` | Structured command schema for tool use |

## Getting Help

Each command has detailed help:

```bash
preso --help           # List all commands
preso <command> -h     # Help for specific command
```

## Common Workflows

### Start a New Presentation

```bash
mkdir my-talk && cd my-talk
preso init
preso serve
```

### Export for Sharing

```bash
cd my-talk
preso build    # Static site in ./dist
preso pdf      # PDF file
```

### Multiple Presentations

Run presentations on different ports:

```bash
# Terminal 1
cd ~/talks/talk-a
preso serve -p 3030

# Terminal 2
cd ~/talks/talk-b
preso serve -p 3031
```

---

## Development Commands

> **Note:** These commands are only available when developing the preso CLI itself. They require [devenv](https://devenv.sh) and are not needed for creating presentations.

After running `devenv shell`:

| Command | Description |
|---------|-------------|
| `preso-dev <cmd>` | Run CLI in development mode |
| `preso-build` | Build binary for current platform |
| `preso-build-all` | Build binaries for all platforms |
| `preso-typecheck` | Type-check source code |

### Devenv Scripts (Development Only)

These scripts manage presentations within the preso repository for testing:

| Command | Description |
|---------|-------------|
| `slides-list` | List presentations in `presentations/` |
| `slides-select <name>` | Select a presentation for testing |
| `slides-serve` | Start dev server in background |
| `slides-stop` | Stop background server |
| `devenv up` | Start process-compose with TUI |

### Agent Session Scripts (Development Only)

| Command | Description |
|---------|-------------|
| `agent-start` | Start zellij session with OpenCode |
| `agent-sessions` | List active sessions |
| `agent-connect [id]` | Connect to existing session |
