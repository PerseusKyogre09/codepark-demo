---
title: Environment Won't Start
description: Fix a workspace that stays stuck on startup or fails during environment provisioning.
category: Troubleshooting
order: 2
icon: cpu
tags:
  - troubleshooting
  - environment
  - startup
  - runtime
lastUpdated: 2026-07-10
draft: false
---

# Environment Won't Start

This page helps when the workspace never reaches the editor or stops at a startup banner.

## Symptoms

- "Starting environment..." never finishes
- The editor never loads
- A runtime error appears during provisioning

## Possible causes

- Invalid `codepark.toml`
- Wrong runtime image
- Missing dependencies in the install step
- Resource limits exceeded during startup

## Step-by-step fixes

1. Open `codepark.toml` and check for syntax errors.
2. Confirm the runtime image matches the project stack.
3. Reduce or simplify the install command.
4. Rebuild the environment from the command palette.
5. Try the project again.

```toml
[environment]
image = "node:20"
ports = [3000]
```

## Prevention tips

- Keep the environment file minimal.
- Test runtime changes in small steps.
- Avoid very heavy startup scripts.

## Related docs

- [Creating Your First Environment](/docs/environments/creating-first-environment)
- [Runtime Selection](/docs/environments/runtime-selection)
- [Common Deployment Issues](/docs/deployment/common-deployment-issues)
