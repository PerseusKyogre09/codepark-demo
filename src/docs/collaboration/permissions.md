---
title: Permissions
description: Understand roles and permissions for project collaborators in CodePark.
category: Collaboration
order: 4
icon: shield
tags:
  - permissions
  - roles
  - access-control
lastUpdated: 2026-07-10
draft: false
---

# Permissions

CodePark uses a role-based permission system. Every collaborator in a project has exactly one role.

## Roles

| Role | View files | Edit files | Run terminal | Shared terminal | Manage project | Invite others |
|------|-----------|-----------|--------------|----------------|---------------|---------------|
| **Owner** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| **Editor** | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ |
| **Viewer** | ✓ | ✗ | ✗ | Read-only | ✗ | ✗ |
| **Guest** | ✓ | ✗ | ✗ | Read-only | ✗ | ✗ |

**Guest** is the default role for anyone who joins via a share link without a CodePark account.

## Managing collaborators

1. Open the project in the editor
2. Click the **Share** button in the top toolbar
3. Under **Collaborators**, find the user whose role you want to change
4. Select a new role from the dropdown

Changes take effect immediately — no refresh required.

## Invite links

When you generate an invite link, you can optionally set a default role for anyone who joins with that link:

- **View link** (default) — joins as Viewer
- **Edit link** — joins as Editor (Pro only)

You can revoke a link at any time from Project Settings.

## Private projects

Private projects (Pro tier) are only visible to collaborators with an explicit invitation. The project does not appear in any public listing.

Free tier projects can be made private, but are limited to 3 collaborators total.
