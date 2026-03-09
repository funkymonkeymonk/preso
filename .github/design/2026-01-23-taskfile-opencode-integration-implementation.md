# Taskfile OpenCode Integration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Expose all Taskfile tasks as OpenCode skills and commands using Taskfile.yml as single source of truth.

**Architecture:** One skill teaches the agent about tasks (reads Taskfile dynamically), one command provides `/task` invocation. Interactive tasks modified to accept optional vars.

**Tech Stack:** Taskfile v3, OpenCode skills/commands (markdown), bash

---

## Task 1: Create the `/task` command

**Files:**
- Create: `.opencode/command/task.md`

**Step 1: Create the command file**

```markdown
---
description: Run Taskfile tasks (list, execute, pass variables)
---

Run tasks defined in Taskfile.yml.

**Usage:** `/task [name] [VAR=value...]`

**Examples:**
- `/task` - List all available tasks
- `/task slides:dev` - Start slidev dev server
- `/task slides:new NAME=my-talk` - Create new presentation

**Arguments provided:** $ARGUMENTS

**Instructions:**

1. If no arguments provided, run `task --list` and display the output
2. If arguments provided, run `task $ARGUMENTS` directly
3. Report the output to the user

**Interactive tasks:** Some tasks prompt for input when run without variables:
- `slides:new` - Accepts `NAME=<slug>` for presentation name
- `slides:select` - Accepts `NAME=<slug>` for presentation to select

If user runs an interactive task without the required variable, ask them for the value first, then run with the variable set.
```

**Step 2: Verify file exists**

Run: `cat .opencode/command/task.md`
Expected: File contents displayed

**Step 3: Commit**

```bash
git add .opencode/command/task.md
git commit -m "feat: add /task command for running Taskfile tasks"
```

---

## Task 2: Create the taskfile skill

**Files:**
- Create: `.opencode/skills/taskfile/SKILL.md`

**Step 1: Create skills directory**

Run: `mkdir -p .opencode/skills/taskfile`

**Step 2: Create the skill file**

```markdown
---
name: taskfile
description: Use when user asks about available tasks, project workflows, or how to do something in this project - reads Taskfile.yml to discover and execute tasks
---

# Working with Taskfile Tasks

## Overview

This project uses Taskfile for task automation. All available tasks are defined in `Taskfile.yml` at the project root.

**When to use this skill:**
- User asks "what can I do?" or "how do I...?"
- User wants to run a project task
- You need to understand available workflows

## Discovering Tasks

1. Read `Taskfile.yml` to see all task definitions
2. Each task has a `desc:` field explaining what it does
3. Tasks are grouped by prefix: `slides:*` for presentations, `agent:*` for OpenCode sessions

Quick list: Run `task --list` to see all tasks with descriptions.

## Task Groups

### Slide Tasks (`slides:*`)
Manage Slidev presentations in `presentations/` directory.

| Task | Description | Interactive? |
|------|-------------|--------------|
| `slides:list` | List all presentations | No |
| `slides:select` | Select presentation to work on | Yes - accepts `NAME=<slug>` |
| `slides:current` | Show current presentation | No |
| `slides:new` | Create new presentation | Yes - accepts `NAME=<slug>` |
| `slides:dev` | Start dev server | No |
| `slides:build` | Build static site | No |
| `slides:pdf` | Export to PDF | No |
| `slides:present` | Start presenter mode | No |

### Agent Tasks (`agent:*`)
Manage OpenCode agent sessions with process-compose and zellij.

| Task | Description | Interactive? |
|------|-------------|--------------|
| `agent:start` | Start new agent session | No |
| `agent:sessions` | List active sessions | No |
| `agent:connect` | Connect to existing session | No (accepts positional arg) |

## Running Tasks

**Non-interactive tasks:** Run directly with `task <name>`

```bash
task slides:dev
task agent:start
```

**Interactive tasks:** Either run interactively OR pass variables:

```bash
# Interactive (prompts for input)
task slides:new

# Non-interactive (pass variable)
task slides:new NAME=my-talk
```

## Handling Interactive Tasks

When user wants to run an interactive task:

1. Check if they provided the required variable
2. If not, ask for it conversationally
3. Run with the variable set

**Example conversation:**
```
User: Create a new presentation
Agent: What should I name it? (slug format, e.g., my-talk)
User: kubernetes-intro
Agent: *runs: task slides:new NAME=kubernetes-intro*
```

## Presentation Selection

Many `slides:*` tasks operate on the "current" presentation. Selection priority:
1. `PRESO` environment variable
2. `.current-preso` file in project root
3. Interactive fzf picker (if neither set)

To set current presentation: `task slides:select NAME=<slug>`
```

**Step 3: Verify file exists**

Run: `cat .opencode/skills/taskfile/SKILL.md`
Expected: File contents displayed

**Step 4: Commit**

```bash
git add .opencode/skills/taskfile/SKILL.md
git commit -m "feat: add taskfile skill for discovering and running tasks"
```

---

## Task 3: Modify `slides:new` to accept NAME var

**Files:**
- Modify: `Taskfile.yml` (lines 88-128, the `slides:new` task)

**Step 1: Update the task definition**

Replace the `slides:new` task with:

```yaml
  slides:new:
    desc: Create a new presentation
    vars:
      NAME: ""
    cmds:
      - |
        name={{shellQuote .NAME}}
        if [[ -z "$name" ]]; then
          echo -n "Presentation name (slug, e.g., my-talk): "
          read -r name
        fi
        
        if [[ -z "$name" ]]; then
          echo "ERROR: Name cannot be empty"
          exit 1
        fi
        
        if [[ -d "presentations/$name" ]]; then
          echo "ERROR: Presentation '$name' already exists"
          exit 1
        fi
        
        # Convert slug to title case for display
        title=$(echo "$name" | sed -E 's/-/ /g' | awk '{for(i=1;i<=NF;i++) $i=toupper(substr($i,1,1)) tolower(substr($i,2))}1')
        
        mkdir -p "presentations/$name"
        cat > "presentations/$name/slides.md" << EOF
        ---
        theme: seriph
        title: $title
        ---

        # $title

        Your presentation starts here.
        EOF
        
        # Remove leading whitespace from heredoc
        sed -i '' 's/^        //' "presentations/$name/slides.md"
        
        echo "$name" > .current-preso
        echo ""
        echo "Created: presentations/$name/slides.md"
        echo "Selected as current presentation"
        echo ""
        echo "Run 'task slides:dev' to start editing"
```

**Step 2: Verify syntax**

Run: `task --list`
Expected: All tasks listed without YAML errors

**Step 3: Test interactive mode**

Run: `echo "test-interactive" | task slides:new`
Expected: Creates `presentations/test-interactive/slides.md`

**Step 4: Clean up test**

Run: `rm -rf presentations/test-interactive && git checkout .current-preso 2>/dev/null || true`

**Step 5: Test non-interactive mode**

Run: `task slides:new NAME=test-noninteractive`
Expected: Creates `presentations/test-noninteractive/slides.md`

**Step 6: Clean up test**

Run: `rm -rf presentations/test-noninteractive && git checkout .current-preso 2>/dev/null || true`

**Step 7: Commit**

```bash
git add Taskfile.yml
git commit -m "feat: slides:new accepts NAME var for non-interactive use"
```

---

## Task 4: Modify `slides:select` to accept NAME var

**Files:**
- Modify: `Taskfile.yml` (lines 64-76, the `slides:select` task)

**Step 1: Update the task definition**

Replace the `slides:select` task with:

```yaml
  slides:select:
    desc: Select a presentation to work on (updates .current-preso)
    vars:
      NAME: ""
    cmds:
      - |
        name={{shellQuote .NAME}}
        if [[ -z "$name" ]]; then
          name=$(ls -1 presentations/ | fzf --height=10 --prompt="Select presentation: ")
        fi
        
        if [[ -z "$name" ]]; then
          echo "No selection made"
          exit 1
        fi
        
        if [[ ! -d "presentations/$name" ]]; then
          echo "ERROR: Presentation '$name' not found in presentations/"
          exit 1
        fi
        
        echo "$name" > .current-preso
        echo "Selected: $name"
```

**Step 2: Verify syntax**

Run: `task --list`
Expected: All tasks listed without YAML errors

**Step 3: Test non-interactive mode**

Run: `task slides:select NAME=example`
Expected: Output "Selected: example" and `.current-preso` contains "example"

**Step 4: Verify selection**

Run: `cat .current-preso`
Expected: `example`

**Step 5: Commit**

```bash
git add Taskfile.yml
git commit -m "feat: slides:select accepts NAME var for non-interactive use"
```

---

## Task 5: Final verification

**Step 1: Verify all files exist**

Run: `ls -la .opencode/command/task.md .opencode/skills/taskfile/SKILL.md`
Expected: Both files listed

**Step 2: Verify task list works**

Run: `task --list`
Expected: All tasks listed with descriptions

**Step 3: Test /task command flow manually**

Run: `task slides:new NAME=verify-test && task slides:select NAME=verify-test && task slides:current`
Expected: Creates presentation, selects it, shows "Current presentation: verify-test"

**Step 4: Clean up**

Run: `rm -rf presentations/verify-test && task slides:select NAME=example`

**Step 5: Final commit (if any unstaged changes)**

```bash
git status
# If clean, done. If changes, commit them.
```
