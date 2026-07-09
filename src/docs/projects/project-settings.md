---
title: Project Settings
description: Configure collaborators, appearance, context scanning, transfers, and deletion for a project.
category: Projects
order: 2
icon: settings-2
tags:
  - settings
  - collaborators
  - permissions
  - appearance
lastUpdated: 2026-07-10
draft: false
---

# Project Settings

Project settings control the parts of a workspace that belong to the project itself, not your personal account.

## Why settings matter

These settings determine who can access the project, how the workspace appears, and which project-level behaviors are enabled.

## Open project settings

1. Open the project in the editor.
2. Click the project settings entry from the project menu or toolbar.
3. Switch between the available tabs for general, collaborators, appearance, transfer, and danger-zone actions.

## General settings

The general tab lets you update the project name and other project-level behavior.

```json
{
  "name": "Design System",
  "context_base_auto_scan": true
}
```

Use this tab when you want to:

- Rename the project
- Review the current project details
- Adjust whether ContextBase auto-scanning is enabled

## Collaborators

The collaborators tab shows the users who currently have access to the project. From here you can review their roles and remove collaborators when needed.

Common roles include:

- Owner
- Editor
- Viewer
- Guest

> [!TIP]
> Change collaborator roles before a long session starts. That avoids interruptions once everyone is already working in the same workspace.

## Appearance

The appearance tab lets you change project-specific presentation settings such as the background image.

Use it when you want the workspace to be easier to identify visually, especially if your team works in several similar projects.

## Transfer ownership

If someone else should become the primary owner of the project, use the transfer tab. Ownership transfer is useful when the project is handed off to another teammate or team.

Before transferring, confirm:

- The new owner still needs the project
- They understand the project history
- You are transferring to the correct collaborator

## Danger zone

The danger zone contains destructive actions such as project deletion.

> [!CAUTION]
> Only use destructive actions after confirming you have the right project open. A mistaken delete can invalidate the live workspace immediately.

## Best practices

- Rename a project before adding multiple collaborators.
- Keep ContextBase auto-scan enabled unless you have a reason to turn it off.
- Review collaborator roles after any team change.
- Store visual branding in appearance settings only if it helps the team identify the workspace.

## Common mistakes

- Confusing project settings with personal account settings
- Removing a collaborator before checking whether they still need access
- Deleting a project instead of duplicating it for experimentation

## Troubleshooting

If changes do not appear to save:

- Refresh the settings modal
- Reopen the project settings panel
- Confirm that you still have owner permissions

If collaborator changes do not reflect immediately, wait for the project list to refresh and the live session to re-sync.

## Related guides

- [Managing Projects](/docs/projects/managing-projects)
- [Inviting Teammates](/docs/collaboration/inviting-teammates)
- [Permissions](/docs/collaboration/permissions)
