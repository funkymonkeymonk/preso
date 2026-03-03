# PRESO

**PRESO Renders Engaging Slides On-demand**

A standalone CLI for creating and presenting [Slidev](https://sli.dev) presentations.

## AI Agent Quick Install

One-line install for AI coding assistants (installs binary + OpenCode skill):

```bash
# macOS (Apple Silicon)
curl -fsSL https://github.com/wweaver/preso/releases/latest/download/preso-darwin-arm64 -o /usr/local/bin/preso && chmod +x /usr/local/bin/preso && mkdir -p ~/.config/opencode/skills/preso && curl -fsSL https://raw.githubusercontent.com/wweaver/preso/main/.opencode/skills/preso/SKILL.md -o ~/.config/opencode/skills/preso/SKILL.md

# macOS (Intel)
curl -fsSL https://github.com/wweaver/preso/releases/latest/download/preso-darwin-x64 -o /usr/local/bin/preso && chmod +x /usr/local/bin/preso && mkdir -p ~/.config/opencode/skills/preso && curl -fsSL https://raw.githubusercontent.com/wweaver/preso/main/.opencode/skills/preso/SKILL.md -o ~/.config/opencode/skills/preso/SKILL.md

# Linux (x64)
curl -fsSL https://github.com/wweaver/preso/releases/latest/download/preso-linux-x64 -o /usr/local/bin/preso && chmod +x /usr/local/bin/preso && mkdir -p ~/.config/opencode/skills/preso && curl -fsSL https://raw.githubusercontent.com/wweaver/preso/main/.opencode/skills/preso/SKILL.md -o ~/.config/opencode/skills/preso/SKILL.md

# Linux (ARM64)
curl -fsSL https://github.com/wweaver/preso/releases/latest/download/preso-linux-arm64 -o /usr/local/bin/preso && chmod +x /usr/local/bin/preso && mkdir -p ~/.config/opencode/skills/preso && curl -fsSL https://raw.githubusercontent.com/wweaver/preso/main/.opencode/skills/preso/SKILL.md -o ~/.config/opencode/skills/preso/SKILL.md
```

After installation, run `preso llm` for token-efficient command reference, or `preso llm schema` for structured tool use.

## Installation

Download the latest release for your platform:

```bash
# macOS (Apple Silicon)
curl -L https://github.com/wweaver/preso/releases/latest/download/preso-darwin-arm64 -o preso
chmod +x preso && sudo mv preso /usr/local/bin/

# macOS (Intel)
curl -L https://github.com/wweaver/preso/releases/latest/download/preso-darwin-x64 -o preso
chmod +x preso && sudo mv preso /usr/local/bin/

# Linux
curl -L https://github.com/wweaver/preso/releases/latest/download/preso-linux-x64 -o preso
chmod +x preso && sudo mv preso /usr/local/bin/
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
| `preso theme` | Manage themes (list, set, add) |
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

## Development

For contributors using [devenv](https://devenv.sh):

```bash
devenv shell
preso-dev serve        # Run CLI in dev mode
preso-build            # Build binary for current platform
preso-build-all        # Build for all platforms
```

## License

MIT
