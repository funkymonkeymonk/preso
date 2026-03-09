# Presentation Monorepo Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform repo into a presentation monorepo with task-based switching between presentations.

**Architecture:** Presentations live in `presentations/<name>/slides.md`. Selection uses env var → dotfile → fzf picker. All slide tasks share a common helper function for selection.

**Tech Stack:** Taskfile v3, fzf, bash

---

### Task 1: Create Directory Structure

**Files:**
- Create: `presentations/example/slides.md` (move from root)
- Create: `shared/.gitkeep`
- Delete: `slides.md` (after move)

**Step 1: Create presentations directory and move existing slides**

```bash
mkdir -p presentations/example
mv slides.md presentations/example/slides.md
```

**Step 2: Create shared directory placeholder**

```bash
mkdir -p shared
touch shared/.gitkeep
```

**Step 3: Verify structure**

Run: `ls -la presentations/example/ && ls -la shared/`
Expected: `slides.md` in presentations/example/, `.gitkeep` in shared/

**Step 4: Commit**

```bash
git add presentations/ shared/
git commit -m "feat: create presentation monorepo structure"
```

---

### Task 2: Add .current-preso to .gitignore

**Files:**
- Modify: `.gitignore`

**Step 1: Add entry to .gitignore**

Add to end of `.gitignore`:

```
# Presentation selection
.current-preso
```

**Step 2: Commit**

```bash
git add .gitignore
git commit -m "chore: gitignore .current-preso"
```

---

### Task 3: Add Helper Functions to Taskfile

**Files:**
- Modify: `Taskfile.yml`

**Step 1: Add helper function for presentation selection**

Add after the `vars:` section, before `tasks:`:

```yaml
env:
  # Presentation selection helper - used by all slides:* tasks
  # Priority: PRESO env var > .current-preso file > fzf picker
  GET_PRESO: |
    get_preso() {
      local preso=""
      
      # 1. Check PRESO env var
      if [[ -n "${PRESO:-}" ]]; then
        preso="$PRESO"
      # 2. Check .current-preso file
      elif [[ -f .current-preso ]]; then
        preso=$(cat .current-preso)
      # 3. Fall back to fzf picker
      else
        preso=$(ls -1 presentations/ | fzf --height=10 --prompt="Select presentation: ")
        if [[ -n "$preso" ]]; then
          echo "$preso" > .current-preso
        fi
      fi
      
      # Validate selection exists
      if [[ -z "$preso" ]]; then
        echo "ERROR: No presentation selected" >&2
        exit 1
      fi
      if [[ ! -d "presentations/$preso" ]]; then
        echo "ERROR: Presentation '$preso' not found in presentations/" >&2
        exit 1
      fi
      
      echo "$preso"
    }
```

**Step 2: Commit**

```bash
git add Taskfile.yml
git commit -m "feat: add presentation selection helper to Taskfile"
```

---

### Task 4: Add slides:list Task

**Files:**
- Modify: `Taskfile.yml`

**Step 1: Add slides:list task**

Add after the `# === Slide Tasks ===` comment:

```yaml
  slides:list:
    desc: List all available presentations
    cmds:
      - |
        echo "Available presentations:"
        echo ""
        ls -1 presentations/ | while read -r preso; do
          if [[ -f ".current-preso" ]] && [[ "$(cat .current-preso)" == "$preso" ]]; then
            echo "  * $preso (current)"
          else
            echo "    $preso"
          fi
        done
```

**Step 2: Verify**

Run: `task slides:list`
Expected: Shows "example" presentation

**Step 3: Commit**

```bash
git add Taskfile.yml
git commit -m "feat: add slides:list task"
```

---

### Task 5: Add slides:select Task

**Files:**
- Modify: `Taskfile.yml`

**Step 1: Add slides:select task**

Add after `slides:list`:

```yaml
  slides:select:
    desc: Select a presentation to work on (updates .current-preso)
    cmds:
      - |
        preso=$(ls -1 presentations/ | fzf --height=10 --prompt="Select presentation: ")
        if [[ -n "$preso" ]]; then
          echo "$preso" > .current-preso
          echo "Selected: $preso"
        else
          echo "No selection made"
          exit 1
        fi
```

**Step 2: Verify**

Run: `task slides:select` (select "example")
Run: `cat .current-preso`
Expected: `example`

**Step 3: Commit**

```bash
git add Taskfile.yml
git commit -m "feat: add slides:select task"
```

---

### Task 6: Add slides:current Task

**Files:**
- Modify: `Taskfile.yml`

**Step 1: Add slides:current task**

Add after `slides:select`:

```yaml
  slides:current:
    desc: Show currently selected presentation
    cmds:
      - |
        if [[ -f .current-preso ]]; then
          echo "Current presentation: $(cat .current-preso)"
        else
          echo "No presentation selected. Run 'task slides:select' to choose one."
        fi
```

**Step 2: Verify**

Run: `task slides:current`
Expected: `Current presentation: example`

**Step 3: Commit**

```bash
git add Taskfile.yml
git commit -m "feat: add slides:current task"
```

---

### Task 7: Add slides:new Task

**Files:**
- Modify: `Taskfile.yml`

**Step 1: Add slides:new task**

Add after `slides:current`:

```yaml
  slides:new:
    desc: Create a new presentation
    cmds:
      - |
        echo -n "Presentation name (slug, e.g., my-talk): "
        read -r name
        
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

**Step 2: Verify**

Run: `task slides:new` (enter "test-preso")
Run: `cat presentations/test-preso/slides.md`
Expected: Slides with "Test Preso" title
Cleanup: `rm -rf presentations/test-preso`

**Step 3: Commit**

```bash
git add Taskfile.yml
git commit -m "feat: add slides:new task"
```

---

### Task 8: Update slides:dev Task

**Files:**
- Modify: `Taskfile.yml`

**Step 1: Replace existing slides:dev task**

Replace the existing `slides:dev` task with:

```yaml
  slides:dev:
    desc: Start slidev in dev mode for selected presentation
    cmds:
      - |
        {{.GET_PRESO}}
        preso=$(get_preso)
        echo "Starting dev server for: $preso"
        cd "presentations/$preso" && npm run dev --prefix ../..
```

Note: We need to run npm from root but serve from presentation dir. Let me check the devenv setup...

Actually, looking at the original, it uses `devenv up`. We need to pass the slides path to slidev. Update to:

```yaml
  slides:dev:
    desc: Start slidev in dev mode for selected presentation
    cmds:
      - |
        {{.GET_PRESO}}
        preso=$(get_preso)
        echo "Starting dev server for: $preso"
        npx slidev "presentations/$preso/slides.md"
```

**Step 2: Verify**

Run: `task slides:dev` (should start slidev for current presentation)
Expected: Slidev starts, shows presentation

**Step 3: Commit**

```bash
git add Taskfile.yml
git commit -m "feat: update slides:dev for presentation selection"
```

---

### Task 9: Update slides:build Task

**Files:**
- Modify: `Taskfile.yml`

**Step 1: Replace existing slides:build task**

```yaml
  slides:build:
    desc: Build static site for selected presentation
    cmds:
      - |
        {{.GET_PRESO}}
        preso=$(get_preso)
        echo "Building: $preso"
        npx slidev build "presentations/$preso/slides.md" --out "presentations/$preso/dist" --base "/$preso/"
```

**Step 2: Commit**

```bash
git add Taskfile.yml
git commit -m "feat: update slides:build for presentation selection"
```

---

### Task 10: Update slides:pdf Task

**Files:**
- Modify: `Taskfile.yml`

**Step 1: Replace existing slides:pdf task**

```yaml
  slides:pdf:
    desc: Export selected presentation to PDF
    cmds:
      - |
        {{.GET_PRESO}}
        preso=$(get_preso)
        echo "Exporting to PDF: $preso"
        npx slidev export "presentations/$preso/slides.md" --output "presentations/$preso/$preso.pdf"
```

**Step 2: Commit**

```bash
git add Taskfile.yml
git commit -m "feat: update slides:pdf for presentation selection"
```

---

### Task 11: Update slides:present Task

**Files:**
- Modify: `Taskfile.yml`

**Step 1: Replace existing slides:present task**

```yaml
  slides:present:
    desc: Start presenter mode for selected presentation
    cmds:
      - |
        {{.GET_PRESO}}
        preso=$(get_preso)
        echo "Presenting: $preso"
        npx slidev "presentations/$preso/slides.md" --open --remote
```

**Step 2: Commit**

```bash
git add Taskfile.yml
git commit -m "feat: update slides:present for presentation selection"
```

---

### Task 12: Final Verification

**Step 1: Test full workflow**

```bash
task slides:list          # Should show example
task slides:current       # Should show example (or prompt to select)
task slides:select        # Pick example
task slides:current       # Should show example
PRESO=example task slides:current  # Should work with env var
```

**Step 2: Final commit**

```bash
git add -A
git commit -m "docs: update implementation plan with completion"
```
