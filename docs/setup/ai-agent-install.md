# Installing preso for AI Agents

Quick setup for using preso with OpenCode, Claude Code, or other AI coding assistants.

## One-Line Install

```bash
# macOS (Apple Silicon)
curl -fsSL https://github.com/funkymonkeymonk/preso/releases/download/latest/preso-darwin-arm64 -o /usr/local/bin/preso && chmod +x /usr/local/bin/preso

# macOS (Intel)
curl -fsSL https://github.com/funkymonkeymonk/preso/releases/download/latest/preso-darwin-x64 -o /usr/local/bin/preso && chmod +x /usr/local/bin/preso

# Linux (x64)
curl -fsSL https://github.com/funkymonkeymonk/preso/releases/download/latest/preso-linux-x64 -o /usr/local/bin/preso && chmod +x /usr/local/bin/preso

# Linux (ARM64)
curl -fsSL https://github.com/funkymonkeymonk/preso/releases/download/latest/preso-linux-arm64 -o /usr/local/bin/preso && chmod +x /usr/local/bin/preso
```

## Verify Installation

```bash
preso --version
preso llm status
```

## For AI Agents

After installation, the agent should run:

```bash
preso llm
```

This provides a token-efficient command reference. For structured tool use:

```bash
preso llm schema
```

## Skill Installation (OpenCode)

Copy the preso skill to your OpenCode skills directory:

```bash
mkdir -p ~/.config/opencode/skills/preso
curl -fsSL https://raw.githubusercontent.com/funkymonkeymonk/preso/main/.opencode/skills/preso/SKILL.md -o ~/.config/opencode/skills/preso/SKILL.md
```

Or if working in a project with preso:

```bash
mkdir -p .opencode/skills/preso
curl -fsSL https://raw.githubusercontent.com/funkymonkeymonk/preso/main/.opencode/skills/preso/SKILL.md -o .opencode/skills/preso/SKILL.md
```

## Updating

```bash
# Get latest version
curl -fsSL https://github.com/funkymonkeymonk/preso/releases/download/latest/preso-$(uname -s | tr '[:upper:]' '[:lower:]')-$(uname -m | sed 's/x86_64/x64/' | sed 's/aarch64/arm64/') -o /usr/local/bin/preso && chmod +x /usr/local/bin/preso
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Permission denied | Use `sudo` or install to `~/.local/bin` |
| Command not found | Add install location to `$PATH` |
| Wrong architecture | Check `uname -m` and download matching binary |
