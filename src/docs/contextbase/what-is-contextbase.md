---
title: What is ContextBase?
description: Understand ContextBase as CodePark's project understanding layer and how it supports AI and workspace intelligence.
category: ContextBase
order: 1
icon: brain
tags:
  - contextbase
  - ai
  - indexing
  - project-intelligence
lastUpdated: 2026-07-10
draft: false
---

# What is ContextBase?

ContextBase is CodePark's project understanding layer. It indexes the workspace, tracks structural relationships, and builds a durable knowledge base that other features can use.

## Why ContextBase exists

A project is more than files on disk. It has structure, dependencies, history, and decisions. ContextBase is what lets CodePark understand those things without requiring manual notes everywhere.

## What ContextBase does

ContextBase currently supports:

- Project fingerprinting
- File neighborhood lookups
- Proximity-aware search ranking
- Manual rescans
- Ongoing auto-scanning when enabled

These capabilities help the workspace answer questions such as:

- What language and framework is this project using?
- Which files are connected to this one?
- What should I inspect first for this change?

## How it fits into the product

ContextBase is the layer behind AI usefulness, but it is also useful on its own. The project can still benefit from structured indexing even before you ask the assistant a question.

## Step-by-step mental model

1. CodePark scans the workspace.
2. The project structure is fingerprinted.
3. File relationships are tracked.
4. New edits are indexed incrementally.
5. AI and project tools use that context when needed.

## Practical example

If you open a backend file, ContextBase can surface nearby files that matter:

```text
app/api/routers/projects.py
app/services/project_manager.py
app/models/project.py
```

That is much faster than manually searching the entire tree every time.

## When to rely on ContextBase

Use it when you need to:

- Understand an unfamiliar project quickly
- Find related code around the current file
- Feed the AI more accurate project context
- Keep indexing in sync as the project evolves

## Best practices

- Keep the repository structure clean.
- Use descriptive file and folder names.
- Let auto-scan run for normal development work.
- Trigger a manual scan after large structural changes.

## Warnings

> [!NOTE]
> ContextBase is not a replacement for Git history. It complements the repository by indexing the current structure and the project's ongoing evolution.

## Common mistakes

- Assuming ContextBase is only for AI chat
- Turning it off and expecting project-aware answers to stay just as accurate
- Confusing runtime session state with project knowledge

## Troubleshooting

If ContextBase appears out of date:

- Check whether auto-scan is enabled in project settings
- Trigger a manual scan
- Confirm the files are not excluded by `.gitignore`

## Related docs

- [Building a Project Knowledge Base](/docs/contextbase/building-a-project-knowledge-base)
- [AI Assistant Overview](/docs/ai/overview)
- [Understanding the Workspace](/docs/getting-started/understanding-workspace)
