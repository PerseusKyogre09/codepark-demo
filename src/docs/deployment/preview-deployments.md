---
title: Preview Deployments
description: Use CodePark preview URLs to test applications while they are still running in the workspace.
category: Deployment
order: 2
icon: external-link
tags:
  - deployment
  - preview
  - ports
  - testing
lastUpdated: 2026-07-10
draft: false
---

# Preview Deployments

Preview deployments in CodePark are the live, session-scoped previews exposed from your running development server.

## Why they exist

They let you check your app in a browser without leaving the workspace or wiring up an external deployment.

## How previews work

1. Your app listens on a declared port.
2. CodePark detects the running port.
3. The editor exposes a preview URL through the session proxy.
4. Authenticated collaborators can open the preview while the session is active.

The backend currently allows preview proxying on common development ports such as `3000`, `5173`, `8000`, and `8080`.

## Step-by-step

1. Declare the port in `codepark.toml`.
2. Start your dev server in the terminal.
3. Wait for the preview button or URL to appear.
4. Open the preview in the browser.
5. Share the session with collaborators if needed.

```toml
[environment]
ports = [3000]
```

```bash
npm run dev
```

## Practical example

If you run a Vite app:

```bash
npm run dev -- --host 0.0.0.0 --port 5173
```

That matches the ports CodePark already proxies.

## Best practices

- Bind your server to `0.0.0.0`, not `127.0.0.1`.
- Declare every port you want to preview.
- Keep one preview port per app entrypoint when possible.

## Common mistakes

- Starting the app on a port that is not declared
- Binding only to localhost
- Confusing a preview URL with a production URL

## Troubleshooting

If the preview does not open:

- Check the dev server logs
- Confirm the port is allowed
- Wait a few seconds for detection
- Make sure the session is still active

## Related docs

- [Deployment Overview](/docs/deployment/overview)
- [Environment Configuration](/docs/deployment/environment-configuration)
- [Common Deployment Issues](/docs/deployment/common-deployment-issues)
