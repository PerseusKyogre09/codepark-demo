---
title: Creating Your First Project
description: Walk through the fastest path from a fresh account to a running CodePark workspace.
category: Getting Started
order: 2
icon: folder-plus
tags:
  - onboarding
  - project
  - quickstart
  - setup
lastUpdated: 2026-07-10
draft: false
---

# Creating Your First Project

Your first project is the easiest way to understand how CodePark works. A project gives you a persistent workspace, a live session, and a place for collaborators to join later.

## Why this matters

CodePark separates the long-lived project from the short-lived editing session. When you create a project, CodePark also opens the live runtime that powers the editor, terminal, and collaboration features.

## Create a project

1. Open the Dashboard.
2. Click **New Project**.
3. Choose a starter template or begin with a blank workspace.
4. Enter a clear project name.
5. Create the project.

> [!TIP]
> Use a project name that describes the work, not the branch. Good names are easier to find later in the dashboard and settings pages.

## Choose a starting point

Most users should start with one of these:

- **Blank** for a clean workspace
- **Node.js** for web apps and scripts
- **Python** for automation, APIs, or data work
- **Rust** or **Go** for systems and CLI work
- **React** or **Next.js** for frontend projects

The template determines the initial workspace layout and runtime defaults. If you already know your stack, start there. If not, blank is the safest option.

## What happens after creation

After you create the project, CodePark opens the editor and provisions the workspace behind the scenes:

- A container-backed runtime is started for the project
- The file tree is loaded into the editor
- The terminal becomes available
- The session is ready for collaboration

```bash
# Typical first commands inside a new project
npm install
npm run dev
```

If the project exposes a local port, CodePark detects it and offers a preview in the editor.

## Practical example

If you are creating a small TypeScript service, a sensible first flow looks like this:

```bash
mkdir api-demo
cd api-demo
npm init -y
npm install typescript tsx
```

Then open the project in CodePark, drop the files into the workspace, and run:

```bash
npx tsx src/index.ts
```

## Best practices

- Keep the first project small and familiar.
- Use a template that matches the language you plan to work in.
- Rename the project as soon as the scope becomes clear.
- Add collaborators only after the workspace is stable enough to share.

## Common mistakes

- Creating a project from the wrong template and trying to fix everything later
- Using a vague name like `test` or `new-project`
- Forgetting that the project is persistent and leaving throwaway files behind

## Troubleshooting

If the editor does not open immediately:

- Wait a few seconds while the workspace finishes provisioning
- Refresh the page once if the session appears stuck
- Check whether you are signed in and have permission to create projects

If the runtime fails to start, the issue is usually template-related or caused by a temporary provisioning delay.

## Next steps

- [Importing an Existing Repository](/docs/getting-started/importing-existing-repository)
- [Understanding the Workspace](/docs/getting-started/understanding-workspace)
- [Managing Projects](/docs/projects/managing-projects)
