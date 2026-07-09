---
title: Runtime Selection
description: Choose the base image and language runtime that best matches your project.
category: Environments
order: 3
icon: cpu
tags:
  - runtime
  - image
  - node
  - python
lastUpdated: 2026-07-10
draft: false
---

# Runtime Selection

Runtime selection decides which base container image CodePark uses for a project. It is one of the most important environment choices because it shapes the tools, package managers, and system libraries available in the workspace.

## Why runtime selection matters

The wrong runtime creates avoidable friction. A Node app needs the right Node version. A Python API may need a slim image with the correct interpreter. A systems project may want a Rust or Go base image.

## Choose a runtime

1. Open or create the project.
2. Add or edit `codepark.toml`.
3. Set the `environment.image` value.
4. Rebuild the environment.
5. Verify the runtime from the terminal.

```toml
[environment]
image = "node:20"
```

```bash
node --version
```

## Common runtime choices

| Project type | Suggested image |
|--------------|-----------------|
| Frontend app | `node:20` |
| Python API | `python:3.12-slim` |
| Rust service | `rust:latest` |
| Go service | `golang:1.22` |
| Minimal Linux setup | `ubuntu:22.04` |

## When to use a custom image

Use a custom image when the project needs tools that are not part of the default runtime.

Examples:

- System packages for native extensions
- A pinned compiler toolchain
- A custom build environment for a monorepo

> [!WARNING]
> A custom image can make the workspace less portable if other collaborators do not have access to the same registry or package source.

## Practical example

If your React project needs a consistent Node version:

```toml
[environment]
image = "node:20"
ports = [3000]
```

Then confirm the version in the terminal:

```bash
node --version
# v20.x.x
```

## Best practices

- Match the runtime to production when possible.
- Pin versions when repeatability matters.
- Prefer a simple image unless you need custom system packages.
- Rebuild after changing the image.

## Common mistakes

- Picking an image just because it is familiar
- Mixing runtime versions across team members
- Forgetting that a rebuild is required after a runtime change

## Troubleshooting

If the runtime seems unchanged after editing `codepark.toml`:

- Rebuild the environment
- Confirm the file was saved at the project root
- Check the terminal output for the image the workspace actually used

## Related docs

- [Creating Your First Environment](/docs/environments/creating-first-environment)
- [Environment Variables](/docs/environments/environment-variables)
- [Persistent Storage](/docs/environments/persistent-storage)
