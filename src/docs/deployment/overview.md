---
title: Deployment Overview
description: Understand how deployment fits into CodePark today, including preview URLs and production handoff.
category: Deployment
order: 1
icon: rocket
tags:
  - deployment
  - preview
  - production
  - runtime
lastUpdated: 2026-07-10
draft: false
---

# Deployment Overview

CodePark is built around a live workspace and preview-friendly runtime. It gives you the tools to develop and validate an app in a shared environment, then hand it off to your production deployment target.

## What CodePark handles today

- Live development in a container-backed workspace
- Port-based preview URLs
- Environment configuration through `codepark.toml`
- GitHub-based repository import

## What is not a built-in product feature

CodePark does not currently ship a first-class production deployment platform in the docs or API surface. Production deployment still depends on the target platform you choose outside CodePark.

## Typical flow

1. Build and run the project in CodePark.
2. Use preview URLs to test the application.
3. Fix runtime or configuration issues in the workspace.
4. Hand the project off to your external deployment platform.

## Why this matters

This workflow keeps development and validation close together without pretending the preview environment is production.

## Related docs

- [Preview Deployments](/docs/deployment/preview-deployments)
- [Environment Configuration](/docs/deployment/environment-configuration)
- [Common Deployment Issues](/docs/deployment/common-deployment-issues)
