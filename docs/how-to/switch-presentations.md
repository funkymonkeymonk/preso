# How to Switch Presentations

This guide shows you how to work with multiple presentations in PRESO.

## List Available Presentations

```bash
slides-list
```

The current presentation is marked with `*`.

## Select a Different Presentation

```bash
slides-select <name>
```

For example:
```bash
slides-select example
```

If the development server is running, it automatically restarts with the new presentation.

## Check Current Selection

```bash
slides-current
```

## Validate Selection

Before starting the server, verify the selection is valid:

```bash
slides-validate
```

This checks that the selected presentation exists and has a `slides.md` file.

## Using Environment Variables

Override the selection temporarily:

```bash
PRESO=my-talk devenv up
```

This starts the server with `my-talk` without changing `.current-preso`.

## Selection Priority

PRESO determines the current presentation in this order:
1. `PRESO` environment variable (highest priority)
2. `.current-preso` file
3. Interactive picker (fzf, for humans only)

> For reference documentation on the selection system, see [Presentation Selection System](../explanation/presentation-selection.md).
