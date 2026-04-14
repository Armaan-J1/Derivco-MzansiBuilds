import { useState, useEffect } from 'react'
import { FeedItem, Milestone } from '../../types'
import CommentThread from '../comments/CommentThread'
import CollabRequests from '../collaboration/CollabRequests'
import { getRaiseHandStatus, raiseHand, lowerHand, getRaiseHandRequests } from '../../services/raiseHandService'
import type { RaiseHandRequest } from '../../services/raiseHandService'
import { getProjectMilestones } from '../../services/projectService'
import { useAuthStore } from '../auth/useAuthStore'

interface Props {
  item: FeedItem
  currentUserId: string
}

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - date.getTime()) / 86400000)
  if (diffDays === 0) return 'today'
  if (diffDays === 1) return '1 day ago'
  return `${diffDays} days ago`
}

function stageBg(stage: string): string {
  switch (stage) {
    case 'In Progress': return '#22C55E'
    case 'Blocked': return '#DC2626'
    case 'Planning': return '#F59E0B'
    case 'Wrapping Up': return '#111827'
    case 'Complete': return '#22C55E'
    default: return '#111827'
  }
}

function getInitials(name: string): string {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
}

export default function FeedCard({ item, currentUserId }: Props) {
  const { user } = useAuthStore()
  const [commentsOpen, setCommentsOpen] = useState(false)
  const [requestsOpen, setRequestsOpen] = useState(false)

  const [raisedByMe, setRaisedByMe] = useState(item.raisedByMe)
  const [raiseCount, setRaiseCount] = useState(item.raiseHandCount)
  const [hovered, setHovered] = useState(false)
  const [raiseHandRequests, setRaiseHandRequests] = useState<RaiseHandRequest[]>([])
  const [milestones, setMilestones] = useState<Milestone[]>(item.project.milestones ?? [])

  const isOwner = item.project.ownerId === currentUserId

  useEffect(() => {
    if (!currentUserId || isOwner) return
    getRaiseHandStatus(item.id, currentUserId).then(setRaisedByMe)
  }, [item.id, currentUserId, isOwner])

  useEffect(() => {
    if ((item.project.milestones ?? []).length > 0) return
    getProjectMilestones(item.project.id).then(setMilestones).catch(() => {})
  }, [item.project.id, item.project.milestones])

  async function handleRaiseHand() {
    if (!user) return
    const email = user.email ?? ''
    const userName = user.displayName ?? ''
    if (raisedByMe) {
      setRaisedByMe(false)
      setRaiseCount((n) => n - 1)
      await lowerHand(item.id, currentUserId)
    } else {
      setRaisedByMe(true)
      setRaiseCount((n) => n + 1)
      await raiseHand(item.id, currentUserId, userName, email)
    }
  }

  async function handleOpenRequests() {
    setRequestsOpen((o) => !o)
    if (!requestsOpen) {
      const requests = await getRaiseHandRequests(item.id)
      setRaiseHandRequests(requests)
    }
  }

  const actionBtn: React.CSSProperties = {
    padding: '7px 16px',
    background: 'transparent',
    color: '#191C1D',
    border: '2px solid #111827',
    fontFamily: "'Courier New', Courier, monospace",
    fontSize: '0.65rem', fontWeight: 700,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.07em',
    cursor: 'pointer',
    transition: 'none',
  }

  function milestoneStatus(ms: Milestone): { label: string; color: string; filled: boolean } {
    const today = new Date().toISOString().slice(0, 10)
    if (ms.date < today) return { label: 'COMPLETED', color: '#22C55E', filled: true }
    if (ms.date === today) return { label: 'IN PROGRESS', color: '#006E2F', filled: false }
    return { label: 'BACKLOG', color: '#6b7280', filled: false }
  }

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#fff',
        border: '2px solid #111827',
        transform: hovered ? 'translate(-2px, -2px)' : 'none',
        boxShadow: hovered ? '6px 6px 0px 0px rgba(0,110,47,1)' : 'none',
        transition: 'none',
        display: 'flex',
      }}
    >
      {/* ── LEFT: main content ── */}
      <div style={{ width: '760px', minWidth: '760px', flexShrink: 0 }}>
      <div style={{ padding: '20px 22px 0' }}>
        {/* Type tag */}
        <span style={{
          display: 'inline-block',
          padding: '3px 10px',
          background: item.type === 'new_project' ? '#22C55E' : 'transparent',
          border: item.type === 'update' ? '2px solid #111827' : 'none',
          color: item.type === 'new_project' ? '#fff' : '#191C1D',
          fontFamily: "'Courier New', monospace",
          fontSize: '0.6rem', fontWeight: 700,
          textTransform: 'uppercase' as const,
          letterSpacing: '0.12em',
          marginBottom: '14px',
        }}>
          {item.type === 'new_project' ? 'new project' : 'update'}
        </span>

        {/* Author */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
          <div style={{
            width: '34px', height: '34px',
            background: '#E7E8E9',
            border: '2px solid #111827',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '0.7rem', fontWeight: 700, flexShrink: 0,
          }}>
            {getInitials(item.project.ownerName)}
          </div>
          <div>
            <span style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700, fontSize: '0.875rem',
              textTransform: 'uppercase', letterSpacing: '0.03em',
            }}>
              {item.project.ownerName}
            </span>
            <span style={{
              marginLeft: '8px',
              fontFamily: "'Courier New', monospace",
              fontSize: '0.65rem', color: '#6b7280',
            }}>
              {timeAgo(item.createdAt)}
            </span>
          </div>
        </div>

        {/* Title + stage */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '10px', flexWrap: 'wrap' as const }}>
          <h3 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '1.375rem',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            color: '#111827',
          }}>
            {item.project.title}
          </h3>
          <span style={{
            padding: '3px 10px',
            background: stageBg(item.project.stage),
            color: '#fff',
            fontFamily: "'Courier New', monospace",
            fontSize: '0.6rem', fontWeight: 700,
            textTransform: 'uppercase' as const,
            letterSpacing: '0.08em',
            whiteSpace: 'nowrap' as const,
            alignSelf: 'center',
            border: '1px solid rgba(0,0,0,0.15)',
          }}>
            {item.project.stage}
          </span>
        </div>

        {/* Description */}
        <p style={{ fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '10px', color: '#374151' }}>
          {item.project.description}
        </p>

        {/* Looking for */}
        {item.project.supportRequired && (
          <p style={{
            fontFamily: "'Courier New', monospace",
            fontSize: '0.75rem',
            fontStyle: 'italic',
            marginBottom: '18px',
            color: '#6b7280',
          }}>
            Looking for: {item.project.supportRequired}
          </p>
        )}

        {item.project.githubVisible && item.project.githubUrl && (
          <div style={{ marginBottom: '18px' }}>
            <a
              href={item.project.githubUrl}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontFamily: "'Courier New', monospace",
                fontSize: '0.7rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#006E2F',
                textDecoration: 'underline',
              }}
            >
              GitHub Repo {'->'}
            </a>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: '8px', paddingBottom: '18px', flexWrap: 'wrap' as const }}>
          <button
            onClick={() => setCommentsOpen((o) => !o)}
            style={{
              ...actionBtn,
              background: commentsOpen ? '#F3F4F5' : 'transparent',
            }}
          >
            ◎ Comments
          </button>

          {isOwner ? (
            <button
              onClick={handleOpenRequests}
              style={{ ...actionBtn, background: requestsOpen ? '#F3F4F5' : 'transparent' }}
            >
              ◈ See requests ({raiseHandRequests.length})
            </button>
          ) : (
            <button
              onClick={handleRaiseHand}
              style={{
                ...actionBtn,
                background: raisedByMe ? '#22C55E' : 'transparent',
                color: raisedByMe ? '#fff' : '#191C1D',
                border: raisedByMe ? '2px solid #22C55E' : '2px solid #111827',
                boxShadow: raisedByMe ? '3px 3px 0px 0px #006E2F' : 'none',
              }}
            >
              Raise Hand ({raiseCount}) 
            </button>
          )}
        </div>
      </div>

      {commentsOpen && (
        <div style={{ borderTop: '2px solid #111827' }}>
          <CommentThread feedItemId={item.id} initialComments={item.comments} currentUserId={currentUserId} />
        </div>
      )}

      {requestsOpen && (
        <div style={{ borderTop: '2px solid #111827' }}>
          <CollabRequests feedItemId={item.id} requests={raiseHandRequests} isOwner={isOwner} />
        </div>
      )}
      </div>{/* end left column */}

      {/* ── RIGHT: trace log ── */}
      <div style={{
        flex: 1,
        minWidth: '200px',
        borderLeft: '2px solid #111827',
        background: '#0d0f10',
        padding: '16px 14px',
        display: 'flex',
        flexDirection: 'column',
        gap: '0',
        fontFamily: "'Courier New', Courier, monospace",
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          paddingBottom: '12px',
          borderBottom: '1px solid #1f2937',
        }}>
          <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em', color: '#d1d5db', textTransform: 'uppercase' }}>
            TRACE LOG
          </span>
          <span style={{ fontSize: '0.65rem', color: '#22C55E', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Live
          </span>
        </div>

        {/* Milestone entries */}
        {milestones.length === 0 ? (
          <div style={{ fontSize: '0.75rem', color: '#6b7280', fontStyle: 'italic', paddingLeft: '20px' }}>
            // no milestones yet
          </div>
        ) : (
          <div style={{ position: 'relative' }}>
            {/* vertical line */}
            <div style={{
              position: 'absolute',
              left: '6px',
              top: '8px',
              bottom: '8px',
              width: '1px',
              background: '#1f2937',
            }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {milestones.map((ms) => {
                const { label, color, filled } = milestoneStatus(ms)
                return (
                  <div key={ms.id} style={{ paddingLeft: '24px', position: 'relative' }}>
                    {/* dot */}
                    <div style={{
                      position: 'absolute',
                      left: '0px',
                      top: '4px',
                      width: '13px',
                      height: '13px',
                      border: `2px solid ${color}`,
                      background: filled ? color : 'transparent',
                      flexShrink: 0,
                    }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px', gap: '8px' }}>
                      <span style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.08em', color, textTransform: 'uppercase' }}>
                        STATUS: {label}
                      </span>
                      <span style={{ fontSize: '0.62rem', color: '#6b7280', letterSpacing: '0.04em', whiteSpace: 'nowrap' as const }}>
                        {ms.date}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f9fafb', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '5px', lineHeight: 1.3 }}>
                      {ms.title}
                    </div>
                    {ms.description && (
                      <p style={{ fontSize: '0.72rem', color: '#9ca3af', lineHeight: 1.6, margin: 0 }}>
                        {ms.description}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
