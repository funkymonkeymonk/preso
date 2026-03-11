# CLI Commands Reference

Reference for all `preso` commands.

## Presentation Commands

### preso init

Create a new presentation in the current directory.

| Option | Description |
|--------|-------------|
| `-t, --template <name>` | Template: basic, seriph, minimal (default: from config) |
| `--theme <name>` | Theme to use (default: from config) |
| `-n, --name <title>` | Presentation title (default: directory name) |
| `-h, --help` | Show help |

**Creates:** `slides.md`, `package.json`, `.gitignore`

**Templates:**

| Template | Description |
|----------|-------------|
| `basic` | Minimal starter with 3 slides |
| `seriph` | Feature-rich with cover slide, layouts, and navigation hints |
| `minimal` | Ultra-minimal with just title and one content slide |

### preso serve

Start the development server.

| Option | Description |
|--------|-------------|
| `-p, --port <number>` | Port to use (default: 3030) |
| `-o, --open` | Open browser automatically |
| `-h, --help` | Show help |

### preso build

Build a static site for deployment.

| Option | Description |
|--------|-------------|
| `-o, --out <dir>` | Output directory (default: dist) |
| `-b, --base <path>` | Base URL path (default: /) |
| `-h, --help` | Show help |

### preso pdf

Export the presentation to PDF.

| Option | Description |
|--------|-------------|
| `-o, --out <file>` | Output file (default: `<dirname>.pdf`) |
| `--dark` | Use dark theme |
| `--with-clicks` | Separate pages for click animations |
| `--with-toc` | Include table of contents |
| `-h, --help` | Show help |

**Requires:** Playwright (`bunx playwright install chromium`)

### preso present

Start presenter mode with speaker notes and timer.

| Option | Description |
|--------|-------------|
| `-p, --port <number>` | Port to use (default: 3030) |
| `--remote` | Enable remote control for audience viewing |
| `-h, --help` | Show help |

**Presenter view features:**
- Current and next slide preview
- Speaker notes display
- Presentation timer
- Slide navigation controls

**URLs when running:**
- Presenter view: `http://localhost:<port>/presenter`
- Audience view: `http://localhost:<port>`

When using `--remote`, the audience can follow along at the main URL while you control from `/presenter`.

## Theme Commands

### preso theme list

List available themes (official and custom in `~/.config/preso/themes/`).

### preso theme set \<name\>

Apply a theme to the current presentation. Updates the `theme:` field in `slides.md` frontmatter.

### preso theme browse

Open the Slidev theme gallery in your browser.

## Configuration Commands

### preso config show

Display current configuration values and file location.

### preso config set \<key\> \<value\>

Set a configuration value.

| Key | Type | Description |
|-----|------|-------------|
| `defaultTheme` | string | Theme for new presentations |
| `defaultTemplate` | string | Template for new presentations |
| `defaultPort` | number | Port for dev server (1-65535) |

### preso config path

Print the configuration file location.

## LLM/Agent Commands

Commands optimized for AI coding assistants.

| Command | Description |
|---------|-------------|
| `preso llm` | Compact help (minimal tokens) |
| `preso llm status` | JSON status of current directory |
| `preso llm debug` | Troubleshooting information |
| `preso llm schema` | Structured command schema for tool use |

## Getting Help

```bash
preso --help           # List all commands
preso <command> -h     # Help for specific command
```
