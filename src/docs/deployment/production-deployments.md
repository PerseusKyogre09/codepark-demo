---
title: Production Deployments
description: Prepare a CodePark project for production by validating the runtime and handing it off to your hosting platform.
category: Deployment
order: 3
icon: globe
tags:
  - deployment
  - production
  - handoff
  - release
lastUpdated: 2026-07-10
draft: false
---

# Production Deployments

Production deployments are not a first-class CodePark feature today. Instead, CodePark helps you prepare and validate the codebase before you deploy it to your production hosting provider.

## What to validate first

- The project runs cleanly in CodePark
- Environment variables are configured
- The correct runtime image is selected
- Preview URLs behave as expected
- The production build succeeds locally

## Recommended workflow

1. Run the app in CodePark.
2. Fix environment mismatches in `codepark.toml`.
3. Verify production build output in the terminal.
4. Push or export the project to your hosting target.
5. Deploy from your external platform.

```bash
npm run build
npm test
```

## Practical example

For a Node app, confirm the production entrypoint before deployment:

```json
{
  "scripts": {
    "build": "tsc -p tsconfig.json",
    "start": "node dist/index.js"
  }
}
```

## Best practices

- Validate the build in CodePark before deploying elsewhere.
- Keep production and preview environment variables aligned.
- Pin your runtime image when build reproducibility matters.

## Common mistakes

- Deploying before the build passes locally
- Letting preview-only configuration leak into production
- Forgetting to check the runtime version that production expects

## Related docs

- [Deployment Overview](/docs/deployment/overview)
- [Environment Configuration](/docs/deployment/environment-configuration)
- [Common Deployment Issues](/docs/deployment/common-deployment-issues)
