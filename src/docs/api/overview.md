---
title: API Overview
description: The CodePark REST API — authentication, rate limits, and available endpoints.
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

CodePark provides a REST API for programmatic access to your projects, sessions, and user data.

## Base URL

```
https://codepark.qzz.io/api
```

All endpoints require authentication unless explicitly marked as public.

## Authentication

Use **Bearer token** authentication. Obtain a token from **Settings → API Keys**.

```bash
curl https://codepark.qzz.io/api/projects \
  -H "Authorization: Bearer YOUR_API_KEY"
```

API keys can be scoped to specific permissions (read-only, read-write, admin).

## Rate limits

| Tier | Requests/minute | Requests/hour |
|------|----------------|---------------|
| Free | 30 | 500 |
| Pro | 200 | 5000 |

Rate limit headers are included in every response:

```
X-RateLimit-Limit: 200
X-RateLimit-Remaining: 195
X-RateLimit-Reset: 1720000000
```

## Response format

All responses are JSON. Errors follow the format:

```json
{
  "error": "not_found",
  "message": "Project with id 'abc123' not found",
  "status": 404
}
```

## Key endpoints

### Projects

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/projects` | List all your projects |
| `POST` | `/projects` | Create a new project |
| `GET` | `/projects/:id` | Get project details |
| `DELETE` | `/projects/:id` | Delete a project |

### Sessions

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/projects/:id/sessions` | List active sessions |
| `POST` | `/projects/:id/sessions` | Start a new session |

### Files

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/projects/:id/files` | List files in workspace |
| `GET` | `/projects/:id/files/:path` | Read a file |
| `PUT` | `/projects/:id/files/:path` | Write a file |

Full API reference with request/response schemas is coming soon.

## SDKs

Official SDKs are planned for Node.js and Python. Until then, the REST API works with any HTTP client.

## Webhooks

Webhook support (project events, session events) is on the roadmap for Q3 2026.
