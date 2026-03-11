# Contributing to PRESO

This guide helps you get started contributing to the preso CLI.

## Prerequisites

- [devenv](https://devenv.sh) - Development environment manager (or just Bun directly)
- Git

## Quick Start

```bash
# Clone the repository
git clone https://github.com/funkymonkeymonk/preso.git
cd preso

# Option 1: Use devenv (recommended)
devenv shell
preso-dev --help

# Option 2: Use Bun directly
bun install
bun run src/cli/index.ts --help
```

## Development Commands

### With devenv

| Command | Description |
|---------|-------------|
| `preso-dev <cmd>` | Run CLI in development mode |
| `preso-build` | Build binary for current platform |
| `preso-build-all` | Build binaries for all platforms |

### With Bun directly

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

## Project Structure

```
preso/
├── src/cli/
│   ├── index.ts           # Entry point, command routing
│   ├── version.ts         # Build-time version
│   ├── commands/          # One file per command
│   │   ├── init.ts
│   │   ├── serve.ts
│   │   ├── build.ts
│   │   ├── pdf.ts
│   │   ├── present.ts
│   │   ├── theme.ts
│   │   ├── config.ts
│   │   └── llm.ts
│   ├── utils/             # Shared utilities
│   │   ├── config.ts      # Configuration management
│   │   ├── output.ts      # Console output helpers
│   │   ├── templates.ts   # Embedded slide templates
│   │   └── themes.ts      # Theme registry
│   └── __tests__/         # Tests
│       ├── helpers/       # Test utilities
│       ├── commands/      # Command tests
│       └── utils/         # Utility tests
├── docs/                  # Documentation (Diataxis structure)
├── scripts/
│   └── build.ts           # Build script for binaries
├── Formula/               # Homebrew formula template
└── devenv.nix             # Development environment config
```

## Adding a New Command

1. Create `src/cli/commands/mycommand.ts`:

```typescript
import { parseArgs } from "node:util";
import { ExitCode, exitWithError } from "../utils/output";

const HELP = `
Description of your command.

USAGE
  preso mycommand [options]

OPTIONS
  -h, --help    Show this help
`;

export async function mycommandCommand(args: string[]): Promise<void> {
  const { values } = parseArgs({
    args,
    options: {
      help: { type: "boolean", short: "h" },
    },
    allowPositionals: true,
  });

  if (values.help) {
    console.log(HELP);
    return;
  }

  // Command implementation
}
```

2. Register in `src/cli/index.ts`:

```typescript
import { mycommandCommand } from "./commands/mycommand";

// In the switch statement:
case "mycommand":
  await mycommandCommand(commandArgs);
  break;
```

3. Add tests in `src/cli/__tests__/commands/mycommand.test.ts`

4. Update documentation:
   - Add to `docs/reference/cli-commands.md`
   - Update `src/cli/commands/llm.ts` schema if relevant

## Running Tests

```bash
# Run all tests
bun test

# Run with coverage
bun test --coverage

# Run specific test file
bun test src/cli/__tests__/commands/init.test.ts

# Watch mode
bun test --watch
```

## Code Style

- TypeScript with strict mode
- Biome for linting and formatting
- Run `bun run lint` before committing

## Testing the CLI

```bash
# Create a test directory
mkdir test-preso && cd test-preso

# Run CLI in dev mode
preso-dev init
preso-dev serve

# Or with bun directly
bun run ../src/cli/index.ts init
bun run ../src/cli/index.ts serve
```

## Building Binaries

```bash
# Current platform only
preso-build
# or: bun run scripts/build.ts

# All platforms (macOS, Linux, Windows)
preso-build-all
# or: bun run scripts/build.ts --all
```

Output goes to `dist/`.

## Submitting Changes

1. Create a branch for your changes
2. Make your changes with clear commit messages
3. Run tests: `bun test`
4. Run linting: `bun run lint:check`
5. Run type-check: `bun run typecheck`
6. Submit a pull request

## Release Process

Releases are automated via GitHub Actions:

1. Update version in `package.json`
2. Create and push a tag: `git tag v0.x.x && git push origin v0.x.x`
3. The release workflow builds binaries and creates a GitHub release
4. Homebrew formula is automatically updated
