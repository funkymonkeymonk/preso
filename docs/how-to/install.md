# Installing preso

Quick setup guide for installing the preso CLI.

## Homebrew (Recommended for macOS/Linux)

```bash
brew install funkymonkeymonk/preso/preso
```

Or tap first for shorter commands:

```bash
brew tap funkymonkeymonk/preso
brew install preso
```

## Manual Download

### macOS

```bash
# Apple Silicon (M1/M2/M3)
sudo curl -fsSL https://github.com/funkymonkeymonk/preso/releases/latest/download/preso-darwin-arm64 -o /usr/local/bin/preso && sudo chmod +x /usr/local/bin/preso

# Intel
sudo curl -fsSL https://github.com/funkymonkeymonk/preso/releases/latest/download/preso-darwin-x64 -o /usr/local/bin/preso && sudo chmod +x /usr/local/bin/preso
```

### Linux

```bash
# x64
sudo curl -fsSL https://github.com/funkymonkeymonk/preso/releases/latest/download/preso-linux-x64 -o /usr/local/bin/preso && sudo chmod +x /usr/local/bin/preso

# ARM64
sudo curl -fsSL https://github.com/funkymonkeymonk/preso/releases/latest/download/preso-linux-arm64 -o /usr/local/bin/preso && sudo chmod +x /usr/local/bin/preso
```

### Windows

```powershell
# PowerShell (run as Administrator for system-wide install)
# Option 1: Install to user directory (recommended)
New-Item -ItemType Directory -Force -Path "$env:LOCALAPPDATA\preso"
Invoke-WebRequest -Uri https://github.com/funkymonkeymonk/preso/releases/latest/download/preso-windows-x64.exe -OutFile "$env:LOCALAPPDATA\preso\preso.exe"
# Add to PATH: [Environment]::SetEnvironmentVariable("Path", $env:Path + ";$env:LOCALAPPDATA\preso", "User")

# Option 2: System-wide (requires Admin)
Invoke-WebRequest -Uri https://github.com/funkymonkeymonk/preso/releases/latest/download/preso-windows-x64.exe -OutFile "C:\Program Files\preso\preso.exe"
```

## Verify Installation

```bash
preso --version
```

## Updating

### Homebrew

```bash
brew upgrade preso
```

### Manual

Re-run the installation command for your platform, or use this auto-detecting script (macOS/Linux):

```bash
sudo curl -fsSL https://github.com/funkymonkeymonk/preso/releases/latest/download/preso-$(uname -s | tr '[:upper:]' '[:lower:]')-$(uname -m | sed 's/x86_64/x64/' | sed 's/aarch64/arm64/') -o /usr/local/bin/preso && sudo chmod +x /usr/local/bin/preso
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
curl -fsSL https://raw.githubusercontent.com/funkymonkeymonk/preso/main/.opencode/skills/preso/SKILL.md -o ~/.config/opencode/skills/preso/SKILL.md
```

Or for project-local installation:

```bash
mkdir -p .opencode/skills/preso
curl -fsSL https://raw.githubusercontent.com/funkymonkeymonk/preso/main/.opencode/skills/preso/SKILL.md -o .opencode/skills/preso/SKILL.md
```
