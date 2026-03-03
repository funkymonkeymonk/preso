# Skill: preso

Create and manage Slidev presentations from the command line.

## When to Use

Use this skill when the user wants to:
- Create a new presentation or slide deck
- Start a presentation dev server
- Build or export presentations (PDF, static site)
- Work with Slidev markdown presentations

**Keywords:** presentation, slides, slidev, deck, talk, keynote, powerpoint

## Quick Reference

```bash
preso llm              # Get compact command help
preso llm status       # Check if current directory is a presentation
preso llm schema       # Get structured command info for tool use
```

## Core Workflow

```bash
# 1. Create presentation (in empty directory)
mkdir my-talk && cd my-talk
preso init

# 2. Start dev server
preso serve                 # http://localhost:3030
preso serve -p 3031         # Use different port

# 3. Export
preso build                 # Static site -> ./dist
preso pdf                   # PDF export
```

## Key Concept

**One directory = one presentation.** The current working directory IS the presentation.

- `slides.md` in cwd = presentation exists
- No project-level config, no "selecting" presentations
- Multiple presentations = multiple directories + different ports

## Before Taking Action

Always run first:
```bash
preso llm status
```

This returns JSON showing:
- Whether current directory has a presentation
- If port 3030 is available
- Path to logs and config

## Common Patterns

### Create New Presentation
```bash
# Check we're in right place
pwd
ls  # Should be empty or no slides.md

# Create
preso init
preso init -T seriph        # With specific theme
preso init -n "My Talk"     # With custom title
```

### Start Development
```bash
preso llm status            # Verify slides.md exists
preso serve                 # Start server
# If port conflict:
preso serve -p 3031
```

### Multiple Presentations
```bash
# Terminal 1
cd ~/talks/talk-a && preso serve -p 3030

# Terminal 2  
cd ~/talks/talk-b && preso serve -p 3031
```

### Export for Sharing
```bash
preso build                 # Creates ./dist with static site
preso pdf                   # Creates <dirname>.pdf
preso pdf -o slides.pdf     # Custom filename
```

## Error Recovery

| Error | Solution |
|-------|----------|
| "No slides.md found" | Run `preso init` or `cd` to presentation directory |
| "Port X in use" | Use `preso serve -p <other-port>` |
| PDF export fails | Run `bunx playwright install chromium` |

## Discovery Commands

When unsure, use progressive discovery:

```bash
preso llm                   # Minimal token help
preso llm status            # Current state as JSON
preso llm debug             # Detailed troubleshooting
preso llm schema            # Full command schema
preso <command> -h          # Detailed help for specific command
```

## File Locations

| Item | Path |
|------|------|
| Presentation content | `./slides.md` |
| Global config | `~/.config/preso/config.json` |
| Custom themes | `~/.config/preso/themes/` |
| Logs | `./.preso.log` |

## Slidev Markdown Syntax

Basic structure:
```markdown
---
theme: seriph
---

# Slide Title

Content here

---

# Next Slide

More content
```

Speaker notes:
```markdown
# Slide

Content

<!--
Speaker notes go here
-->
```

Code highlighting:
````markdown
```ts {2,3}
// Line 1
// Line 2 - highlighted
// Line 3 - highlighted
```
````

## Do NOT

- Don't look for a "project root" or multi-presentation setup
- Don't try to "select" a presentation - just `cd` to it
- Don't auto-increment ports on conflict - fail and tell user
- Don't create presentations in nested structures
