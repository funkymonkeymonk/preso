# Human-AI Collaboration Improvements

## Context

This plan improves the PRESO repository's support for human-AI collaboration by:
- Fixing stale/broken OpenCode commands
- Adding project-specific skills for agent guidance
- Creating validation helpers and unified commands
- Improving documentation and discoverability

## Requirements

### Functional
- All OpenCode commands must work correctly with current devenv-based setup
- Agents must have clear guidance for Slidev authoring and presentation workflows
- Validation must fail fast with actionable errors
- Placeholder content must be completed or marked appropriately

### Non-Functional
- No breaking changes to existing human workflows
- Skills should be reusable across similar projects
- Commands should be self-documenting

## Approach

Work proceeds in four phases:
1. **Cleanup** - Remove/fix broken components
2. **Foundation** - Add validation and helpers
3. **Commands** - Create unified `/slides` command, fix `/processes`
4. **Skills** - Add project-specific agent guidance

---

## Phase 1: Cleanup

### Task 1.1: Delete stale `/task` command
**File:** `.opencode/command/task.md`
**Action:** Delete file

This command references `Taskfile.yml` which no longer exists. All tasks are now devenv scripts.

**Verification:**
```bash
ls .opencode/command/
# Should show: processes.md and slides.md (task.md removed)
```

**Estimate:** 1 minute

---

### Task 1.2: Delete placeholder presentation
**File:** `presentations/member-communications-system-overview/`
**Action:** Delete directory

This presentation is a placeholder with no real content. Remove it entirely.

**Verification:**
```bash
ls presentations/
# Should show: example, what-is-preso (no member-communications-system-overview)
```

**Estimate:** 1 minute

---

## Phase 2: Foundation

### Task 2.1: Add `slides-validate` script
**File:** `devenv.nix`
**Action:** Add new script after `slides-current` (around line 192)

Add this script definition:

```nix
scripts.slides-validate = {
  exec = ''
    if [[ ! -f .current-preso ]]; then
      echo "ERROR: No presentation selected (missing .current-preso)"
      echo "Fix: Run 'slides-select <name>' to select a presentation"
      exit 1
    fi
    
    preso=$(cat .current-preso)
    
    if [[ -z "$preso" ]]; then
      echo "ERROR: .current-preso is empty"
      echo "Fix: Run 'slides-select <name>' to select a presentation"
      exit 1
    fi
    
    if [[ ! -d "presentations/$preso" ]]; then
      echo "ERROR: Presentation '$preso' not found in presentations/"
      echo "Available presentations:"
      ls -1 presentations/ | sed 's/^/  /'
      echo "Fix: Run 'slides-select <name>' with a valid name"
      exit 1
    fi
    
    if [[ ! -f "presentations/$preso/slides.md" ]]; then
      echo "ERROR: Missing slides.md in presentations/$preso/"
      echo "Fix: Create presentations/$preso/slides.md"
      exit 1
    fi
    
    echo "OK: $preso (presentations/$preso/slides.md exists)"
  '';
  description = "Validate current presentation selection";
};
```

**Verification:**
```bash
# With valid selection
slides-validate
# Output: OK: example (presentations/example/slides.md exists)

# With invalid selection
echo "nonexistent" > .current-preso
slides-validate
# Output: ERROR: Presentation 'nonexistent' not found...
# Exit code: 1

# Restore valid selection
slides-select example
```

**Estimate:** 5 minutes

---

### Task 2.2: Add pre-flight validation to `agent-start`
**File:** `devenv.nix`
**Action:** Modify `agent-start` script, add validation after `# --- Main ---` section (around line 354)

Insert this block after `PROJECT_ID=$(get_project_id)` and before `REPO_NAME=$(get_repo_name)`:

```nix
# --- Validate presentation selection ---
if [[ ! -f .current-preso ]]; then
  echo "WARNING: No presentation selected. Defaulting to 'example'"
  echo "example" > .current-preso
elif [[ ! -d "presentations/$(cat .current-preso)" ]]; then
  echo "WARNING: Selected presentation '$(cat .current-preso)' not found. Defaulting to 'example'"
  echo "example" > .current-preso
fi
```

**Verification:**
```bash
# Remove .current-preso and start agent
rm .current-preso
agent-start
# Should see WARNING and create .current-preso with "example"
# (Then exit zellij with Ctrl+Q to verify)

cat .current-preso
# Output: example
```

**Estimate:** 5 minutes

---

### Task 2.3: Update enterShell to show slides-validate
**File:** `devenv.nix`
**Action:** Modify the `enterShell` block (around line 536) to include the new command

Update the "Slide Commands" section to include:

```nix
enterShell = ''
  echo ""
  echo "PRESO - Presentation Repository"
  echo "================================"
  echo ""
  echo "Slide Commands:"
  echo "  slides-list              List all presentations"
  echo "  slides-select [NAME]     Select presentation to work on"
  echo "  slides-current           Show current presentation"
  echo "  slides-validate          Validate current selection"
  echo "  slides-new <NAME>        Create new presentation"
  echo "  slides-build             Build static site"
  echo "  slides-pdf               Export to PDF"
  echo "  slides-present           Start presenter mode"
  echo ""
  echo "Agent Commands:"
  echo "  agent-start              Start new agent session"
  echo "  agent-sessions           List active sessions"
  echo "  agent-connect [ID]       Connect to session"
  echo ""
  echo "Processes (via 'devenv up'):"
  echo "  slides                   Slidev dev server"
  echo ""
'';
```

**Verification:**
```bash
# Exit and re-enter devenv shell
exit
devenv shell
# Should see "slides-validate" in the Slide Commands list
```

**Estimate:** 2 minutes

---

## Phase 3: Commands

### Task 3.1: Fix `/processes` command to use Unix socket
**File:** `.opencode/command/processes.md`
**Action:** Replace entire file content

```markdown
---
description: Manage process-compose processes (status, start, stop, restart, logs)
---

Process management command. Interact with process-compose via its Unix socket API.

**Usage:** `/processes <subcommand> [args]`

**Subcommands:**
- `status` - Show all processes with their current state
- `start [name]` - Start all processes or a specific one
- `stop [name]` - Stop all processes or a specific one  
- `restart [name]` - Restart all processes or a specific one
- `logs <name> [lines]` - Show recent logs for a process (default: 50 lines)

**Arguments provided:** $ARGUMENTS

**Important:** Process-compose uses a Unix socket, NOT an HTTP port. First find the socket:

```bash
SOCKET=$(find /var/folders -name "pc.sock" -path "*/devenv-*/pc.sock" 2>/dev/null | head -1)
```

If no socket is found, process-compose is not running. Tell the user to run `devenv up` first.

**API Examples using the socket:**

```bash
# List processes
curl -s --unix-socket "$SOCKET" http://localhost/processes | jq .

# Restart a process
curl -s --unix-socket "$SOCKET" -X POST http://localhost/process/restart/slides

# Stop a process
curl -s --unix-socket "$SOCKET" -X POST http://localhost/process/stop/slides

# Start a process
curl -s --unix-socket "$SOCKET" -X POST http://localhost/process/start/slides

# Get logs (offset 0, limit 50)
curl -s --unix-socket "$SOCKET" "http://localhost/process/logs/slides/0/50" | jq -r '.logs[]'
```

Execute the appropriate action based on the subcommand. Always find the socket first and verify it exists before making API calls.
```

**Verification:**
Run `/processes status` in OpenCode while `devenv up` is running - should show process list without errors.

**Estimate:** 5 minutes

---

### Task 3.2: Create `/slides` unified command
**File:** `.opencode/command/slides.md`
**Action:** Create new file

```markdown
---
description: Manage presentations (list, select, new, build, pdf, present, validate)
---

Presentation management command. Run devenv scripts for slide operations.

**Usage:** `/slides <action> [args]`

**Actions:**
- `list` - Show all presentations (marks current with *)
- `select <name>` - Select a presentation to work on
- `current` - Show currently selected presentation
- `validate` - Verify current selection is valid
- `new <name>` - Create a new presentation
- `build` - Build static site for current presentation
- `pdf` - Export current presentation to PDF
- `present` - Start presenter mode with remote control

**Arguments provided:** $ARGUMENTS

**Instructions:**

1. Parse the action from arguments
2. Run the corresponding devenv script:
   - `list` → `slides-list`
   - `select <name>` → `slides-select <name>`
   - `current` → `slides-current`
   - `validate` → `slides-validate`
   - `new <name>` → `slides-new <name>`
   - `build` → `slides-build`
   - `pdf` → `slides-pdf`
   - `present` → `slides-present`

3. If no action provided, show available actions

**Examples:**
- `/slides list` - List all presentations
- `/slides select my-talk` - Select "my-talk" presentation
- `/slides new kubernetes-intro` - Create new presentation
- `/slides build` - Build current presentation

**Important for agents:**
- Always run `/slides validate` before expecting the dev server to work
- Use `/slides select <name>` with the name argument to avoid interactive prompts
- After `/slides select`, the slides process auto-restarts if running
```

**Verification:**
Run `/slides list` in OpenCode - should show presentation list.

**Estimate:** 5 minutes

---

## Phase 4: Skills

### Task 4.1: Create `slidev-authoring` skill
**File:** `.opencode/skills/slidev-authoring/SKILL.md`
**Action:** Create directory and file

```markdown
# Slidev Authoring

Guide for creating and editing Slidev presentations in this repository.

## When to Use

- Creating new slides or presentations
- Editing existing presentation content
- Adding layouts, transitions, or components
- Troubleshooting Slidev markdown issues

## Presentation Structure

Each presentation lives in `presentations/<name>/slides.md`:

```
presentations/
  example/
    slides.md       # Main presentation file
    dist/           # Built output (after slides-build)
  my-talk/
    slides.md
```

## Slidev Markdown Syntax

### Frontmatter (First Slide)

```yaml
---
theme: seriph              # Theme name (seriph, default, or custom)
title: My Presentation     # Browser tab title
background: https://...    # Cover image URL
class: text-center         # CSS classes for first slide
transition: slide-left     # Default transition
mdc: true                  # Enable MDC syntax
---
```

### Slide Separators

```markdown
---                        # New slide
---                        # Another slide

<!-- or with per-slide config -->

---
layout: center
class: text-center
---
```

### Common Layouts

| Layout | Purpose |
|--------|---------|
| `default` | Standard content slide |
| `center` | Centered content |
| `cover` | Title/cover slide |
| `two-cols` | Two-column layout |
| `image-right` | Content left, image right |
| `image-left` | Image left, content right |
| `quote` | Quotation styling |
| `section` | Section divider |
| `end` | Closing slide |

### Two-Column Example

```markdown
---
layout: two-cols
---

# Left Column

Content on the left side.

::right::

# Right Column

Content on the right side.
```

### Code Blocks

````markdown
```typescript {2-3|5}
function greet(name: string) {
  // These lines highlighted first
  console.log(`Hello, ${name}!`);
  
  return true;  // Then this line
}
```
````

The `{2-3|5}` syntax creates click-through highlighting.

### Transitions

Per-slide: `transition: fade` or `transition: slide-up`

Options: `fade`, `fade-out`, `slide-left`, `slide-right`, `slide-up`, `slide-down`

### Vue Components

Slidev supports Vue components inline:

```markdown
<div class="flex gap-4">
  <div v-click>Appears first</div>
  <div v-click>Appears second</div>
</div>
```

## Workflow

1. **Select presentation:** `slides-select <name>`
2. **Start dev server:** `devenv up` (or it's already running)
3. **Edit:** Modify `presentations/<name>/slides.md`
4. **Preview:** Open http://localhost:3030
5. **Build:** `slides-build` for static site
6. **Export:** `slides-pdf` for PDF

## Common Issues

### Slide not rendering
- Check for unclosed code blocks or HTML tags
- Verify frontmatter YAML is valid
- Look for syntax errors in Vue components

### Layout not applying
- Ensure `layout:` is in the slide's frontmatter block (after `---`)
- Check layout name spelling

### Transitions not working
- Add `transition:` to frontmatter
- Some themes override transitions

## Resources

- [Slidev Documentation](https://sli.dev)
- [Slidev Themes](https://sli.dev/resources/theme-gallery)
- [Slidev Syntax](https://sli.dev/guide/syntax)
```

**Verification:**
```bash
ls .opencode/skills/slidev-authoring/
# Output: SKILL.md
```

**Estimate:** 10 minutes

---

### Task 4.2: Create `presentation-workflow` skill
**File:** `.opencode/skills/presentation-workflow/SKILL.md`
**Action:** Create directory and file

```markdown
# Presentation Workflow

Guide for managing presentations in the PRESO repository.

## When to Use

- Starting work on a presentation
- Switching between presentations
- Building or exporting presentations
- Troubleshooting dev server issues

## Quick Start

```bash
# 1. List available presentations
slides-list

# 2. Select one to work on
slides-select my-talk

# 3. Validate selection
slides-validate

# 4. Start dev server
devenv up

# 5. Open browser to http://localhost:3030
```

## Selection System

The repository maintains a "current presentation" in `.current-preso`.

**Priority (highest to lowest):**
1. `PRESO` environment variable
2. `.current-preso` file
3. Interactive fzf picker (humans only)

**For agents:** Always pass the name argument to avoid interactive prompts:
```bash
slides-select my-talk     # Good - non-interactive
slides-select             # Bad - opens fzf picker
```

## Creating a New Presentation

```bash
slides-new my-new-talk
```

This:
1. Creates `presentations/my-new-talk/slides.md` with template
2. Sets it as current (updates `.current-preso`)
3. Restarts slides process if running

## Building & Exporting

```bash
# Build static HTML site
slides-build
# Output: presentations/<name>/dist/

# Export to PDF
slides-pdf
# Output: presentations/<name>/<name>.pdf
```

## Process Management

The slides dev server runs via process-compose:

```bash
# Start process manager (includes slides)
devenv up

# The slides process reads .current-preso on startup
# After slides-select, it auto-restarts
```

### Manual Process Control

Use the Unix socket API:

```bash
SOCKET=$(find /var/folders -name "pc.sock" -path "*/devenv-*/pc.sock" 2>/dev/null | head -1)

# Check status
curl -s --unix-socket "$SOCKET" http://localhost/processes | jq .

# Restart slides
curl -s --unix-socket "$SOCKET" -X POST http://localhost/process/restart/slides

# View logs
curl -s --unix-socket "$SOCKET" "http://localhost/process/logs/slides/0/50" | jq -r '.logs[]'
```

## Troubleshooting

### Port 3030 not responding

```bash
# 1. Validate selection
slides-validate

# 2. Check what's on the port
lsof -i :3030

# 3. Check process logs
SOCKET=$(find /var/folders -name "pc.sock" -path "*/devenv-*/pc.sock" 2>/dev/null | head -1)
curl -s --unix-socket "$SOCKET" "http://localhost/process/logs/slides/0/20" | jq -r '.logs[]'
```

### Multiple slidev processes

```bash
# Kill orphans
pkill -f "slidev presentations"

# Restart managed process
curl -s --unix-socket "$SOCKET" -X POST http://localhost/process/restart/slides
```

### Selection shows wrong presentation

```bash
# Check current
slides-current

# Re-select
slides-select correct-name
```
```

**Verification:**
```bash
ls .opencode/skills/presentation-workflow/
# Output: SKILL.md
```

**Estimate:** 10 minutes

---

### Task 4.3: Update AGENTS.md with Quick Fixes table and skills reference
**File:** `AGENTS.md`
**Action:** Add new section before "## Agent Session Architecture" (around line 195)

Insert this content:

```markdown
## Quick Fixes

| Symptom | Diagnosis | Fix |
|---------|-----------|-----|
| Port 3030 not responding | `slides-validate` | `slides-select example` |
| Wrong presentation showing | `slides-current` | `slides-select <correct-name>` |
| Multiple slidev processes | `pgrep -fl slidev` | `pkill -f "slidev presentations"` |
| Process-compose not running | Check if `devenv up` running | Run `devenv up` |
| Socket not found | Process-compose not started | Run `devenv up` |
| Build fails | Check slides-validate | Fix selection, then `slides-build` |

## Available Skills

This project includes OpenCode skills in `.opencode/skills/`:

| Skill | Purpose |
|-------|---------|
| `slidev-authoring` | Slidev markdown syntax, layouts, transitions, components |
| `presentation-workflow` | Selecting, building, exporting presentations |

Load a skill when you need detailed guidance on these topics.

```

**Verification:**
```bash
grep -A5 "Quick Fixes" AGENTS.md
# Should show the table
```

**Estimate:** 5 minutes

---

## Testing & Verification

After completing all tasks, run this verification sequence:

```bash
# 1. Verify cleanup
ls .opencode/command/
# Expected: processes.md, slides.md (no task.md)

ls presentations/
# Expected: example, what-is-preso (no member-communications-system-overview)

# 2. Verify validation script
slides-validate
# Expected: OK: example (or current selection)

echo "nonexistent" > .current-preso
slides-validate
# Expected: ERROR message, exit code 1
slides-select example  # Restore valid selection

# 3. Verify skills exist
ls .opencode/skills/
# Expected: slidev-authoring/, presentation-workflow/

ls .opencode/skills/slidev-authoring/
# Expected: SKILL.md

ls .opencode/skills/presentation-workflow/
# Expected: SKILL.md

# 4. Verify AGENTS.md updates
grep "Quick Fixes" AGENTS.md
grep "Available Skills" AGENTS.md
# Both should return matches

# 5. Verify enterShell shows slides-validate
devenv shell
# Should see slides-validate in output
```

---

## Risks

| Risk | Mitigation |
|------|------------|
| Breaking existing workflows | All changes are additive; existing scripts unchanged |
| Skills not being discovered | Added "Available Skills" section to AGENTS.md |
| Socket path changes | Using `find` command which handles dynamic paths |
| Agent ignores validation | Pre-flight check in agent-start forces valid state |

---

## Summary

| Phase | Tasks | Total Estimate |
|-------|-------|----------------|
| 1. Cleanup | 2 tasks | 2 minutes |
| 2. Foundation | 3 tasks | 12 minutes |
| 3. Commands | 2 tasks | 10 minutes |
| 4. Skills | 3 tasks | 25 minutes |
| **Total** | **10 tasks** | **~49 minutes** |
