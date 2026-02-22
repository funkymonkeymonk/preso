{ pkgs, lib, config, ... }:

# ============================================================================
# devenv.nix - PRESO Development Environment
# ============================================================================
#
# This file provides the development environment for the preso CLI and
# presentations. For end users, the standalone `preso` binary is recommended.
#
# QUICK REFERENCE
# ============================================================================
#
# CLI DEVELOPMENT
#   preso-dev            - Run CLI in development mode
#   preso-build          - Build standalone binaries
#   preso-build-all      - Build for all platforms
#
# PRESENTATION SCRIPTS (slides-*)
#   slides-list          - List all available presentations
#   slides-select [NAME] - Select presentation to work on
#   slides-serve         - Start slidev dev server (background)
#   slides-stop          - Stop background server
#
# AGENT SESSION SCRIPTS (agent-*)
#   agent-start          - Start new OpenCode agent session
#   agent-sessions       - List all active sessions
#   agent-connect [ID]   - Connect to existing session
#
# PROCESSES (via devenv up)
#   slides               - Slidev dev server
#
# ============================================================================

let
  sessionDir = "/tmp/opencode-sessions";

  findPresoScript = ''
    find_preso_path() {
      local name="$1"
      if [[ -d "presentations/$name" ]]; then
        echo "presentations/$name"
      elif [[ -d "local/presentations/$name" ]]; then
        echo "local/presentations/$name"
      else
        echo ""
      fi
    }
  '';

  listPresosScript = ''
    list_all_presos() {
      {
        if [[ -d "presentations" ]]; then
          ls -1 presentations/ 2>/dev/null | while read -r p; do echo "$p"; done
        fi
        if [[ -d "local/presentations" ]]; then
          ls -1 local/presentations/ 2>/dev/null | while read -r p; do echo "$p"; done
        fi
      } | sort -u
    }
  '';

  getPresoScript = ''
    ${findPresoScript}
    ${listPresosScript}
    
    get_preso() {
      local preso=""
      if [[ -n "''${PRESO:-}" ]]; then
        preso="$PRESO"
      elif [[ -f .current-preso ]]; then
        preso=$(cat .current-preso)
      else
        preso=$(list_all_presos | fzf --height=10 --prompt="Select presentation: ")
        if [[ -n "$preso" ]]; then
          echo "$preso" > .current-preso
        fi
      fi
      
      if [[ -z "$preso" ]]; then
        echo "ERROR: No presentation selected" >&2
        exit 1
      fi
      
      local preso_path
      preso_path=$(find_preso_path "$preso")
      if [[ -z "$preso_path" ]]; then
        echo "ERROR: Presentation '$preso' not found" >&2
        exit 1
      fi
      
      echo "$preso"
    }
    
    get_preso_path() {
      local preso="$1"
      find_preso_path "$preso"
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
    pkgs.bun
  ];

  # ============================================================================
  # ENVIRONMENT VARIABLES
  # ============================================================================
  env.OPENCODE_AUTORUN = "false";
  env.OPENCODE_BACKEND = "devenv";
  env.OPENCODE_PROCESS_COMPOSE_PORT = "8080";

  # ============================================================================
  # LANGUAGES (Bun handles JavaScript/TypeScript)
  # ============================================================================
  languages.javascript = {
    enable = true;
    bun = {
      enable = true;
      install.enable = true;
    };
  };

  # ============================================================================
  # PROCESS MANAGER
  # ============================================================================
  process.managers.process-compose = {
    port = 8080;
  };

  # ============================================================================
  # PROCESSES
  # ============================================================================
  
  processes.slides.exec = ''
    PRESO=$(cat .current-preso 2>/dev/null || echo "example")
    if [[ -d "presentations/$PRESO" ]]; then
      PRESO_PATH="presentations/$PRESO"
    elif [[ -d "local/presentations/$PRESO" ]]; then
      PRESO_PATH="local/presentations/$PRESO"
    else
      echo "ERROR: Presentation '$PRESO' not found"
      exit 1
    fi
    exec bunx slidev "$PRESO_PATH/slides.md"
  '';

  # ============================================================================
  # SCRIPTS - CLI Development
  # ============================================================================

  scripts.preso-dev = {
    exec = ''
      bun run src/cli/index.ts "$@"
    '';
    description = "Run preso CLI in development mode";
  };

  scripts.preso-build = {
    exec = ''
      bun run scripts/build.ts "$@"
    '';
    description = "Build standalone preso binary for current platform";
  };

  scripts.preso-build-all = {
    exec = ''
      bun run scripts/build.ts --all
    '';
    description = "Build standalone preso binaries for all platforms";
  };

  scripts.preso-typecheck = {
    exec = ''
      bun run typecheck
    '';
    description = "Type-check the CLI source code";
  };

  # ============================================================================
  # SCRIPTS - Slide Management (for development/testing)
  # ============================================================================

  scripts.slides-list = {
    exec = ''
      ${listPresosScript}
      echo "Available presentations:"
      echo ""
      current=""
      if [[ -f ".current-preso" ]]; then
        current=$(cat .current-preso)
      fi
      
      if [[ -d "presentations" ]] && [[ -n "$(ls -A presentations/ 2>/dev/null)" ]]; then
        echo "Public (presentations/):"
        ls -1 presentations/ | while read -r preso; do
          if [[ "$current" == "$preso" ]]; then
            echo "  * $preso (current)"
          else
            echo "    $preso"
          fi
        done
        echo ""
      fi
      
      if [[ -d "local/presentations" ]] && [[ -n "$(ls -A local/presentations/ 2>/dev/null)" ]]; then
        echo "Private (local/presentations/):"
        ls -1 local/presentations/ | while read -r preso; do
          if [[ "$current" == "$preso" ]]; then
            echo "  * $preso (current)"
          else
            echo "    $preso"
          fi
        done
      fi
    '';
    description = "List all available presentations";
  };

  scripts.slides-select = {
    exec = ''
      ${findPresoScript}
      ${listPresosScript}
      
      name="''${1:-}"
      if [[ -z "$name" ]]; then
        name=$(list_all_presos | fzf --height=10 --prompt="Select presentation: ")
      fi
      
      if [[ -z "$name" ]]; then
        echo "No selection made"
        exit 1
      fi
      
      preso_path=$(find_preso_path "$name")
      if [[ -z "$preso_path" ]]; then
        echo "ERROR: Presentation '$name' not found"
        exit 1
      fi
      
      echo "$name" > .current-preso
      echo "Selected: $name ($preso_path)"
    '';
    description = "Select a presentation to work on";
  };

  scripts.slides-serve = {
    exec = ''
      ${getPresoScript}
      preso=$(get_preso)
      preso_path=$(get_preso_path "$preso")
      
      pkill -f "slidev.*slides.md" 2>/dev/null || true
      sleep 1
      
      echo "Starting dev server for: $preso (background)"
      mkdir -p .devenv
      nohup bunx slidev "$preso_path/slides.md" > .devenv/slides.log 2>&1 &
      
      echo "Waiting for server to start..."
      for i in {1..30}; do
        if curl -s -o /dev/null http://localhost:3030; then
          echo "Server ready at http://localhost:3030"
          exit 0
        fi
        sleep 1
      done
      
      echo "ERROR: Server failed to start. Check .devenv/slides.log"
      exit 1
    '';
    description = "Start slidev in background mode";
  };

  scripts.slides-stop = {
    exec = ''
      if pkill -f "slidev"; then
        echo "Stopped slidev server"
      else
        echo "No slidev server running"
      fi
    '';
    description = "Stop any running slidev servers";
  };

  scripts.slides-validate = {
    exec = ''
      ${findPresoScript}
      ${listPresosScript}
      
      if [[ ! -f .current-preso ]]; then
        echo "ERROR: No presentation selected"
        exit 1
      fi
      
      preso=$(cat .current-preso)
      preso_path=$(find_preso_path "$preso")
      
      if [[ -z "$preso_path" ]]; then
        echo "ERROR: Presentation '$preso' not found"
        exit 1
      fi
      
      if [[ ! -f "$preso_path/slides.md" ]]; then
        echo "ERROR: Missing slides.md in $preso_path/"
        exit 1
      fi
      
      echo "OK: $preso ($preso_path/slides.md exists)"
    '';
    description = "Validate current presentation selection";
  };

  # ============================================================================
  # SCRIPTS - Agent Session Management
  # ============================================================================

  scripts.agent-start = {
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

      generate_short_id() {
        head -c 4 /dev/urandom | xxd -p | head -c 4
      }

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

      if [[ ! -f .current-preso ]]; then
        echo "example" > .current-preso
      fi
      
      REPO_NAME=$(get_repo_name)
      SHORT_ID=$(generate_short_id)
      SESSION_NAME="''${REPO_NAME}-''${SHORT_ID}"
      BASE_PORT="''${OPENCODE_PROCESS_COMPOSE_PORT:-8080}"
      PORT=$(find_available_port "$BASE_PORT")

      SESSION_DIR="${sessionDir}"
      mkdir -p "$SESSION_DIR"
      echo "$PORT" > "$SESSION_DIR/$SESSION_NAME"

      COLS=$(tput cols 2>/dev/null || echo 120)
      ROWS=$(tput lines 2>/dev/null || echo 40)

      if [[ $COLS -gt $ROWS ]]; then
        SPLIT_DIR="vertical"
      else
        SPLIT_DIR="horizontal"
      fi

      PC_CMD="devenv up"
      LAYOUT_FILE=$(mktemp /tmp/zellij-layout-XXXXXX.kdl)

      if [[ "$SPLIT_DIR" == "vertical" ]]; then
        cat > "$LAYOUT_FILE" <<EOF
layout {
    pane split_direction="vertical" {
        pane size="30%" command="bash" {
            args "-c" "$PC_CMD"
        }
        pane size="70%" command="bash" {
            args "-c" "OPENCODE_ACTIVE_PORT=$PORT opencode"
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
            args "-c" "OPENCODE_ACTIVE_PORT=$PORT opencode"
        }
    }
}
EOF
      fi

      echo "Starting session: $SESSION_NAME"
      zellij --session "$SESSION_NAME" --new-session-with-layout "$LAYOUT_FILE"
      rm -f "$LAYOUT_FILE"
    '';
    description = "Start a new OpenCode agent session";
  };

  scripts.agent-sessions = {
    exec = ''
      set -euo pipefail
      get_repo_name() {
        local remote_url
        remote_url=$(git remote get-url origin 2>/dev/null || echo "")
        if [[ -z "$remote_url" ]]; then basename "$(pwd)"; return; fi
        basename "$remote_url" .git
      }
      REPO_NAME=$(get_repo_name)
      ACTIVE_SESSIONS=$(zellij list-sessions 2>/dev/null | grep -E "^$REPO_NAME-" || echo "")
      if [[ -z "$ACTIVE_SESSIONS" ]]; then
        echo "No active sessions for $REPO_NAME"
        exit 0
      fi
      echo "Active sessions for $REPO_NAME:"
      echo "$ACTIVE_SESSIONS"
    '';
    description = "List active OpenCode agent sessions";
  };

  scripts.agent-connect = {
    exec = ''
      set -euo pipefail
      get_repo_name() {
        local remote_url
        remote_url=$(git remote get-url origin 2>/dev/null || echo "")
        if [[ -z "$remote_url" ]]; then basename "$(pwd)"; return; fi
        basename "$remote_url" .git
      }
      REPO_NAME=$(get_repo_name)
      TARGET="''${1:-}"
      ACTIVE_SESSIONS=$(zellij list-sessions 2>/dev/null | grep -E "^$REPO_NAME-" | grep -v "EXITED" | awk '{print $1}' || echo "")
      if [[ -z "$ACTIVE_SESSIONS" ]]; then
        echo "No active sessions for $REPO_NAME"
        exit 1
      fi
      if [[ -n "$TARGET" ]]; then
        MATCH=$(echo "$ACTIVE_SESSIONS" | grep "$TARGET" | head -1 || echo "")
        if [[ -n "$MATCH" ]]; then
          zellij attach "$MATCH"
        else
          echo "No session matching '$TARGET' found"
          exit 1
        fi
      elif [[ $(echo "$ACTIVE_SESSIONS" | wc -l) -eq 1 ]]; then
        zellij attach "$ACTIVE_SESSIONS"
      else
        SELECTED=$(echo "$ACTIVE_SESSIONS" | fzf --height=10 --prompt="Session: ")
        if [[ -n "$SELECTED" ]]; then
          zellij attach "$SELECTED"
        fi
      fi
    '';
    description = "Connect to an existing session";
  };

  # ============================================================================
  # SHELL ENTRY
  # ============================================================================
  enterShell = ''
    echo ""
    echo "PRESO Development Environment"
    echo "=============================="
    echo ""
    echo "CLI Development:"
    echo "  preso-dev <cmd>      Run CLI in dev mode (e.g., preso-dev serve)"
    echo "  preso-build          Build binary for current platform"
    echo "  preso-build-all      Build binaries for all platforms"
    echo "  preso-typecheck      Type-check source code"
    echo ""
    echo "Slide Commands:"
    echo "  slides-list          List presentations"
    echo "  slides-select [NAME] Select presentation"
    echo "  slides-serve         Start dev server (background)"
    echo "  slides-stop          Stop dev server"
    echo ""
    echo "Agent Commands:"
    echo "  agent-start          Start new session"
    echo "  agent-sessions       List sessions"
    echo "  agent-connect [ID]   Connect to session"
    echo ""
    echo "Processes (via 'devenv up'):"
    echo "  slides               Slidev dev server"
    echo ""
  '';
}
