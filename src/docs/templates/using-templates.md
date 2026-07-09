---
title: Using Templates
description: Start new projects from the built-in templates available in the project creation flow.
category: Templates
order: 1
icon: layout-template
tags:
  - templates
  - project-creation
  - starter
  - runtime
lastUpdated: 2026-07-10
draft: false
---

# Using Templates

Templates are starter presets for new projects. They give you a working base image, typical files, and a runtime that matches the stack you want to use.

## What templates do

Templates reduce setup work by starting you in a configuration that already fits a common project type.

Current built-in options include:

- Blank
- Node.js
- Full-stack
- Rust
- Python
- Go

## When to use a template

Use a template when:

- You already know the stack
- You want a predictable starting point
- You want to avoid manually wiring runtime setup

Use blank when:

- You want full control
- You are onboarding a custom codebase
- You plan to add the runtime manually in `codepark.toml`

## Step-by-step

1. Open **Create a project**.
2. Enter a project name.
3. Select a template.
4. Review the summary.
5. Create the project.

## Practical example

A small API project might start with the Python template and then use the terminal:

```bash
pip install -r requirements.txt
uvicorn app.main:app --reload
```

A frontend app usually fits the Node.js template:

```bash
npm install
npm run dev
```

## Best practices

- Pick the template that matches the dominant runtime.
- Keep the first commit focused on getting the project to run.
- Rename the project as soon as the scope becomes clear.

## Common mistakes

- Choosing a template for the wrong language
- Using blank when the project already has a common stack
- Forgetting to check the template summary before creating the project

## Troubleshooting

If a template does not behave as expected, confirm the runtime in the workspace and compare it with your `codepark.toml` settings.

## Related docs

- [Creating Your First Project](/docs/getting-started/creating-first-project)
- [Runtime Selection](/docs/environments/runtime-selection)
- [Project Settings](/docs/projects/project-settings)
