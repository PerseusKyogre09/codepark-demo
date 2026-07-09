---
title: Creating Your First Environment
description: Set up a project environment for the first time with a `codepark.toml` file and a supported base image.
category: Environments
order: 2
icon: plus-square
tags:
  - environment
  - setup
  - codepark.toml
  - runtime
lastUpdated: 2026-07-10
draft: false
---

# Creating Your First Environment

A project environment is the runtime that powers your workspace. Creating one means choosing the base image, install commands, exposed ports, and any non-secret environment variables your project needs.

## Why this matters

The environment is what makes a project reproducible for your whole team. If the runtime is described in the project, anyone who opens it gets the same setup.

## Start with `codepark.toml`

Create a `codepark.toml` file at the root of the project:

```toml
[environment]
image = "node:20"
ports = [3000]

[environment.install]
run = ["npm install"]

[environment.env]
NODE_ENV = "development"
```

## Step-by-step

1. Open your project in CodePark.
2. Add `codepark.toml` at the repository root.
3. Choose a base image that matches the app you are building.
4. Add install commands for the project dependencies.
5. Declare any ports your app listens on.
6. Rebuild the environment from the command palette.

> [!IMPORTANT]
> Environment variables in `codepark.toml` are for non-secret configuration. Do not place API keys, tokens, or passwords in the file.

## Practical example

If you are building a small Python API:

```toml
[environment]
image = "python:3.12-slim"
ports = [8000]

[environment.install]
run = ["pip install -r requirements.txt"]

[environment.env]
PYTHONUNBUFFERED = "1"
```

Then in the terminal:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## When to use this

Create a fresh environment when:

- You are starting a new project from scratch
- You know the language and runtime in advance
- You want the setup to be reproducible for teammates

## Best practices

- Pick the smallest image that still supports your stack.
- Keep install commands deterministic.
- Expose only the ports your app actually needs.
- Rebuild after changing runtime settings.

## Common mistakes

- Using a generic image when the project already has a known stack
- Forgetting to expose the app port
- Putting installation steps in a README instead of the environment file

## Troubleshooting

If the project boots into the wrong image:

- Check the `image` value in `codepark.toml`
- Rebuild the environment
- Make sure the file is at the repository root

If dependencies are missing, verify the install commands in the `environment.install` section.

## Related docs

- [Runtime Selection](/docs/environments/runtime-selection)
- [Environment Variables](/docs/environments/environment-variables)
- [Persistent Storage](/docs/environments/persistent-storage)
