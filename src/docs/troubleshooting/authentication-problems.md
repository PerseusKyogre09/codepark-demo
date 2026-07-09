---
title: Authentication Problems
description: Fix sign-in, session, and access issues in CodePark.
category: Troubleshooting
order: 7
icon: shield-alert
tags:
  - troubleshooting
  - authentication
  - login
  - permissions
lastUpdated: 2026-07-10
draft: false
---

# Authentication Problems

Use this guide when sign-in fails, a session expires, or a project refuses access.

## Symptoms

- You are sent back to login
- Requests return `401 Unauthorized`
- A project opens in a waiting-room state
- GitHub import says you are not connected

## Possible causes

- Expired session cookie
- Missing login state
- GitHub connection revoked
- Project access not granted yet

## Step-by-step fixes

1. Sign in again.
2. Refresh the page.
3. Reconnect GitHub if the import flow failed.
4. Confirm the project was shared with your account.
5. Retry the action.

## Prevention tips

- Keep the browser session active while working.
- Reconnect external accounts after provider changes.
- Use the right account when joining a shared project.

## Related docs

- [API Authentication](/docs/api/authentication)
- [GitHub Integration](/docs/integrations/github-integration)
- [Permissions](/docs/collaboration/permissions)
