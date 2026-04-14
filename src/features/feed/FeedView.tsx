import { useState } from 'react'
import { FeedItem } from '../../types'
import FeedCard from './FeedCard'

interface Props {
  feedItems: FeedItem[]
  currentUserId: string
  searchQuery: string
  hasMoreFromServer: boolean
  feedLoading: boolean
  onLoadMoreFromServer: () => void
}

export default function FeedView({ feedItems, currentUserId, searchQuery, hasMoreFromServer, feedLoading, onLoadMoreFromServer }: Props) {
  const [visibleCount, setVisibleCount] = useState(10)
  const [loadMoreHover, setLoadMoreHover] = useState(false)

  const q = searchQuery.trim().toLowerCase()

  // When searching, show all matching items across everything loaded; otherwise paginate
  const filtered = q
    ? feedItems.filter((item) =>
        item.project.title.toLowerCase().includes(q) ||
        item.project.description.toLowerCase().includes(q) ||
        item.project.ownerName.toLowerCase().includes(q)
      )
    : feedItems.slice(0, visibleCount)

  const hasMoreLocal = !q && visibleCount < feedItems.length
  const showLoadMore = !q && (hasMoreLocal || hasMoreFromServer)

  function handleLoadMore() {
    if (hasMoreLocal) {
      setVisibleCount((n) => n + 10)
    } else {
      onLoadMoreFromServer()
    }
  }

  return (
    <div style={{ maxWidth: '1100px' }}>
      {/* Section header */}
      <div style={{ maxWidth: '760px', marginBottom: '36px', borderBottom: '4px solid #111827', paddingBottom: '20px' }}>
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

      {filtered.length === 0 && q ? (
        <p style={{
          fontFamily: "'Courier New', monospace", fontSize: '0.875rem',
          fontStyle: 'italic', color: '#6b7280', padding: '24px 0',
        }}>
          // No results for "{searchQuery}"
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {filtered.map((item) => (
            <FeedCard key={item.id} item={item} currentUserId={currentUserId} />
          ))}
        </div>
      )}

      <footer style={{
        marginTop: '56px',
        paddingTop: '24px',
        borderTop: '2px solid #111827',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
      }}>
        <span style={{
          fontFamily: "'Courier New', monospace",
          fontSize: '0.6rem',
          textTransform: 'uppercase',
          letterSpacing: '0.2em',
          color: '#6b7280',
        }}>
          Feed stream // builders in motion
        </span>
        {showLoadMore && (
          <button
            onClick={handleLoadMore}
            disabled={feedLoading}
            onMouseEnter={() => setLoadMoreHover(true)}
            onMouseLeave={() => setLoadMoreHover(false)}
            style={{
              padding: '8px 24px',
              background: feedLoading ? '#9ca3af' : loadMoreHover ? '#111827' : '#22C55E',
              color: '#fff',
              border: '2px solid #111827',
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '0.7rem', fontWeight: 800,
              textTransform: 'uppercase' as const,
              letterSpacing: '0.1em',
              cursor: feedLoading ? 'not-allowed' : 'pointer',
              boxShadow: loadMoreHover && !feedLoading ? 'none' : '4px 4px 0px 0px #111827',
              transform: loadMoreHover && !feedLoading ? 'translate(4px, 4px)' : 'none',
              transition: 'none',
            }}
          >
            {feedLoading ? 'Loading...' : 'Load more'}
          </button>
        )}
        <span style={{
          fontFamily: "'Courier New', monospace",
          fontSize: '0.6rem',
          textTransform: 'uppercase',
          letterSpacing: '0.2em',
          color: '#111827',
        }}>
          {q ? `${filtered.length} result${filtered.length !== 1 ? 's' : ''}` : `Showing ${filtered.length}`}
        </span>
      </footer>
    </div>
  )
}
