---
title: AI Assistant Not Responding
description: Fix AI panel issues when the assistant is slow, generic, or appears unavailable.
category: Troubleshooting
order: 4
icon: bot
tags:
  - troubleshooting
  - ai
  - contextbase
  - assistant
lastUpdated: 2026-07-10
draft: false
---

# AI Assistant Not Responding

This guide covers the common cases where the AI panel is slow, generic, or not helping with the current project.

## Symptoms

- The AI panel returns vague answers
- Responses do not reference your code
- The panel feels stuck or outdated

## Possible causes

- ContextBase is stale
- The file you are asking about has not been scanned yet
- The workspace is still syncing
- The prompt is too broad

## Step-by-step fixes

1. Ask a narrower question with a file or function name.
2. Trigger a manual ContextBase scan if the project structure changed.
3. Wait for the workspace to finish syncing.
4. Try again with a direct prompt.

```text
Where is authentication configured in this project?
```

## Prevention tips

- Keep the project structure clean.
- Re-scan after major refactors.
- Ask one question at a time for complex topics.

## Related docs

- [AI Assistant Overview](/docs/ai/overview)
- [Working with AI in the Editor](/docs/ai/working-with-ai-in-the-editor)
- [What is ContextBase?](/docs/contextbase/what-is-contextbase)
