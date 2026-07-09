---
title: FAQ
description: Answers to common questions about how CodePark works.
category: FAQ
order: 1
icon: circle-help
tags:
  - faq
  - questions
  - overview
  - help
lastUpdated: 2026-07-10
draft: false
---

# FAQ

This page answers the questions people ask most often when they first use CodePark.

## What is CodePark?

CodePark is a cloud-based collaborative development environment. It gives you a live workspace, a shared editor, a terminal, and realtime collaboration in the browser.

## Do I need to install anything?

Usually no. You use CodePark in the browser. Your project runtime runs in the workspace environment, so you do not need to install a local IDE to start.

## Can I collaborate in real time?

Yes. CodePark supports live cursors, collaborator presence, chat, and shared session access.

## How are environments stored?

Project files persist in the workspace under `/workspace`. Temporary paths such as `/tmp` do not persist across restarts.

## Does CodePark support GitHub?

Yes. You can connect GitHub, list repositories, and import a repository into a new project.

## How does AI use my project?

AI uses ContextBase to retrieve relevant project context. That lets the assistant answer questions about your actual files rather than generic examples.

## How do I report bugs?

Use the feedback or bug report path in the product if available. If you are filing a technical report, include the project ID, the exact error, and what you were doing when it happened.

## Is my code private?

Your code stays inside your workspace and project context. Avoid putting secrets in public project files, and use the supported secret flow for sensitive values.

## How do I recover deleted work?

If the workspace is still open, check whether the file can be restored from Git or from a recent copy of the project. If the project itself was deleted, recovery depends on the availability of another copy or backup.

## Related docs

- [Creating Your First Project](/docs/getting-started/creating-first-project)
- [Persistent Storage](/docs/environments/persistent-storage)
- [What is ContextBase?](/docs/contextbase/what-is-contextbase)
