---
title: GitHub Integration
description: Connect GitHub to import repositories and manage repository-backed projects.
category: Integrations
order: 1
icon: github
tags:
  - github
  - integration
  - import
  - oauth
lastUpdated: 2026-07-10
draft: false
---

# GitHub Integration

CodePark supports GitHub for account connection and repository import.

## What it does

GitHub integration lets you:

- Connect your GitHub account
- List repositories from the connected account
- Import a repository into a new CodePark project
- Disconnect GitHub when you no longer need the connection

## How it works

The backend routes the OAuth flow through GitHub, stores the returned token on the user profile, and uses that token to fetch repository data when you import a project.

## Set up GitHub

1. Open settings or the import flow in CodePark.
2. Choose the GitHub connection option.
3. Approve the OAuth flow in GitHub.
4. Return to CodePark after authorization completes.

The backend exposes:

- `GET /api/github/login`
- `GET /api/github/callback`
- `GET /api/github/status`
- `GET /api/github/repos`
- `POST /api/github/import`
- `DELETE /api/github/disconnect`

## Import a repository

Once connected, you can import a repository into a new project:

```bash
curl -X POST https://codepark.qzz.io/api/github/import \
  -H "Content-Type: application/json" \
  --cookie "cp_auth=YOUR_SESSION_COOKIE" \
  -d '{
    "repo_url": "https://github.com/example/my-app",
    "name": "my-app"
  }'
```

Example response:

```json
{
  "success": true,
  "project_id": "proj_123",
  "name": "my-app"
}
```

## Typical workflow

1. Connect GitHub.
2. Review available repositories.
3. Import the repository you want.
4. Open the new project in CodePark.
5. Install dependencies and run the app in the workspace.

## Limitations

- GitHub is the only repository provider currently documented and implemented in the product.
- GitHub import depends on the server-side OAuth configuration being present.

## Best practices

- Disconnect when you no longer need repository access.
- Import the repository into a new project instead of overwriting an existing workspace.
- Verify the runtime after import before sharing the project.

## Common mistakes

- Assuming the import automatically configures your runtime
- Forgetting that GitHub access depends on OAuth being set up on the server
- Importing the wrong repository from a large account

## Troubleshooting

If GitHub says it is not connected:

- Reconnect the account
- Confirm the session is still valid
- Try the import again

If import fails, check that the repository URL is valid and that the server has GitHub OAuth configured.

## Related docs

- [Importing an Existing Repository](/docs/getting-started/importing-existing-repository)
- [API Authentication](/docs/api/authentication)
- [Projects API](/docs/api/projects-api)
