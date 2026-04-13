import { useState } from 'react'
import { Milestone, Project } from '../../types'

interface Props {
  projects: Project[]
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

let nextMilestoneId = 200

export default function MyProjectsView({ projects: initialProjects }: Props) {
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [editingField, setEditingField] = useState<string | null>(null)

  // Edit state
  const [editTitle, setEditTitle] = useState('')
  const [editDesc, setEditDesc] = useState('')
  const [editStage, setEditStage] = useState<Project['stage']>('Planning')
  const [editSupport, setEditSupport] = useState('')

  // Milestone
  const [addingMilestone, setAddingMilestone] = useState(false)
  const [msDate, setMsDate] = useState('')
  const [msTitle, setMsTitle] = useState('')
  const [msDesc, setMsDesc] = useState('')

  // Complete confirmation
  const [confirmComplete, setConfirmComplete] = useState(false)

  const selected = projects.find((p) => p.id === selectedId) ?? null

  function selectProject(p: Project) {
    setSelectedId(p.id)
    setEditTitle(p.title)
    setEditDesc(p.description)
    setEditStage(p.stage)
    setEditSupport(p.supportRequired)
    setEditingField(null)
    setConfirmComplete(false)
    setAddingMilestone(false)
  }

  function saveField(field: string) {
    if (!selected) return
    setProjects((prev) =>
      prev.map((p) =>
        p.id === selected.id
          ? {
              ...p,
              title: field === 'title' ? editTitle : p.title,
              description: field === 'desc' ? editDesc : p.description,
              stage: field === 'stage' ? editStage : p.stage,
              supportRequired: field === 'support' ? editSupport : p.supportRequired,
            }
          : p
      )
    )
    setEditingField(null)
  }

  function addMilestone() {
    if (!selected || !msTitle.trim()) return
    const ms: Milestone = {
      id: String(nextMilestoneId++),
      date: msDate || new Date().toISOString().slice(0, 10),
      title: msTitle.trim(),
      description: msDesc.trim(),
    }
    setProjects((prev) =>
      prev.map((p) =>
        p.id === selected.id ? { ...p, milestones: [...p.milestones, ms] } : p
      )
    )
    setMsDate('')
    setMsTitle('')
    setMsDesc('')
    setAddingMilestone(false)
  }

  function markComplete() {
    if (!selected) return
    setProjects((prev) =>
      prev.map((p) =>
        p.id === selected.id
          ? { ...p, stage: 'Complete', completedAt: new Date().toISOString().slice(0, 10) }
          : p
      )
    )
    setConfirmComplete(false)
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '8px 10px',
    border: '1px solid #111827',
    fontSize: '0.9rem',
    outline: 'none',
    fontFamily: 'inherit',
    background: '#fff',
    color: '#191C1D',
  }

  const stages: Project['stage'][] = ['Planning', 'In Progress', 'Blocked', 'Wrapping Up', 'Complete']

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
        My Projects
      </h2>

      {/* Project list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '24px' }}>
        {projects.map((p) => {
          const isSelected = p.id === selectedId
          return (
            <div
              key={p.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                background: isSelected ? '#F3F4F5' : '#fff',
                border: isSelected ? '1px solid #22C55E' : '1px solid #E7E8E9',
                cursor: 'pointer',
              }}
              onClick={() => selectProject(p)}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{p.title}</span>
              </div>
              <span
                style={{
                  padding: '2px 8px',
                  background: stageBgColor(p.stage),
                  color: '#fff',
                  fontFamily: "'Courier New', Courier, monospace",
                  fontSize: '0.5625rem',
                  fontWeight: 700,
                  textTransform: 'uppercase' as const,
                  letterSpacing: '0.08em',
                  whiteSpace: 'nowrap' as const,
                }}
              >
                {p.stage}
              </span>
              <span
                style={{
                  fontFamily: "'Courier New', Courier, monospace",
                  fontSize: '0.6875rem',
                  whiteSpace: 'nowrap' as const,
                }}
              >
                {p.milestones.length} milestone{p.milestones.length !== 1 ? 's' : ''}
              </span>
              <button
                onClick={(e) => { e.stopPropagation(); selectProject(p) }}
                style={{
                  padding: '4px 12px',
                  background: 'transparent',
                  border: '1px solid #111827',
                  fontFamily: "'Courier New', Courier, monospace",
                  fontSize: '0.625rem',
                  fontWeight: 700,
                  textTransform: 'uppercase' as const,
                  letterSpacing: '0.06em',
                  cursor: 'pointer',
                  color: '#191C1D',
                }}
              >
                View
              </button>
            </div>
          )
        })}
      </div>

      {/* Detail panel */}
      {selected && (
        <div style={{ background: '#fff', border: '1px solid #E7E8E9', padding: '24px' }}>
          {/* Title */}
          <div style={{ marginBottom: '20px' }}>
            {editingField === 'title' ? (
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  style={{ ...inputStyle, fontSize: '1.125rem', fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif" }}
                  onFocus={(e) => (e.target.style.outline = '2px solid #22C55E')}
                  onBlur={(e) => (e.target.style.outline = 'none')}
                  autoFocus
                />
                <button onClick={() => saveField('title')} style={saveBtnStyle(false)}>Save</button>
                <button onClick={() => setEditingField(null)} style={cancelBtnStyle}>Cancel</button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h3
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: '1.125rem',
                    fontWeight: 700,
                    letterSpacing: '-0.01em',
                  }}
                >
                  {selected.title}
                </h3>
                <button
                  onClick={() => setEditingField('title')}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    padding: '0 4px',
                    color: '#191C1D',
                  }}
                  title="Edit title"
                >
                  ✎
                </button>
              </div>
            )}
          </div>

          {/* Description */}
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Description</label>
            {editingField === 'desc' ? (
              <div>
                <textarea
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  rows={3}
                  style={{ ...inputStyle, resize: 'vertical' as const }}
                  onFocus={(e) => (e.target.style.outline = '2px solid #22C55E')}
                  onBlur={(e) => (e.target.style.outline = 'none')}
                  autoFocus
                />
                <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                  <button onClick={() => saveField('desc')} style={saveBtnStyle(false)}>Save</button>
                  <button onClick={() => setEditingField(null)} style={cancelBtnStyle}>Cancel</button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.55 }}>{selected.description}</p>
                <button
                  onClick={() => setEditingField('desc')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.875rem', padding: '0 4px', color: '#191C1D', flexShrink: 0 }}
                >
                  ✎
                </button>
              </div>
            )}
          </div>

          {/* Stage */}
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Stage</label>
            {editingField === 'stage' ? (
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <select
                  value={editStage}
                  onChange={(e) => setEditStage(e.target.value as Project['stage'])}
                  style={{ ...inputStyle, width: 'auto' }}
                  onFocus={(e) => (e.target.style.outline = '2px solid #22C55E')}
                  onBlur={(e) => (e.target.style.outline = 'none')}
                >
                  {stages.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <button onClick={() => saveField('stage')} style={saveBtnStyle(false)}>Save</button>
                <button onClick={() => setEditingField(null)} style={cancelBtnStyle}>Cancel</button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    display: 'inline-block',
                    padding: '2px 10px',
                    background: stageBgColor(selected.stage),
                    color: '#fff',
                    fontFamily: "'Courier New', Courier, monospace",
                    fontSize: '0.625rem',
                    fontWeight: 700,
                    textTransform: 'uppercase' as const,
                    letterSpacing: '0.08em',
                  }}
                >
                  {selected.stage}
                </span>
                <button onClick={() => setEditingField('stage')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.875rem', padding: '0 4px', color: '#191C1D' }}>✎</button>
              </div>
            )}
          </div>

          {/* Support required */}
          <div style={{ marginBottom: '24px' }}>
            <label style={labelStyle}>Support Required</label>
            {editingField === 'support' ? (
              <div>
                <input
                  value={editSupport}
                  onChange={(e) => setEditSupport(e.target.value)}
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.outline = '2px solid #22C55E')}
                  onBlur={(e) => (e.target.style.outline = 'none')}
                  autoFocus
                />
                <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                  <button onClick={() => saveField('support')} style={saveBtnStyle(false)}>Save</button>
                  <button onClick={() => setEditingField(null)} style={cancelBtnStyle}>Cancel</button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.9rem', fontStyle: 'italic' }}>{selected.supportRequired || '—'}</span>
                <button onClick={() => setEditingField('support')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.875rem', padding: '0 4px', color: '#191C1D' }}>✎</button>
              </div>
            )}
          </div>

          {/* Milestones */}
          <div style={{ marginBottom: '24px' }}>
            <label style={labelStyle}>Milestones</label>

            {selected.milestones.length > 0 && (
              <div
                style={{
                  borderLeft: '3px solid #22C55E',
                  paddingLeft: '16px',
                  marginBottom: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}
              >
                {selected.milestones.map((ms) => (
                  <div key={ms.id}>
                    <div
                      style={{
                        fontFamily: "'Courier New', Courier, monospace",
                        fontSize: '0.6875rem',
                        fontWeight: 700,
                        marginBottom: '2px',
                      }}
                    >
                      {ms.date}
                    </div>
                    <div style={{ fontWeight: 600, fontSize: '0.9375rem', marginBottom: '2px' }}>{ms.title}</div>
                    {ms.description && (
                      <p style={{ fontSize: '0.875rem', lineHeight: 1.5 }}>{ms.description}</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {addingMilestone ? (
              <div style={{ background: '#F3F4F5', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div>
                  <label style={labelStyle}>Date</label>
                  <input
                    type="date"
                    value={msDate}
                    onChange={(e) => setMsDate(e.target.value)}
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.outline = '2px solid #22C55E')}
                    onBlur={(e) => (e.target.style.outline = 'none')}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Title</label>
                  <input
                    value={msTitle}
                    onChange={(e) => setMsTitle(e.target.value)}
                    placeholder="Milestone title"
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.outline = '2px solid #22C55E')}
                    onBlur={(e) => (e.target.style.outline = 'none')}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Description</label>
                  <textarea
                    value={msDesc}
                    onChange={(e) => setMsDesc(e.target.value)}
                    rows={2}
                    placeholder="What did you accomplish?"
                    style={{ ...inputStyle, resize: 'vertical' as const }}
                    onFocus={(e) => (e.target.style.outline = '2px solid #22C55E')}
                    onBlur={(e) => (e.target.style.outline = 'none')}
                  />
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={addMilestone} style={saveBtnStyle(false)}>Add</button>
                  <button onClick={() => setAddingMilestone(false)} style={cancelBtnStyle}>Cancel</button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setAddingMilestone(true)}
                style={{
                  background: 'none',
                  border: '1px dashed #111827',
                  padding: '8px 16px',
                  fontSize: '0.8125rem',
                  cursor: 'pointer',
                  fontFamily: "'Courier New', Courier, monospace",
                  textTransform: 'uppercase' as const,
                  letterSpacing: '0.06em',
                  fontWeight: 600,
                  color: '#191C1D',
                }}
              >
                + Add milestone
              </button>
            )}
          </div>

          {/* Mark as complete */}
          {selected.stage !== 'Complete' && (
            <div>
              {confirmComplete ? (
                <div style={{ background: '#F3F4F5', padding: '16px', border: '1px solid #E7E8E9' }}>
                  <p style={{ fontSize: '0.875rem', marginBottom: '12px', fontWeight: 500 }}>
                    This will move your project to the Celebration Wall. Are you sure?
                  </p>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={markComplete} style={saveBtnStyle(false)}>Confirm</button>
                    <button onClick={() => setConfirmComplete(false)} style={cancelBtnStyle}>Cancel</button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmComplete(true)}
                  style={{
                    padding: '9px 20px',
                    background: 'transparent',
                    border: '1px solid #111827',
                    fontFamily: "'Courier New', Courier, monospace",
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textTransform: 'uppercase' as const,
                    letterSpacing: '0.06em',
                    cursor: 'pointer',
                    color: '#191C1D',
                  }}
                >
                  Mark as Complete
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
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

function saveBtnStyle(_hover: boolean): React.CSSProperties {
  return {
    padding: '6px 14px',
    background: '#22C55E',
    color: '#fff',
    border: 'none',
    fontFamily: "'Courier New', Courier, monospace",
    fontSize: '0.6875rem',
    fontWeight: 700,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.06em',
    cursor: 'pointer',
  }
}

const cancelBtnStyle: React.CSSProperties = {
  padding: '6px 14px',
  background: 'transparent',
  color: '#191C1D',
  border: '1px solid #111827',
  fontFamily: "'Courier New', Courier, monospace",
  fontSize: '0.6875rem',
  fontWeight: 700,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.06em',
  cursor: 'pointer',
}
