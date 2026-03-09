# AGENTS.md

> **PRESO** - Slidev presentation CLI

Quick reference for AI agents. For detailed help: `preso llm`

## Key Concept

**One directory = one presentation.** The current working directory is the presentation.

## Essential Commands

```bash
# Create presentation
mkdir my-talk && cd my-talk
preso init

# Develop
preso serve              # Start dev server on :3030
preso serve -p 3031      # Use different port

# Export
preso build              # Static site -> ./dist
preso pdf                # PDF export

# Present
preso present            # Speaker notes view
```

## LLM-Optimized Discovery

```bash
preso llm                # Compact help (minimal tokens)
preso llm status         # JSON: cwd, slides exist, port status
preso llm debug          # Troubleshooting info
preso llm schema         # Structured command schema for tool use
```

## Quick Fixes

| Problem | Solution |
|---------|----------|
| "No slides.md" | `preso init` |
| "Port in use" | `preso serve -p <other>` |
| PDF fails | `bunx playwright install chromium` |

## File Locations

| Item | Location |
|------|----------|
| Presentation | `./slides.md` (current directory) |
| Global config | `~/.config/preso/config.json` |

## Documentation

- [Full documentation](docs/index.md)
- [CLI reference](docs/reference/cli-commands.md)
- [Slidev syntax](docs/reference/slidev-syntax.md)

## Contributing

For contributors developing the preso CLI:

```bash
devenv shell
preso-dev serve          # Run in dev mode
preso-build              # Build current platform
```

See [Contributing Guide](docs/contributing/getting-started.md) for details.
