---
title: Core Concepts
description: Understand the key mental models behind CodePark — projects, sessions, environments, and collaboration.
category: Getting Started
order: 3
icon: layers
tags:
  - concepts
  - architecture
  - sessions
  - environments
lastUpdated: 2026-07-10
draft: false
---

# Core Concepts

Understanding these four concepts makes everything else in CodePark click.

## Projects

A **project** is a persistent workspace tied to your account. It includes:

- A dedicated Linux container with your chosen runtime pre-installed
- A persistent file system that survives browser closes and container restarts
- A git repository (optional, linkable to GitHub)
- A set of collaborators with defined roles

Projects live under your account or a team. You can have multiple projects, each with independent environments.

## Sessions

A **session** is a live, active connection to a project. When you open a project in the editor, a session starts. Sessions are ephemeral — they represent the live state of who is connected and what is happening right now.

Key properties of sessions:

- Multiple users can join the same session simultaneously
- Sessions carry a **presence** map — who is online, which file they're viewing, where their cursor is
- Sessions can share terminals (opt-in per terminal tab)
- Sessions expire after a configurable idle timeout (Free: 30 min, Pro: 4 hours)

## Environments

An **environment** is the container runtime attached to a project. It defines:

- The base operating system (Ubuntu 22.04)
- Pre-installed language runtimes (Node.js, Python, Rust, Go, Java, etc.)
- Available system packages
- Resource limits (CPU, RAM, disk)

Environments are configured via a `codepark.toml` file at the root of your project.

```toml
[environment]
image = "node:20"
ports = [3000, 8080]

[environment.install]
run = ["npm install"]
```

## Collaboration

CodePark uses **Yjs CRDTs** under the hood to synchronize editor state between participants. This means:

- No "last write wins" conflicts
- Offline edits are merged automatically on reconnect
- Every edit is attributed to the user who made it

Collaboration roles control what each participant can do:

| Role | Can view | Can edit | Can run terminal | Can manage project |
|------|----------|----------|-----------------|-------------------|
| Owner | ✓ | ✓ | ✓ | ✓ |
| Editor | ✓ | ✓ | ✓ | ✗ |
| Viewer | ✓ | ✗ | ✗ | ✗ |
| Guest | ✓ | ✗ | ✗ | ✗ |

Guests are users who join via a share link without an account.

## ContextBase

**ContextBase** is CodePark's project-aware AI index. It automatically scans your project files and builds a semantic index, allowing the AI assistant to answer questions about your specific codebase — not just generic programming questions.

ContextBase is opt-in and respects your `.gitignore`. It never sends your code to third parties without your explicit opt-in.
