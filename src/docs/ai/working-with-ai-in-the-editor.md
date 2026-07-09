---
title: Working with AI in the Editor
description: Use the AI panel and editor workflow effectively when asking CodePark for help.
category: AI
order: 2
icon: message-square-code
tags:
  - ai
  - editor
  - workflow
  - productivity
lastUpdated: 2026-07-10
draft: false
---

# Working with AI in the Editor

The AI tools in CodePark are most useful when they are paired with a real workspace. Use them to ask about code, draft changes, and validate your understanding while you stay inside the editor.

## What this page covers

This guide focuses on the practical workflow of using AI while you work, not on model internals.

## Open the AI panel

1. Open a project in the editor.
2. Click the AI panel in the sidebar.
3. Ask a direct question about the code or workflow.
4. Refine the answer with follow-up questions if needed.

## Ask good questions

Good prompts are specific and anchored to the project:

- "What does this service do?"
- "Where is this request validated?"
- "What files need to change to add a new route?"
- "Can you explain this error message?"

Avoid vague prompts like:

- "Fix it"
- "What is wrong?"
- "Explain everything"

## Practical examples

Use AI to narrow down work before you edit code:

```text
Where is authentication configured in this project?
```

```text
I am seeing a 500 error in the API. What files should I inspect first?
```

```text
Can you summarize the files changed in the last refactor?
```

If you want to keep the response structured, ask for a checklist:

```text
Show me the safest steps to add a new environment variable without breaking the app.
```

## When to use AI in the editor

Use it when you need to:

- Understand unfamiliar code
- Trace a call path
- Compare two implementation options
- Draft a first pass before manual review

## Best practices

- Ask one question at a time when the topic is complex.
- Include file names or function names when you know them.
- Verify suggestions against the actual code before applying them.
- Use AI for acceleration, not as a substitute for review.

> [!TIP]
> The best AI answers usually come from questions that already know the project name, file path, or feature area.

## Warnings

> [!WARNING]
> AI suggestions can be wrong or incomplete. Treat them as a starting point and confirm the result in the editor or terminal.

## Common mistakes

- Asking AI to guess code it has not seen
- Applying changes without testing them
- Starting with a broad question when a targeted one would do

## Troubleshooting

If the AI response seems generic:

- Ask a more specific question
- Mention the file or feature you are looking at
- Make sure the project has enough indexed context available

If the AI panel appears unhelpful after a major refactor, trigger a context refresh from the AI or ContextBase tools if available in your workspace.

## Related docs

- [AI Assistant Overview](/docs/ai/overview)
- [What is ContextBase?](/docs/contextbase/what-is-contextbase)
- [Understanding the Workspace](/docs/getting-started/understanding-workspace)
