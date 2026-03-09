# Feature Specification: In-Agent Presentation Workspace

**Feature Branch**: `in-agent-presentation-workspace`  
**Created**: 2026-02-22  
**Status**: Draft  
**Input**: Design session exploring human-agent interface for presentation authoring

## Summary

Create a presentation workspace that allows AI coding agents to author Slidev presentations with full control over preview, process management, and session state. The system must work across multiple agents (OpenCode, Claude Code, Cursor, Goose) and support concurrent sessions for different presentations.

## User Scenarios & Testing

### User Story 1 - Start Presentation Session (Priority: P1)

A user tells their AI agent "let's work on my presentation." The agent detects if there are existing active sessions and asks whether to continue one or start fresh. When starting fresh, the agent allocates a port, starts the Slidev server, and opens a restricted Fence browser window showing the presentation.

**Why this priority**: This is the entry point - nothing else works without session management.

**Independent Test**: Run `preso-start my-talk` and verify: Slidev starts on an allocated port, `.preso-sessions/my-talk.json` is created, Fence browser opens to the correct URL.

**Acceptance Scenarios**:

1. **Given** no existing sessions, **When** user says "start working on presentations", **Then** agent asks which presentation to work on and starts a new session
2. **Given** an active session from 30 minutes ago, **When** user says "work on presentations", **Then** agent offers to continue existing session or start fresh
3. **Given** user selects a presentation, **When** session starts, **Then** Slidev server starts on unique port, browser opens, JSON state file created

---

### User Story 2 - Concurrent Multi-Session Support (Priority: P2)

Multiple agents working on different presentations simultaneously. Each presentation gets its own Slidev server (on different ports) and its own Fence browser window. Sessions don't interfere with each other.

**Why this priority**: Enables parallel workflows - critical for users running multiple agents.

**Independent Test**: Start sessions for two different presentations from different terminals. Verify each has unique port, separate browser window, and independent state file.

**Acceptance Scenarios**:

1. **Given** session A running on port 3030, **When** agent B starts session for different presentation, **Then** session B gets port 3031, both run independently
2. **Given** two active sessions, **When** running `preso-status --all --json`, **Then** output shows both sessions with correct ports and PIDs
3. **Given** session A is stopped, **When** session B continues, **Then** session B is unaffected

---

### User Story 3 - Browser Window Management (Priority: P2)

Agent can open different Slidev views in restricted Fence browser windows: main slides, presenter view (with notes), and overview mode. Windows are restricted to localhost only via Fence's origin policy. Agent can open multiple views for the same presentation.

**Why this priority**: Visual feedback is essential for iterative authoring; multiple views support different workflows.

**Independent Test**: Run `preso-preview my-talk --view presenter` and verify Fence opens http://localhost:PORT/presenter, restricted to localhost origins.

**Acceptance Scenarios**:

1. **Given** an active session, **When** agent runs `preso-preview my-talk`, **Then** Fence browser opens to slides view on correct port
2. **Given** slides view already open, **When** agent runs `preso-preview my-talk --view presenter`, **Then** second Fence window opens to presenter view
3. **Given** Fence is not installed, **When** agent tries to open preview, **Then** clear error message with installation instructions

---

### User Story 4 - Slide Navigation Control (Priority: P3)

Agent can navigate to a specific slide when discussing changes. Uses Slidev's WebSocket remote control protocol to send navigation commands without requiring browser refresh.

**Why this priority**: Useful but not essential - hot reload handles most cases; navigation is for explicit "look at slide 5" scenarios.

**Independent Test**: With preview open, run `preso-navigate my-talk 5` and verify browser jumps to slide 5.

**Acceptance Scenarios**:

1. **Given** preview open on slide 1, **When** agent runs `preso-navigate my-talk 5`, **Then** browser shows slide 5
2. **Given** invalid slide number (e.g., 999), **When** agent navigates, **Then** error message with total slide count
3. **Given** presentation not running, **When** agent tries to navigate, **Then** error indicating session not active

---

### User Story 5 - Session Lifecycle Management (Priority: P3)

User can cleanly stop a session, closing all associated browser windows and stopping the Slidev server. State is cleaned up. Sessions can also be listed for visibility.

**Why this priority**: Cleanup is important but not blocking; users can manually close things.

**Independent Test**: With active session, run `preso-stop my-talk` and verify: Slidev process killed, Fence windows closed, state file removed.

**Acceptance Scenarios**:

1. **Given** active session with two browser windows, **When** `preso-stop my-talk`, **Then** both windows close, Slidev stops, state file deleted
2. **Given** multiple sessions, **When** `preso-stop my-talk`, **Then** only my-talk session stops, others unaffected
3. **Given** no active sessions, **When** `preso-stop my-talk`, **Then** informative message that session not found

---

### Edge Cases

- What happens when Fence is not installed? Graceful fallback to standard browser with warning about navigation restrictions.
- How does system handle port conflicts? Port allocator starts at 3030, increments until finding an available port, up to 3039.
- What if WebSocket connection fails for navigation? Return error, suggest refreshing browser.
- What if session state file exists but process is dead? Detect stale sessions via PID check, clean up automatically.
- What if user force-quits Fence? Session state becomes stale; `preso-status` detects and reports.

## Requirements

### Functional Requirements

- **FR-001**: System MUST track session state in `.preso-sessions/<name>.json` files
- **FR-002**: System MUST allocate unique ports (3030-3039) for concurrent Slidev instances
- **FR-003**: System MUST open Fence browser windows restricted to `localhost:PORT/*` origins
- **FR-004**: System MUST support slides, presenter, and overview view types
- **FR-005**: System MUST detect and report stale sessions (PID no longer running)
- **FR-006**: All commands MUST support `--json` flag for structured output
- **FR-007**: System MUST work when invoked from any agent via bash commands
- **FR-008**: OpenCode MUST have TypeScript tool wrappers in `.opencode/tools/preso.ts`
- **FR-009**: Navigation MUST use Slidev's WebSocket protocol, not page refresh
- **FR-010**: Session state MUST include: name, port, PID, start time, browser window PIDs

### Non-Functional Requirements

- **NFR-001**: Commands MUST complete in under 2 seconds (excluding browser launch)
- **NFR-002**: JSON output MUST be parseable by `jq` without errors
- **NFR-003**: System MUST NOT require always-running daemons
- **NFR-004**: All state MUST be in files (no databases, no external services)

### Key Entities

- **Session**: A running presentation workspace (name, port, PID, browser windows, timestamps)
- **View**: A type of Slidev interface (slides, presenter, overview)
- **Port Allocation**: Dynamic assignment of ports to sessions (3030-3039 range)

## Success Criteria

### Measurable Outcomes

- **SC-001**: Agent can start a session and have preview visible in under 5 seconds
- **SC-002**: Multiple concurrent sessions run without port conflicts
- **SC-003**: `preso-status --all --json | jq .` produces valid JSON for any state
- **SC-004**: Session cleanup leaves no orphan processes after `preso-stop`
- **SC-005**: Agent can complete full edit-preview cycle without user touching browser

---

# Implementation Plan: In-Agent Presentation Workspace

**Branch**: `in-agent-presentation-workspace` | **Date**: 2026-02-22 | **Spec**: above
**Input**: Feature specification from brainstorming session

## Summary

Shell-script-first architecture exposing presentation workspace control via JSON-enabled devenv scripts. Thin wrappers for agents that support custom tools (OpenCode). Uses Fence browser for restricted preview windows.

## Technical Context

**Language/Version**: Bash (devenv scripts), TypeScript (OpenCode tools)  
**Primary Dependencies**: devenv/nix, process-compose, Fence browser, websocat (for WebSocket)  
**Storage**: JSON files in `.preso-sessions/` directory  
**Testing**: Manual verification + shell script tests  
**Target Platform**: macOS (Fence is macOS-only currently)  
**Project Type**: CLI tools + agent integration  
**Performance Goals**: Commands complete in <2s  
**Constraints**: No daemons, file-based state only, agent-agnostic core

## Project Structure

### Documentation

```text
docs/plans/
├── 2026-02-22-in-agent-presentation-workspace-spec.md  # This file
```

### Source Code

```text
# Shell scripts (in devenv.nix)
scripts.preso-start       # Start session: port allocation, Slidev, state file
scripts.preso-stop        # Stop session: kill processes, cleanup state
scripts.preso-status      # Query session state (single or all)
scripts.preso-preview     # Open/manage Fence browser windows
scripts.preso-preview-close # Close preview windows for a session
scripts.preso-navigate    # Jump to specific slide via WebSocket

# Enhanced existing scripts
scripts.slides-list       # Add --json flag
scripts.slides-select     # Add --json flag  
scripts.slides-validate   # Add --json flag (already exists, enhance)

# OpenCode integration
.opencode/tools/preso.ts  # TypeScript wrapper with rich typing

# State directory (gitignored)
.preso-sessions/          # Per-presentation JSON state files

# Agent guidance
.opencode/skills/presentation-workspace/SKILL.md
```

## Tool Specifications

### Core Session Management

#### `preso-start <name>`

Starts a presentation workspace session.

**Behavior**:
1. Validate presentation exists via `slides-validate`
2. Check if session already exists for this presentation
3. Allocate port (3030, increment if in use, max 3039)
4. Start Slidev on allocated port in background
5. Create `.preso-sessions/<name>.json` with state
6. Optionally open preview (if `--preview` flag)

**Output (--json)**:
```json
{
  "started": true,
  "session": {
    "name": "kubernetes-intro",
    "port": 3030,
    "pid": 12345,
    "started": "2026-02-22T10:30:00Z",
    "url": "http://localhost:3030"
  }
}
```

**Errors**:
- Presentation not found → exit 1, message with `slides-list` suggestion
- All ports in use → exit 1, message to stop unused sessions
- Session already exists → exit 0, return existing session info

---

#### `preso-stop <name>`

Stops a presentation workspace session.

**Behavior**:
1. Load session state from `.preso-sessions/<name>.json`
2. Kill Slidev process (SIGTERM, then SIGKILL after 5s)
3. Kill all tracked Fence browser PIDs
4. Remove state file
5. Report cleanup summary

**Output (--json)**:
```json
{
  "stopped": true,
  "name": "kubernetes-intro",
  "killed_processes": {
    "slidev": 12345,
    "fence_windows": [23456, 23457]
  }
}
```

---

#### `preso-status [name] [--all]`

Query session state.

**Behavior**:
- With `<name>`: Return state for specific session
- With `--all`: Return summary of all active sessions
- Validates PIDs are still running (marks stale if not)

**Output (--json, single session)**:
```json
{
  "name": "kubernetes-intro",
  "port": 3030,
  "pid": 12345,
  "running": true,
  "started": "2026-02-22T10:30:00Z",
  "age_minutes": 45,
  "url": "http://localhost:3030",
  "browser_windows": [
    {"type": "slides", "pid": 23456, "url": "http://localhost:3030"}
  ]
}
```

**Output (--json, --all)**:
```json
{
  "sessions": [
    {"name": "kubernetes-intro", "port": 3030, "running": true},
    {"name": "company-overview", "port": 3031, "running": true}
  ],
  "available_ports": [3032, 3033, 3034, 3035, 3036, 3037, 3038, 3039]
}
```

---

### Browser Control

#### `preso-preview <name> [--view TYPE]`

Open or focus a Fence browser window.

**View types**: `slides` (default), `presenter`, `overview`

**Behavior**:
1. Load session state, get port
2. Construct URL based on view type
3. Check if Fence window already open for this view
4. If open: activate window (bring to front)
5. If not: launch Fence with origin restriction
6. Update session state with window PID

**Fence invocation**:
```bash
fence --allowed-origins "http://localhost:$PORT" "$URL" &
```

**Output (--json)**:
```json
{
  "opened": true,
  "window": {
    "type": "presenter",
    "url": "http://localhost:3030/presenter",
    "pid": 23457
  }
}
```

---

#### `preso-preview-close <name>`

Close all Fence preview windows for a session.

**Behavior**:
1. Load session state
2. Kill all tracked Fence PIDs
3. Update session state to remove window entries

---

#### `preso-navigate <name> <slide>`

Navigate to a specific slide.

**Behavior**:
1. Load session state, get port
2. Send WebSocket message to Slidev remote endpoint
3. Report success or error

**WebSocket endpoint**: `ws://localhost:PORT/__slidev_remote`  
**Message format**: `{"type":"navigate","no":SLIDE_NUMBER}`

**Tool**: Use `websocat` for WebSocket communication

---

### Enhanced Existing Commands

Add `--json` flag to:
- `slides-list` → `{"presentations": ["a", "b"], "current": "a"}`
- `slides-select` → `{"selected": "name", "previous": "old"}`
- `slides-validate` → `{"valid": true, "name": "x", "path": "..."}`

---

## OpenCode Tool Wrapper

`.opencode/tools/preso.ts`:

```typescript
import { tool } from "@opencode-ai/plugin"

export const start = tool({
  description: "Start a presentation workspace session (Slidev server + optional preview)",
  args: {
    name: tool.schema.string().describe("Presentation name"),
    preview: tool.schema.boolean().optional().describe("Open preview after starting")
  },
  async execute(args) {
    const flags = args.preview ? "--preview" : ""
    return await Bun.$`preso-start ${args.name} ${flags} --json`.json()
  }
})

export const stop = tool({
  description: "Stop a presentation workspace session",
  args: {
    name: tool.schema.string().describe("Presentation name")
  },
  async execute(args) {
    return await Bun.$`preso-stop ${args.name} --json`.json()
  }
})

export const status = tool({
  description: "Get status of presentation sessions",
  args: {
    name: tool.schema.string().optional().describe("Specific presentation (omit for all)"),
    all: tool.schema.boolean().optional().describe("Show all sessions")
  },
  async execute(args) {
    if (args.all || !args.name) {
      return await Bun.$`preso-status --all --json`.json()
    }
    return await Bun.$`preso-status ${args.name} --json`.json()
  }
})

export const preview = tool({
  description: "Open or focus a browser preview window for a presentation",
  args: {
    name: tool.schema.string().describe("Presentation name"),
    view: tool.schema.enum(["slides", "presenter", "overview"]).optional()
      .describe("View type (default: slides)")
  },
  async execute(args) {
    const view = args.view || "slides"
    return await Bun.$`preso-preview ${args.name} --view ${view} --json`.json()
  }
})

export const navigate = tool({
  description: "Navigate to a specific slide in the preview",
  args: {
    name: tool.schema.string().describe("Presentation name"),
    slide: tool.schema.number().describe("Slide number to navigate to")
  },
  async execute(args) {
    return await Bun.$`preso-navigate ${args.name} ${args.slide} --json`.json()
  }
})
```

---

## Skill: presentation-workspace

`.opencode/skills/presentation-workspace/SKILL.md`:

```markdown
# Presentation Workspace

Guide for managing presentation authoring sessions with visual preview.

## When to Use

- User asks to work on a presentation
- Need to show/preview presentation changes
- Managing multiple concurrent presentations
- Navigating to specific slides during discussion

## Session Workflow

### Starting Work

1. Check for existing sessions: `preso-status --all --json`
2. If sessions exist, ask user: continue existing or start fresh?
3. Start session: `preso-start <name> --preview --json`
4. Confirm preview is visible before editing

### During Authoring

- Edit slides.md directly - Slidev hot reloads automatically
- Use `preso-preview <name> --view presenter` to show notes
- Use `preso-navigate <name> <slide>` to jump to specific slides

### Ending Session

- Ask if user wants to keep session running or stop
- Stop cleanly: `preso-stop <name> --json`

## Commands Reference

| Command | Purpose |
|---------|---------|
| `preso-status --all --json` | List all active sessions |
| `preso-start <name> --json` | Start session (allocates port, starts Slidev) |
| `preso-preview <name> --json` | Open browser preview |
| `preso-navigate <name> <slide>` | Jump to slide |
| `preso-stop <name> --json` | Stop session, cleanup |

## Important Notes

- Always use `--json` flag for parseable output
- Preview uses Fence browser (restricted to localhost)
- Multiple sessions can run on ports 3030-3039
- Hot reload handles most preview updates automatically
- Navigation is for explicit "look at slide N" scenarios
```

---

## Dependencies

### Required Tools

| Tool | Purpose | Installation |
|------|---------|--------------|
| Fence | Restricted browser | `brew install --cask fence` (TBD) |
| websocat | WebSocket CLI | `brew install websocat` or `nix` |
| jq | JSON parsing | Already in devenv |
| lsof | Port checking | macOS built-in |

### Fence Availability

Fence is currently a hypothetical tool. Alternatives if unavailable:
1. Use standard browser with warning about navigation restrictions
2. Build minimal Electron wrapper with origin restriction
3. Use Safari with Parental Controls (more complex)

---

## Risks

| Risk | Mitigation |
|------|------------|
| Fence not available | Fallback to standard browser with warning |
| Port exhaustion (10 max) | Clear error message, suggest stopping unused |
| Stale PID detection false positives | Check both PID existence and command line match |
| WebSocket protocol changes | Document Slidev version tested against |
| Cross-agent compatibility | Shell scripts are universal; test with each agent |

---

# Tasks: In-Agent Presentation Workspace

**Input**: Design documents above
**Prerequisites**: Spec and plan complete

## Phase 1: Setup

- [ ] T001 Create `.preso-sessions/` directory, add to `.gitignore`
- [ ] T002 Add `websocat` to devenv.nix packages
- [ ] T003 Create helper functions in devenv.nix for port allocation and JSON output

---

## Phase 2: Foundational - Core Session Scripts

**Purpose**: Session state management that all other features depend on

- [ ] T004 Implement `preso-status` script with `--json` and `--all` flags
- [ ] T005 Implement `preso-start` script with port allocation and state file creation
- [ ] T006 Implement `preso-stop` script with process cleanup
- [ ] T007 [P] Add `--json` flag to `slides-list`
- [ ] T008 [P] Add `--json` flag to `slides-select`
- [ ] T009 [P] Enhance `slides-validate` with full JSON output

**Checkpoint**: Can start, query, and stop sessions via CLI

---

## Phase 3: User Story 1 - Basic Session Management

- [ ] T010 Add stale session detection to `preso-status` (PID validation)
- [ ] T011 Add session continuation prompt logic documentation to skill
- [ ] T012 Test multi-port allocation (start 3 sessions, verify ports)

**Checkpoint**: Agent can start sessions and query status reliably

---

## Phase 4: User Story 2 & 3 - Browser Control

- [ ] T013 Implement `preso-preview` script with Fence integration
- [ ] T014 Implement `preso-preview-close` script
- [ ] T015 Add browser window PID tracking to session state
- [ ] T016 Handle Fence not installed (graceful fallback)
- [ ] T017 Test multiple view types (slides, presenter, overview)

**Checkpoint**: Agent can open and close preview windows

---

## Phase 5: User Story 4 - Navigation

- [ ] T018 Implement `preso-navigate` script with WebSocket
- [ ] T019 Add slide count validation (fetch from Slidev or count in file)
- [ ] T020 Test navigation across different slide counts

**Checkpoint**: Agent can navigate to specific slides

---

## Phase 6: OpenCode Integration

- [ ] T021 Create `.opencode/tools/preso.ts` with all tool exports
- [ ] T022 Test tools from OpenCode TUI
- [ ] T023 Create `presentation-workspace` skill

**Checkpoint**: Full functionality available in OpenCode

---

## Phase 7: Polish

- [ ] T024 Update AGENTS.md with new commands
- [ ] T025 Update enterShell with new command list
- [ ] T026 Document Fence installation/alternatives
- [ ] T027 End-to-end test: start, edit, preview, navigate, stop

---

## Dependencies & Execution Order

- Phase 1 (Setup): No dependencies
- Phase 2 (Foundational): Depends on Phase 1
- Phase 3-5 (User Stories): Depend on Phase 2, can run in parallel
- Phase 6 (OpenCode): Depends on Phase 2
- Phase 7 (Polish): Depends on all above
