---
title: Creating Custom Templates
description: Understand the current status of custom templates in CodePark and how to prepare reusable project setups today.
category: Templates
order: 2
icon: wrench
tags:
  - templates
  - custom
  - status
  - setup
lastUpdated: 2026-07-10
draft: false
---

# Creating Custom Templates

CodePark currently ships built-in templates in the project creation flow. A self-serve custom template authoring system is not exposed in the product yet.

## What to do today

If you want a reusable starting point, use one of these workflows:

- Start from a built-in template and save the resulting project as your team baseline
- Copy a project when you want to branch from an existing setup
- Document the environment in `codepark.toml` so the setup can be recreated consistently

## Practical pattern

1. Create a project from a built-in template.
2. Install the dependencies your team needs.
3. Add `codepark.toml` and any project bootstrap scripts.
4. Copy the project when you need a new workspace with the same shape.

```toml
[environment]
image = "node:20"

[environment.install]
run = ["npm install"]
```

## Limitations

- There is no template marketplace in the current product.
- There is no UI for publishing a reusable template package.
- Template behavior is controlled by the existing project creation presets.

## Best practices

- Keep a clean baseline project if your team repeatedly creates similar workspaces.
- Document setup steps in the repository so they are easy to reproduce.
- Use copies for variations instead of editing the baseline directly.

## Related docs

- [Using Templates](/docs/templates/using-templates)
- [Managing Projects](/docs/projects/managing-projects)
- [Runtime Selection](/docs/environments/runtime-selection)
