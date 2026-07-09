---
title: Troubleshooting
description: Common issues and how to fix them in CodePark.
category: Troubleshooting
order: 1
icon: wrench
tags:
  - troubleshooting
  - debug
  - issues
  - faq
lastUpdated: 2026-07-10
draft: false
---

# Troubleshooting

Common issues and their solutions.

## Container won't start

**Symptoms:** The editor shows "Starting environment…" indefinitely, or shows a red error banner.

**Solutions:**

1. **Rebuild the environment** — Open the command palette (`Ctrl+Shift+P`) and run **Rebuild Environment**
2. **Check `codepark.toml`** — A syntax error in your config file can prevent the container from starting
3. **Check resource limits** — Free tier containers have 512 MB RAM. If your install script requires more, it will fail silently

## Editor not syncing

**Symptoms:** Your edits don't appear for other collaborators, or you see a "Disconnected" badge.

**Solutions:**

1. Check your internet connection
2. Hard-refresh the page (`Ctrl+Shift+R`)
3. If the issue persists, both participants should leave and rejoin the session

## Terminal not responding

**Symptoms:** The terminal appears but doesn't respond to keystrokes.

**Solutions:**

1. Click inside the terminal area to ensure it has focus
2. Send a reset signal: press `Ctrl+C` then `Enter`
3. Close the terminal tab and open a new one

## Port preview not working

**Symptoms:** Your app is running but the preview URL shows a blank page or 502 error.

**Solutions:**

1. Make sure your app is listening on `0.0.0.0`, not `127.0.0.1`
2. Ensure the port is declared in `codepark.toml` under `ports`
3. Wait ~5 seconds after starting your server — port detection has a small delay

## AI responses are irrelevant

**Symptoms:** The AI gives generic answers that don't reference your actual code.

**Solutions:**

1. Trigger a manual ContextBase re-scan from the AI panel
2. Check that ContextBase is enabled in **Settings → AI**
3. Ensure your files are not in `.gitignore` (ContextBase respects it)

## Getting more help

If you're still stuck, you can:

- Post in the community forum (link in the footer)
- File a bug report via the feedback button in the editor toolbar
- Email support at support@codepark.io (Pro tier)
