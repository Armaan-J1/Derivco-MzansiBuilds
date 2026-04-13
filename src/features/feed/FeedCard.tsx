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
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  if (diffDays === 0) return 'today'
  if (diffDays === 1) return '1 day ago'
  return `${diffDays} days ago`
}

function stageBgColor(stage: string): string {
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
  const [commentHover, setCommentHover] = useState(false)
  const [raiseHover, setRaiseHover] = useState(false)
  const [requestsHover, setRequestsHover] = useState(false)

  const isOwner = item.project.ownerId === currentUserId

  function handleRaiseHand() {
    if (raisedByMe) {
      setRaisedByMe(false)
      setRaiseCount((n) => n - 1)
    } else {
      setRaisedByMe(true)
      setRaiseCount((n) => n + 1)
    }
  }

  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #E7E8E9',
      }}
    >
      {/* Card top: type tag */}
      <div style={{ padding: '16px 20px 0' }}>
        <span
          style={{
            display: 'inline-block',
            padding: '2px 8px',
            background: item.type === 'new_project' ? '#22C55E' : 'transparent',
            border: item.type === 'update' ? '1px solid #111827' : 'none',
            color: item.type === 'new_project' ? '#fff' : '#191C1D',
            fontFamily: "'Courier New', Courier, monospace",
            fontSize: '0.625rem',
            fontWeight: 700,
            textTransform: 'uppercase' as const,
            letterSpacing: '0.1em',
            marginBottom: '12px',
          }}
        >
          {item.type === 'new_project' ? 'new project' : 'update'}
        </span>

        {/* Author row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              background: '#E7E8E9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '0.75rem',
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            {getInitials(item.project.ownerName)}
          </div>
          <div>
            <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{item.project.ownerName}</span>
            <span
              style={{
                marginLeft: '8px',
                fontFamily: "'Courier New', Courier, monospace",
                fontSize: '0.6875rem',
                color: '#191C1D',
              }}
            >
              {timeAgo(item.createdAt)}
            </span>
          </div>
        </div>

        {/* Project title + stage */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' as const }}>
          <h3
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '1.0625rem',
              fontWeight: 600,
              letterSpacing: '-0.01em',
            }}
          >
            {item.project.title}
          </h3>
          <span
            style={{
              padding: '2px 8px',
              background: stageBgColor(item.project.stage),
              color: '#fff',
              fontFamily: "'Courier New', Courier, monospace",
              fontSize: '0.625rem',
              fontWeight: 700,
              textTransform: 'uppercase' as const,
              letterSpacing: '0.08em',
              whiteSpace: 'nowrap' as const,
              alignSelf: 'center',
            }}
          >
            {item.project.stage}
          </span>
        </div>

        {/* Description */}
        <p style={{ fontSize: '0.9rem', lineHeight: 1.55, marginBottom: '8px' }}>
          {item.project.description}
        </p>

        {/* Looking for */}
        {item.project.supportRequired && (
          <p
            style={{
              fontSize: '0.8125rem',
              fontStyle: 'italic',
              marginBottom: '16px',
              color: '#191C1D',
            }}
          >
            Looking for: {item.project.supportRequired}
          </p>
        )}

        {/* Action row */}
        <div
          style={{
            display: 'flex',
            gap: '10px',
            paddingBottom: '16px',
            flexWrap: 'wrap' as const,
          }}
        >
          {/* Comment button */}
          <button
            onClick={() => setCommentsOpen((o) => !o)}
            onMouseEnter={() => setCommentHover(true)}
            onMouseLeave={() => setCommentHover(false)}
            style={{
              padding: '7px 16px',
              background: commentHover ? '#F3F4F5' : 'transparent',
              color: '#191C1D',
              border: '1px solid #111827',
              fontFamily: "'Courier New', Courier, monospace",
              fontSize: '0.6875rem',
              fontWeight: 600,
              textTransform: 'uppercase' as const,
              letterSpacing: '0.06em',
              cursor: 'pointer',
            }}
          >
            Comment ({item.comments.length})
          </button>

          {/* Raise hand or See requests */}
          {isOwner ? (
            <button
              onClick={() => setRequestsOpen((o) => !o)}
              onMouseEnter={() => setRequestsHover(true)}
              onMouseLeave={() => setRequestsHover(false)}
              style={{
                padding: '7px 16px',
                background: requestsHover ? '#F3F4F5' : 'transparent',
                color: '#191C1D',
                border: '1px solid #111827',
                fontFamily: "'Courier New', Courier, monospace",
                fontSize: '0.6875rem',
                fontWeight: 600,
                textTransform: 'uppercase' as const,
                letterSpacing: '0.06em',
                cursor: 'pointer',
              }}
            >
              See requests ({item.raiseHandRequests.length})
            </button>
          ) : (
            <button
              onClick={handleRaiseHand}
              onMouseEnter={() => setRaiseHover(true)}
              onMouseLeave={() => setRaiseHover(false)}
              style={{
                padding: '7px 16px',
                background: raisedByMe
                  ? raiseHover ? '#006E2F' : '#22C55E'
                  : raiseHover ? '#F3F4F5' : 'transparent',
                color: raisedByMe ? '#fff' : '#191C1D',
                border: raisedByMe ? 'none' : '1px solid #111827',
                fontFamily: "'Courier New', Courier, monospace",
                fontSize: '0.6875rem',
                fontWeight: 600,
                textTransform: 'uppercase' as const,
                letterSpacing: '0.06em',
                cursor: 'pointer',
              }}
            >
              ✋ Raise Hand ({raiseCount})
            </button>
          )}
        </div>
      </div>

      {/* Comment thread */}
      {commentsOpen && (
        <div style={{ borderTop: '1px solid #E7E8E9' }}>
          <CommentThread initialComments={item.comments} currentUserId={currentUserId} />
        </div>
      )}

      {/* Collab requests */}
      {requestsOpen && (
        <div style={{ borderTop: '1px solid #E7E8E9' }}>
          <CollabRequests requests={item.raiseHandRequests} isOwner={isOwner} />
        </div>
      )}
    </div>
  )
}
