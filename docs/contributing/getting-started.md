# Contributing to PRESO

This guide helps you get started contributing to the preso CLI.

## Prerequisites

- [devenv](https://devenv.sh) - Development environment manager
- Git

## Quick Start

```bash
# Clone the repository
git clone https://github.com/wweaver/preso.git
cd preso

# Enter the development environment
devenv shell

# Run the CLI in development mode
preso-dev --help
preso-dev serve
```

## Development Commands

| Command | Description |
|---------|-------------|
| `preso-dev <cmd>` | Run CLI in development mode |
| `preso-build` | Build binary for current platform |
| `preso-build-all` | Build binaries for all platforms |
| `preso-typecheck` | Type-check source code |
| `preso-lint` | Lint and format code |

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
│   └── utils/             # Shared utilities
│       ├── config.ts      # Configuration management
│       ├── output.ts      # Console output helpers
│       ├── templates.ts   # Embedded slide templates
│       └── themes.ts      # Theme registry
├── docs/                  # Documentation (Diataxis structure)
├── scripts/
│   └── build.ts           # Build script for binaries
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

3. Update documentation:
   - Add to `docs/reference/cli-commands.md`
   - Update `src/cli/commands/llm.ts` schema if relevant

## Code Style

- TypeScript with strict mode
- Biome for linting and formatting
- Run `preso-lint` before committing

## Testing Changes

Test presentations are in `presentations/`:

```bash
# Select a test presentation
slides-select example

# Start the dev server
slides-serve

# Or test the CLI directly
cd presentations/example
preso-dev serve
```

## Building Binaries

```bash
# Current platform only
preso-build

# All platforms (macOS, Linux, Windows)
preso-build-all
```

Output goes to `dist/`.

## Submitting Changes

1. Create a branch for your changes
2. Make your changes with clear commit messages
3. Run `preso-lint` and `preso-typecheck`
4. Submit a pull request

## Advanced: Agent Sessions

For AI-assisted development, see:
- [Start Agent Session](start-agent-session.md)
- [Agent Session Architecture](agent-sessions.md)
