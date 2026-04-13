import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import DotGrid from '../component/DotGrid'
import { FeedItem, Project } from '../types'
import CelebrationWallView from '../features/celebration/CelebrationWallView'
import FeedView from '../features/feed/FeedView'
import NewProjectPanel from '../features/projects/NewProjectPanel'
import MyProjectsView from '../features/projects/MyProjectsView'
import { useAuthStore } from '../features/auth/useAuthStore'
import { logout } from '../services/authService'
import { getFeed, createFeedItem, updateFeedItemSnapshot } from '../services/feedService'
import { getMyProjects, createProject, getCompletedProjects } from '../services/projectService'
import type { DocumentSnapshot } from 'firebase/firestore'

type View = 'feed' | 'myprojects' | 'celebration' | 'newproject'

const NAV_ICONS: Record<View, string> = {
  feed: '*',
  myprojects: '[]',
  celebration: 'o',
  newproject: '+',
}

export default function AppPage() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [activeView, setActiveView] = useState<View>('feed')
  const [signOutHover, setSignOutHover] = useState(false)
  const [newProjectHover, setNewProjectHover] = useState(false)
  const [feedItems, setFeedItems] = useState<FeedItem[]>([])
  const [myProjects, setMyProjects] = useState<Project[]>([])
  const [completedProjects, setCompletedProjects] = useState<Project[]>([])
  const [feedLastDoc, setFeedLastDoc] = useState<DocumentSnapshot | null>(null)
  const [feedLoading, setFeedLoading] = useState(false)

  // Compute avatar initials from auth user
  const displayName = user?.displayName ?? ''
  const avatarInitials = displayName
    .split(' ')
    .map((n) => n[0] ?? '')
    .join('')
    .toUpperCase()
    .slice(0, 2) || '??'

  useEffect(() => {
    setFeedLoading(true)
    getFeed(10).then(({ items, lastDoc }) => {
      setFeedItems(items)
      setFeedLastDoc(lastDoc)
    }).finally(() => setFeedLoading(false))
  }, [])

  useEffect(() => {
    if (!user) return
    getMyProjects(user.uid).then(setMyProjects)
  }, [user])

  useEffect(() => {
    getCompletedProjects().then(setCompletedProjects)
  }, [])

  async function loadMore() {
    if (!feedLastDoc || feedLoading) return
    setFeedLoading(true)
    try {
      const { items, lastDoc } = await getFeed(10, feedLastDoc)
      setFeedItems((prev) => [...prev, ...items])
      setFeedLastDoc(lastDoc)
    } finally {
      setFeedLoading(false)
    }
  }

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

  async function handleCreateProject(project: {
    title: string
    description: string
    stage: Project['stage']
    supportRequired: string
    githubUrl: string
    githubVisible: boolean
  }) {
    if (!user) return
    const createdAt = new Date().toISOString().slice(0, 10)
    const projectId = await createProject(user.uid, displayName, project)
    const feedItemId = await createFeedItem(
      'new_project',
      projectId,
      user.uid,
      displayName,
      project
    )

    const newProject: Project = {
      id: projectId,
      ownerId: user.uid,
      ownerName: displayName,
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
      id: feedItemId,
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

  async function handleSignOut() {
    await logout()
    navigate('/')
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
              {avatarInitials}
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
                {displayName}
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
            onClick={handleSignOut}
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
            <>
              <FeedView feedItems={feedItems} currentUserId={user?.uid ?? ''} />
              {feedLastDoc && (
                <button
                  onClick={loadMore}
                  disabled={feedLoading}
                  style={{
                    display: 'block', margin: '24px auto 0',
                    padding: '10px 24px',
                    background: 'transparent', color: '#191C1D',
                    border: '2px solid #111827',
                    fontFamily: "'Courier New', monospace",
                    fontSize: '0.7rem', fontWeight: 700,
                    textTransform: 'uppercase', letterSpacing: '0.08em',
                    cursor: feedLoading ? 'not-allowed' : 'pointer',
                  }}
                >
                  {feedLoading ? 'Loading...' : 'Load more'}
                </button>
              )}
            </>
          ) : activeView === 'myprojects' ? (
            <MyProjectsView
              projects={myProjects}
              onProjectsChange={handleProjectsChange}
              currentUserId={user?.uid ?? ''}
              updateFeedSnapshot={updateFeedItemSnapshot}
            />
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
