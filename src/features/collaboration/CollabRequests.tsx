import { useState } from 'react'
import { updateRequestStatus } from '../../services/raiseHandService'
import type { RaiseHandRequest } from '../../services/raiseHandService'

interface Props {
  feedItemId: string
  requests: RaiseHandRequest[]
  isOwner: boolean
}

function getInitials(name: string): string {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
}

export default function CollabRequests({ feedItemId, requests, isOwner }: Props) {
  const [localRequests, setLocalRequests] = useState<RaiseHandRequest[]>(requests)
  const [accepted, setAccepted] = useState<Set<string>>(new Set(
    requests.filter((r) => r.status === 'accepted').map((r) => r.userId)
  ))

  async function handleAccept(userId: string) {
    await updateRequestStatus(feedItemId, userId, 'accepted')
    setAccepted((s) => new Set([...s, userId]))
    setLocalRequests((prev) => prev.map((r) => r.userId === userId ? { ...r, status: 'accepted' } : r))
  }

  async function handleDismiss(userId: string) {
    await updateRequestStatus(feedItemId, userId, 'dismissed')
    setLocalRequests((prev) => prev.filter((r) => r.userId !== userId))
  }

  const visible = localRequests.filter((r) => r.status !== 'dismissed')

  return (
    <div style={{ padding: '16px 20px' }}>
      <p
        style={{
          fontFamily: "'Courier New', Courier, monospace",
          fontSize: '0.6875rem',
          fontWeight: 700,
          textTransform: 'uppercase' as const,
          letterSpacing: '0.08em',
          marginBottom: '12px',
        }}
      >
        Collaboration Requests ({visible.length})
      </p>

      {visible.length === 0 && (
        <p style={{ fontSize: '0.875rem', color: '#191C1D', fontStyle: 'italic' }}>No requests yet.</p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {visible.map((req) => (
          <div
            key={req.userId}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              padding: '10px 12px',
              background: '#F3F4F5',
              border: accepted.has(req.userId) ? '1px solid #22C55E' : '1px solid #E7E8E9',
            }}
          >
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
              {getInitials(req.userName)}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' as const }}>
                <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{req.userName}</span>
                {accepted.has(req.userId) && (
                  <span
                    style={{
                      fontFamily: "'Courier New', Courier, monospace",
                      fontSize: '0.625rem',
                      fontWeight: 700,
                      color: '#22C55E',
                      textTransform: 'uppercase' as const,
                    }}
                  >
                    Accepted
                  </span>
                )}
              </div>
              {req.note && (
                <p style={{ fontSize: '0.8125rem', marginTop: '3px', color: '#191C1D' }}>{req.note}</p>
              )}
              {accepted.has(req.userId) && (
                <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' as const }}>
                  <span style={{
                    fontFamily: "'Courier New', Courier, monospace",
                    fontSize: '0.65rem',
                    color: '#191C1D',
                  }}>
                    {req.email}
                  </span>
                  <a
                    href={`mailto:${req.email}`}
                    style={{
                      padding: '5px 10px',
                      border: '1px solid #111827',
                      background: '#fff',
                      fontFamily: "'Courier New', Courier, monospace",
                      fontSize: '0.625rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      color: '#191C1D',
                      textDecoration: 'none',
                    }}
                  >
                    Email
                  </a>
                </div>
              )}
            </div>

            {isOwner && !accepted.has(req.userId) && (
              <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                <button
                  onClick={() => handleAccept(req.userId)}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    color: '#22C55E',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                >
                  Accept
                </button>
                <button
                  onClick={() => handleDismiss(req.userId)}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    fontSize: '0.8125rem',
                    color: '#191C1D',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                >
                  Dismiss
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
