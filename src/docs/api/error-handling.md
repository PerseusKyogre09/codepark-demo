---
title: Error Handling
description: Understand the common HTTP errors and response patterns used by the CodePark API.
category: API
order: 5
icon: triangle-alert
tags:
  - api
  - errors
  - http
  - troubleshooting
lastUpdated: 2026-07-10
draft: false
---

# Error Handling

CodePark APIs follow standard HTTP status codes and return JSON error bodies.

## Error shape

Most errors return a `detail` field:

```json
{
  "detail": "Project not found"
}
```

## Common status codes

| Status | Meaning |
|--------|---------|
| `400` | Bad request or invalid input |
| `401` | Missing or invalid authentication |
| `403` | Authenticated, but not allowed |
| `404` | Resource not found |
| `409` | Conflict with existing state |
| `500` | Server error |
| `502` | Upstream service failure |
| `503` | Temporary service unavailability |

## Example

```http
GET /api/projects/proj_123/open
```

Possible error response:

```json
{
  "detail": "Project not found"
}
```

## GitHub-related errors

When the GitHub integration fails, the backend may return:

- `GitHub account not connected`
- `GitHub authentication failed. Please reconnect.`
- `Failed to communicate with GitHub API`

## Session-related errors

Realtime session endpoints can return:

- `Session not found`
- `Session not active`
- `Forbidden: You are not a collaborator in this session`

## Best practices

- Check the status code before parsing the body.
- Surface the server error message in developer tools or logs.
- Retry only when the failure is clearly transient.

## Common mistakes

- Assuming all failures are `500` errors
- Ignoring `403` and retrying without fixing permissions
- Treating a transient `503` as a permanent failure

## Troubleshooting

If you receive a `401`:

- Confirm you are signed in
- Confirm the session cookie is present

If you receive a `403`:

- Check your project role
- Confirm the session or project is actually shared with you

## Related docs

- [API Overview](/docs/api/overview)
- [API Authentication](/docs/api/authentication)
- [Projects API](/docs/api/projects-api)
