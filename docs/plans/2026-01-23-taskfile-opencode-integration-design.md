# Taskfile OpenCode Integration Design

## Goal

Expose all Taskfile tasks as OpenCode skills and commands, using `Taskfile.yml` as the single source of truth with no generated files to maintain.

## Components

### 1. Skill: `.opencode/skills/taskfile/SKILL.md`

Teaches the agent how to work with this project's tasks:

- Read `Taskfile.yml` to discover available tasks and their descriptions
- Understand task groupings (slides:*, agent:*)
- Recognize interactive tasks and gather inputs conversationally before execution
- Know the var pattern for non-interactive invocation: `task <name> VAR=value`

**When to use:** Agent is exploring what actions are available, or user asks about project workflows.

### 2. Command: `.opencode/command/task.md`

Quick invocation via `/task`:

- `/task` - lists available tasks (runs `task --list`)
- `/task <name>` - executes the named task
- `/task <name> VAR=value` - executes with variables for non-interactive use

**When to use:** User wants to run a task directly without conversation.

### 3. Taskfile Modifications

Update interactive tasks to accept optional vars, falling back to prompts when not provided.

**Pattern:**
```yaml
my-task:
  desc: Does something
  vars:
    NAME: ""
  cmds:
    - |
      name={{shellQuote .NAME}}
      if [[ -z "$name" ]]; then
        echo -n "Enter name: "
        read -r name
      fi
      # ... rest of task using $name
```

**Tasks requiring modification:**

| Task | Var | Purpose |
|------|-----|---------|
| `slides:new` | `NAME` | Presentation slug |
| `slides:select` | `NAME` | Presentation to select |

**Tasks already non-interactive (no changes needed):**
- `slides:list`
- `slides:current`
- `slides:dev`
- `slides:build`
- `slides:pdf`
- `slides:present`
- `agent:start`
- `agent:sessions`
- `agent:connect` (accepts positional arg already)

## Behavior

### Skill Usage Flow

1. User asks "what can I do in this project?" or "how do I create a presentation?"
2. Agent reads the skill, then reads `Taskfile.yml`
3. Agent explains available tasks based on descriptions
4. If user wants to run an interactive task, agent gathers inputs conversationally
5. Agent executes with vars: `task slides:new NAME=my-talk`

### Command Usage Flow

1. User types `/task`
2. Agent runs `task --list`, shows available tasks
3. User types `/task slides:new NAME=my-talk`
4. Agent executes directly

### Interactive Task Handling

When agent encounters a task that needs input (skill teaches which ones):

```
User: /task slides:new
Agent: What should I name the new presentation? (slug format, e.g., my-talk)
User: kubernetes-intro
Agent: *executes: task slides:new NAME=kubernetes-intro*
```

## File Structure

```
.opencode/
  skills/
    taskfile/
      SKILL.md        # Agent guidance for working with tasks
  command/
    task.md           # /task command definition
    processes.md      # Existing process-compose command
```

## What This Achieves

- **Single source of truth:** `Taskfile.yml` defines tasks, skills/commands read it dynamically
- **No sync required:** Add a task to Taskfile, it's immediately available
- **Dual interface:** Skills for guidance/conversation, commands for quick execution
- **Backward compatible:** Tasks still work interactively from terminal
- **Agent-friendly:** Non-interactive var pattern enables automation
