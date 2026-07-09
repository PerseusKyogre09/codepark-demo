---
title: Building a Project Knowledge Base
description: Learn how ContextBase grows a project knowledge base as files change, scan results update, and relationships deepen.
category: ContextBase
order: 2
icon: library-big
tags:
  - contextbase
  - knowledge-base
  - indexing
  - scanning
lastUpdated: 2026-07-10
draft: false
---

# Building a Project Knowledge Base

ContextBase builds a project knowledge base over time. That knowledge comes from the workspace structure, file relationships, and repeated scans of the project as it changes.

## Why build a knowledge base

The more the project changes, the more valuable it becomes to understand not just the current files, but how those files relate to the rest of the workspace.

## What gets indexed

ContextBase focuses on information that helps explain the project:

- File paths and structure
- Imports and nearby relationships
- Symbols and file neighborhoods
- Project fingerprint data
- Updates from incremental scans

## Step-by-step

1. Start with a clean project structure.
2. Add a `codepark.toml` if the project needs environment configuration.
3. Let the workspace scan the project.
4. Make normal code changes.
5. Re-run a manual scan after big reorganizations.

## Practical example

Suppose you move a route handler from one folder to another:

```text
src/routes/users.ts
src/services/users.ts
```

After the move, ContextBase should be refreshed so the relationship graph matches the new structure.

## Example workflow

```bash
git mv src/routes/users.ts src/http/users.ts
```

Then trigger a manual scan from the workspace tools if the project changed substantially.

## Best practices

- Refactor in smaller steps so indexing stays easier to follow.
- Keep imports tidy; they are part of the project knowledge graph.
- Trigger rescans after large folder moves or branch checkouts.
- Let the project stabilize before asking the AI to summarize it.

## Warnings

> [!WARNING]
> Do not expect a knowledge base to be accurate if the workspace has not been scanned after a large structural change.

## Common mistakes

- Renaming many files and forgetting to refresh the project context
- Treating a manual scan as a substitute for a well-organized codebase
- Expecting ContextBase to preserve deleted runtime state

## Troubleshooting

If the knowledge base seems incomplete:

- Confirm the project was scanned after the latest changes
- Make sure the files are not ignored by `.gitignore`
- Check whether ContextBase auto-scanning is enabled

If a specific file does not show useful relationships, verify that it actually imports or is imported by nearby code.

## Related docs

- [What is ContextBase?](/docs/contextbase/what-is-contextbase)
- [Working with AI in the Editor](/docs/ai/working-with-ai-in-the-editor)
- [Runtime Selection](/docs/environments/runtime-selection)
