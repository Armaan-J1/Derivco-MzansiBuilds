import { useState } from 'react'
import { Project } from '../../types'

interface DraftProject {
  title: string
  description: string
  stage: Project['stage']
  supportRequired: string
  githubUrl: string
  githubVisible: boolean
}

interface Props {
  onCreate: (project: DraftProject) => void
}

export default function NewProjectPanel({ onCreate }: Props) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [stage, setStage] = useState<Project['stage']>('Planning')
  const [support, setSupport] = useState('')
  const [githubUrl, setGithubUrl] = useState('')
  const [githubVisible, setGithubVisible] = useState(true)
  const [submitHover, setSubmitHover] = useState(false)

  const stages: Project['stage'][] = ['Planning', 'In Progress', 'Blocked', 'Wrapping Up', 'Complete']

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return

    onCreate({
      title: title.trim(),
      description: description.trim(),
      stage,
      supportRequired: support.trim(),
      githubUrl: githubUrl.trim(),
      githubVisible,
    })

    setTitle('')
    setDescription('')
    setStage('Planning')
    setSupport('')
    setGithubUrl('')
    setGithubVisible(true)
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '11px 12px',
    border: '2px solid #111827',
    fontSize: '0.9375rem',
    outline: 'none',
    background: '#fff',
    color: '#191C1D',
    fontFamily: 'inherit',
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontFamily: "'Courier New', Courier, monospace",
    fontSize: '0.65rem',
    fontWeight: 700,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.1em',
    marginBottom: '6px',
    color: '#6b7280',
  }

  return (
    <div style={{ maxWidth: '760px' }}>
      <div style={{ marginBottom: '36px', borderBottom: '4px solid #111827', paddingBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <div style={{ height: '2px', width: '24px', background: '#22C55E' }} />
          <span
            style={{
              fontFamily: "'Courier New', monospace",
              fontSize: '0.6rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              color: '#6b7280',
            }}
          >
            // New Build
          </span>
        </div>
        <h2
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 900,
            letterSpacing: '-0.04em',
            textTransform: 'uppercase',
            lineHeight: 0.95,
            color: '#111827',
          }}
        >
          Post
          <br />
          <span style={{ color: '#22C55E' }}>Project.</span>
        </h2>
      </div>

      <div style={{ background: '#fff', border: '2px solid #111827', padding: '28px', boxShadow: '6px 6px 0px 0px #111827' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
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

          <div>
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

          <div>
            <label style={labelStyle}>Stage</label>
            <select
              value={stage}
              onChange={(e) => setStage(e.target.value as Project['stage'])}
              style={inputStyle}
              onFocus={(e) => (e.target.style.outline = '2px solid #22C55E')}
              onBlur={(e) => (e.target.style.outline = 'none')}
            >
              {stages.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={labelStyle}>Support Needed</label>
            <input
              type="text"
              value={support}
              onChange={(e) => setSupport(e.target.value)}
              placeholder="e.g. code review, UI feedback"
              style={inputStyle}
              onFocus={(e) => (e.target.style.outline = '2px solid #22C55E')}
              onBlur={(e) => (e.target.style.outline = 'none')}
            />
          </div>

          <div>
            <label style={labelStyle}>GitHub Repo</label>
            <input
              type="url"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/username/repo"
              style={inputStyle}
              onFocus={(e) => (e.target.style.outline = '2px solid #22C55E')}
              onBlur={(e) => (e.target.style.outline = 'none')}
            />
          </div>

          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 14px',
              border: '2px solid #111827',
              background: '#F3F4F5',
              cursor: 'pointer',
            }}
          >
            <input
              type="checkbox"
              checked={githubVisible}
              onChange={(e) => setGithubVisible(e.target.checked)}
              style={{ width: '16px', height: '16px', accentColor: '#22C55E' }}
            />
            <span style={{
              fontFamily: "'Courier New', monospace",
              fontSize: '0.7rem',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: '#191C1D',
            }}>
              Show repo publicly in feed and celebration wall
            </span>
          </label>

          <button
            type="submit"
            onMouseEnter={() => setSubmitHover(true)}
            onMouseLeave={() => setSubmitHover(false)}
            style={{
              padding: '12px 0',
              background: submitHover ? '#111827' : '#22C55E',
              color: '#fff',
              border: '2px solid #111827',
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '0.75rem',
              fontWeight: 800,
              textTransform: 'uppercase' as const,
              letterSpacing: '0.1em',
              cursor: 'pointer',
              boxShadow: submitHover ? 'none' : '4px 4px 0px 0px #111827',
              transform: submitHover ? 'translate(4px,4px)' : 'none',
              transition: 'none',
            }}
          >
            Post Project {'->'}
          </button>
        </form>
      </div>
    </div>
  )
}
