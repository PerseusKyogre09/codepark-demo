---
title: Environments Overview
description: Learn how CodePark environments work, how to configure runtime settings, and how the workspace persists.
category: Environments
order: 1
icon: box
tags:
  - environments
  - containers
  - runtime
  - configuration
lastUpdated: 2026-07-10
draft: false
---

# Environments Overview

Every CodePark project runs inside a dedicated Linux container. The environment defines what is installed, which ports are exposed, and how the workspace behaves at runtime.

## Default environment

By default, new projects use the **standard CodePark image** — Ubuntu 22.04 with the following pre-installed:

- Node.js 20 LTS
- Python 3.11
- Git, curl, wget
- Common build tools (gcc, make, etc.)

## Why environments exist

The environment is what makes the workspace reproducible. Instead of relying on your local machine, CodePark gives every project the same controlled runtime so teammates see the same toolchain and command behavior.

## Where to configure it

Most environment settings live in a `codepark.toml` file at the root of the project:

```toml
[environment]
image = "python:3.12-slim"
ports = [8000, 8080]

[environment.install]
run = ["pip install -r requirements.txt"]
```

Use `codepark.toml` when you want project-specific runtime defaults. Use Project Settings for project-level behavior like ContextBase auto-scanning.

## Customising with `codepark.toml`

Place a `codepark.toml` file at the root of your project to customise the environment:

```toml
[environment]
# Use a specific base image
image = "python:3.12-slim"

# Expose these ports for preview URLs
ports = [8000, 8080]

# Commands to run after the container starts
[environment.install]
run = [
  "pip install -r requirements.txt"
]

# Environment variables (non-secret)
[environment.env]
PYTHONPATH = "src"
DEBUG = "false"
```

> **Note:** Never put secrets in `codepark.toml`. Use the **Secrets** panel in Project Settings instead. Secrets are injected as environment variables at runtime and never written to disk.

## Available base images

| Image | Runtimes |
|-------|---------|
| `codepark/standard` (default) | Node 20, Python 3.11, Go 1.22 |
| `node:20` | Node.js 20 |
| `python:3.12` | Python 3.12 |
| `rust:latest` | Rust (latest stable) |
| `golang:1.22` | Go 1.22 |
| `ubuntu:22.04` | Bare Ubuntu |

Custom Docker images (Pro) are supported if hosted on a public or authorized private registry.

## When to use environments

Use environment configuration when you need to:

- Match production more closely
- Install language-specific dependencies automatically
- Expose one or more preview ports
- Control the default base image for a project

## Resource limits

| Tier | CPU | RAM | Disk |
|------|-----|-----|------|
| Free | 0.5 vCPU | 512 MB | 1 GB |
| Pro | 2 vCPU | 4 GB | 10 GB |

Containers that exceed memory limits are automatically restarted. You'll see a notification in the editor.

## Persistent storage

Your project's file system (`/workspace`) persists across container restarts and browser closes. It is backed up daily.

The following paths are **not** persisted: `/tmp`, `/var/run`, container-level package caches (pip, npm global, etc.).

## Rebuilding the environment

If you change `codepark.toml`, open the command palette (`Ctrl+Shift+P`) and run **Rebuild Environment**. This recreates the container from scratch while preserving your `/workspace` files.

## Best practices

- Keep `codepark.toml` small and explicit.
- Pin images when you need predictable builds.
- Put startup commands in the install section instead of typing them manually every session.
- Expose only the ports you actually use.

## Common mistakes

- Storing secrets in `codepark.toml`
- Assuming package caches survive rebuilds
- Changing the base image without checking that the project still starts cleanly

## Troubleshooting

If a project starts with the wrong runtime:

- Verify the `image` field in `codepark.toml`
- Rebuild the environment after editing the file
- Confirm you are opening the correct project

If a preview URL does not appear, make sure the application is listening on one of the declared ports.

## Related docs

- [Creating Your First Project](/docs/getting-started/creating-first-project)
- [Understanding the Workspace](/docs/getting-started/understanding-workspace)
- [Runtime Selection](/docs/environments/runtime-selection)
