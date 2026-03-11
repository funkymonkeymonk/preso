# PRESO

**PRESO Renders Engaging Slides On-demand**

A standalone CLI for creating and presenting [Slidev](https://sli.dev) presentations.

## Installation

### Homebrew (Recommended)

```bash
brew install funkymonkeymonk/preso/preso
```

### Manual Download

```bash
# macOS (Apple Silicon)
curl -fsSL https://github.com/funkymonkeymonk/preso/releases/latest/download/preso-darwin-arm64 -o preso
chmod +x preso && sudo mv preso /usr/local/bin/

# macOS (Intel)
curl -fsSL https://github.com/funkymonkeymonk/preso/releases/latest/download/preso-darwin-x64 -o preso
chmod +x preso && sudo mv preso /usr/local/bin/

# Linux (x64)
curl -fsSL https://github.com/funkymonkeymonk/preso/releases/latest/download/preso-linux-x64 -o preso
chmod +x preso && sudo mv preso /usr/local/bin/

# Linux (ARM64)
curl -fsSL https://github.com/funkymonkeymonk/preso/releases/latest/download/preso-linux-arm64 -o preso
chmod +x preso && sudo mv preso /usr/local/bin/

# Windows (PowerShell)
New-Item -ItemType Directory -Force -Path "$env:LOCALAPPDATA\preso"
Invoke-WebRequest -Uri https://github.com/funkymonkeymonk/preso/releases/latest/download/preso-windows-x64.exe -OutFile "$env:LOCALAPPDATA\preso\preso.exe"
# Add to PATH: [Environment]::SetEnvironmentVariable("Path", $env:Path + ";$env:LOCALAPPDATA\preso", "User")
```

## Quick Start

```bash
# Create a new presentation
mkdir my-talk && cd my-talk
preso init

# Start the dev server
preso serve

# Open http://localhost:3030
```

## Commands

| Command | Description |
|---------|-------------|
| `preso init` | Create slides.md and dependencies in current directory |
| `preso serve` | Start development server |
| `preso build` | Build static site for deployment |
| `preso pdf` | Export to PDF |
| `preso present` | Start presenter mode with speaker notes |
| `preso theme` | Manage themes (list, set, browse) |
| `preso config` | Manage global configuration |

Each command has detailed help: `preso <command> -h`

## Multiple Presentations

Each presentation lives in its own directory. Run multiple presentations on different ports:

```bash
# Terminal 1
cd ~/talks/talk-a
preso serve -p 3030

# Terminal 2
cd ~/talks/talk-b
preso serve -p 3031
```

## Configuration

Global settings are stored in `~/.config/preso/config.json`:

```bash
preso config show                    # View configuration
preso config set defaultTheme seriph # Set default theme
preso config set defaultPort 4000    # Set default port
```

## For AI/LLM Agents

The `llm` command provides token-efficient help and status:

```bash
preso llm              # Compact help
preso llm status       # JSON status of current directory
preso llm debug        # Troubleshooting information
preso llm schema       # Structured command schema
```

For AI coding assistants (OpenCode, Claude Code, etc.), see the [Installation Guide](docs/how-to/install.md#for-ai-coding-assistants).

## Development

For contributors:

```bash
# Using devenv
devenv shell
preso-dev serve        # Run CLI in dev mode
preso-build            # Build binary for current platform

# Or with Bun directly
bun install
bun run src/cli/index.ts serve
bun test
```

See [Contributing Guide](docs/contributing/getting-started.md) for more details.

## Documentation

See [docs/](docs/index.md) for full documentation.

## License

MIT
