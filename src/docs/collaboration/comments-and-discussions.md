---
title: Comments and Discussions
description: Use chat, code comments, and discussion habits to keep collaborative work clear and reviewable.
category: Collaboration
order: 4
icon: message-square-text
tags:
  - comments
  - chat
  - discussion
  - review
lastUpdated: 2026-07-10
draft: false
---

# Comments and Discussions

CodePark gives teams a few ways to talk while they work. Use the right channel for the kind of discussion you are having.

## Why this matters

Good collaboration is not just about typing in the same file. Teams also need a place to explain intent, ask questions, and document decisions while the code is still changing.

## Use chat for fast coordination

The editor includes a chat panel for short, session-level communication.

Use chat when you need to:

- Ask whether someone is changing a file
- Explain what command you are about to run
- Call out a temporary issue in the workspace
- Confirm that everyone sees the same state

```bash
# Example message you might send in chat
Working on the auth flow now. Please avoid editing src/auth/ until I finish the refactor.
```

## Use code comments for code-level notes

Code comments belong next to the code they describe. They are best for:

- Explaining non-obvious logic
- Marking temporary work
- Leaving notes for the next person who opens the file

```ts
// Keep the retry delay short so the UI stays responsive during reconnects.
const retryDelayMs = 250
```

## Use documentation or release notes for lasting decisions

If a discussion matters after the session ends, move it into a durable place:

- Project docs
- A README update
- Release notes
- A changelog entry

That keeps ephemeral chat from becoming the only record of an important decision.

## Practical workflow

1. Use chat to coordinate the live session.
2. Add code comments only where the code needs explanation.
3. Record long-lived decisions in project documentation.
4. Remove temporary comments once the code no longer needs them.

> [!TIP]
> If a discussion keeps repeating, it probably belongs in a document instead of the chat panel.

## Best practices

- Keep chat messages short and specific.
- Write comments that explain why, not just what.
- Delete stale temporary notes after the work lands.
- Prefer durable documentation for team decisions.

## Common mistakes

- Leaving implementation notes in chat and assuming everyone will remember them
- Writing comments that restate obvious code
- Using a comment to justify code that should be simplified instead

## Troubleshooting

If teammates miss a discussion:

- Summarize the conclusion in one place
- Add a short comment or doc note near the code
- Link the discussion back to the project page or task

## Related guides

- [Inviting Teammates](/docs/collaboration/inviting-teammates)
- [Live Cursors](/docs/collaboration/live-cursors)
- [Project Settings](/docs/projects/project-settings)
