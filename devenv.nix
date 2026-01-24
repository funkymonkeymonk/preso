{ pkgs, lib, config, ... }:

# ============================================================================
# devenv.nix - Presentation Repository Configuration
# ============================================================================
#
# This file provides all automation for the Slidev presentation repository.
# All tasks previously in Taskfile.yml are now devenv scripts.
#
# QUICK REFERENCE
# ============================================================================
#
# PRESENTATION SCRIPTS (slides-*)
#   slides-list              - List all available presentations
#   slides-select [NAME]     - Select presentation to work on
#   slides-current           - Show which presentation is selected
#   slides-new <NAME>        - Create new presentation
#   slides-theme [NAME|list] - Apply theme to current presentation
#   slides-build             - Build static site for current presentation
#   slides-pdf               - Export current presentation to PDF
#   slides-present           - Start presenter mode with remote control
#
# AGENT SESSION SCRIPTS (agent-*)
#   agent-start              - Start new OpenCode agent session
#   agent-sessions           - List all active sessions for this repo
#   agent-connect [ID]       - Connect to existing session
#
# PROCESSES (via devenv up)
#   slides                   - Slidev dev server for current presentation
#
# ============================================================================

let
  # Session metadata directory
  sessionDir = "/tmp/opencode-sessions";

  # Helper script to get current presentation
  # Priority: PRESO env var > .current-preso file > fzf picker
  getPresoScript = ''
    get_preso() {
      local preso=""
      
      # 1. Check PRESO env var
      if [[ -n "''${PRESO:-}" ]]; then
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
  '';

  # Helper to restart slides dev server if running
  restartSlidesScript = ''
    restart_slides() {
      # Find the devenv process-compose socket
      local socket
      socket=$(find /var/folders -name "pc.sock" -path "*/devenv-*/pc.sock" 2>/dev/null | head -1 || true)
      if [[ -n "$socket" ]]; then
        # Check if slides process is running
        local status
        status=$(curl -s --unix-socket "$socket" "http://localhost/processes" 2>/dev/null || echo "")
        if echo "$status" | grep -q '"name":"slides"'; then
          curl -s --unix-socket "$socket" -X POST "http://localhost/process/restart/slides" >/dev/null 2>&1
          echo "Restarted slides dev server"
        fi
      fi
      return 0
    }
  '';

in {
  cachix.enable = false;

  # ============================================================================
  # PACKAGES
  # ============================================================================
  packages = [
    pkgs.zellij
    pkgs.jq
    pkgs.fzf
    pkgs.curl
  ];

  # ============================================================================
  # ENVIRONMENT VARIABLES
  # ============================================================================
  env.OPENCODE_AUTORUN = "false";
  env.OPENCODE_BACKEND = "devenv";
  env.OPENCODE_PROCESS_COMPOSE_PORT = "8080";

  # ============================================================================
  # LANGUAGES
  # ============================================================================
  languages.javascript = {
    enable = true;
    npm = {
      enable = true;
      install.enable = true;
    };
  };

  # ============================================================================
  # PROCESS MANAGER (process-compose)
  # ============================================================================
  process.managers.process-compose = {
    port = 8080;
  };

  # ============================================================================
  # PROCESSES
  # ============================================================================
  
  # Main slidev dev server - reads current presentation from .current-preso
  processes.slides.exec = ''
    PRESO=$(cat .current-preso 2>/dev/null || echo "example")
    exec npm run dev -- "presentations/$PRESO/slides.md"
  '';

  # ============================================================================
  # SCRIPTS - Slide Management
  # ============================================================================

  scripts.slides-list = {
    exec = ''
      echo "Available presentations:"
      echo ""
      ls -1 presentations/ | while read -r preso; do
        if [[ -f ".current-preso" ]] && [[ "$(cat .current-preso)" == "$preso" ]]; then
          echo "  * $preso (current)"
        else
          echo "    $preso"
        fi
      done
    '';
    description = "List all available presentations";
  };

  scripts.slides-select = {
    exec = ''
      ${restartSlidesScript}
      
      name="''${1:-}"
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
      
      restart_slides
    '';
    description = "Select a presentation to work on";
  };

  scripts.slides-current = {
    exec = ''
      if [[ -f .current-preso ]]; then
        echo "Current presentation: $(cat .current-preso)"
      else
        echo "No presentation selected. Run 'slides-select' to choose one."
      fi
    '';
    description = "Show currently selected presentation";
  };

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

  scripts.slides-new = {
    exec = ''
      ${restartSlidesScript}
      
      name="''${1:-}"
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
      
      echo "$name" > .current-preso
      echo ""
      echo "Created: presentations/$name/slides.md"
      echo "Selected as current presentation"
      echo ""
      echo "Run 'devenv up' to start the dev server"
      
      restart_slides
    '';
    description = "Create a new presentation";
  };

  scripts.slides-dev = {
    exec = ''
      ${getPresoScript}
      preso=$(get_preso)
      echo "Starting dev server for: $preso"
      npx slidev "presentations/$preso/slides.md"
    '';
    description = "Start slidev in dev mode (standalone, not via process manager)";
  };

  scripts.slides-build = {
    exec = ''
      ${getPresoScript}
      preso=$(get_preso)
      echo "Building: $preso"
      npx slidev build "presentations/$preso/slides.md" --out "presentations/$preso/dist" --base "/$preso/"
    '';
    description = "Build static site for selected presentation";
  };

  scripts.slides-pdf = {
    exec = ''
      ${getPresoScript}
      preso=$(get_preso)
      echo "Exporting to PDF: $preso"
      npx slidev export "presentations/$preso/slides.md" --output "presentations/$preso/$preso.pdf"
    '';
    description = "Export selected presentation to PDF";
  };

  scripts.slides-present = {
    exec = ''
      ${getPresoScript}
      preso=$(get_preso)
      echo "Presenting: $preso"
      npx slidev "presentations/$preso/slides.md" --open --remote
    '';
    description = "Start presenter mode for selected presentation";
  };

  scripts.slides-theme = {
    exec = ''
      ${getPresoScript}
      ${restartSlidesScript}
      
      # Available themes from multiple sources:
      # 1. Installed npm packages (@slidev/theme-*)
      # 2. Private/shared themes in shared/themes/
      # 3. Official Slidev themes (auto-installed on use)
      
      INSTALLED_THEMES=$(cat package.json 2>/dev/null | jq -r '.dependencies | keys[]' 2>/dev/null | grep '@slidev/theme-' | sed 's/@slidev\/theme-//' || echo "")
      
      # Private themes from shared/themes/ directory
      # Each subdirectory is a theme (Slidev local theme convention)
      PRIVATE_THEMES=""
      if [[ -d "shared/themes" ]]; then
        PRIVATE_THEMES=$(find shared/themes -mindepth 1 -maxdepth 1 -type d -exec basename {} \; 2>/dev/null | sort || echo "")
      fi
      
      # Official Slidev themes (these will be auto-installed if selected)
      OFFICIAL_THEMES="default
seriph
apple-basic
bricks
dracula
geist
purplin
shibainu
unicorn"

      # Combine and deduplicate
      ALL_THEMES=$(echo -e "''${INSTALLED_THEMES}\n''${PRIVATE_THEMES}\n''${OFFICIAL_THEMES}" | sort -u | grep -v '^$')
      
      theme="''${1:-}"
      preso=$(get_preso)
      slides_file="presentations/$preso/slides.md"
      
      # Get current theme from frontmatter
      current_theme=$(grep -E '^theme:' "$slides_file" 2>/dev/null | head -1 | sed 's/theme:[[:space:]]*//' || echo "none")
      
      if [[ "$theme" == "list" ]] || [[ "$theme" == "-l" ]]; then
        echo "Available themes:"
        echo ""
        echo "Installed (in package.json):"
        if [[ -n "$INSTALLED_THEMES" ]]; then
          echo "$INSTALLED_THEMES" | while read -r t; do
            if [[ "$t" == "$current_theme" ]]; then
              echo "  * $t (current)"
            else
              echo "    $t"
            fi
          done
        else
          echo "    (none)"
        fi
        echo ""
        echo "Private themes (in shared/themes/):"
        if [[ -n "$PRIVATE_THEMES" ]]; then
          echo "$PRIVATE_THEMES" | while read -r t; do
            if [[ "$t" == "$current_theme" ]] || [[ "./shared/themes/$t" == "$current_theme" ]]; then
              echo "  * $t (current)"
            else
              echo "    $t"
            fi
          done
        else
          echo "    (none)"
        fi
        echo ""
        echo "Official Slidev themes (auto-installed on use):"
        echo "$OFFICIAL_THEMES" | while read -r t; do
          if [[ "$t" == "$current_theme" ]]; then
            echo "  * $t (current)"
          else
            echo "    $t"
          fi
        done
        echo ""
        echo "Current presentation: $preso"
        echo "Current theme: $current_theme"
        echo ""
        echo "Usage: slides-theme <theme-name>"
        echo "       slides-theme list"
        exit 0
      fi
      
      if [[ -z "$theme" ]]; then
        # Interactive selection with fzf
        echo "Select a theme for '$preso' (current: $current_theme):"
        theme=$(echo "$ALL_THEMES" | fzf --height=15 --prompt="Theme: " --preview="echo 'Theme: {}'" || echo "")
        if [[ -z "$theme" ]]; then
          echo "No theme selected"
          exit 1
        fi
      fi
      
      # Validate theme is in our list
      if ! echo "$ALL_THEMES" | grep -qx "$theme"; then
        echo "ERROR: Unknown theme '$theme'"
        echo ""
        echo "Available themes:"
        echo "$ALL_THEMES" | sed 's/^/  /'
        exit 1
      fi
      
      if [[ "$theme" == "$current_theme" ]]; then
        echo "Theme '$theme' is already applied to $preso"
        exit 0
      fi
      
      # Determine the theme value to write
      # Private themes need relative path, others use just the name
      theme_value="$theme"
      if [[ -n "$PRIVATE_THEMES" ]] && echo "$PRIVATE_THEMES" | grep -qx "$theme"; then
        theme_value="./shared/themes/$theme"
      fi
      
      # Update theme in frontmatter
      # Use perl with quotemeta to handle special chars in theme_value
      if grep -qE '^theme:' "$slides_file"; then
        # Replace existing theme line
        perl -i -pe 'BEGIN { $t = shift } s/^theme:.*$/theme: $t/' "$theme_value" "$slides_file"
      else
        # Add theme after first ---
        perl -i -pe 'BEGIN { $t = shift } s/^---$/---\ntheme: $t/ if $.==1' "$theme_value" "$slides_file"
      fi
      
      echo "Applied theme '$theme' to $preso"
      
      # Provide context about theme source
      if [[ -n "$PRIVATE_THEMES" ]] && echo "$PRIVATE_THEMES" | grep -qx "$theme"; then
        echo "(Private theme from shared/themes/$theme)"
      elif ! echo "$INSTALLED_THEMES" | grep -qx "$theme"; then
        echo "Note: Theme '$theme' will be auto-installed by Slidev on next dev server start"
      fi
      
      # Check if theme is installed
      if ! echo "$INSTALLED_THEMES" | grep -qx "$theme"; then
        echo "Note: Theme '$theme' will be auto-installed by Slidev on next dev server start"
      fi
      
      restart_slides
    '';
    description = "Apply a theme to the current presentation";
  };

  # ============================================================================
  # SCRIPTS - Agent Session Management
  # ============================================================================

  scripts.agent-start = {
    exec = ''
      set -euo pipefail

      # --- Derive project ID from git remote ---
      get_project_id() {
        local remote_url
        remote_url=$(git remote get-url origin 2>/dev/null || echo "")
        if [[ -z "$remote_url" ]]; then
          basename "$(pwd)"
          return
        fi
        echo "$remote_url" | \
          sed -E 's|^https?://||' | \
          sed -E 's|^git@||' | \
          sed -E 's|:|/|g' | \
          sed -E 's|\.git$||' | \
          tr '/' '-'
      }

      # --- Derive repo name from git remote ---
      get_repo_name() {
        local remote_url
        remote_url=$(git remote get-url origin 2>/dev/null || echo "")
        if [[ -z "$remote_url" ]]; then
          basename "$(pwd)"
          return
        fi
        basename "$remote_url" .git
      }

      # --- Generate short ID ---
      generate_short_id() {
        head -c 4 /dev/urandom | xxd -p | head -c 4
      }

      # --- Find available port ---
      find_available_port() {
        local base_port=$1
        local port=$base_port
        while lsof -i :"$port" >/dev/null 2>&1; do
          port=$((port + 1))
          if [[ $port -gt $((base_port + 100)) ]]; then
            echo "ERROR: Could not find available port" >&2
            exit 1
          fi
        done
        echo "$port"
      }

      # --- Load config with personal override ---
      load_config() {
        local project_id=$1
        local config_dir="$HOME/.config/opencode/projects/$project_id"
        local config_file="$config_dir/config"

        local autorun="''${OPENCODE_AUTORUN:-false}"

        if [[ -f "$config_file" ]]; then
          local override_autorun
          override_autorun=$(grep -E '^autorun=' "$config_file" 2>/dev/null | cut -d= -f2 || echo "")
          if [[ -n "$override_autorun" ]]; then
            autorun="$override_autorun"
          fi
        fi

        echo "$autorun"
      }

      # --- Main ---
      
      # --- Validate presentation selection ---
      if [[ ! -f .current-preso ]]; then
        echo "WARNING: No presentation selected. Defaulting to 'example'"
        echo "example" > .current-preso
      elif [[ ! -d "presentations/$(cat .current-preso)" ]]; then
        echo "WARNING: Selected presentation '$(cat .current-preso)' not found. Defaulting to 'example'"
        echo "example" > .current-preso
      fi
      
      PROJECT_ID=$(get_project_id)
      REPO_NAME=$(get_repo_name)
      SHORT_ID=$(generate_short_id)
      SESSION_NAME="''${REPO_NAME}-''${SHORT_ID}"

      BASE_PORT="''${OPENCODE_PROCESS_COMPOSE_PORT:-8080}"
      PORT=$(find_available_port "$BASE_PORT")

      AUTORUN=$(load_config "$PROJECT_ID")

      # Create session metadata directory
      SESSION_DIR="${sessionDir}"
      mkdir -p "$SESSION_DIR"
      echo "$PORT" > "$SESSION_DIR/$SESSION_NAME"
      echo "$PROJECT_ID" >> "$SESSION_DIR/$SESSION_NAME"
      echo "$(pwd)" >> "$SESSION_DIR/$SESSION_NAME"

      # Determine split direction based on terminal size
      COLS=$(tput cols 2>/dev/null || echo 120)
      ROWS=$(tput lines 2>/dev/null || echo 40)

      if [[ $COLS -gt $ROWS ]]; then
        SPLIT_DIR="vertical"
        PC_SIZE="30"
      else
        SPLIT_DIR="horizontal"
        PC_SIZE="30"
      fi

      # Build process-compose command using devenv
      PC_CMD="devenv up"

      # Export port for OpenCode slash commands
      export OPENCODE_ACTIVE_PORT="$PORT"
      export OPENCODE_SESSION_NAME="$SESSION_NAME"

      # Create zellij layout file
      LAYOUT_FILE=$(mktemp /tmp/zellij-layout-XXXXXX.kdl)

      if [[ "$SPLIT_DIR" == "vertical" ]]; then
        cat > "$LAYOUT_FILE" <<EOF
layout {
    pane split_direction="vertical" {
        pane size="30%" command="bash" {
            args "-c" "$PC_CMD"
        }
        pane size="70%" command="bash" {
            args "-c" "OPENCODE_ACTIVE_PORT=$PORT OPENCODE_SESSION_NAME=$SESSION_NAME opencode"
        }
    }
}
EOF
      else
        cat > "$LAYOUT_FILE" <<EOF
layout {
    pane split_direction="horizontal" {
        pane size="30%" command="bash" {
            args "-c" "$PC_CMD"
        }
        pane size="70%" command="bash" {
            args "-c" "OPENCODE_ACTIVE_PORT=$PORT OPENCODE_SESSION_NAME=$SESSION_NAME opencode"
        }
    }
}
EOF
      fi

      echo "Starting session: $SESSION_NAME"
      zellij --session "$SESSION_NAME" --new-session-with-layout "$LAYOUT_FILE"

      # Cleanup layout file on exit
      rm -f "$LAYOUT_FILE"
    '';
    description = "Start a new OpenCode agent session with process-compose and zellij";
  };

  scripts.agent-sessions = {
    exec = ''
      set -euo pipefail

      get_repo_name() {
        local remote_url
        remote_url=$(git remote get-url origin 2>/dev/null || echo "")
        if [[ -z "$remote_url" ]]; then
          basename "$(pwd)"
          return
        fi
        basename "$remote_url" .git
      }

      REPO_NAME=$(get_repo_name)
      SESSION_DIR="${sessionDir}"

      if [[ ! -d "$SESSION_DIR" ]]; then
        echo "No active sessions"
        exit 0
      fi

      ACTIVE_SESSIONS=$(zellij list-sessions 2>/dev/null | grep -E "^$REPO_NAME-" || echo "")

      if [[ -z "$ACTIVE_SESSIONS" ]]; then
        echo "No active sessions for $REPO_NAME"
        exit 0
      fi

      echo "Active sessions for $REPO_NAME:"
      echo ""
      printf "%-20s %-10s %s\n" "SESSION" "PORT" "STATUS"
      printf "%-20s %-10s %s\n" "-------" "----" "------"

      while IFS= read -r session_line; do
        session_name=$(echo "$session_line" | awk '{print $1}')
        if [[ -f "$SESSION_DIR/$session_name" ]]; then
          port=$(head -1 "$SESSION_DIR/$session_name")
          if echo "$session_line" | grep -q "(current)"; then
            status="attached (current)"
          elif echo "$session_line" | grep -q "EXITED"; then
            status="exited"
          else
            status="running"
          fi
          printf "%-20s %-10s %s\n" "$session_name" "$port" "$status"
        fi
      done <<< "$ACTIVE_SESSIONS"
    '';
    description = "List active OpenCode agent sessions for this repo";
  };

  scripts.agent-connect = {
    exec = ''
      set -euo pipefail

      get_repo_name() {
        local remote_url
        remote_url=$(git remote get-url origin 2>/dev/null || echo "")
        if [[ -z "$remote_url" ]]; then
          basename "$(pwd)"
          return
        fi
        basename "$remote_url" .git
      }

      REPO_NAME=$(get_repo_name)
      SESSION_DIR="${sessionDir}"
      TARGET="''${1:-}"

      ACTIVE_SESSIONS=$(zellij list-sessions 2>/dev/null | grep -E "^$REPO_NAME-" | grep -v "EXITED" | awk '{print $1}' || echo "")

      if [[ -z "$ACTIVE_SESSIONS" ]]; then
        echo "No active sessions for $REPO_NAME"
        exit 1
      fi

      SESSION_COUNT=$(echo "$ACTIVE_SESSIONS" | wc -l | tr -d ' ')

      if [[ -n "$TARGET" ]]; then
        MATCH=$(echo "$ACTIVE_SESSIONS" | grep -E "^$REPO_NAME-$TARGET$" || echo "")
        if [[ -z "$MATCH" ]]; then
          MATCH=$(echo "$ACTIVE_SESSIONS" | grep "$TARGET" | head -1 || echo "")
        fi
        if [[ -z "$MATCH" ]]; then
          echo "No session matching '$TARGET' found"
          exit 1
        fi
        zellij attach "$MATCH"
      elif [[ "$SESSION_COUNT" -eq 1 ]]; then
        zellij attach "$ACTIVE_SESSIONS"
      else
        echo "Multiple sessions found. Select one:"
        SELECTED=$(echo "$ACTIVE_SESSIONS" | fzf --height=10 --prompt="Session: ")
        if [[ -n "$SELECTED" ]]; then
          zellij attach "$SELECTED"
        fi
      fi
    '';
    description = "Connect to an existing OpenCode agent session";
  };

  # ============================================================================
  # SHELL ENTRY
  # ============================================================================
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
    echo "  slides-theme [NAME]      Apply theme (or 'list' to show available)"
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
}
