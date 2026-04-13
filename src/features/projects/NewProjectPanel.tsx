import { useState } from 'react'
import { Project } from '../../types'

interface Props {
  onSuccess: () => void
}

export default function NewProjectPanel({ onSuccess }: Props) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [stage, setStage] = useState<Project['stage']>('Planning')
  const [support, setSupport] = useState('')
  const [submitHover, setSubmitHover] = useState(false)
  const [backHover, setBackHover] = useState(false)

  const stages: Project['stage'][] = ['Planning', 'In Progress', 'Blocked', 'Wrapping Up', 'Complete']

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    onSuccess()
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #111827',
    fontSize: '0.9375rem',
    outline: 'none',
    background: '#fff',
    color: '#191C1D',
    fontFamily: 'inherit',
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontFamily: "'Courier New', Courier, monospace",
    fontSize: '0.6875rem',
    fontWeight: 700,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.08em',
    marginBottom: '6px',
    color: '#191C1D',
  }

  return (
    <div style={{ maxWidth: '600px' }}>
      {/* Back link */}
      <button
        onClick={onSuccess}
        onMouseEnter={() => setBackHover(true)}
        onMouseLeave={() => setBackHover(false)}
        style={{
          background: 'none',
          border: 'none',
          padding: 0,
          fontSize: '0.875rem',
          cursor: 'pointer',
          textDecoration: backHover ? 'underline' : 'none',
          marginBottom: '24px',
          color: '#191C1D',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}
      >
        ← Back
      </button>

      <h2
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: '1.25rem',
          fontWeight: 700,
          marginBottom: '24px',
          letterSpacing: '-0.01em',
        }}
      >
        New Project
      </h2>

      <div style={{ background: '#fff', border: '1px solid #E7E8E9', padding: '28px' }}>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '18px' }}>
            <label style={labelStyle}>Project Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What are you building?"
              style={inputStyle}
              onFocus={(e) => (e.target.style.outline = '2px solid #22C55E')}
              onBlur={(e) => (e.target.style.outline = 'none')}
              required
            />
          </div>

          <div style={{ marginBottom: '18px' }}>
            <label style={labelStyle}>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your project..."
              rows={4}
              style={{ ...inputStyle, resize: 'vertical' as const }}
              onFocus={(e) => (e.target.style.outline = '2px solid #22C55E')}
              onBlur={(e) => (e.target.style.outline = 'none')}
            />
          </div>

          <div style={{ marginBottom: '18px' }}>
            <label style={labelStyle}>Stage</label>
            <select
              value={stage}
              onChange={(e) => setStage(e.target.value as Project['stage'])}
              style={inputStyle}
              onFocus={(e) => (e.target.style.outline = '2px solid #22C55E')}
              onBlur={(e) => (e.target.style.outline = 'none')}
            >
              {stages.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '28px' }}>
            <label style={labelStyle}>What support do you need?</label>
            <input
              type="text"
              value={support}
              onChange={(e) => setSupport(e.target.value)}
              placeholder="e.g. code review, beta testers, UI feedback"
              style={inputStyle}
              onFocus={(e) => (e.target.style.outline = '2px solid #22C55E')}
              onBlur={(e) => (e.target.style.outline = 'none')}
            />
          </div>

          <button
            type="submit"
            onMouseEnter={() => setSubmitHover(true)}
            onMouseLeave={() => setSubmitHover(false)}
            style={{
              width: '100%',
              padding: '12px 0',
              background: submitHover ? '#006E2F' : '#22C55E',
              color: '#fff',
              border: 'none',
              fontFamily: "'Courier New', Courier, monospace",
              fontSize: '0.8125rem',
              fontWeight: 700,
              textTransform: 'uppercase' as const,
              letterSpacing: '0.08em',
              cursor: 'pointer',
            }}
          >
            Post Project
          </button>
        </form>
      </div>
    </div>
  )
}
