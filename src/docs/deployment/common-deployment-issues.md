---
title: Common Deployment Issues
description: Diagnose the most frequent deployment-related problems in CodePark preview and handoff workflows.
category: Deployment
order: 5
icon: triangle-alert
tags:
  - deployment
  - troubleshooting
  - preview
  - build
lastUpdated: 2026-07-10
draft: false
---

# Common Deployment Issues

This page covers the most common deployment-related issues in CodePark's preview and validation workflows.

## Preview does not load

**Symptoms**

- Blank page
- 502 from the preview URL
- Preview button never appears

**Possible causes**

- The server is not listening on the declared port
- The process is bound to `127.0.0.1`
- The environment has not been rebuilt after changing `codepark.toml`

**Fix**

1. Confirm the port in `codepark.toml`.
2. Start the app on `0.0.0.0`.
3. Rebuild the environment if the runtime changed.
4. Wait a few seconds for preview detection.

## Build succeeds locally but fails in CodePark

**Possible causes**

- Missing dependency in the project environment
- Version mismatch between local machine and CodePark runtime
- A script depends on a local cache that does not persist

**Fix**

1. Compare the local Node/Python/Rust version with the workspace runtime.
2. Reinstall dependencies in the workspace.
3. Pin the runtime image if the version matters.

## Production handoff fails

**Possible causes**

- The production build script is missing
- Environment variables were not copied
- The app depends on a preview-only path

**Fix**

1. Run the production build in the terminal.
2. Verify the build output.
3. Copy the required environment variables to your hosting target.

## Prevention tips

- Keep the environment file current.
- Test the app after every runtime change.
- Use preview URLs only for development validation.

## Related docs

- [Deployment Overview](/docs/deployment/overview)
- [Preview Deployments](/docs/deployment/preview-deployments)
- [Environment Configuration](/docs/deployment/environment-configuration)
