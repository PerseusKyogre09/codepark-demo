---
title: Importing an Existing Repository
description: Bring an existing GitHub repository into CodePark and keep the original project structure intact.
category: Getting Started
order: 3
icon: github
tags:
  - import
  - github
  - git
  - repository
lastUpdated: 2026-07-10
draft: false
---

# Importing an Existing Repository

If your code already lives in GitHub, you do not need to recreate it in CodePark. Importing lets you start from the code you already have and move directly into collaborative editing.

## Why import instead of starting blank

Importing preserves the repository you already trust:

- Commit history stays meaningful
- Existing folders and scripts remain in place
- Your team can review and edit real code instead of a scaffold

## Import a repository

1. Open the project creation flow from the Dashboard.
2. Choose **Import from GitHub**.
3. Connect your GitHub account if prompted.
4. Select the repository you want to bring in.
5. Confirm the import.

> [!IMPORTANT]
> CodePark imports the repository into a new project workspace. You are not editing the GitHub repo directly from the dashboard.

## What CodePark imports

The imported workspace keeps the repository contents and project structure so you can continue working immediately. A typical import includes:

- Source files
- Package manifests such as `package.json` or `pyproject.toml`
- Configuration files
- Scripts and tests

Example repository layout:

```text
my-app/
├── src/
│   ├── index.ts
│   └── routes/
├── package.json
├── tsconfig.json
└── README.md
```

## After the import

Once the import finishes, open the project and verify the workspace before you do any real work:

1. Check that the expected files are present.
2. Run the install step for the project.
3. Start the app or test suite.
4. Confirm that the editor shows the right root folder.

```bash
npm install
npm test
npm run dev
```

## Practical example

If you import a Next.js repository, you will usually want to check the following immediately:

```bash
cat package.json
```

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  }
}
```

That tells you how to run the project once the workspace opens.

## Best practices

- Import a repository only after you have confirmed the default branch and runtime.
- Review the README before making changes.
- Run the install step before inviting teammates.
- Keep the first session focused on setup and verification.

## Common mistakes

- Importing the wrong repository from a large GitHub account
- Assuming the project will run without installing dependencies
- Forgetting to check environment-specific files such as `.env.example`

## Troubleshooting

If the repository does not appear in the picker:

- Make sure your GitHub account is connected
- Confirm the repository belongs to the account or organization you authorized
- Refresh the import dialog if the list appears stale

If the project opens but dependencies are missing, run the install command for that repository before starting the app.

## Next steps

- [Creating Your First Project](/docs/getting-started/creating-first-project)
- [Managing Projects](/docs/projects/managing-projects)
- [Project Settings](/docs/projects/project-settings)
