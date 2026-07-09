---
title: Persistent Storage
description: Understand which workspace data survives restarts and which files are intentionally temporary.
category: Environments
order: 5
icon: database
tags:
  - storage
  - persistence
  - workspace
  - filesystem
lastUpdated: 2026-07-10
draft: false
---

# Persistent Storage

Persistent storage is what keeps your workspace useful after a browser refresh, container restart, or reconnect.

## What persists

The project file system under `/workspace` persists across restarts and browser closes. That means your source code, project files, and other workspace content remain available the next time you open the project.

## What does not persist

Temporary locations and container-level caches do not survive:

- `/tmp`
- `/var/run`
- Global package caches

```bash
ls /tmp
```

Use temporary paths only for short-lived work.

## Why this matters

Persistent storage lets the workspace behave like a real project rather than a disposable container. You can stop work, come back later, and continue from the same files.

## Step-by-step

1. Save files in the project workspace.
2. Run your app or tests as usual.
3. Close the tab or let the session reconnect.
4. Reopen the project.
5. Confirm the files are still there.

## Practical example

If you generate a new config file in the workspace:

```bash
printf 'PORT=3000\n' > .env.local
```

The file remains in the workspace because it was created under the persisted project directory.

## When to rely on persistence

Use persistent storage for:

- Source code
- Project configuration
- Test fixtures
- Generated assets that belong in the project

## Best practices

- Keep long-lived work under the project root.
- Treat `/tmp` as disposable.
- Recreate build artifacts when needed instead of assuming caches will survive.
- Commit important generated files if your workflow depends on them.

## Common mistakes

- Assuming a temporary build cache will still exist after reconnecting
- Writing project data outside the workspace path
- Confusing a browser refresh with data loss

## Troubleshooting

If something disappears after a reconnect:

- Check whether the file was created in `/tmp` or another temporary path
- Confirm that the file was actually saved in the workspace
- Reopen the project and look at the persisted project tree

## Related docs

- [Understanding the Workspace](/docs/getting-started/understanding-workspace)
- [Creating Your First Environment](/docs/environments/creating-first-environment)
- [Managing Projects](/docs/projects/managing-projects)
