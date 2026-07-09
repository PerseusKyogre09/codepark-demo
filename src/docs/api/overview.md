---
title: API Overview
description: Learn how the CodePark REST API is organized and which resources are available today.
category: API
order: 1
icon: code-2
tags:
  - api
  - rest
  - authentication
  - endpoints
lastUpdated: 2026-07-10
draft: false
---

# API Overview

CodePark provides a REST API for programmatic access to your projects, sessions, collaboration state, and integrations.

## Base URL

```
https://codepark.qzz.io/api
```

Most endpoints require authentication. The main exceptions are login and OAuth redirect endpoints that start an auth flow.

## Authentication

Use the `cp_auth` session cookie for browser-authenticated requests, or a short-lived WebSocket token for session transport. When the frontend calls the REST API, it usually sends the authenticated session automatically.

```bash
curl https://codepark.qzz.io/api/projects \
  --cookie "cp_auth=YOUR_SESSION_COOKIE"
```

There is no public API key management page in the current product.

## What the API is for

The API exists to support project management, project creation, collaborator management, GitHub integration, and real-time session plumbing.

## Response format

Most endpoints return JSON. Errors also return JSON with a `detail` field from FastAPI.

Example:

```json
{
  "detail": "Project not found"
}
```

## Main API areas

### Projects

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/projects` | List all your projects |
| `POST` | `/projects/create` | Create a new project and runtime session |
| `GET` | `/projects/:id` | Get project details |
| `POST` | `/projects/:id/open` | Open or resolve a live session |
| `POST` | `/projects/:id/access-requests` | Request access to a project |
| `DELETE` | `/projects/:id` | Delete a project |

### Sessions

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/sessions/:session_id/participants` | List live participants |
| `POST` | `/sessions/:session_id/persist` | Persist session state |
| `POST` | `/sessions/:session_id/heartbeat` | Refresh session activity |

### GitHub

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/github/status` | Check GitHub connection status |
| `GET` | `/github/login` | Start the GitHub OAuth flow |
| `GET` | `/github/callback` | Finish GitHub OAuth |
| `GET` | `/github/repos` | List connected GitHub repositories |
| `POST` | `/github/import` | Import a GitHub repository |
| `DELETE` | `/github/disconnect` | Disconnect GitHub |

## Related docs

- [API Authentication](/docs/api/authentication)
- [Projects API](/docs/api/projects-api)
- [Collaboration API](/docs/api/collaboration-api)
- [Error Handling](/docs/api/error-handling)
