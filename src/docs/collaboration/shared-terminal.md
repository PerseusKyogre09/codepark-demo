---
title: Shared Terminal
description: Share a terminal session with all collaborators to watch builds, deployments, and debugging together.
category: Collaboration
order: 3
icon: terminal
tags:
  - terminal
  - collaboration
  - shared
lastUpdated: 2026-07-10
draft: false
---

# Shared Terminal

By default every participant in a session has their own private terminal. You can optionally share a terminal with all session participants.

## Sharing a terminal

1. Open a terminal tab at the bottom of the editor
2. Right-click the terminal tab header
3. Select **Share with session**

The tab header gains a small **shared** indicator. All `Editor` and `Owner` participants can now type into that terminal. `Viewer` and `Guest` participants can watch but not interact.

## Unsharing

Right-click the shared terminal tab and select **Stop sharing**. The terminal reverts to private. Existing output remains visible to all participants who were watching.

## Use cases

**Watching a build together** — share the terminal, run `npm run build`, and narrate errors as they appear.

**Live deployment walkthrough** — run your deploy script while a junior developer watches and asks questions.

**Debugging a flaky test** — share the terminal while you reproduce the issue together.

**Code review with execution** — run the reviewer's suggested fix live and see the output immediately.

## Permissions

Only `Editor` and `Owner` role participants can type into a shared terminal. `Viewer` and `Guest` participants see the output stream in read-only mode.

The terminal owner (the person who created the tab) can revoke sharing at any time.

## Notes

- Shared terminals consume slightly more bandwidth than private terminals due to output broadcasting
- Output is buffered — late joiners see the last 1000 lines of history
- Shared terminals do not persist after the session ends
