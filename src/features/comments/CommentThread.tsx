import { useState, useEffect } from 'react'
import { Comment } from '../../types'
import { getComments, addComment } from '../../services/commentService'
import { useAuthStore } from '../auth/useAuthStore'

interface Props {
  feedItemId: string
  initialComments: Comment[]
  currentUserId: string
}

function getInitials(name: string): string {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
}

export default function CommentThread({ feedItemId, initialComments, currentUserId }: Props) {
  const { user } = useAuthStore()
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [text, setText] = useState('')
  const [error, setError] = useState('')
  const [submitHover, setSubmitHover] = useState(false)

  useEffect(() => {
    getComments(feedItemId).then(setComments)
  }, [feedItemId])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!text.trim()) {
      setError('Comment cannot be empty.')
      return
    }
    if (!user) return
    setError('')
    const authorName = user.displayName ?? 'Anonymous'
    const newComment = await addComment(feedItemId, currentUserId, authorName, text.trim())
    setComments((prev) => [...prev, newComment])
    setText('')
  }

  return (
    <div style={{ padding: '16px 20px' }}>
      {comments.length > 0 && (
        <div style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {comments.map((c) => (
            <div key={c.id} style={{ display: 'flex', gap: '10px' }}>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  background: '#E7E8E9',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: '0.625rem',
                  fontWeight: 700,
                }}
              >
                {getInitials(c.authorName)}
              </div>
              <div>
                <span style={{ fontWeight: 600, fontSize: '0.8125rem' }}>{c.authorName}</span>
                <span
                  style={{
                    marginLeft: '8px',
                    fontFamily: "'Courier New', Courier, monospace",
                    fontSize: '0.625rem',
                    color: '#191C1D',
                  }}
                >
                  {c.createdAt}
                </span>
                <p style={{ fontSize: '0.875rem', marginTop: '2px', lineHeight: 1.5 }}>{c.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
        <textarea
          value={text}
          onChange={(e) => { setText(e.target.value); if (error) setError('') }}
          rows={2}
          placeholder="Write a comment..."
          style={{
            flex: 1,
            padding: '8px 10px',
            border: '1px solid #111827',
            fontSize: '0.875rem',
            resize: 'none' as const,
            fontFamily: 'inherit',
            outline: 'none',
          }}
          onFocus={(e) => (e.target.style.outline = '2px solid #22C55E')}
          onBlur={(e) => (e.target.style.outline = 'none')}
        />
        <button
          type="submit"
          onMouseEnter={() => setSubmitHover(true)}
          onMouseLeave={() => setSubmitHover(false)}
          style={{
            padding: '8px 16px',
            background: submitHover ? '#006E2F' : '#22C55E',
            color: '#fff',
            border: 'none',
            fontFamily: "'Courier New', Courier, monospace",
            fontSize: '0.6875rem',
            fontWeight: 700,
            textTransform: 'uppercase' as const,
            letterSpacing: '0.06em',
            cursor: 'pointer',
            flexShrink: 0,
            alignSelf: 'flex-start',
            marginTop: '0',
          }}
        >
          Post
        </button>
      </form>
      {error && (
        <p
          style={{
            marginTop: '6px',
            fontSize: '0.8125rem',
            color: '#DC2626',
            fontFamily: "'Courier New', Courier, monospace",
          }}
        >
          {error}
        </p>
      )}
    </div>
  )
}
