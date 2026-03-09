# How to Use Presenter Mode

This guide shows you how to present with speaker notes, timer, and audience synchronization.

## Start Presenter Mode

```bash
preso present
```

This opens the presenter view at `http://localhost:3030/presenter`.

## Presenter View Features

The presenter view shows:

- **Current slide** - What the audience sees
- **Next slide** - Preview of what's coming
- **Speaker notes** - Your private notes (see below)
- **Timer** - Elapsed presentation time
- **Progress** - Current slide / total slides

## Adding Speaker Notes

Add notes to any slide using the `<!--` comment syntax at the bottom of the slide:

```markdown
---

# My Slide Title

Main content goes here.

<!--
These are speaker notes.
They appear in presenter mode but not in the main presentation.

- Remember to mention the demo
- Ask if there are questions
-->

---
```

## Remote Presentations

To let an audience follow along remotely:

```bash
preso present --remote
```

This enables:
- **Presenter view**: `http://localhost:3030/presenter` (you)
- **Audience view**: `http://localhost:3030` (share this link)

The audience view automatically syncs with your navigation.

## Keyboard Shortcuts

In presenter mode:

| Key | Action |
|-----|--------|
| `Space` / `Right` / `Down` | Next slide |
| `Left` / `Up` | Previous slide |
| `g` | Go to slide number |
| `o` | Toggle overview |
| `d` | Toggle dark mode |
| `Esc` | Exit overview/fullscreen |

## Multiple Monitors

For the best experience:

1. Open presenter view on your laptop: `http://localhost:3030/presenter`
2. Open audience view on the projector/external display: `http://localhost:3030`
3. Drag the audience window to the external display
4. Press `F` in the audience window for fullscreen

## Tips

- **Practice with notes** - Run through with presenter mode before presenting
- **Use the timer** - Keep track of your pace
- **Keep notes brief** - Bullet points work better than paragraphs
- **Test remote mode** - If presenting virtually, verify audience sync works

## Troubleshooting

### Notes not showing

Ensure notes are inside `<!-- ... -->` at the end of the slide, before the `---` separator.

### Remote viewers out of sync

Refresh the audience browser. The sync happens automatically when both views are connected.

### Timer reset

The timer starts when presenter mode opens. Refresh to reset.
