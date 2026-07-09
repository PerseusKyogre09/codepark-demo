---
title: Connection Problems
description: Recover from websocket, network, or preview connection problems in CodePark.
category: Troubleshooting
order: 6
icon: wifi-off
tags:
  - troubleshooting
  - connection
  - websocket
  - preview
lastUpdated: 2026-07-10
draft: false
---

# Connection Problems

Use this page when CodePark feels disconnected, slow to sync, or unable to reach the session backend.

## Symptoms

- "Disconnected" appears in the editor
- Preview requests fail
- Collaboration lags behind
- Heartbeats or session updates stop arriving

## Possible causes

- Temporary network loss
- Browser tab sleep or throttling
- Session reconnect in progress
- Corporate proxy or firewall interference

## Step-by-step fixes

1. Check whether the browser has internet access.
2. Hard refresh the tab.
3. Close and reopen the project if the session is stale.
4. Try another network if your current one filters websocket traffic.

## Prevention tips

- Keep the browser tab active during long editing sessions.
- Avoid aggressive sleep settings while collaborating live.
- Use a stable network for preview-heavy workflows.

## Related docs

- [Collaboration Issues](/docs/troubleshooting/collaboration-issues)
- [Preview Deployments](/docs/deployment/preview-deployments)
- [API Authentication](/docs/api/authentication)
