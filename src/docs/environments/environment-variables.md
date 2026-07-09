---
title: Environment Variables
description: Configure non-secret environment variables for a project environment.
category: Environments
order: 4
icon: braces
tags:
  - env
  - variables
  - configuration
lastUpdated: 2026-07-10
draft: false
---

# Environment Variables

Environment variables let you configure a project without hard-coding values into your source files.

## Why they exist

They separate configuration from code. That keeps the same project usable across different machines, collaborators, and deployment targets.

## Add variables in `codepark.toml`

Use the `environment.env` section for non-secret values:

```toml
[environment.env]
NODE_ENV = "development"
API_BASE_URL = "http://localhost:8000"
LOG_LEVEL = "debug"
```

## Step-by-step

1. Open `codepark.toml`.
2. Add an `environment.env` section.
3. Define the non-secret values your app needs.
4. Rebuild the environment if the app reads them at startup.
5. Verify the values inside the terminal or app logs.

## Practical example

For a TypeScript frontend:

```toml
[environment.env]
VITE_API_URL = "https://api.example.local"
VITE_FEATURE_FLAG_NEW_NAV = "true"
```

Then from the terminal:

```bash
printenv VITE_API_URL
```

Example output:

```text
https://api.example.local
```

## When to use environment variables

Use them for:

- API base URLs
- Feature flags
- Logging verbosity
- Non-secret runtime toggles

## Warnings

> [!CAUTION]
> Do not store secrets in `codepark.toml`. Use the project settings secret flow for sensitive values.

## Best practices

- Use uppercase names with underscores.
- Keep variable names stable across environments.
- Document important values in the README if teammates need to know what they do.
- Prefer a single source of truth for each value.

## Common mistakes

- Hard-coding URLs in application code
- Putting secrets in the environment file
- Changing a variable name without updating the app

## Troubleshooting

If a variable is not visible in the app:

- Confirm it is under `environment.env`
- Rebuild the environment if the app reads variables on startup
- Check for typos in the variable name

## Related docs

- [Creating Your First Environment](/docs/environments/creating-first-environment)
- [Runtime Selection](/docs/environments/runtime-selection)
- [Project Settings](/docs/projects/project-settings)
