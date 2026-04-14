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
import { useIsMobile } from '../hooks/useIsMobile'
import type { DocumentSnapshot } from 'firebase/firestore'

type View = 'feed' | 'myprojects' | 'celebration' | 'newproject'

function IconFeed({ color }: { color: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="2" width="16" height="3" fill={color} />
      <rect x="1" y="7.5" width="11" height="3" fill={color} />
      <rect x="1" y="13" width="13" height="3" fill={color} />
    </svg>
  )
}

function IconProjects({ color }: { color: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="7" height="7" fill={color} />
      <rect x="10" y="1" width="7" height="7" fill={color} />
      <rect x="1" y="10" width="7" height="7" fill={color} />
      <rect x="10" y="10" width="7" height="7" fill={color} />
    </svg>
  )
}

function IconCelebration({ color }: { color: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 1L11.06 6.26L17 6.73L12.75 10.37L14.18 16L9 13.01L3.82 16L5.25 10.37L1 6.73L6.94 6.26L9 1Z" fill={color} />
    </svg>
  )
}

function IconProfile({ color }: { color: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="9" cy="5.5" r="3.5" fill={color} />
      <path d="M2 16c0-3.866 3.134-7 7-7s7 3.134 7 7" stroke={color} strokeWidth="2" strokeLinecap="square" />
    </svg>
  )
}

const NAV_ICON_COMPONENTS: Record<string, (color: string) => JSX.Element> = {
  feed: (c) => <IconFeed color={c} />,
  myprojects: (c) => <IconProjects color={c} />,
  celebration: (c) => <IconCelebration color={c} />,
  profile: (c) => <IconProfile color={c} />,
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
  const [searchQuery, setSearchQuery] = useState('')

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
    if (activeView === 'celebration') {
      getCompletedProjects().then(setCompletedProjects)
    }
  }, [activeView])

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
    setCompletedProjects((prev) => {
      const exists = prev.some((item) => item.id === project.id)
      if (project.stage === 'Complete' && !exists) return [project, ...prev]
      return prev.map((item) => item.id === project.id ? { ...item, ...project } : item)
    })
  }

  function handleProjectsChange(nextProjects: Project[]) {
    // Sync feed item snapshots for any projects that changed
    nextProjects.forEach((project) => {
      const prev = myProjects.find((p) => p.id === project.id)
      if (prev && (
        prev.stage !== project.stage ||
        prev.title !== project.title ||
        prev.description !== project.description ||
        prev.supportRequired !== project.supportRequired ||
        prev.githubUrl !== project.githubUrl ||
        prev.githubVisible !== project.githubVisible
      )) {
        const feedItem = feedItems.find((item) => item.project.id === project.id)
        if (feedItem) {
          updateFeedItemSnapshot(feedItem.id, {
            stage: project.stage,
            title: project.title,
            description: project.description,
            supportRequired: project.supportRequired,
            githubUrl: project.githubUrl,
            githubVisible: project.githubVisible,
          }).catch(console.error)
        }
      }
    })
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
    if (!user) throw new Error('Not authenticated')
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
      commentCount: 0,
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

  const isMobile = useIsMobile()

  async function handleSignOut() {
    await logout()
    navigate('/')
  }

  function switchView(view: View) {
    setActiveView(view)
    setSearchQuery('')
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
          baseColor="#e5e5e5"
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
          width: isMobile ? '100%' : '260px',
          minWidth: isMobile ? 'unset' : '260px',
          background: '#fff',
          borderRight: isMobile ? 'none' : '2px solid #111827',
          borderTop: isMobile ? '2px solid #111827' : 'none',
          display: 'flex',
          flexDirection: isMobile ? 'row' : 'column',
          position: isMobile ? 'fixed' : 'sticky',
          bottom: isMobile ? 0 : 'unset',
          top: isMobile ? 'unset' : 0,
          left: isMobile ? 0 : 'unset',
          height: isMobile ? '60px' : '100vh',
          overflow: 'hidden',
          zIndex: 50,
        }}
      >
        <div style={{ padding: '20px 20px 20px', borderBottom: '2px solid #111827', display: isMobile ? 'none' : 'block' }}>
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

        <div style={{ padding: '20px 20px', display: isMobile ? 'none' : 'block' }}>
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

        <nav style={{ flex: 1, padding: isMobile ? '0' : '8px 0', display: 'flex', flexDirection: isMobile ? 'row' : 'column' }}>
          {[
            ...navItems,
            ...(isMobile ? [{ id: 'profile' as const, label: 'Profile' }] : []),
          ].map((item) => {
            const isActive = activeView === item.id
            const iconColor = isMobile
              ? (isActive ? '#22C55E' : '#6b7280')
              : (isActive ? '#fff' : '#191C1D')
            return (
              <button
                key={item.id}
                onClick={() => item.id === 'profile' ? navigate('/profile') : switchView(item.id as View)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: isMobile ? 'center' : 'flex-start',
                  flexDirection: isMobile ? 'column' : 'row',
                  gap: isMobile ? '3px' : '10px',
                  flex: isMobile ? 1 : 'unset',
                  width: isMobile ? 'auto' : '90%',
                  marginLeft: isMobile ? '0' : '16px',
                  textAlign: 'left',
                  padding: isMobile ? '8px 4px' : '11px 20px',
                  background: isActive ? (isMobile ? 'transparent' : '#22C55E') : 'none',
                  border: 'none',
                  borderLeft: !isMobile && isActive ? '0px' : !isMobile ? '3px solid transparent' : 'none',
                  borderTop: isMobile && isActive ? '2px solid #22C55E' : isMobile ? '2px solid transparent' : 'none',
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: isActive ? 700 : 500,
                  fontSize: isMobile ? '0.5rem' : '0.8125rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  cursor: 'pointer',
                  color: isMobile ? (isActive ? '#22C55E' : '#6b7280') : (isActive ? '#fff' : '#191C1D'),
                  boxShadow: !isMobile && isActive ? '4px 4px 0px 0px #111827' : 'none',
                  transform: !isMobile && isActive ? 'translate(-2px, -2px)' : 'none',
                  marginBottom: !isMobile && isActive ? '4px' : '0',
                  transition: 'none',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                  {NAV_ICON_COMPONENTS[item.id]?.(iconColor)}
                </span>
                {item.label}
              </button>
            )
          })}
        </nav>

        <div style={{ padding: '16px 20px', borderTop: '2px solid #111827', display: isMobile ? 'none' : 'block' }}>
          <button
            onClick={() => switchView('newproject')}
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
          paddingBottom: isMobile ? '60px' : '0',
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
            padding: isMobile ? '0 16px' : '0 32px',
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
          {(activeView === 'feed' || activeView === 'celebration') && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ position: 'relative' }}>
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={activeView === 'celebration' ? 'SEARCH_BUILDERS' : 'SEARCH_PROJECTS'}
                  style={{
                    border: '2px solid #111827',
                    background: '#fff',
                    padding: '6px 12px 6px 28px',
                    fontFamily: "'Courier New', monospace",
                    fontSize: '0.7rem',
                    letterSpacing: '0.05em',
                    width: '220px',
                    outline: 'none',
                  }}
                  onFocus={(e) => (e.target.style.outline = '2px solid #22C55E')}
                  onBlur={(e) => (e.target.style.outline = 'none')}
                />
                <span style={{
                  position: 'absolute', left: '8px', top: '50%',
                  transform: 'translateY(-50%)', fontSize: '0.75rem', color: '#6b7280',
                }}>
                  /
                </span>
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} style={{
                    position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', padding: '2px',
                    fontSize: '0.7rem', color: '#6b7280', lineHeight: 1,
                  }}>✕</button>
                )}
              </div>
            </div>
          )}
        </header>

        <div
          style={{
            flex: 1,
            minHeight: 0,
            padding: isMobile ? '20px 16px' : activeView === 'newproject' ? '32px 48px 40px' : '40px 48px',
            maxWidth: '1400px',
            width: '100%',
            margin: '0 auto',
            boxSizing: 'border-box',
          }}
        >
          {activeView === 'feed' ? (
            <FeedView
              feedItems={feedItems.filter((item) => item.project.stage !== 'Blocked')}
              currentUserId={user?.uid ?? ''}
              searchQuery={searchQuery}
              hasMoreFromServer={!!feedLastDoc}
              feedLoading={feedLoading}
              onLoadMoreFromServer={loadMore}
            />
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
            <CelebrationWallView projects={completedProjects} searchQuery={searchQuery} />
          )}
        </div>
      </main>
    </div>
  )
}
