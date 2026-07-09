---
title: Pair Programming
description: Collaborate with teammates in real time — same editor, same terminal, same context.
category: Collaboration
order: 1
icon: users
tags:
  - collaboration
  - realtime
  - pair-programming
  - multiplayer
lastUpdated: 2026-07-10
draft: false
---

# Pair Programming

CodePark's pair programming lets you and a teammate share the same environment in real time — same editor, same terminal, same context. No screen-sharing software, no lag, no "can you push that branch" interruptions.

## Starting a session

From any project, open the editor. Click the **Invite** button in the top-right toolbar. You'll get:

- A **shareable link** — paste it into Slack, email, or wherever
- A **session code** — a short code your teammate can enter from their own dashboard

```bash
# Or invite via the CLI (coming soon)
codepark invite --project my-project --role editor
# → Session link: https://codepark.qzz.io/project/abc123/join?token=xyz
```

## What your teammate sees

When they join, they land directly in the editor. Their cursor appears as a colored pill with their name. You'll see theirs too.

Cursors fade to small dots after a moment of inactivity, so they don't distract from reading.

> **Note:** Guests (users without a CodePark account) join with view-only access by default. Upgrade their role in Project Settings to grant edit access.

## Roles in a session

Each participant has a role that controls what they can do:

| Role | Edit files | Use terminal | Manage project |
|------|-----------|--------------|---------------|
| Owner | ✓ | ✓ | ✓ |
| Editor | ✓ | ✓ | ✗ |
| Viewer | ✗ | ✗ | ✗ |
| Guest | ✗ | ✗ | ✗ |

Change roles at any time from **Project Settings → Collaborators**.

## Following a teammate

Click on any collaborator's avatar in the presence bar. Your viewport will follow their cursor and scroll position — useful for code reviews and demos.

To stop following, click their avatar again or press `Escape`.

## Shared terminal

By default, each participant gets their own independent terminal session. To share a terminal:

1. Right-click a terminal tab
2. Select **Share with session**

The terminal is now shared — all participants with `Editor` or `Owner` roles can type into it. Viewers can watch but not interact.

> **Tip:** Shared terminals are great for watching a build together, walking through a deployment, or demonstrating a bug live.

## Next steps

- [Live Cursors](/docs/collaboration/live-cursors) — understand cursor synchronization
- [Shared Terminal](/docs/collaboration/shared-terminal) — deep dive into terminal sharing
- [Permissions](/docs/collaboration/permissions) — manage roles and access
