# Architecture Notes

Use this as your thinking guide before you code.

## Suggested architecture

Frontend responsibilities:

- render UI
- manage forms
- call Firebase services
- guard protected routes or screens

Backend / Firebase responsibilities:

- authenticate users
- store project data
- store progress updates
- store comments and collaboration requests
- enforce access rules

## Suggested folder responsibilities

`src/app`
- pages, routes, screens, or app entry points

`src/components`
- reusable UI components

`src/features`
- domain-based feature code such as auth, projects, feed, comments

`src/lib`
- shared low-level setup such as Firebase initialization

`src/services`
- wrappers around Firebase reads and writes

`src/types`
- shared types and interfaces

`tests`
- unit tests, component tests, or service tests

## Suggested implementation order

1. App scaffold
2. Firebase initialization
3. Auth flow
4. User profile model
5. Project creation flow
6. Feed retrieval
7. Comments and collaboration requests
8. Milestones and completion flow
9. Celebration wall
10. Tests and cleanup

## Suggested Firestore data model

You can either:

- keep separate collections for each feature, or
- nest some data as subcollections

A simple approach:

- top-level `users`
- top-level `projects`
- subcollection `projects/{projectId}/updates`
- subcollection `projects/{projectId}/comments`
- top-level `collaborationRequests`

This is not the only valid design. Choose what you can explain clearly.

## Important non-functional concerns

- input validation
- loading and error states
- authorization checks
- responsive layout
- basic accessibility
- clean commit history
- clear documentation

