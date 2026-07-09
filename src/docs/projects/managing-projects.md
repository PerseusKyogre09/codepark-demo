---
title: Managing Projects
description: Learn how to open, rename, copy, download, and delete projects from the dashboard.
category: Projects
order: 1
icon: folders
tags:
  - projects
  - dashboard
  - manage
  - copy
lastUpdated: 2026-07-10
draft: false
---

# Managing Projects

The dashboard is your control center for projects. From here you can open existing workspaces, create new ones, rename projects, duplicate them, and remove ones you no longer need.

## Why this page exists

Projects are the durable unit in CodePark. Sessions come and go, but the project is what stays on your dashboard and what collaborators recognize.

## What you can do from the dashboard

- Open a project
- Create a new project
- Rename an existing project
- Copy a project
- Download a project archive
- Delete a project

## Open a project

Click a project card to open its workspace. CodePark resolves the active session and takes you into the editor view.

If the project is already active, you will join the current session. If not, CodePark creates a new session for you.

## Rename a project

Use the project settings or inline rename flow to change the project name. Good names help collaborators quickly understand what the workspace is for.

```ts
const projectName = "payments-api"
```

Use names that are specific enough to be searched later:

- `marketing-site`
- `backend-api`
- `design-system`

## Copy a project

Copying is useful when you want a fresh branch of work without changing the original project.

Typical uses:

- Creating a safe variant for experiments
- Preparing a template from an existing workspace
- Starting a new feature from a known-good baseline

## Download a project

Downloading creates a local archive of the project. This is useful for backups, offline inspection, or moving a project into a different environment.

```bash
unzip my-project.zip
cd my-project
```

## Delete a project

Deleting a project removes the project record and invalidates its associated runtime state. Only do this when you are sure the workspace is no longer needed.

> [!WARNING]
> Deletion is permanent from the dashboard perspective. Make sure you have a backup or a copy before deleting a shared project.

## Best practices

- Keep active projects near the top of the dashboard.
- Use copies for experiments instead of editing the original.
- Download before deleting if you may need the files later.
- Rename the project before inviting more collaborators.

## Common mistakes

- Deleting the only copy of a project that still contains useful history
- Copying a project and forgetting to update its name
- Opening the wrong project because several cards share the same generic title

## Troubleshooting

If a project does not appear in the dashboard:

- Refresh the page
- Check whether the project is shared with your account
- Confirm that the project was not deleted or archived elsewhere

If a copy or delete operation fails, retry once after the dashboard finishes refreshing.

## See also

- [Creating Your First Project](/docs/getting-started/creating-first-project)
- [Project Settings](/docs/projects/project-settings)
- [Importing an Existing Repository](/docs/getting-started/importing-existing-repository)
