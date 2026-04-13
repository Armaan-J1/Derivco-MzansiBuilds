# GitHub Setup First

This is the **first priority** because Derivco explicitly requires a public GitHub repository.

## Step 1: Create a new GitHub repository

Create a new repository on GitHub with a clear name, for example:

- `mzansibuilds`
- `derivco-mzansibuilds`

Do not add a `.gitignore`, license, or README on GitHub if you want this local folder to remain the source of truth.

## Step 2: Initialize Git locally

From this project folder, run:

```powershell
git init
git add .
git commit -m "chore: initialize assessment starter template"
```

## Step 3: Rename the default branch

```powershell
git branch -M main
```

## Step 4: Connect the local repo to GitHub

Replace `<YOUR_GITHUB_URL>` with your repo URL:

```powershell
git remote add origin <YOUR_GITHUB_URL>
git push -u origin main
```

Example:

```powershell
git remote add origin https://github.com/your-username/mzansibuilds.git
git push -u origin main
```

## Step 5: Make the repository public

On GitHub:

1. Open the repository
2. Go to `Settings`
3. Open `General`
4. Scroll to `Danger Zone`
5. Change repository visibility to `Public`

Keep it public for the duration of the assessment.

## Step 6: Good commit habits

Commit often with short, clear messages:

- `feat: add auth pages`
- `feat: add project creation form`
- `feat: implement celebration wall`
- `test: add auth service tests`
- `docs: update architecture notes`
- `fix: validate empty comment submission`

## Step 7: Suggested branch strategy

If time is short, work directly on `main` and commit carefully.

If you want cleaner history, use short-lived feature branches:

- `feature/auth`
- `feature/project-feed`
- `feature/comments`
- `feature/celebration-wall`

## What assessors may notice in GitHub

- whether you started early and committed consistently
- whether your messages are meaningful
- whether your code evolves in understandable steps
- whether docs and tests are committed alongside code

## Minimum GitHub checklist

- public repository created
- local repo linked to GitHub
- first commit pushed
- regular commits during development
- final code visible before deadline

