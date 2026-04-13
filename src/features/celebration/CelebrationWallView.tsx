import { Project } from '../../types'

interface Props {
  projects: Project[]
}

function getInitials(name: string): string {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
}

export default function CelebrationWallView({ projects }: Props) {
  return (
    <div>
      <h2
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: '2rem',
          fontWeight: 500,
          letterSpacing: '-0.02em',
          marginBottom: '8px',
        }}
      >
        Built in public.
      </h2>
      <p
        style={{
          fontFamily: "'Courier New', Courier, monospace",
          fontSize: '0.75rem',
          marginBottom: '32px',
          color: '#191C1D',
        }}
      >
        // projects shipped by this community
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '16px',
        }}
      >
        {projects.map((p) => (
          <CelebrationCard key={p.id} project={p} />
        ))}
      </div>

      {projects.length === 0 && (
        <p style={{ fontSize: '0.9rem', fontStyle: 'italic', color: '#191C1D' }}>
          No completed projects yet. Be the first!
        </p>
      )}
    </div>
  )
}

function CelebrationCard({ project }: { project: Project }) {
  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #E7E8E9',
        padding: '20px',
        position: 'relative',
      }}
    >
      {/* Green checkmark badge */}
      <div
        style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          width: '24px',
          height: '24px',
          background: '#22C55E',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.875rem',
          fontWeight: 700,
        }}
      >
        ✓
      </div>

      {/* Author */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
        <div
          style={{
            width: '36px',
            height: '36px',
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
          {getInitials(project.ownerName)}
        </div>
        <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{project.ownerName}</span>
      </div>

      {/* Title */}
      <h3
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: '1rem',
          fontWeight: 700,
          marginBottom: '8px',
          letterSpacing: '-0.01em',
          paddingRight: '32px',
        }}
      >
        {project.title}
      </h3>

      {/* Completion date */}
      {project.completedAt && (
        <p
          style={{
            fontFamily: "'Courier New', Courier, monospace",
            fontSize: '0.6875rem',
            fontWeight: 700,
            marginBottom: '10px',
            color: '#22C55E',
          }}
        >
          Completed {project.completedAt}
        </p>
      )}

      {/* Description */}
      <p style={{ fontSize: '0.875rem', lineHeight: 1.55, color: '#191C1D' }}>
        {project.description}
      </p>
    </div>
  )
}
