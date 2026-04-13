import { useState, useCallback } from 'react'
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
    title: 'Kernel_Optimizer_v2',
    description: 'Refactored core scheduling engine reducing latency by 42% for edge compute clusters.',
    stage: 'Complete',
    supportRequired: '',
    milestones: [],
    completedAt: '2026-04-05',
    createdAt: '2026-02-01',
    tags: ['#RUST', '#SYSTEMS'],
  },
  {
    id: 'p6',
    ownerId: 'u7',
    ownerName: 'Priya Singh',
    title: 'Neural_Canvas_UI',
    description: 'A generative UI kit that adapts component density based on user attention heatmaps.',
    stage: 'Complete',
    supportRequired: '',
    milestones: [],
    completedAt: '2026-04-02',
    createdAt: '2026-03-01',
    tags: ['#AI', '#DESIGN_SYSTEMS'],
    featured: true,
  },
  {
    id: 'p7',
    ownerId: 'u8',
    ownerName: 'Tom Nakamura',
    title: 'HTTP Mock Server',
    description: 'Lightweight mock server configurable via YAML with hot-reload.',
    stage: 'Complete',
    supportRequired: '',
    milestones: [],
    completedAt: '2026-03-28',
    createdAt: '2026-02-15',
    tags: ['#TYPESCRIPT', '#OSS'],
  },
  {
    id: 'p8',
    ownerId: 'u9',
    ownerName: 'Lina Mendez',
    title: 'Fin_Audit_Flow',
    description: 'An immutable ledger system for tracking open-source contributions in real-time.',
    stage: 'Complete',
    supportRequired: '',
    milestones: [],
    completedAt: '2026-03-15',
    createdAt: '2026-01-20',
    tags: ['#FINTECH', '#WEB3'],
  },
  {
    id: 'p9',
    ownerId: 'u10',
    ownerName: 'Marc Kovic',
    title: 'Stream_Pulse_Lib',
    description: 'Lightweight WebSocket wrapper with automatic failover and zero-allocation parsing.',
    stage: 'Complete',
    supportRequired: '',
    milestones: [],
    completedAt: '2026-03-10',
    createdAt: '2026-01-05',
    tags: ['#TYPESCRIPT', '#OSS'],
  },
]

const NAV_ICONS: Record<string, string> = {
  feed: '◈',
  myprojects: '◧',
  celebration: '◉',
}

export default function AppPage() {
  const [activeView, setActiveView] = useState<View>('feed')
  const [newProjectOpen, setNewProjectOpen] = useState(false)
  const [signOutHover, setSignOutHover] = useState(false)
  const [newProjectHover, setNewProjectHover] = useState(false)
  const [mouse, setMouse] = useState({ x: -9999, y: -9999 })

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    setMouse({ x: e.clientX, y: e.clientY })
  }, [])

  const navItems: { id: View; label: string }[] = [
    { id: 'feed', label: 'Feed' },
    { id: 'myprojects', label: 'My Projects' },
    { id: 'celebration', label: 'Celebration Wall' },
  ]

  return (
    <div
      onMouseMove={handleMouseMove}
      style={{ display: 'flex', minHeight: '100vh', background: '#F3F4F5', position: 'relative', overflow: 'hidden' }}
    >
      {/* ── DOT GRID BACKGROUND ── */}
      <div
        aria-hidden
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          backgroundImage: 'radial-gradient(circle, #191C1D 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          opacity: 0.07,
        }}
      />
      {/* ── MOUSE GLOW OVERLAY ── */}
      <div
        aria-hidden
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1,
          pointerEvents: 'none',
          background: `radial-gradient(circle 280px at ${mouse.x}px ${mouse.y}px, rgba(34,197,94,0.18) 0%, transparent 70%)`,
        }}
      />

      {/* ── SIDEBAR ── */}
      <aside
        style={{
          width: '260px',
          minWidth: '260px',
          background: '#fff',
          borderRight: '2px solid #111827',
          display: 'flex',
          flexDirection: 'column',
          position: 'sticky',
          top: 0,
          height: '100vh',
          zIndex: 10,
        }}
      >
        {newProjectOpen ? (
          <NewProjectPanel onSuccess={() => { setNewProjectOpen(false); setActiveView('feed') }} />
        ) : (
          <>
            {/* Brand */}
            <div style={{ padding: '20px 20px 16px', borderBottom: '2px solid #111827' }}>
              <div style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 900,
                fontSize: '1.1rem',
                letterSpacing: '-0.03em',
                color: '#111827',
                textTransform: 'uppercase',
              }}>
                <span style={{ color: '#22C55E' }}>M</span>ZANSI
                <span style={{ color: '#22C55E' }}>B</span>UILDS
              </div>
            </div>

            {/* User */}
            <div style={{ padding: '16px 20px', borderBottom: '2px solid #111827' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '38px', height: '38px',
                  background: '#22C55E',
                  border: '2px solid #111827',
                  color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700, fontSize: '0.8rem',
                  flexShrink: 0,
                }}>
                  {MOCK_USER.avatarInitials}
                </div>
                <div>
                  <div style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 700, fontSize: '0.8rem',
                    textTransform: 'uppercase', letterSpacing: '0.05em',
                  }}>
                    {MOCK_USER.displayName}
                  </div>
                  <Link to="/profile" style={{
                    fontFamily: "'Courier New', monospace",
                    fontSize: '0.65rem', color: '#191C1D',
                    textDecoration: 'none', letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    borderBottom: '1px solid #191C1D',
                  }}>
                    View profile
                  </Link>
                </div>
              </div>
            </div>

            {/* Nav */}
            <nav style={{ flex: 1, padding: '8px 0' }}>
              {navItems.map((item) => {
                const isActive = activeView === item.id && !newProjectOpen
                return (
                  <button
                    key={item.id}
                    onClick={() => { setActiveView(item.id); setNewProjectOpen(false) }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      width: '100%',
                      textAlign: 'left',
                      padding: '11px 20px',
                      background: isActive ? '#22C55E' : 'none',
                      border: 'none',
                      borderLeft: isActive ? '0px' : '3px solid transparent',
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontWeight: isActive ? 700 : 500,
                      fontSize: '0.8125rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      cursor: 'pointer',
                      color: isActive ? '#fff' : '#191C1D',
                      boxShadow: isActive ? '4px 4px 0px 0px #111827' : 'none',
                      transform: isActive ? 'translate(-2px, -2px)' : 'none',
                      marginBottom: isActive ? '4px' : '0',
                      transition: 'none',
                    }}
                  >
                    <span style={{ fontSize: '1rem', lineHeight: 1 }}>{NAV_ICONS[item.id]}</span>
                    {item.label}
                  </button>
                )
              })}
            </nav>

            {/* Bottom */}
            <div style={{ padding: '16px 20px', borderTop: '2px solid #111827' }}>
              <button
                onClick={() => setNewProjectOpen(true)}
                onMouseEnter={() => setNewProjectHover(true)}
                onMouseLeave={() => setNewProjectHover(false)}
                style={{
                  display: 'block', width: '100%',
                  padding: '11px 0',
                  background: newProjectHover ? '#111827' : '#22C55E',
                  color: '#fff',
                  border: '2px solid #111827',
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: '0.75rem', fontWeight: 800,
                  textTransform: 'uppercase', letterSpacing: '0.08em',
                  cursor: 'pointer', marginBottom: '12px',
                  boxShadow: newProjectHover ? 'none' : '4px 4px 0px 0px #111827',
                  transform: newProjectHover ? 'translate(4px, 4px)' : 'none',
                  transition: 'none',
                }}
              >
                + New Project
              </button>
              <button
                onMouseEnter={() => setSignOutHover(true)}
                onMouseLeave={() => setSignOutHover(false)}
                style={{
                  background: 'none', border: 'none', padding: 0,
                  fontFamily: "'Courier New', monospace",
                  fontSize: '0.7rem', letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  textDecoration: signOutHover ? 'underline' : 'none',
                  cursor: 'pointer', color: '#191C1D',
                }}
              >
                Sign out
              </button>
            </div>
          </>
        )}
      </aside>

      {/* ── MAIN PANEL ── */}
      <main style={{ flex: 1, minWidth: 0, position: 'relative', zIndex: 5, display: 'flex', flexDirection: 'column' }}>
        {/* Top bar */}
        {!newProjectOpen && (
          <header style={{
            position: 'sticky', top: 0, zIndex: 20,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0 32px',
            height: '56px',
            background: 'rgba(248,249,250,0.85)',
            backdropFilter: 'blur(12px)',
            borderBottom: '2px solid #111827',
          }}>
            <div style={{ display: 'flex', gap: '24px' }}>
              {(['Docs', 'Community'] as const).map(label => (
                <a key={label} href="#" style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: '0.7rem', fontWeight: 600,
                  textTransform: 'uppercase', letterSpacing: '0.08em',
                  color: '#191C1D', textDecoration: 'none',
                }}>
                  {label}
                </a>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ position: 'relative' }}>
                <input
                  placeholder="SEARCH_BUILDERS"
                  style={{
                    border: '2px solid #111827', background: '#fff',
                    padding: '6px 12px 6px 28px',
                    fontFamily: "'Courier New', monospace",
                    fontSize: '0.7rem', letterSpacing: '0.05em',
                    width: '200px', outline: 'none',
                  }}
                />
                <span style={{
                  position: 'absolute', left: '8px', top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '0.75rem', color: '#6b7280',
                }}>⌕</span>
              </div>
            </div>
          </header>
        )}

        {/* Content */}
        <div style={{ flex: 1, padding: newProjectOpen ? '0' : '40px 48px', maxWidth: '1400px', width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
          {newProjectOpen ? (
            <NewProjectPanel onSuccess={() => { setNewProjectOpen(false); setActiveView('feed') }} />
          ) : activeView === 'feed' ? (
            <FeedView feedItems={MOCK_FEED} currentUserId={MOCK_USER.id} />
          ) : activeView === 'myprojects' ? (
            <MyProjectsView projects={MOCK_MY_PROJECTS} />
          ) : (
            <CelebrationWallView projects={MOCK_COMPLETED} />
          )}
        </div>
      </main>
    </div>
  )
}
