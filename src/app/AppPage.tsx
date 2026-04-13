import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FeedItem, Project, User } from '../types'
import FeedView from '../features/feed/FeedView'
import MyProjectsView from '../features/projects/MyProjectsView'
import CelebrationWallView from '../features/celebration/CelebrationWallView'
import NewProjectPanel from '../features/projects/NewProjectPanel'

type View = 'feed' | 'myprojects' | 'celebration'

const MOCK_USER: User = {
  id: 'u1',
  displayName: 'Alex Chen',
  email: 'alex@example.com',
  bio: 'Building in public since 2024',
  avatarInitials: 'AC',
}

const MOCK_FEED: FeedItem[] = [
  {
    id: 'f1',
    type: 'new_project',
    project: {
      id: 'p1',
      ownerId: 'u2',
      ownerName: 'Jordan Lee',
      title: 'DevLog — a developer journal',
      description: 'A minimal journaling tool for developers to track progress publicly.',
      stage: 'In Progress',
      supportRequired: 'UI feedback',
      milestones: [],
      createdAt: '2026-04-10',
    },
    comments: [
      { id: 'c1', authorId: 'u3', authorName: 'Sam K', text: 'Love this idea!', createdAt: '2026-04-10' },
    ],
    raiseHandCount: 3,
    raisedByMe: false,
    raiseHandRequests: [],
    createdAt: '2026-04-10',
  },
  {
    id: 'f2',
    type: 'update',
    project: {
      id: 'p2',
      ownerId: 'u1',
      ownerName: 'Alex Chen',
      title: 'CLI Snippet Manager',
      description: 'Terminal-first tool for storing and searching code snippets.',
      stage: 'Planning',
      supportRequired: 'code review',
      milestones: [],
      createdAt: '2026-04-09',
    },
    comments: [],
    raiseHandCount: 1,
    raisedByMe: false,
    raiseHandRequests: [{ userId: 'u4', userName: 'Dev Patel', note: 'I can help with the CLI architecture' }],
    createdAt: '2026-04-09',
  },
  {
    id: 'f3',
    type: 'new_project',
    project: {
      id: 'p3',
      ownerId: 'u5',
      ownerName: 'Riley Morgan',
      title: 'OpenAPI Linter',
      description: 'Validates and lints OpenAPI specs with custom rules.',
      stage: 'Blocked',
      supportRequired: 'finding a co-founder',
      milestones: [],
      createdAt: '2026-04-08',
    },
    comments: [],
    raiseHandCount: 7,
    raisedByMe: true,
    raiseHandRequests: [],
    createdAt: '2026-04-08',
  },
]

const MOCK_MY_PROJECTS: Project[] = [
  {
    id: 'p2',
    ownerId: 'u1',
    ownerName: 'Alex Chen',
    title: 'CLI Snippet Manager',
    description: 'Terminal-first tool for storing and searching code snippets.',
    stage: 'Planning',
    supportRequired: 'code review',
    milestones: [
      { id: 'm1', date: '2026-04-01', title: 'Repo setup', description: 'Initialized the project with Go modules.' },
      { id: 'm2', date: '2026-04-08', title: 'Basic CLI structure', description: 'Added command parsing and help output.' },
    ],
    createdAt: '2026-04-09',
  },
  {
    id: 'p4',
    ownerId: 'u1',
    ownerName: 'Alex Chen',
    title: 'Markdown Resume Builder',
    description: 'Generate beautiful resumes from markdown files.',
    stage: 'Wrapping Up',
    supportRequired: 'beta testers',
    milestones: [
      { id: 'm3', date: '2026-03-20', title: 'MVP complete', description: 'First working version with HTML export.' },
    ],
    createdAt: '2026-03-15',
  },
]

const MOCK_COMPLETED: Project[] = [
  {
    id: 'p5',
    ownerId: 'u6',
    ownerName: 'Chris Wu',
    title: 'Git Commit Analyzer',
    description: 'Visualizes commit patterns and code churn over time.',
    stage: 'Complete',
    supportRequired: '',
    milestones: [],
    completedAt: '2026-04-05',
    createdAt: '2026-02-01',
  },
  {
    id: 'p6',
    ownerId: 'u7',
    ownerName: 'Priya Singh',
    title: 'Dotenv Validator',
    description: 'Checks .env files against a schema to prevent missing vars in prod.',
    stage: 'Complete',
    supportRequired: '',
    milestones: [],
    completedAt: '2026-04-02',
    createdAt: '2026-03-01',
  },
  {
    id: 'p7',
    ownerId: 'u8',
    ownerName: 'Tom Nakamura',
    title: 'HTTP Mock Server',
    description: 'Lightweight mock server configurable via YAML.',
    stage: 'Complete',
    supportRequired: '',
    milestones: [],
    completedAt: '2026-03-28',
    createdAt: '2026-02-15',
  },
]

export default function AppPage() {
  const [activeView, setActiveView] = useState<View>('feed')
  const [newProjectOpen, setNewProjectOpen] = useState(false)
  const [signOutHover, setSignOutHover] = useState(false)
  const [newProjectHover, setNewProjectHover] = useState(false)

  const navItems: { id: View; label: string }[] = [
    { id: 'feed', label: 'Feed' },
    { id: 'myprojects', label: 'My Projects' },
    { id: 'celebration', label: 'Celebration Wall' },
  ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F3F4F5' }}>
      {/* Sidebar */}
      <aside
        style={{
          width: '260px',
          minWidth: '260px',
          background: '#fff',
          borderRight: '1px solid #E7E8E9',
          display: 'flex',
          flexDirection: 'column',
          position: 'sticky',
          top: 0,
          height: '100vh',
        }}
      >
        {/* User info */}
        <div style={{ padding: '24px 20px', borderBottom: '1px solid #E7E8E9' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                background: '#22C55E',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: '0.875rem',
                flexShrink: 0,
              }}
            >
              {MOCK_USER.avatarInitials}
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{MOCK_USER.displayName}</div>
              <Link
                to="/profile"
                style={{
                  fontSize: '0.75rem',
                  color: '#191C1D',
                  textDecoration: 'underline',
                }}
              >
                View profile
              </Link>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 0' }}>
          {navItems.map((item) => {
            const isActive = activeView === item.id && !newProjectOpen
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveView(item.id)
                  setNewProjectOpen(false)
                }}
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  padding: '12px 20px',
                  background: 'none',
                  border: 'none',
                  borderLeft: isActive ? '3px solid #22C55E' : '3px solid transparent',
                  fontWeight: isActive ? 600 : 400,
                  fontSize: isActive ? '0.9375rem' : '0.875rem',
                  cursor: 'pointer',
                  color: '#191C1D',
                }}
              >
                {item.label}
              </button>
            )
          })}
        </nav>

        {/* Bottom actions */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid #E7E8E9' }}>
          <button
            onClick={() => setNewProjectOpen(true)}
            onMouseEnter={() => setNewProjectHover(true)}
            onMouseLeave={() => setNewProjectHover(false)}
            style={{
              display: 'block',
              width: '100%',
              padding: '10px 0',
              background: newProjectHover ? '#006E2F' : '#22C55E',
              color: '#fff',
              border: 'none',
              fontFamily: "'Courier New', Courier, monospace",
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase' as const,
              letterSpacing: '0.06em',
              cursor: 'pointer',
              marginBottom: '12px',
            }}
          >
            + New Project
          </button>
          <button
            onClick={() => {}}
            onMouseEnter={() => setSignOutHover(true)}
            onMouseLeave={() => setSignOutHover(false)}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              fontSize: '0.8125rem',
              textDecoration: signOutHover ? 'underline' : 'none',
              cursor: 'pointer',
              color: '#191C1D',
            }}
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Main panel */}
      <main style={{ flex: 1, minWidth: 0, padding: '32px' }}>
        {newProjectOpen ? (
          <NewProjectPanel onSuccess={() => { setNewProjectOpen(false); setActiveView('feed') }} />
        ) : activeView === 'feed' ? (
          <FeedView feedItems={MOCK_FEED} currentUserId={MOCK_USER.id} />
        ) : activeView === 'myprojects' ? (
          <MyProjectsView projects={MOCK_MY_PROJECTS} />
        ) : (
          <CelebrationWallView projects={MOCK_COMPLETED} />
        )}
      </main>
    </div>
  )
}
