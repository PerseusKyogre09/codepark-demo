---
title: Live Cursors
description: Understand how live cursors, selections, and presence stay in sync during collaborative editing.
category: Collaboration
order: 2
icon: mouse-pointer-2
tags:
  - cursors
  - presence
  - collaboration
  - yjs
lastUpdated: 2026-07-10
draft: false
---

# Live Cursors

Live cursors show where each collaborator is working in the editor. They make it easier to follow along, avoid stepping on each other, and understand who is editing what.

## How it works

CodePark synchronizes editor state via **Yjs CRDTs** over a persistent WebSocket connection. Cursor positions are part of the Yjs awareness protocol, which carries ephemeral per-user state without modifying the document.

Because it's CRDT-based, cursor positions are always consistent even when the network hiccups.

## Cursor appearance

Each collaborator gets a unique color chosen from a palette of accessible colors. The cursor renders as:

- A **blinking caret** in the editor with a colored border
- A **name pill** that appears above the caret for a few seconds, then fades
- A **selection highlight** over any text they have selected (semi-transparent, same color)
- A **small dot** when the cursor is in a file you're not currently viewing

## What you see in practice

When two people edit the same file, you may see:

- A live caret moving as the other person types
- Their selected text highlighted in the same collaborator color
- Their name in the presence area while they are online

This is especially useful during reviews, onboarding, and debugging sessions where it matters to know who is touching which part of the file.

## Customize your color

Your cursor color is set in **Settings → Appearance → Collaborator Color**. The change applies immediately to all active sessions.

## Presence bar

The presence bar in the top-right of the editor shows avatars of all current participants. Each avatar:

- Shows the participant's profile picture or initials
- Shows a colored ring matching their cursor color
- Clicking it jumps your view to their current location (follow mode)

## Good habits

- Use following mode when someone is walking you through a change
- Pause before editing if another collaborator is clearly active in the same block
- Keep comments in the chat panel when the cursor is not enough to explain intent

## Performance

CodePark debounces cursor position updates to reduce noise on the websocket. On slow connections, cursors may lag slightly but will always converge correctly.

## Common mistakes

- Treating a live cursor as a promise that another collaborator will not move the file next
- Following someone and forgetting to stop following when you resume independent work
- Using a cursor color change as a substitute for access control

## Troubleshooting

If another collaborator's cursor does not appear:

- Check whether you are both in the same live session
- Confirm that the collaborator is connected
- Wait a moment for presence data to sync after joining

## See also

- [Inviting Teammates](/docs/collaboration/inviting-teammates)
- [Comments and Discussions](/docs/collaboration/comments-and-discussions)
- [Permissions](/docs/collaboration/permissions)
