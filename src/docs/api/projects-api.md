---
title: Projects API
description: Reference the project lifecycle endpoints used to create, open, list, rename, and delete projects.
category: API
order: 3
icon: folder-kanban
tags:
  - api
  - projects
  - collaboration
  - lifecycle
lastUpdated: 2026-07-10
draft: false
---

# Projects API

The Projects API manages the permanent project record. It is the primary API you use for lifecycle operations.

## List projects

- **Method:** `GET`
- **Endpoint:** `/api/projects`
- **Auth:** Required

### Purpose

Returns projects the current user owns or collaborates on.

### Response

```json
[
  {
    "id": "proj_123",
    "name": "Design System",
    "description": "Shared component library",
    "role": "owner",
    "branch": "main"
  }
]
```

## Create project

- **Method:** `POST`
- **Endpoint:** `/api/projects/create`
- **Auth:** Required

### Purpose

Creates a new project and its initial runtime session.

### Response

```json
{
  "project_id": "proj_123",
  "session_id": "sess_abc"
}
```

### Example

```bash
curl -X POST https://codepark.qzz.io/api/projects/create \
  --cookie "cp_auth=YOUR_SESSION_COOKIE"
```

## Open project

- **Method:** `POST`
- **Endpoint:** `/api/projects/{project_id}/open`
- **Auth:** Required

### Purpose

Resolves or creates the active runtime session for a project.

### Example response

```json
{
  "project_id": "proj_123",
  "session_id": "sess_abc",
  "owner_id": "user_1"
}
```

## Rename project

The frontend can update the project name and description through the same project save flow.

### Example request body

```json
{
  "name": "payments-api",
  "description": "Shared backend for billing"
}
```

## Delete project

- **Method:** `DELETE`
- **Endpoint:** `/api/projects/{project_id}`
- **Auth:** Required

### Purpose

Deletes the project and invalidates live runtime state tied to it.

### Common errors

- `404 Not Found` if the project does not exist
- `403 Forbidden` if you are not the owner

## Access requests

Projects also support access requests for non-collaborators:

- `POST /api/projects/{project_id}/access-requests`
- `POST /api/projects/{project_id}/access-requests/{requester_id}/respond`

These endpoints support the waiting-room flow used in the editor.

## Best practices

- Create the project before importing collaborators.
- Use the open endpoint to enter the current session rather than guessing session IDs.
- Delete projects only after confirming you do not need the runtime state.

## Common mistakes

- Confusing project IDs with session IDs
- Treating the project as ephemeral when the project record is the durable resource
- Deleting a project while collaborators are still active in it

## Related docs

- [API Overview](/docs/api/overview)
- [Collaboration API](/docs/api/collaboration-api)
- [Creating Your First Project](/docs/getting-started/creating-first-project)
