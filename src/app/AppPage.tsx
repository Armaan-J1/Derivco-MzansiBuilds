import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import DotGrid from '../component/DotGrid'
import { FeedItem, Project, User } from '../types'
import CelebrationWallView from '../features/celebration/CelebrationWallView'
import FeedView from '../features/feed/FeedView'
import NewProjectPanel from '../features/projects/NewProjectPanel'
import MyProjectsView from '../features/projects/MyProjectsView'

type View = 'feed' | 'myprojects' | 'celebration' | 'newproject'

const MOCK_USER: User = {
  id: 'u1',
  displayName: 'Alex Chen',
  email: 'alex@example.com',
  bio: 'Building in public since 2024',
  avatarInitials: 'AC',
}

const INITIAL_FEED: FeedItem[] = [
  {
    id: 'f1',
    type: 'new_project',
    project: {
      id: 'p1',
      ownerId: 'u2',
      ownerName: 'Jordan Lee',
      title: 'DevLog - a developer journal',
      description: 'A minimal journaling tool for developers to track progress publicly.',
      stage: 'In Progress',
      supportRequired: 'UI feedback',
      githubUrl: 'https://github.com/jordan/devlog',
      githubVisible: true,
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
      githubUrl: 'https://github.com/alex/snippet-manager',
      githubVisible: true,
      milestones: [],
      createdAt: '2026-04-09',
    },
    comments: [],
    raiseHandCount: 1,
    raisedByMe: false,
    raiseHandRequests: [{ userId: 'u4', userName: 'Dev Patel', email: 'dev.patel@example.com', note: 'I can help with the CLI architecture' }],
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
      githubUrl: 'https://github.com/riley/openapi-linter',
      githubVisible: false,
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

const INITIAL_MY_PROJECTS: Project[] = [
  {
    id: 'p2',
    ownerId: 'u1',
    ownerName: 'Alex Chen',
    title: 'CLI Snippet Manager',
    description: 'Terminal-first tool for storing and searching code snippets.',
    stage: 'Planning',
    supportRequired: 'code review',
    githubUrl: 'https://github.com/alex/snippet-manager',
    githubVisible: true,
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
    githubUrl: 'https://github.com/alex/markdown-resume-builder',
    githubVisible: false,
    milestones: [
      { id: 'm3', date: '2026-03-20', title: 'MVP complete', description: 'First working version with HTML export.' },
    ],
    createdAt: '2026-03-15',
  },
]

const INITIAL_COMPLETED: Project[] = [
  {
    id: 'p5',
    ownerId: 'u6',
    ownerName: 'Chris Wu',
    title: 'Kernel_Optimizer_v2',
    description: 'Refactored core scheduling engine reducing latency by 42% for edge compute clusters.',
    stage: 'Complete',
    supportRequired: '',
    githubUrl: 'https://github.com/chris/kernel-optimizer-v2',
    githubVisible: true,
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
    githubUrl: 'https://github.com/priya/neural-canvas-ui',
    githubVisible: true,
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
    githubUrl: 'https://github.com/tom/http-mock-server',
    githubVisible: true,
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
    githubUrl: 'https://github.com/lina/fin-audit-flow',
    githubVisible: false,
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
    githubUrl: 'https://github.com/marc/stream-pulse-lib',
    githubVisible: true,
    milestones: [],
    completedAt: '2026-03-10',
    createdAt: '2026-01-05',
    tags: ['#TYPESCRIPT', '#OSS'],
  },
]

const NAV_ICONS: Record<View, string> = {
  feed: '*',
  myprojects: '[]',
  celebration: 'o',
  newproject: '+',
}

export default function AppPage() {
  const navigate = useNavigate()
  const [activeView, setActiveView] = useState<View>('feed')
  const [signOutHover, setSignOutHover] = useState(false)
  const [newProjectHover, setNewProjectHover] = useState(false)
  const [feedItems, setFeedItems] = useState<FeedItem[]>(INITIAL_FEED)
  const [myProjects, setMyProjects] = useState<Project[]>(INITIAL_MY_PROJECTS)
  const [completedProjects, setCompletedProjects] = useState<Project[]>(INITIAL_COMPLETED)

  function syncProjectAcrossViews(project: Project) {
    setFeedItems((prev) => prev.map((item) => (
      item.project.id === project.id ? { ...item, project: { ...item.project, ...project } } : item
    )))
    setCompletedProjects((prev) => prev.map((item) => (
      item.id === project.id ? { ...item, ...project } : item
    )))
  }

  function handleProjectsChange(nextProjects: Project[]) {
    setMyProjects(nextProjects)
    nextProjects.forEach(syncProjectAcrossViews)
  }

  function handleCreateProject(project: {
    title: string
    description: string
    stage: Project['stage']
    supportRequired: string
    githubUrl: string
    githubVisible: boolean
  }) {
    const createdAt = new Date().toISOString().slice(0, 10)
    const newProject: Project = {
      id: `p${Date.now()}`,
      ownerId: MOCK_USER.id,
      ownerName: MOCK_USER.displayName,
      title: project.title,
      description: project.description,
      stage: project.stage,
      supportRequired: project.supportRequired,
      githubUrl: project.githubUrl,
      githubVisible: project.githubVisible,
      milestones: [],
      createdAt,
    }

    const newFeedItem: FeedItem = {
      id: `f${Date.now()}`,
      type: 'new_project',
      project: newProject,
      comments: [],
      raiseHandCount: 0,
      raisedByMe: false,
      raiseHandRequests: [],
      createdAt,
    }

    setMyProjects((prev) => [newProject, ...prev])
    setFeedItems((prev) => [newFeedItem, ...prev])
    if (newProject.stage === 'Complete') {
      setCompletedProjects((prev) => [newProject, ...prev])
    }
    setActiveView('myprojects')
  }

  const navItems: { id: Exclude<View, 'newproject'>; label: string }[] = [
    { id: 'feed', label: 'Feed' },
    { id: 'myprojects', label: 'My Projects' },
    { id: 'celebration', label: 'Celebration Wall' },
  ]

  const viewTitle =
    activeView === 'feed'
      ? 'Feed'
      : activeView === 'myprojects'
        ? 'My Projects'
        : activeView === 'celebration'
          ? 'Celebration Wall'
          : 'New Project'

  return (
    <div
      style={{ display: 'flex', height: '100vh', background: '#F3F4F5', position: 'relative', overflow: 'hidden' }}
    >
      {/* DotGrid background */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <DotGrid
          dotSize={4}
          gap={26}
          baseColor="#ededed"
          activeColor="#2bff00"
          proximity={100}
          speedTrigger={100}
          shockRadius={250}
          shockStrength={6}
          maxSpeed={5000}
          resistance={750}
          returnDuration={1.5}
        />
      </div>

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
          overflow: 'hidden',
          zIndex: 10,
        }}
      >
        <div style={{ padding: '20px 20px 20px', borderBottom: '2px solid #111827' }}>
          <div
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 900,
              fontSize: '1.1rem',
              letterSpacing: '-0.03em',
              color: '#111827',
              textTransform: 'uppercase',
            }}
          >
            <span style={{ color: '#22C55E' }}>M</span>ZANSI
            <span style={{ color: '#22C55E' }}>B</span>UILDS
          </div>
        </div>

        <div style={{ padding: '20px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                background: '#22C55E',
                border: '2px solid #111827',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: '0.8rem',
                flexShrink: 0,
              }}
            >
              {MOCK_USER.avatarInitials}
            </div>
            <div>
              <div
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                {MOCK_USER.displayName}
              </div>
              <Link
                to="/profile"
                style={{
                  fontFamily: "'Courier New', monospace",
                  fontSize: '0.65rem',
                  color: '#191C1D',
                  textDecoration: 'none',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  borderBottom: '1px solid #191C1D',
                }}
              >
                View profile
              </Link>
            </div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: '8px 0' }}>
          {navItems.map((item) => {
            const isActive = activeView === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
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

        <div style={{ padding: '16px 20px', borderTop: '2px solid #111827' }}>
          <button
            onClick={() => setActiveView('newproject')}
            onMouseEnter={() => setNewProjectHover(true)}
            onMouseLeave={() => setNewProjectHover(false)}
            style={{
              display: 'block',
              width: '100%',
              padding: '11px 0',
              background: activeView === 'newproject' || newProjectHover ? '#111827' : '#22C55E',
              color: '#fff',
              border: '2px solid #111827',
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '0.75rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              cursor: 'pointer',
              marginBottom: '12px',
              boxShadow: activeView === 'newproject' || newProjectHover ? 'none' : '4px 4px 0px 0px #111827',
              transform: activeView === 'newproject' || newProjectHover ? 'translate(4px, 4px)' : 'none',
              transition: 'none',
            }}
          >
            + New Project
          </button>
          <button
            onClick={() => navigate('/')}
            onMouseEnter={() => setSignOutHover(true)}
            onMouseLeave={() => setSignOutHover(false)}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              fontFamily: "'Courier New', monospace",
              fontSize: '0.7rem',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              textDecoration: signOutHover ? 'underline' : 'none',
              cursor: 'pointer',
              color: '#191C1D',
            }}
          >
            Sign out
          </button>
        </div>
      </aside>

      <main
        style={{
          flex: 1,
          minWidth: 0,
          minHeight: 0,
          height: '100vh',
          overflowY: 'auto',
          overflowX: 'hidden',
          position: 'relative',
          zIndex: 5,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <header
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 32px',
            height: '64px',
            background: 'rgba(248,249,250,0.85)',
            backdropFilter: 'blur(12px)',
            borderBottom: '2px solid #111827',
          }}
        >
          <div
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '0.8rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: '#191C1D',
            }}
          >
            {viewTitle}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ position: 'relative' }}>
              <input
                placeholder="SEARCH_BUILDERS"
                style={{
                  border: '2px solid #111827',
                  background: '#fff',
                  padding: '6px 12px 6px 28px',
                  fontFamily: "'Courier New', monospace",
                  fontSize: '0.7rem',
                  letterSpacing: '0.05em',
                  width: '200px',
                  outline: 'none',
                }}
              />
              <span
                style={{
                  position: 'absolute',
                  left: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '0.75rem',
                  color: '#6b7280',
                }}
              >
                ?
              </span>
            </div>
          </div>
        </header>

        <div
          style={{
            flex: 1,
            minHeight: 0,
            padding: activeView === 'newproject' ? '32px 48px 40px' : '40px 48px',
            maxWidth: '1400px',
            width: '100%',
            margin: '0 auto',
            boxSizing: 'border-box',
          }}
        >
          {activeView === 'feed' ? (
            <FeedView feedItems={feedItems} currentUserId={MOCK_USER.id} />
          ) : activeView === 'myprojects' ? (
            <MyProjectsView projects={myProjects} onProjectsChange={handleProjectsChange} />
          ) : activeView === 'newproject' ? (
            <NewProjectPanel onCreate={handleCreateProject} />
          ) : (
            <CelebrationWallView projects={completedProjects} />
          )}
        </div>
      </main>
    </div>
  )
}
