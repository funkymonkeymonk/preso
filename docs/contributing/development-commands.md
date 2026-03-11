# Development Commands Reference

Reference for commands available when developing the preso CLI itself.

## Option 1: Using devenv (Recommended)

```bash
devenv shell
```

### Available Commands

| Command | Description |
|---------|-------------|
| `preso-dev <cmd>` | Run CLI in development mode |
| `preso-build` | Build binary for current platform |
| `preso-build-all` | Build binaries for all platforms |

### Examples

```bash
preso-dev serve           # Test serve command
preso-dev init            # Test init command
preso-build               # Build for current platform
preso-build-all           # Build for all platforms
```

## Option 2: Using Bun Directly

If you don't want to use devenv:

```bash
bun install
```

### Available Commands

| Command | Description |
|---------|-------------|
| `bun run src/cli/index.ts <cmd>` | Run CLI in development mode |
| `bun test` | Run tests |
| `bun test --coverage` | Run tests with coverage |
| `bun run lint` | Lint and format code |
| `bun run lint:check` | Check linting without fixing |
| `bun run typecheck` | Type-check source code |
| `bun run scripts/build.ts` | Build binary for current platform |
| `bun run scripts/build.ts --all` | Build for all platforms |

### Examples

```bash
# Run CLI in dev mode
bun run src/cli/index.ts --help
bun run src/cli/index.ts serve

# Testing
bun test
bun test --coverage
bun test src/cli/__tests__/commands/init.test.ts

# Linting
bun run lint        # Fix issues
bun run lint:check  # Check only

# Building
bun run scripts/build.ts        # Current platform
bun run scripts/build.ts --all  # All platforms
```

## Testing Workflow

```bash
# Create a test directory
mkdir my-test && cd my-test

# Initialize and test
preso-dev init              # or: bun run ../src/cli/index.ts init
preso-dev serve             # or: bun run ../src/cli/index.ts serve

# Open http://localhost:3030
```

## Build Output

Built binaries go to `dist/`:

| File | Platform |
|------|----------|
| `preso-darwin-arm64` | macOS Apple Silicon |
| `preso-darwin-x64` | macOS Intel |
| `preso-linux-x64` | Linux x64 |
| `preso-linux-arm64` | Linux ARM64 |
| `preso-windows-x64.exe` | Windows x64 |
