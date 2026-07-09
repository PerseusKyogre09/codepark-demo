---
title: Inviting Teammates
description: Share a project with other people so they can join the same live workspace.
category: Collaboration
order: 1
icon: user-plus
tags:
  - invite
  - teammates
  - sharing
  - collaboration
lastUpdated: 2026-07-10
draft: false
---

# Inviting Teammates

Inviting someone brings them into the same project workspace so they can see the editor, terminal, and live session state you are working with.

## Why invites matter

CodePark is built around shared work. Invites are how you move from solo setup to a real collaborative session without switching tools.

## Invite a teammate

1. Open the project in the editor.
2. Click **Invite** in the toolbar.
3. Share the generated link with your teammate.
4. Ask them to open the link or join from their dashboard.

## What invite recipients see

When a teammate joins, they enter the same session as you. Depending on their role, they may be able to:

- View the workspace
- Edit files
- Use the terminal
- Manage the project

> [!NOTE]
> Guests can join without a full account flow, but their access is limited by the role assigned to them.

## Choose the right access level

Use the most restrictive role that still lets the person do their job.

| Role | Best for |
|------|----------|
| Owner | The person responsible for the project |
| Editor | Teammates who should change code and run commands |
| Viewer | People who only need to inspect the workspace |
| Guest | Fast, low-friction access for a temporary session |

## Practical example

If you are reviewing a bug fix with another engineer, invite them as an `Editor` so they can reproduce the issue and test a patch in the same session.

```bash
# Example review flow
npm test
npm run dev
```

## Best practices

- Invite only after the workspace is in a readable state.
- Use a clear project name before sharing.
- Confirm the collaborator role before sending the link.
- Remove access when the work is finished.

## Common mistakes

- Sharing the project before the runtime has fully loaded
- Giving edit access when the collaborator only needs to review
- Forgetting to update the project settings after the team changes

## Troubleshooting

If a teammate cannot join:

- Confirm the link is still valid
- Confirm the project still exists
- Check whether the user needs a different role or owner approval

If they land in a waiting room, the project is treating them as a non-collaborator until access is granted.

## Next steps

- [Live Cursors](/docs/collaboration/live-cursors)
- [Comments and Discussions](/docs/collaboration/comments-and-discussions)
- [Permissions](/docs/collaboration/permissions)
