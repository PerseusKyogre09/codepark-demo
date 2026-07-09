---
title: AI Assistant Overview
description: Learn how CodePark's AI assistant works, what it can do, and how ContextBase powers it.
category: AI
order: 1
icon: sparkles
tags:
  - ai
  - assistant
  - contextbase
  - autocomplete
lastUpdated: 2026-07-10
draft: false
---

# AI Assistant Overview

CodePark's AI assistant is context-aware — it knows your project structure, your recent changes, and your coding patterns.

## What the AI can do

- **Answer questions** about your codebase ("What does this function do?", "Where is this variable defined?")
- **Generate code** from natural language ("Write a FastAPI endpoint that returns user profiles")
- **Debug errors** — paste an error message and get a precise explanation with a fix
- **Refactor code** — ask it to simplify, optimise, or rename across files
- **Explain concepts** — get explanations tuned to your language and stack

## ContextBase

ContextBase is the indexing system that gives the AI knowledge of your project. When enabled, it:

1. Scans your workspace files
2. Builds a semantic vector index
3. Retrieves relevant code snippets when you ask a question

This means the AI can answer questions like "how does authentication work in my app?" with specific references to your actual files — not a generic answer.

### Enabling ContextBase

ContextBase is enabled by default for all projects. Toggle it in **Settings → AI → ContextBase**.

You can also trigger a manual re-scan from the AI panel sidebar if you've made major structural changes.

### Privacy

ContextBase processes your code locally within your container. It only sends relevant **excerpts** to the AI model when you explicitly ask a question. Your full codebase is never transmitted in bulk.

Files matching your `.gitignore` are excluded from indexing by default.

## Using the AI panel

Open the AI panel with `Ctrl+Shift+A` or click the sparkles icon in the left sidebar.

The panel has two modes:

**Chat mode** — natural language conversation with full context awareness. Ask multi-turn questions, refer to previous answers.

**Inline mode** — highlight code in the editor, press `Ctrl+K`, and get inline suggestions or rewrites without leaving your current file.

## Limitations

- The AI does not have internet access during generation
- Maximum context window is approximately 32,000 tokens
- The AI cannot execute code on your behalf — it can only write and suggest; you run it
