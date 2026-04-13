import { useState } from 'react'
import { FeedItem } from '../../types'
import CommentThread from '../comments/CommentThread'
import CollabRequests from '../collaboration/CollabRequests'

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
  const [commentsOpen, setCommentsOpen] = useState(false)
  const [requestsOpen, setRequestsOpen] = useState(false)
  const [raisedByMe, setRaisedByMe] = useState(item.raisedByMe)
  const [raiseCount, setRaiseCount] = useState(item.raiseHandCount)
  const [hovered, setHovered] = useState(false)

  const isOwner = item.project.ownerId === currentUserId

  function handleRaiseHand() {
    setRaisedByMe((r) => !r)
    setRaiseCount((n) => (raisedByMe ? n - 1 : n + 1))
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
      }}
    >
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
            ◎ Comment ({item.comments.length})
          </button>

          {isOwner ? (
            <button
              onClick={() => setRequestsOpen((o) => !o)}
              style={{ ...actionBtn, background: requestsOpen ? '#F3F4F5' : 'transparent' }}
            >
              ◈ See requests ({item.raiseHandRequests.length})
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
              ✋ Raise Hand ({raiseCount})
            </button>
          )}
        </div>
      </div>

      {commentsOpen && (
        <div style={{ borderTop: '2px solid #111827' }}>
          <CommentThread initialComments={item.comments} currentUserId={currentUserId} />
        </div>
      )}

      {requestsOpen && (
        <div style={{ borderTop: '2px solid #111827' }}>
          <CollabRequests requests={item.raiseHandRequests} isOwner={isOwner} />
        </div>
      )}
    </div>
  )
}
