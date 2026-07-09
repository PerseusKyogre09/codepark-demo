---
title: Environments Overview
description: Learn how CodePark environments work and how to configure your container runtime.
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

Every CodePark project runs inside a dedicated Linux container. The environment defines what's installed, what ports are exposed, and how resources are allocated.

## Default environment

By default, new projects use the **standard CodePark image** — Ubuntu 22.04 with the following pre-installed:

- Node.js 20 LTS
- Python 3.11
- Git, curl, wget
- Common build tools (gcc, make, etc.)

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
