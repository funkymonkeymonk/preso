# PRESO Documentation

This documentation follows the [Diataxis framework](https://diataxis.fr), organizing content into four distinct types based on user needs.

## Tutorials (Learning-oriented)

Step-by-step lessons that teach you PRESO by doing.

- [Getting Started](tutorials/getting-started.md) - Create your first presentation

## How-To Guides (Goal-oriented)

Practical guides for accomplishing specific tasks.

- [AI Agent Installation](how-to/ai-agent-install.md) - Quick setup for AI assistants
- [Apply Themes](how-to/apply-themes.md) - Change the visual appearance
- [Build and Export](how-to/build-and-export.md) - Create distributable versions
- [Troubleshoot Server](how-to/troubleshoot-server.md) - Fix common issues
- [Create Custom Theme](how-to/create-custom-theme.md) - Make your own theme

## Reference (Information-oriented)

Technical descriptions and specifications.

- [CLI Commands](reference/cli-commands.md) - All available commands
- [Slidev Syntax](reference/slidev-syntax.md) - Markdown syntax reference
- [Theme Structure](reference/theme-structure.md) - Custom theme files
- [Project Structure](reference/project-structure.md) - File organization

---

## Finding What You Need

| You want to... | Go to... |
|----------------|----------|
| Learn PRESO from scratch | [Getting Started Tutorial](tutorials/getting-started.md) |
| Install for AI agents | [AI Agent Installation](how-to/ai-agent-install.md) |
| Do a specific task | [How-To Guides](#how-to-guides-goal-oriented) |
| Look up syntax or commands | [Reference](#reference-information-oriented) |
| Develop the preso CLI | [Development Documentation](#development-documentation) |

---

## Development Documentation

> **Note:** The following documentation is for contributors developing the preso CLI itself. Regular users don't need this section.

- [Agent Session Architecture](development/agent-sessions.md) - Session design decisions
- [Process-Compose Integration](development/process-compose-integration.md) - Dev environment architecture
- [Process-Compose API](development/process-compose-api.md) - Unix socket API reference

Historical design documents are in [plans/](plans/).
