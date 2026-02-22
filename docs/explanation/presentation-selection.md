# Presentation Selection System

This document explains how PRESO determines which presentation to work with and why the system is designed this way.

## The Problem

A presentation repository contains multiple presentations, but most commands operate on a single "current" presentation. The system needs to:

1. Know which presentation to serve, build, or export
2. Allow quick switching between presentations
3. Support both interactive (human) and non-interactive (agent) use cases
4. Persist selection across terminal sessions

## The Solution: Priority-Based Selection

PRESO uses a three-tier priority system:

1. **`PRESO` environment variable** (highest priority)
2. **`.current-preso` file**
3. **Interactive fzf picker** (lowest priority, humans only)

### Why This Order?

**Environment variable first** allows temporary overrides without changing persisted state:
```bash
PRESO=demo slides-build  # Builds demo without changing .current-preso
```

**File second** provides persistence across sessions. When you run `slides-select my-talk`, it writes to `.current-preso`, and that selection persists until you change it.

**Interactive picker last** provides a fallback for humans who haven't selected anything, but agents should always pass explicit arguments to avoid blocking on user input.

## The .current-preso File

This is a simple text file containing just the presentation name:

```
my-talk
```

The file is:
- Created/updated by `slides-select <name>` and `slides-new <name>`
- Read by the `slides` process on startup
- Validated by `slides-validate`

### Validation

The selection system can fail silently if `.current-preso` references a non-existent presentation. This is why `slides-validate` exists:

```bash
slides-validate
# OK: my-talk (presentations/my-talk/slides.md exists)
```

If invalid, Slidev starts but doesn't bind to port 3030 because it can't find the slides file.

## Process Restart on Selection Change

When you change the selection while `devenv up` is running, the slides process needs to restart to pick up the new value. `slides-select` automatically triggers this restart by calling the process-compose API.

## Design Trade-offs

### Why not use command arguments everywhere?

Commands like `slides-build` could require `slides-build my-talk`, but:
- It's verbose when working on one presentation for extended periods
- It doesn't match how humans think ("build the current thing")
- Multiple commands would need the same argument repeated

### Why a file instead of a database or config?

- Simple to inspect and debug (`cat .current-preso`)
- Works with any tooling (no special readers needed)
- Easy to version control if desired (though it's gitignored by default)
- Trivial for agents to read and write

### Why gitignore .current-preso?

Different developers may work on different presentations. The selection is local state, not project configuration.

## For Agents

Agents should:
1. Always pass explicit arguments: `slides-select my-talk` not `slides-select`
2. Validate before starting: `slides-validate`
3. Use environment variable for one-off commands: `PRESO=demo slides-build`

> For step-by-step instructions, see [How to Switch Presentations](../how-to/switch-presentations.md).
