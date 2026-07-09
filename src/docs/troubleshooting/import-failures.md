---
title: Import Failures
description: Resolve repository import problems when GitHub repositories fail to import into CodePark.
category: Troubleshooting
order: 8
icon: github
tags:
  - troubleshooting
  - import
  - github
  - repository
lastUpdated: 2026-07-10
draft: false
---

# Import Failures

Use this guide when GitHub repository import fails or the imported project opens in an unexpected state.

## Symptoms

- Import request fails
- Repository does not appear in the picker
- Imported project opens but is missing files
- The import modal shows an authentication error

## Possible causes

- GitHub is not connected
- The repository URL is invalid
- The server-side GitHub OAuth setup is missing
- The repository is private and inaccessible to the connected account

## Step-by-step fixes

1. Verify GitHub is connected in CodePark.
2. Check the repository URL.
3. Retry the import after reconnecting GitHub.
4. Open the imported project and confirm the files are present.

## Prevention tips

- Import from a URL you can open in GitHub first.
- Reconnect GitHub if the repo list looks stale.
- Give the project a clear name during import.

## Related docs

- [GitHub Integration](/docs/integrations/github-integration)
- [Importing an Existing Repository](/docs/getting-started/importing-existing-repository)
- [Authentication Problems](/docs/troubleshooting/authentication-problems)
