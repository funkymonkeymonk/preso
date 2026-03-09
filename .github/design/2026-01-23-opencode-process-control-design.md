# OpenCode Process Control Integration

## Overview

Zellij-based development environment integrating OpenCode with process-compose for process visibility and control during coding sessions.

## Entry Point

`agent:start` launches a zellij session with:
- Process-compose TUI in one pane (smaller)
- OpenCode in another pane (larger)
- Split direction auto-detected based on terminal dimensions

## Session Management

**Naming:** `<repo>-<shortid>` (e.g., `presos-a3f2`)
- Repo derived from git remote origin
- Short random ID allows multiple sessions per repo

**Port allocation:**
- First session uses configured port (default 8080)
- Subsequent sessions auto-assign next available port

**Scripts:**
- `agent:start` - Launch new session
- `agent:sessions` - List active sessions for this repo with ports
- `agent:connect [shortid]` - Attach to existing session (picker if multiple)

## Configuration

**Project config** via devenv.nix environment variables:
```nix
env.OPENCODE_AUTORUN = "false";
env.OPENCODE_BACKEND = "devenv";
```

Port read from existing `process.process-compose.port` setting.

**Personal override** at `~/.config/opencode/projects/<project-id>/config`:
```
autorun=true
```

Project ID derived from git remote (e.g., `github.com-wweaver-presos`).

Merge behavior: personal overrides project settings.

## OpenCode Slash Commands

| Command | Description |
|---------|-------------|
| `/processes status` | Show all processes with status, uptime, port |
| `/processes start [name]` | Start all or specific process |
| `/processes stop [name]` | Stop all or specific process |
| `/processes restart [name]` | Restart all or specific process |
| `/processes logs <name> [lines]` | Tail recent logs (default 50 lines) |
| `/processes config` | Show merged config with sources |
| `/processes autorun on\|off` | Toggle autorun in personal config |

Commands use process-compose REST API for control and status.

## Implementation Components

| Component | Location | Purpose |
|-----------|----------|---------|
| `agent:start` | `devenv.nix` script | Launch zellij session |
| `agent:sessions` | `devenv.nix` script | List active sessions |
| `agent:connect` | `devenv.nix` script | Attach to session |
| Session metadata | `/tmp/opencode-sessions/<id>` | Track port assignments |
| Personal override | `~/.config/opencode/projects/<id>/config` | User settings |
| Slash commands | `.opencode/commands/processes.sh` | `/processes *` |

## Dependencies

Add to devenv.nix packages:
- `zellij`
- `jq`
- `fzf` (optional, for session picker)

## Process-Compose API

Endpoints used:
- `GET /processes` - list processes with status
- `POST /processes/{name}/start` - start process
- `POST /processes/{name}/stop` - stop process
- `GET /processes/{name}/logs` - get logs

## Layout

```
┌─────────────────────────────────────┐
│         process-compose TUI         │
│            (30% height)             │
├─────────────────────────────────────┤
│            opencode                 │
│            (70% height)             │
└─────────────────────────────────────┘
```

Split direction (horizontal/vertical) determined at launch based on terminal dimensions.
