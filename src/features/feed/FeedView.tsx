import { useState } from 'react'
import { FeedItem } from '../../types'
import FeedCard from './FeedCard'

interface Props {
  feedItems: FeedItem[]
  currentUserId: string
}

export default function FeedView({ feedItems, currentUserId }: Props) {
  const [visibleCount, setVisibleCount] = useState(10)
  const [loadMoreHover, setLoadMoreHover] = useState(false)

  const visible = feedItems.slice(0, visibleCount)
  const hasMore = visibleCount < feedItems.length

  return (
    <div style={{ maxWidth: '760px' }}>
      {/* Section header */}
      <div style={{ marginBottom: '36px', borderBottom: '4px solid #111827', paddingBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <div style={{ height: '2px', width: '24px', background: '#22C55E' }} />
          <span style={{
            fontFamily: "'Courier New', monospace",
            fontSize: '0.6rem', fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '0.2em',
            color: '#6b7280',
          }}>
            // Live Feed
          </span>
        </div>
        <h2 style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 'clamp(2rem, 4vw, 3rem)',
          fontWeight: 900,
          letterSpacing: '-0.04em',
          lineHeight: 0.95,
          textTransform: 'uppercase',
          color: '#111827',
        }}>
          What developers<br />
          <span style={{ color: '#22C55E' }}>are building.</span>
        </h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {visible.map((item) => (
          <FeedCard key={item.id} item={item} currentUserId={currentUserId} />
        ))}
      </div>

      {hasMore && (
        <div style={{ marginTop: '32px' }}>
          <button
            onClick={() => setVisibleCount((n) => n + 10)}
            onMouseEnter={() => setLoadMoreHover(true)}
            onMouseLeave={() => setLoadMoreHover(false)}
            style={{
              padding: '11px 32px',
              background: loadMoreHover ? '#111827' : '#22C55E',
              color: '#fff',
              border: '2px solid #111827',
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '0.75rem', fontWeight: 800,
              textTransform: 'uppercase' as const,
              letterSpacing: '0.1em',
              cursor: 'pointer',
              boxShadow: loadMoreHover ? 'none' : '4px 4px 0px 0px #111827',
              transform: loadMoreHover ? 'translate(4px, 4px)' : 'none',
              transition: 'none',
            }}
          >
            Load more
          </button>
        </div>
      )}
    </div>
  )
}
