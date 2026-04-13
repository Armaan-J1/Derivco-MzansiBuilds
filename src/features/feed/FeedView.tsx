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
    <div style={{ maxWidth: '720px' }}>
      <h2
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: '1.25rem',
          fontWeight: 700,
          marginBottom: '24px',
          letterSpacing: '-0.01em',
        }}
      >
        Feed
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {visible.map((item) => (
          <FeedCard key={item.id} item={item} currentUserId={currentUserId} />
        ))}
      </div>

      {hasMore && (
        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <button
            onClick={() => setVisibleCount((n) => n + 10)}
            onMouseEnter={() => setLoadMoreHover(true)}
            onMouseLeave={() => setLoadMoreHover(false)}
            style={{
              padding: '10px 32px',
              background: loadMoreHover ? '#006E2F' : '#22C55E',
              color: '#fff',
              border: 'none',
              fontFamily: "'Courier New', Courier, monospace",
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase' as const,
              letterSpacing: '0.08em',
              cursor: 'pointer',
            }}
          >
            Load more
          </button>
        </div>
      )}
    </div>
  )
}
