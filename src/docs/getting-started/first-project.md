---
title: Your First Project
description: A complete walkthrough of creating, customising, and sharing your first CodePark project.
category: Getting Started
order: 4
icon: folder-plus
tags:
  - project
  - walkthrough
  - tutorial
lastUpdated: 2026-07-10
draft: false
---

# Your First Project

This walkthrough takes you from an empty dashboard to a running, shared project.

## Creating a project

From the Dashboard, click **New Project**. You'll see a dialog with several options:

### Choose a template

Templates give you a pre-configured container with the right runtime, package manager, and starter files already in place.

Available templates include: **Blank**, **Node.js**, **Python**, **Rust**, **Go**, **React**, **Next.js**, **FastAPI**, and more.

### Import from GitHub

If you have an existing repository, click **Import from GitHub**, authorize the GitHub integration, and select the repository. CodePark clones it into your container automatically.

### Project settings

Give your project a name and choose a visibility setting:

- **Private** — only you and invited collaborators can access it (Pro)
- **Public** — anyone with the link can view it

## Inside the editor

Once the project opens, you'll see the editor layout:

- **Left panel** — file tree, git, and search
- **Center** — the Monaco editor with full IntelliSense
- **Bottom panel** — integrated terminal
- **Right panel** — AI assistant and presence indicators

### Running your first command

Click on the terminal tab at the bottom. The terminal is a full bash shell running inside your container:

```bash
# Check your environment
node --version   # or python3 --version, rustc --version, etc.

# Install dependencies
npm install

# Start your app
npm run dev
```

If your app listens on a port, CodePark detects it and shows a **Preview** button in the top bar.

## Inviting a collaborator

Click the **Invite** button in the editor toolbar. You get:

- A **shareable link** — sends anyone to the project with Guest (view-only) access by default
- A **session code** — a short alphanumeric code your teammate enters from their dashboard

To grant edit access, go to **Project Settings → Collaborators** and change the role.

## Saving your work

CodePark auto-saves all file changes to the persistent volume. There's no save button — every keystroke is persisted within seconds.

To push to GitHub:

```bash
git add .
git commit -m "Initial commit"
git push
```

Or use the built-in git panel in the left sidebar.

## What's next?

Now that you have a project running, explore:

- [Pair Programming](/docs/collaboration/pair-programming) — invite a teammate and code together
- [Environments](/docs/environments/overview) — customise your container runtime
- [AI Assistant](/docs/ai/overview) — get context-aware coding help
