---
title: Live Cursors
description: How cursor synchronization works in CodePark and how to customise your presence color.
category: Collaboration
order: 2
icon: mouse-pointer-2
tags:
  - cursors
  - presence
  - collaboration
lastUpdated: 2026-07-10
draft: false
---

# Live Cursors

Every collaborator in a session has a live cursor visible to all other participants. Cursors show name, selection range, and scroll position in real time.

## How it works

CodePark synchronizes editor state via **Yjs CRDTs** over a persistent WebSocket connection. Cursor positions are part of the Yjs awareness protocol — a lightweight side-channel that carries ephemeral per-user state without modifying the document.

Because it's CRDT-based, cursor positions are always consistent even when the network hiccups.

## Cursor appearance

Each collaborator gets a unique color chosen from a palette of accessible colors. The cursor renders as:

- A **blinking caret** in the editor with a colored border
- A **name pill** that appears above the caret for a few seconds, then fades
- A **selection highlight** over any text they have selected (semi-transparent, same color)
- A **small dot** when the cursor is in a file you're not currently viewing

## Customising your color

Your cursor color is set in **Settings → Appearance → Collaborator Color**. The change applies immediately to all active sessions.

## Presence bar

The presence bar in the top-right of the editor shows avatars of all current participants. Each avatar:

- Shows the participant's profile picture or initials
- Shows a colored ring matching their cursor color
- Clicking it jumps your view to their current location (follow mode)

## Performance

CodePark debounces cursor position updates to 50ms to avoid overwhelming the WebSocket. On slow connections, cursors may lag slightly but will always converge correctly.
