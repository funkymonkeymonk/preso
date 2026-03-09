# Installing preso

Quick setup guide for installing the preso CLI.

## One-Line Install

```bash
# macOS (Apple Silicon)
sudo curl -fsSL https://github.com/wweaver/preso/releases/latest/download/preso-darwin-arm64 -o /usr/local/bin/preso && sudo chmod +x /usr/local/bin/preso

# macOS (Intel)
sudo curl -fsSL https://github.com/wweaver/preso/releases/latest/download/preso-darwin-x64 -o /usr/local/bin/preso && sudo chmod +x /usr/local/bin/preso

# Linux (x64)
sudo curl -fsSL https://github.com/wweaver/preso/releases/latest/download/preso-linux-x64 -o /usr/local/bin/preso && sudo chmod +x /usr/local/bin/preso

# Linux (ARM64)
sudo curl -fsSL https://github.com/wweaver/preso/releases/latest/download/preso-linux-arm64 -o /usr/local/bin/preso && sudo chmod +x /usr/local/bin/preso

# Windows (PowerShell as Administrator)
Invoke-WebRequest -Uri https://github.com/wweaver/preso/releases/latest/download/preso-windows-x64.exe -OutFile C:\Windows\preso.exe
```

## Verify Installation

```bash
preso --version
```

## Updating

```bash
# Auto-detects platform (requires sudo)
sudo curl -fsSL https://github.com/wweaver/preso/releases/latest/download/preso-$(uname -s | tr '[:upper:]' '[:lower:]')-$(uname -m | sed 's/x86_64/x64/' | sed 's/aarch64/arm64/') -o /usr/local/bin/preso && sudo chmod +x /usr/local/bin/preso
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Permission denied | Use `sudo` or install to `~/.local/bin` |
| Command not found | Add install location to `$PATH` |
| Wrong architecture | Check `uname -m` and download matching binary |

## For AI Coding Assistants

If you're setting up preso for use with OpenCode, Claude Code, or other AI coding assistants:

### Quick Status Check

```bash
preso llm status    # JSON status of current directory
preso llm           # Token-efficient command reference
preso llm schema    # Structured command schema for tool use
```

### OpenCode Skill Installation

Copy the preso skill to your OpenCode skills directory:

```bash
mkdir -p ~/.config/opencode/skills/preso
curl -fsSL https://raw.githubusercontent.com/wweaver/preso/main/.opencode/skills/preso/SKILL.md -o ~/.config/opencode/skills/preso/SKILL.md
```

Or for project-local installation:

```bash
mkdir -p .opencode/skills/preso
curl -fsSL https://raw.githubusercontent.com/wweaver/preso/main/.opencode/skills/preso/SKILL.md -o .opencode/skills/preso/SKILL.md
```
