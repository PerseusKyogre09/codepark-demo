---
title: Collaboration API
description: Reference the endpoints that expose live participants, session persistence, and access flows.
category: API
order: 4
icon: users
tags:
  - api
  - collaboration
  - sessions
  - presence
lastUpdated: 2026-07-10
draft: false
---

# Collaboration API

The Collaboration API exposes the live session state that powers the editor experience.

## Session participants

- **Method:** `GET`
- **Endpoint:** `/api/sessions/{session_id}/participants`
- **Auth:** Required

### Purpose

Returns the current live participants in a session.

### Response

```json
[
  {
    "id": "user_1",
    "name": "Avery",
    "handle": "avery",
    "color": "#4F46E5",
    "role": "owner"
  }
]
```

## Persist session files

- **Method:** `POST`
- **Endpoint:** `/api/sessions/{session_id}/persist`
- **Auth:** Required

### Purpose

Persists the current in-memory session state back to the project record.

### Example response

```json
{
  "success": true
}
```

If persistence happens too frequently, the backend may return a throttled success response.

## Heartbeat

- **Method:** `POST`
- **Endpoint:** `/api/sessions/{session_id}/heartbeat`
- **Auth:** Required

### Purpose

Refreshes session activity so the workspace stays alive during editing.

### Request body

```json
{
  "tab_id": "editor-tab-1"
}
```

### Response

```json
{
  "success": true
}
```

## Access flow

For non-collaborators, the project router supports:

- Access requests
- Request responses
- Waiting-room approval

That flow is project-scoped, not session-scoped.

## Best practices

- Use participants to power live presence indicators.
- Persist after major session changes instead of every keystroke.
- Keep the heartbeat active during long sessions.

## Common mistakes

- Polling session state as if it were the durable project record
- Using the collaboration API to manage project metadata
- Assuming the session persists forever without heartbeats

## Related docs

- [API Overview](/docs/api/overview)
- [Projects API](/docs/api/projects-api)
- [Live Cursors](/docs/collaboration/live-cursors)
