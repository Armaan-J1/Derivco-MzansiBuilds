# MzansiBuilds — Derivco Graduate Programme Assessment

## Overview

MzansiBuilds is a "build in public" platform designed for South African developers to share their projects, track milestones, collaborate with others, and celebrate shipped work. Built as a real-time community feed, it gives developers a space to be transparent about what they're building, get support, and grow together.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript |
| Build Tool | Vite |
| State Management | Zustand |
| Backend / Database | Firebase (Auth + Firestore) |
| Routing | React Router v6 |
| Styling | Inline styles (no CSS framework) |
| Deployment | Vercel |

---

## Features

### Authentication
- Email/password registration and login
- Show/hide password toggle on all password fields
- Forgot password via Firebase email reset
- Protected routes — unauthenticated users are redirected to the login screen
- Auth state driven by `onAuthStateChanged` to prevent race conditions on redirect

### Feed
- Paginated live feed of all public projects (10 per page, load more appends the next 10)
- Each feed card shows project title, stage badge, description, support needed, and GitHub link
- Milestone trace log panel on the right of each card — pulled from Firestore on mount
- Raise hand / lower hand collaboration requests with live counter
- Comment threads per feed item, fetched on open
- Search filters across title, description, and owner name across all loaded items
- Blocked projects are hidden from the feed

### My Projects
- Create new projects with title, description, stage, support needed, and GitHub repo
- Inline editing of all project fields with optimistic updates
- Add milestones with date, title, and description
- Mark a project as complete (with confirmation) — moves it to the Celebration Wall
- Blocked projects remain visible in My Projects so the stage can be changed

### Celebration Wall
- Gallery of all completed projects across all users
- Search by builder name
- Refreshes from Firestore every time the view is opened

### Collaboration
- Any user can raise their hand on a project to signal interest
- Project owners can view all raise hand requests with name, email, and note
- Owners can accept or dismiss requests

---

## Project Structure

```
src/
├── app/              # Page-level components (AppPage, AuthPage, ProfilePage)
├── component/        # Shared components (DotGrid background)
├── features/
│   ├── auth/         # Zustand auth store
│   ├── celebration/  # Celebration Wall view
│   ├── collaboration/# Raise hand / collab requests
│   ├── comments/     # Comment threads
│   ├── feed/         # Feed view + feed cards
│   └── projects/     # My Projects view + New Project panel
├── lib/              # Firebase initialisation
├── services/         # Firestore service layer (auth, feed, projects, comments, raise hands, users)
└── types/            # Shared TypeScript interfaces
```

---

## Architecture Decisions

**Service layer** — All Firestore reads and writes are isolated in `/services`. Components never call Firestore directly. This keeps components clean and makes the data layer easy to swap or test.

**Optimistic updates** — Project edits update the UI immediately before the Firestore write confirms, giving a snappy feel without a loading spinner on every keystroke.

**Denormalised feed snapshots** — Feed items store a `projectSnapshot` so the feed loads without joining to the projects collection. When a project is edited, the snapshot is updated in the background.

**No composite indexes** — Queries are written to avoid Firestore composite index requirements (filtering done client-side where needed), so the project works out of the box without manual index setup in the Firebase console.

**Auth-driven navigation** — Login and registration navigate by watching `onAuthStateChanged` rather than calling `navigate()` directly after the async call, preventing the race condition where `ProtectedRoute` sees a null user mid-redirect.

---

## Running Locally

```bash
# 1. Clone the repo
git clone https://github.com/Armaan-J1/Derivco-MzansiBuilds

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Fill in your Firebase project credentials in .env

# 4. Start the dev server
npm run dev
```

---

## Environment Variables

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

---

## Live Demo

[https://derivco-mzansi-builds.vercel.app](https://derivco-mzansi-builds.vercel.app)

---

## Author

**Armaan Joosub** — Derivco Graduate Programme 2025
