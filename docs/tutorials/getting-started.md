# Getting Started with PRESO

In this tutorial, you'll create your first presentation and see it running in your browser. By the end, you'll understand the basic workflow for creating and previewing slides.

## Prerequisites

You need the `preso` binary installed. See [Installation](../how-to/install.md) for platform-specific instructions.

Verify installation:

```bash
preso --version
```

## Step 1: Create a Presentation Directory

Each presentation lives in its own directory. Create one and navigate to it:

```bash
mkdir my-first-talk
cd my-first-talk
```

## Step 2: Initialize the Presentation

Create the slides file and dependencies:

```bash
preso init
```

This creates a `slides.md` file with starter content.

## Step 3: Start the Development Server

Start the Slidev development server:

```bash
preso serve
```

You'll see output indicating the server is running on port 3030.

## Step 4: View Your Presentation

Open your browser to [http://localhost:3030](http://localhost:3030). You should see your presentation's title slide.

Try these URLs:
- **Slides:** http://localhost:3030
- **Overview:** http://localhost:3030/overview (see all slides as thumbnails)
- **Presenter:** http://localhost:3030/presenter (speaker view with notes)

## Step 5: Make Your First Edit

Open `slides.md` in your editor. You'll see something like:

```markdown
---
theme: default
title: My First Talk
---

# My First Talk

Your presentation starts here.
```

Change the title and add a second slide:

```markdown
---
theme: default
title: My First Talk
---

# Hello PRESO!

My first presentation using Slidev.

---

# What I Learned

- Each presentation is a directory with slides.md
- Slides are written in Markdown
- Changes appear instantly in the browser
```

Save the file. Your browser will automatically reload with the changes.

## Step 6: Navigate Between Slides

In the browser:
- **Arrow keys** or **Space** advance slides
- **Overview mode**: Press `o` to see all slides
- **Presenter mode**: Press `p` for speaker view

## Next Steps

- **Add more slides:** Learn Slidev syntax in the [Slidev Syntax Reference](../reference/slidev-syntax.md)
- **Apply a theme:** See [How to Apply Themes](../how-to/apply-themes.md)
- **Build for deployment:** See [How to Build and Export](../how-to/build-and-export.md)
- **Multiple presentations:** Each presentation is its own directory - run `preso serve -p 3031` in another directory for parallel work
