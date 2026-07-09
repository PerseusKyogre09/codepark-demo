---
title: API Authentication
description: Authenticate REST and realtime requests against the CodePark backend.
category: API
order: 2
icon: shield
tags:
  - api
  - authentication
  - cookies
  - websocket
lastUpdated: 2026-07-10
draft: false
---

# API Authentication

CodePark uses browser session authentication for most requests. The backend issues a `cp_auth` HttpOnly cookie after sign-in, and the frontend reuses that session for authenticated API calls.

## How it works

1. You sign in through Firebase or another supported login flow.
2. The backend exchanges that login for a `cp_auth` cookie.
3. REST requests include the cookie automatically when made from the app.
4. WebSocket connections can request a short-lived token for session access.

## Browser requests

For browser-based requests, the session cookie is enough:

```bash
curl https://codepark.qzz.io/api/projects \
  --cookie "cp_auth=YOUR_SESSION_COOKIE"
```

## WebSocket token flow

For session-connected realtime features, the backend can issue a short-lived WebSocket token:

```http
POST /api/auth/ws-token
Content-Type: application/json

{
  "session_id": "sess_123"
}
```

Example response:

```json
{
  "token": "eyJhbGciOi..."
}
```

The token is scoped to the session and is intended for realtime transport, not long-term storage.

## GitHub token support

If you connect GitHub, the backend stores the GitHub OAuth token on your user record so the integration can list repositories and import them into CodePark.

```http
POST /api/auth/github-token
Content-Type: application/json

{
  "github_token": "gho_xxx"
}
```

## When to use which credential

- Use the `cp_auth` cookie for browser and REST requests.
- Use the WebSocket token for session transport.
- Use GitHub OAuth only for GitHub integration.

## Best practices

- Treat the `cp_auth` cookie as private.
- Keep WebSocket tokens short-lived.
- Reconnect GitHub when repo listing returns an auth error.

## Common mistakes

- Trying to use a WebSocket token as a long-lived API key
- Assuming the backend exposes public API keys
- Manually setting cookie values in client code outside the normal login flow

## Troubleshooting

If a request returns `401 Unauthorized`:

- Confirm you are signed in
- Check that the `cp_auth` cookie is being sent
- Re-authenticate if the session expired

If GitHub requests fail with an auth error, disconnect and reconnect the GitHub account.

## Related docs

- [API Overview](/docs/api/overview)
- [GitHub Integration](/docs/integrations/github-integration)
- [Collaboration API](/docs/api/collaboration-api)
