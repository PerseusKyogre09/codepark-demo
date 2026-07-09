---
title: Useful Commands Reference
description: Reference the workflows you can perform today without an official CodePark CLI.
category: CLI
order: 6
icon: list-checks
tags:
  - cli
  - reference
  - workflow
  - commands
lastUpdated: 2026-07-10
draft: false
---

# Useful Commands Reference

There is no official `codepark` command set yet. This reference maps common developer tasks to the supported place you perform them today.

## Project tasks

| Task | Where to do it |
|------|----------------|
| Create a project | Dashboard |
| Import a repository | GitHub integration |
| Rename a project | Project settings |
| Delete a project | Project settings or dashboard |
| Open a running project | Dashboard |

## Environment tasks

| Task | Where to do it |
|------|----------------|
| Choose a runtime | Project creation template |
| Change base image | `codepark.toml` |
| Set ports | `codepark.toml` |
| Rebuild the environment | Command palette in the editor |

## Collaboration tasks

| Task | Where to do it |
|------|----------------|
| Invite collaborators | Editor toolbar |
| Review participants | Collaboration panel |
| Persist session state | Automatic or session API |
| Check live participants | Collaboration API |

## Example workflow

```text
1. Create a project in the dashboard
2. Open it in the editor
3. Run npm install in the terminal
4. Invite a teammate from the editor toolbar
5. Rebuild the environment after changing codepark.toml
```

## Related docs

- [CLI Overview](/docs/cli/overview)
- [Creating Your First Project](/docs/getting-started/creating-first-project)
- [Persistent Storage](/docs/environments/persistent-storage)
