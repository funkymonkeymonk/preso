# Devenv

Guide for working with devenv.sh development environments.

## When to Use

- Starting or stopping processes
- Understanding devenv.nix configuration
- Managing the development environment
- Troubleshooting process issues

## What is devenv?

[devenv.sh](https://devenv.sh) is a fast, declarative, reproducible developer environment tool built on Nix. It manages:

- **Packages**: Tools available in the shell
- **Scripts**: Custom commands (e.g., `slides-list`, `slides-select`)
- **Processes**: Long-running services (e.g., dev servers)
- **Languages**: Language runtimes and tooling
- **Services**: Pre-configured databases, caches, etc.

## Key Commands

### Environment

```bash
# Enter the devenv shell (makes scripts available)
devenv shell

# Get information about the environment
devenv info

# Search for packages
devenv search <package-name>
```

### Processes

```bash
# Start all processes in foreground (with TUI) - for humans
devenv up

# Start all processes in background (daemon mode) - for agents
devenv up -d

# Stop background processes
devenv processes down
```

**For agents:** Always use `devenv up -d` to start processes in daemon mode. The TUI will block agent execution.

### Process-Compose Integration

When using process-compose (the default), it communicates via a **Unix socket**, not an HTTP port. The socket location is:

```bash
# Find the socket
SOCKET=$(find /var/folders -name "pc.sock" -path "*/devenv-*/pc.sock" 2>/dev/null | head -1)

# Or check devenv runtime directory
ls .devenv/state/*/pc.sock 2>/dev/null
```

### Unix Socket API

Control processes programmatically via the socket:

```bash
# List all processes
curl -s --unix-socket "$SOCKET" http://localhost/processes | jq .

# Restart a specific process
curl -s --unix-socket "$SOCKET" -X POST http://localhost/process/restart/<name>

# Stop a process
curl -s --unix-socket "$SOCKET" -X POST http://localhost/process/stop/<name>

# Start a process
curl -s --unix-socket "$SOCKET" -X POST http://localhost/process/start/<name>

# Get process logs (offset, limit)
curl -s --unix-socket "$SOCKET" "http://localhost/process/logs/<name>/0/50" | jq -r '.logs[]'

# Get process info
curl -s --unix-socket "$SOCKET" http://localhost/process/info/<name> | jq .
```

## devenv.nix Structure

### Scripts

Scripts become shell commands when in `devenv shell`:

```nix
scripts.my-script = {
  exec = ''
    echo "Hello from my-script"
  '';
  description = "A helpful description";
};
```

### Processes

Long-running services managed by `devenv up`:

```nix
processes.my-server.exec = ''
  npm run dev
'';
```

### Environment Variables

```nix
env.MY_VAR = "value";
```

### Shell Hooks

Code that runs when entering the shell:

```nix
enterShell = ''
  echo "Welcome to the devenv shell!"
'';
```

## Common Patterns

### Checking if Process-Compose is Running

```bash
SOCKET=$(find /var/folders -name "pc.sock" -path "*/devenv-*/pc.sock" 2>/dev/null | head -1)
if [[ -z "$SOCKET" ]]; then
  echo "Process-compose not running. Start with: devenv up"
else
  echo "Process-compose running on socket: $SOCKET"
fi
```

### Restarting a Process After Config Change

```bash
# After changing a file that affects a process
SOCKET=$(find /var/folders -name "pc.sock" -path "*/devenv-*/pc.sock" 2>/dev/null | head -1)
curl -s --unix-socket "$SOCKET" -X POST http://localhost/process/restart/slides
```

### Getting Process Status

```bash
SOCKET=$(find /var/folders -name "pc.sock" -path "*/devenv-*/pc.sock" 2>/dev/null | head -1)
curl -s --unix-socket "$SOCKET" http://localhost/processes | jq '.[] | {name, status: .status}'
```

## Troubleshooting

### "Command not found" for devenv scripts

You need to be in the devenv shell:

```bash
devenv shell
# Now scripts like slides-list are available
```

### Process-compose socket not found

Process-compose isn't running:

```bash
# Start it
devenv up
```

### Process shows "Running" but port not responding

1. Check process logs:
   ```bash
   curl -s --unix-socket "$SOCKET" "http://localhost/process/logs/<name>/0/30" | jq -r '.logs[]'
   ```

2. Verify the process command is correct in `devenv.nix`

3. Check for port conflicts:
   ```bash
   lsof -i :<port>
   ```

### Multiple instances of a process

Kill orphans and restart:

```bash
pkill -f "<process-pattern>"
curl -s --unix-socket "$SOCKET" -X POST http://localhost/process/restart/<name>
```

## For Agents

1. **Use scripts when available** - If there's a `slides-*` script, use it instead of raw commands

2. **Check socket first** - Before API calls, verify process-compose is running by finding the socket

3. **Use the Unix socket** - The HTTP port in config is for process-compose's internal use; always use the Unix socket for API calls

4. **Restart after config changes** - After modifying files that affect a process, restart it via the socket API

## Resources

- [devenv.sh Documentation](https://devenv.sh)
- [Processes Guide](https://devenv.sh/processes/)
- [Scripts Guide](https://devenv.sh/scripts/)
- [Process-Compose Options](https://devenv.sh/supported-process-managers/process-compose/)
