import { useState } from 'react'
import { Project } from '../../types'

interface Props {
  projects: Project[]
}

// Deterministic thumbnail palette per project
const THUMB_PALETTES = [
  { bg: '#0f2027', accent: '#22C55E' },
  { bg: '#1a1a2e', accent: '#22C55E' },
  { bg: '#16213e', accent: '#4ae176' },
  { bg: '#0d0d0d', accent: '#22C55E' },
  { bg: '#111827', accent: '#4ae176' },
]

function thumbPalette(id: string) {
  const idx = id.charCodeAt(id.length - 1) % THUMB_PALETTES.length
  return THUMB_PALETTES[idx]
}

function getInitials(name: string): string {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
}

export default function CelebrationWallView({ projects }: Props) {
  const rest = projects.filter((p) => !p.featured)
  const total = projects.length

  return (
    <div>
      {/* ── HERO ── */}
      <div style={{
        marginBottom: '48px',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        gap: '24px',
        borderBottom: '4px solid #111827',
        paddingBottom: '32px',
        flexWrap: 'wrap',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <span style={{
              fontFamily: "'Courier New', monospace",
              fontSize: '0.65rem',
              fontWeight: 900,
              background: '#111827',
              color: '#fff',
              padding: '4px 12px',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
            }}>
              MzansiBuilds Ecosystem
            </span>
            <div style={{ height: '2px', width: '40px', background: '#22C55E' }} />
          </div>
          <h1 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 900,
            fontSize: 'clamp(4rem, 8vw, 7.5rem)',
            lineHeight: 0.88,
            letterSpacing: '-0.04em',
            textTransform: 'uppercase',
            color: '#111827',
          }}>
            BUILT<br />
            <span style={{ color: '#22C55E' }}>IN PUBLIC.</span>
          </h1>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{
            fontFamily: "'Courier New', monospace",
            fontSize: '0.6rem',
            fontWeight: 700,
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            marginBottom: '4px',
            color: '#191C1D',
          }}>
            Total Shipments
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <span style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 900,
              fontSize: 'clamp(3rem, 6vw, 5rem)',
              lineHeight: 1,
              color: '#22C55E',
              letterSpacing: '-0.04em',
            }}>
              {total}
            </span>
            <span style={{
              fontFamily: "'Courier New', monospace",
              fontSize: '0.65rem',
              color: '#6b7280',
              fontWeight: 700,
              letterSpacing: '0.1em',
            }}>
              UNIT_X
            </span>
          </div>
        </div>
      </div>

      {/* ── GRID ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '28px',
      }}>
        {rest.map((p) => <NormalCard key={p.id} project={p} />)}
      </div>

      {projects.length === 0 && (
        <p style={{
          fontFamily: "'Courier New', monospace",
          fontSize: '0.875rem',
          fontStyle: 'italic',
          color: '#191C1D',
          padding: '40px 0',
        }}>
          // No completed projects yet. Be the first to ship.
        </p>
      )}

      {/* ── FOOTER ── */}
      <footer style={{
        marginTop: '80px',
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
          © 2026 MZANSIBUILDS_SYSTEM // CELEBRATION_WALL
        </span>
        <div style={{ display: 'flex', gap: '32px' }}>
          {['Region: ZA_AFRICA', 'Build: v2.1.0-STABLE'].map((txt) => (
            <span key={txt} style={{
              fontFamily: "'Courier New', monospace",
              fontSize: '0.6rem',
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              fontWeight: 700,
              color: '#111827',
            }}>
              {txt}
            </span>
          ))}
        </div>
      </footer>
    </div>
  )
}

function NormalCard({ project }: { project: Project }) {
  const [hovered, setHovered] = useState(false)
  const palette = thumbPalette(project.id)
  const isClickable = project.githubVisible && !!project.githubUrl

  function handleOpenProject() {
    if (isClickable) {
      window.open(project.githubUrl, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <div
      onClick={handleOpenProject}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#fff',
        border: '2px solid #111827',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        transform: hovered ? 'translate(-3px, -3px)' : 'none',
        boxShadow: hovered ? '8px 8px 0px 0px rgba(0,110,47,1)' : 'none',
        transition: 'none',
        cursor: isClickable ? 'pointer' : 'default',
      }}
    >
      {/* Thumbnail */}
      <div style={{
        height: '160px',
        borderBottom: '2px solid #111827',
        background: palette.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        filter: hovered ? 'none' : 'grayscale(100%)',
      }}>
        <span style={{
          fontFamily: "'Courier New', monospace",
          fontSize: '0.65rem',
          fontWeight: 700,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: palette.accent,
          opacity: hovered ? 1 : 0.5,
        }}>
          {(project.tags ?? ['#SHIPPED']).join(' ')}
        </span>
      </div>

      {/* Checkmark badge */}
      <div style={{
        position: 'absolute',
        top: '144px',
        right: '16px',
        width: '32px',
        height: '32px',
        background: '#22C55E',
        border: '2px solid #111827',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
        fontSize: '1rem',
        color: '#fff',
        fontWeight: 900,
      }}>
        ✓
      </div>

      {/* Body */}
      <div style={{ padding: '20px', paddingTop: '28px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Author */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
          <div style={{
            width: '30px', height: '30px',
            background: '#E7E8E9',
            border: '1px solid #111827',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'Courier New', monospace",
            fontSize: '0.6rem', fontWeight: 700, flexShrink: 0,
          }}>
            {getInitials(project.ownerName)}
          </div>
          <div>
            <div style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700, fontSize: '0.75rem',
              textTransform: 'uppercase', letterSpacing: '0.04em',
            }}>
              {project.ownerName}
            </div>
            {project.completedAt && (
              <div style={{
                fontFamily: "'Courier New', monospace",
                fontSize: '0.6rem',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                color: '#6b7280',
              }}>
                SHIPPED {project.completedAt}
              </div>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: '1.25rem',
          fontWeight: 700,
          letterSpacing: '-0.02em',
          marginBottom: '10px',
          color: '#111827',
        }}>
          {project.title}
        </h3>

        {/* Description */}
        <p style={{
          fontSize: '0.875rem',
          lineHeight: 1.6,
          color: '#374151',
          marginBottom: '16px',
          flex: 1,
        }}>
          {project.description}
        </p>

        {project.githubVisible && project.githubUrl && (
          <span style={{
            fontFamily: "'Courier New', monospace",
            fontSize: '0.65rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: '#006E2F',
            marginBottom: '16px',
          }}>
            Open Repository {'->'}
          </span>
        )}

        {/* Footer row */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '12px',
          borderTop: '1px solid #E7E8E9',
        }}>
          <span style={{
            fontFamily: "'Courier New', monospace",
            fontSize: '0.6rem',
            letterSpacing: '0.06em',
            color: '#6b7280',
          }}>
            {(project.tags ?? []).join(' ')}
          </span>
          <button style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: '1rem', color: hovered ? '#22C55E' : '#6b7280',
            padding: 0,
          }}>
            ↗
          </button>
        </div>
      </div>
    </div>
  )
}
