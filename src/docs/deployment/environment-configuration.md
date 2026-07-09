---
title: Environment Configuration
description: Configure runtime, ports, and install steps for deployment-oriented workflows in CodePark.
category: Deployment
order: 4
icon: settings-2
tags:
  - deployment
  - environment
  - codepark.toml
  - configuration
lastUpdated: 2026-07-10
draft: false
---

# Environment Configuration

Deployment-related configuration in CodePark lives in `codepark.toml`.

## What to configure

- Base image
- Exposed ports
- Install commands
- Non-secret environment variables

## Example

```toml
[environment]
image = "node:20"
ports = [3000]

[environment.install]
run = ["npm install"]

[environment.env]
NODE_ENV = "production"
PORT = "3000"
```

## Step-by-step

1. Open the project root.
2. Edit `codepark.toml`.
3. Save the file.
4. Rebuild the environment.
5. Verify the runtime and preview URL.

## Warnings

> [!CAUTION]
> Do not place secrets in `codepark.toml`. Use the supported secret flow in project settings.

## Best practices

- Keep configuration explicit and minimal.
- Use the same port in both the runtime and the app.
- Rebuild after changing the image or install steps.

## Common mistakes

- Editing configuration in the wrong folder
- Forgetting to expose the port the server uses
- Assuming install commands rerun automatically after every save

## Related docs

- [Environment Variables](/docs/environments/environment-variables)
- [Runtime Selection](/docs/environments/runtime-selection)
- [Preview Deployments](/docs/deployment/preview-deployments)
