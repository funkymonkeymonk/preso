# Getting Started with PRESO

In this tutorial, you'll create your first presentation and see it running in your browser. By the end, you'll understand the basic workflow for creating and previewing slides.

## Prerequisites

You need [devenv](https://devenv.sh) installed on your system. devenv manages all other dependencies automatically.

## Step 1: Enter the Development Environment

Open your terminal and navigate to the PRESO repository. Then enter the devenv shell:

```bash
devenv shell
```

You'll see a welcome message listing available commands. This confirms the environment is ready.

## Step 2: Create Your First Presentation

Let's create a presentation called "my-first-talk":

```bash
slides-new my-first-talk
```

This creates a new presentation at `presentations/my-first-talk/slides.md` with starter content and automatically selects it as the current presentation.

## Step 3: Start the Development Server

Start the Slidev development server:

```bash
devenv up
```

You'll see the process-compose TUI showing the `slides` process running.

## Step 4: View Your Presentation

Open your browser to [http://localhost:3030](http://localhost:3030). You should see your presentation's title slide.

Try these URLs:
- **Slides:** http://localhost:3030
- **Overview:** http://localhost:3030/overview (see all slides as thumbnails)
- **Presenter:** http://localhost:3030/presenter (speaker view with notes)

## Step 5: Make Your First Edit

Open `presentations/my-first-talk/slides.md` in your editor. You'll see something like:

```markdown
---
theme: seriph
title: My First Talk
---

# My First Talk

Your presentation starts here.
```

Change the title and add a second slide:

```markdown
---
theme: seriph
title: My First Talk
---

# Hello PRESO!

My first presentation using Slidev.

---

# What I Learned

- PRESO manages presentations with devenv
- Slides are written in Markdown
- Changes appear instantly in the browser
```

Save the file. Your browser will automatically reload with the changes.

## Step 6: Navigate Between Slides

In the browser:
- **Arrow keys** or **Space** advance slides
- **Overview mode**: Press `o` to see all slides
- **Presenter mode**: Press `p` for speaker view

## What You've Accomplished

You've:
1. Set up the PRESO development environment
2. Created a new presentation
3. Started the development server
4. Made live edits to your slides
5. Learned the basic navigation controls

## Next Steps

- **Add more slides:** Learn Slidev syntax in the [Slidev Syntax Reference](../reference/slidev-syntax.md)
- **Apply a theme:** See [How to Apply Themes](../how-to/apply-themes.md)
- **Build for deployment:** See [How to Build and Export](../how-to/build-and-export.md)
- **Work with multiple presentations:** See [How to Switch Presentations](../how-to/switch-presentations.md)
