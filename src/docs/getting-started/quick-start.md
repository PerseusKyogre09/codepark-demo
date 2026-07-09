---
title: Quick Start
description: Create your first CodePark project and start coding in under two minutes.
category: Getting Started
order: 2
icon: zap
tags:
  - quickstart
  - setup
  - getting-started
lastUpdated: 2026-07-10
draft: false
---

# Quick Start

Get from zero to a running project in under two minutes.

## Step 1 — Create an account

Navigate to [codepark.qzz.io](https://codepark.qzz.io) and sign in with your GitHub account or email. First-time users are prompted to choose a username.

## Step 2 — Create a project

From the Dashboard, click **New Project**. Choose a template (Node.js, Python, Rust, blank, and more) or start from a GitHub repository.

```bash
# Or use the CLI (coming soon)
codepark new my-project --template node
```

Your project spins up in a dedicated Linux container. The editor opens automatically.

## Step 3 — Start coding

The editor supports:

- Full **Monaco** experience (IntelliSense, multi-cursor, keybindings)
- Integrated **terminal** — run any shell command
- **File tree** — create, rename, delete files and folders
- **AI assistant** — ask questions about your code in context

## Step 4 — Invite a collaborator

Click the **Invite** button in the top-right of the editor. Share the link with a teammate. They join instantly — no account required for view access.

Both of you will see each other's cursors, selections, and edits in real time.

## Step 5 — Run your code

Open a terminal tab and run your code normally:

```bash
# Python
python main.py

# Node.js
node index.js

# Any language installed in the container
cargo run
```

Output appears in the terminal. If your project serves a port (e.g. `localhost:3000`), CodePark exposes a preview URL automatically.

## What's next?

- [Core Concepts](/docs/getting-started/core-concepts) — understand the mental model
- [Collaboration](/docs/collaboration/pair-programming) — deep dive into multiplayer features
- [Environments](/docs/environments/overview) — customise your container
