# Firebase Setup Guide

This guide assumes you will use Firebase for authentication, database, and hosting.

## Firebase services to use

- Firebase Authentication
- Cloud Firestore
- Firebase Hosting

Optional later:

- Firebase Storage
- Cloud Functions

## Step 1: Create a Firebase project

1. Go to the Firebase Console
2. Click `Create a project`
3. Name it something like `mzansibuilds`
4. Disable Google Analytics if you want a simpler setup
5. Create the project

## Step 2: Register your web app

1. Inside the project, add a Web App
2. Give it a name like `mzansibuilds-web`
3. Firebase will give you a config object
4. Keep that config safe and place it in environment variables

## Step 3: Enable Authentication

1. Go to `Authentication`
2. Click `Get started`
3. Enable at least one sign-in method:
   - Email/Password
   - Google

Recommended for the assessment:

- start with Email/Password
- add Google only if you have time

## Step 4: Create Firestore database

1. Go to `Firestore Database`
2. Click `Create database`
3. Start in production mode if you are comfortable writing rules
4. Choose a region close to your users

## Step 5: Plan your collections before coding

Suggested collections:

- `users`
- `projects`
- `projectUpdates`
- `comments`
- `collaborationRequests`
- `celebrationWall`

## Suggested document responsibilities

`users`
- stores profile data for each developer
- example responsibility: display name, bio, skills, avatar, joined date

`projects`
- stores the main project created by a developer
- example responsibility: title, description, stage, support needed, owner id, status

`projectUpdates`
- stores progress updates and milestones
- example responsibility: project id, milestone text, created date

`comments`
- stores feed comments
- example responsibility: project id, author id, message, created date

`collaborationRequests`
- stores raised-hand collaboration interest
- example responsibility: project id, requester id, message, status

`celebrationWall`
- stores completed projects or references to them
- example responsibility: project id, owner id, completed date

## Step 6: Add Firebase config to your app

You will usually create one file such as:

- `src/lib/firebase.ts`

That file should:

- initialize Firebase app
- export auth instance
- export Firestore instance

Do not hardcode secrets in source files if your setup expects environment variables.

## Step 7: Use environment variables

Typical values:

- API key
- Auth domain
- Project ID
- Storage bucket
- Messaging sender ID
- App ID

Store them in `.env.local` and do not commit that file.

## Step 8: Firestore security rules

At minimum, make sure:

- users can only edit their own profile
- users can only create projects as themselves
- users can only edit their own projects
- authenticated users can create comments
- celebration entries are only created when a project is marked complete by the owner

## Step 9: Hosting

When your app is ready:

1. Install Firebase CLI
2. Login
3. Initialize hosting
4. Build the app
5. Deploy

Typical commands:

```powershell
npm install -g firebase-tools
firebase login
firebase init
firebase deploy
```

## Practical order for your build

1. Firebase project
2. Auth
3. Firestore collections
4. Security rules
5. UI integration
6. Hosting

