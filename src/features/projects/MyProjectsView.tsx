import { useEffect, useState } from 'react'
import { Milestone, Project } from '../../types'

interface Props {
  projects: Project[]
  onProjectsChange: (projects: Project[]) => void
}

function stageBg(stage: string): string {
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

export default function MyProjectsView({ projects: initialProjects, onProjectsChange }: Props) {
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [editingField, setEditingField] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDesc, setEditDesc] = useState('')
  const [editStage, setEditStage] = useState<Project['stage']>('Planning')
  const [editSupport, setEditSupport] = useState('')
  const [editGithubUrl, setEditGithubUrl] = useState('')
  const [addingMilestone, setAddingMilestone] = useState(false)
  const [msDate, setMsDate] = useState('')
  const [msTitle, setMsTitle] = useState('')
  const [msDesc, setMsDesc] = useState('')
  const [confirmComplete, setConfirmComplete] = useState(false)
  const [rowHover, setRowHover] = useState<string | null>(null)

  useEffect(() => {
    setProjects(initialProjects)
  }, [initialProjects])

  const selected = projects.find((p) => p.id === selectedId) ?? null

  function commitProjects(updater: (items: Project[]) => Project[]) {
    setProjects((prev) => {
      const next = updater(prev)
      onProjectsChange(next)
      return next
    })
  }

  function selectProject(p: Project) {
    setSelectedId(p.id)
    setEditTitle(p.title)
    setEditDesc(p.description)
    setEditStage(p.stage)
    setEditSupport(p.supportRequired)
    setEditGithubUrl(p.githubUrl)
    setEditingField(null)
    setConfirmComplete(false)
    setAddingMilestone(false)
  }

  function saveField(field: string) {
    if (!selected) return
    commitProjects((prev) => prev.map((p) =>
      p.id === selected.id ? {
        ...p,
        title: field === 'title' ? editTitle : p.title,
        description: field === 'desc' ? editDesc : p.description,
        stage: field === 'stage' ? editStage : p.stage,
        supportRequired: field === 'support' ? editSupport : p.supportRequired,
        githubUrl: field === 'github' ? editGithubUrl : p.githubUrl,
      } : p
    ))
    setEditingField(null)
  }

  function toggleGithubVisibility() {
    if (!selected) return
    commitProjects((prev) => prev.map((p) =>
      p.id === selected.id ? { ...p, githubVisible: !p.githubVisible } : p
    ))
  }

  function addMilestone() {
    if (!selected || !msTitle.trim()) return
    const ms: Milestone = {
      id: String(nextMilestoneId++),
      date: msDate || new Date().toISOString().slice(0, 10),
      title: msTitle.trim(),
      description: msDesc.trim(),
    }
    commitProjects((prev) => prev.map((p) =>
      p.id === selected.id ? { ...p, milestones: [...p.milestones, ms] } : p
    ))
    setMsDate('')
    setMsTitle('')
    setMsDesc('')
    setAddingMilestone(false)
  }

  function markComplete() {
    if (!selected) return
    commitProjects((prev) => prev.map((p) =>
      p.id === selected.id
        ? { ...p, stage: 'Complete', completedAt: new Date().toISOString().slice(0, 10) }
        : p
    ))
    setConfirmComplete(false)
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '9px 11px',
    border: '2px solid #111827', fontSize: '0.9rem',
    outline: 'none', fontFamily: 'inherit',
    background: '#fff', color: '#191C1D',
  }

  const stages: Project['stage'][] = ['Planning', 'In Progress', 'Blocked', 'Wrapping Up', 'Complete']

  return (
    <div style={{ maxWidth: '760px' }}>
      <div style={{ marginBottom: '36px', borderBottom: '4px solid #111827', paddingBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <div style={{ height: '2px', width: '24px', background: '#22C55E' }} />
          <span style={{
            fontFamily: "'Courier New', monospace",
            fontSize: '0.6rem', fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '0.2em', color: '#6b7280',
          }}>// My Projects</span>
        </div>
        <h2 style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 'clamp(2rem, 4vw, 3rem)',
          fontWeight: 900, letterSpacing: '-0.04em',
          lineHeight: 0.95, textTransform: 'uppercase', color: '#111827',
        }}>
          Your<br /><span style={{ color: '#22C55E' }}>Builds.</span>
        </h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '28px' }}>
        {projects.map((p) => {
          const isSelected = p.id === selectedId
          const isRowHovered = rowHover === p.id
          return (
            <div
              key={p.id}
              onClick={() => selectProject(p)}
              onMouseEnter={() => setRowHover(p.id)}
              onMouseLeave={() => setRowHover(null)}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '13px 16px',
                background: isSelected ? '#22C55E' : '#fff',
                border: '2px solid #111827',
                cursor: 'pointer',
                transform: isRowHovered && !isSelected ? 'translate(-2px,-2px)' : 'none',
                boxShadow: isRowHovered && !isSelected ? '4px 4px 0px 0px #111827' : 'none',
                transition: 'none',
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700, fontSize: '0.9375rem',
                  textTransform: 'uppercase', letterSpacing: '-0.01em',
                  color: isSelected ? '#fff' : '#111827',
                }}>
                  {p.title}
                </span>
              </div>
              <span style={{
                padding: '3px 10px',
                background: isSelected ? '#fff' : stageBg(p.stage),
                color: isSelected ? stageBg(p.stage) : '#fff',
                fontFamily: "'Courier New', monospace",
                fontSize: '0.6rem', fontWeight: 700,
                textTransform: 'uppercase' as const, letterSpacing: '0.08em',
                whiteSpace: 'nowrap' as const,
                border: isSelected ? '2px solid rgba(0,0,0,0.1)' : 'none',
              }}>
                {p.stage}
              </span>
              <span style={{
                fontFamily: "'Courier New', monospace",
                fontSize: '0.65rem', whiteSpace: 'nowrap' as const,
                color: isSelected ? 'rgba(255,255,255,0.8)' : '#6b7280',
              }}>
                {p.milestones.length}ms
              </span>
              <button
                onClick={(e) => { e.stopPropagation(); selectProject(p) }}
                style={{
                  padding: '4px 12px',
                  background: isSelected ? '#fff' : 'transparent',
                  border: `2px solid ${isSelected ? '#fff' : '#111827'}`,
                  fontFamily: "'Courier New', monospace",
                  fontSize: '0.6rem', fontWeight: 700,
                  textTransform: 'uppercase' as const, letterSpacing: '0.06em',
                  cursor: 'pointer',
                  color: isSelected ? '#22C55E' : '#191C1D',
                }}
              >
                View
              </button>
            </div>
          )
        })}
      </div>

      {selected && (
        <div style={{ background: '#fff', border: '2px solid #111827', padding: '28px', boxShadow: '6px 6px 0px 0px #111827' }}>
          <div style={{ marginBottom: '20px' }}>
            {editingField === 'title' ? (
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)}
                  style={{ ...inputStyle, fontSize: '1.125rem', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }}
                  onFocus={(e) => (e.target.style.outline = '2px solid #22C55E')}
                  onBlur={(e) => (e.target.style.outline = 'none')}
                  autoFocus />
                <button onClick={() => saveField('title')} style={saveBtnStyle}>Save</button>
                <button onClick={() => setEditingField(null)} style={cancelBtnStyle}>Cancel</button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h3 style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: '1.375rem', fontWeight: 800,
                  letterSpacing: '-0.03em', textTransform: 'uppercase', color: '#111827',
                }}>
                  {selected.title}
                </h3>
                <button onClick={() => setEditingField('title')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', padding: '0 4px', color: '#22C55E' }}
                  title="Edit title">Edit</button>
              </div>
            )}
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Description</label>
            {editingField === 'desc' ? (
              <div>
                <textarea value={editDesc} onChange={(e) => setEditDesc(e.target.value)}
                  rows={3} style={{ ...inputStyle, resize: 'vertical' as const }}
                  onFocus={(e) => (e.target.style.outline = '2px solid #22C55E')}
                  onBlur={(e) => (e.target.style.outline = 'none')}
                  autoFocus />
                <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                  <button onClick={() => saveField('desc')} style={saveBtnStyle}>Save</button>
                  <button onClick={() => setEditingField(null)} style={cancelBtnStyle}>Cancel</button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: '#374151' }}>{selected.description}</p>
                <button onClick={() => setEditingField('desc')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem', padding: '0 4px', color: '#22C55E', flexShrink: 0 }}>Edit</button>
              </div>
            )}
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Stage</label>
            {editingField === 'stage' ? (
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <select value={editStage} onChange={(e) => setEditStage(e.target.value as Project['stage'])}
                  style={{ ...inputStyle, width: 'auto' }}
                  onFocus={(e) => (e.target.style.outline = '2px solid #22C55E')}
                  onBlur={(e) => (e.target.style.outline = 'none')}>
                  {stages.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <button onClick={() => saveField('stage')} style={saveBtnStyle}>Save</button>
                <button onClick={() => setEditingField(null)} style={cancelBtnStyle}>Cancel</button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  display: 'inline-block', padding: '3px 12px',
                  background: stageBg(selected.stage), color: '#fff',
                  fontFamily: "'Courier New', monospace",
                  fontSize: '0.6rem', fontWeight: 700,
                  textTransform: 'uppercase' as const, letterSpacing: '0.08em',
                  border: '1px solid rgba(0,0,0,0.1)',
                }}>
                  {selected.stage}
                </span>
                <button onClick={() => setEditingField('stage')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem', padding: '0 4px', color: '#22C55E' }}>Edit</button>
              </div>
            )}
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Support Required</label>
            {editingField === 'support' ? (
              <div>
                <input value={editSupport} onChange={(e) => setEditSupport(e.target.value)}
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.outline = '2px solid #22C55E')}
                  onBlur={(e) => (e.target.style.outline = 'none')}
                  autoFocus />
                <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                  <button onClick={() => saveField('support')} style={saveBtnStyle}>Save</button>
                  <button onClick={() => setEditingField(null)} style={cancelBtnStyle}>Cancel</button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.9rem', fontStyle: 'italic', color: '#374151' }}>
                  {selected.supportRequired || '-'}
                </span>
                <button onClick={() => setEditingField('support')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem', padding: '0 4px', color: '#22C55E' }}>Edit</button>
              </div>
            )}
          </div>

          <div style={{ marginBottom: '28px' }}>
            <label style={labelStyle}>GitHub Repo</label>
            {editingField === 'github' ? (
              <div>
                <input value={editGithubUrl} onChange={(e) => setEditGithubUrl(e.target.value)}
                  placeholder="https://github.com/username/repo"
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.outline = '2px solid #22C55E')}
                  onBlur={(e) => (e.target.style.outline = 'none')}
                  autoFocus />
                <div style={{ display: 'flex', gap: '8px', marginTop: '6px', flexWrap: 'wrap' as const }}>
                  <button onClick={() => saveField('github')} style={saveBtnStyle}>Save</button>
                  <button onClick={() => setEditingField(null)} style={cancelBtnStyle}>Cancel</button>
                  <button onClick={toggleGithubVisibility} style={cancelBtnStyle}>
                    {selected.githubVisible ? 'Hide Public Link' : 'Show Public Link'}
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' as const }}>
                {selected.githubUrl ? (
                  <a
                    href={selected.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      fontSize: '0.875rem',
                      color: '#006E2F',
                      textDecoration: 'underline',
                    }}
                  >
                    {selected.githubUrl}
                  </a>
                ) : (
                  <span style={{ fontSize: '0.9rem', fontStyle: 'italic', color: '#374151' }}>
                    No repo linked yet
                  </span>
                )}
                <span style={{
                  padding: '3px 10px',
                  background: selected.githubVisible ? '#22C55E' : '#E7E8E9',
                  color: selected.githubVisible ? '#fff' : '#191C1D',
                  fontFamily: "'Courier New', monospace",
                  fontSize: '0.6rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}>
                  {selected.githubVisible ? 'Public' : 'Hidden'}
                </span>
                <button onClick={() => setEditingField('github')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem', padding: '0 4px', color: '#22C55E' }}>Edit</button>
                <button onClick={toggleGithubVisibility}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem', padding: '0 4px', color: '#191C1D', textDecoration: 'underline' }}>
                  Toggle visibility
                </button>
              </div>
            )}
          </div>

          <div style={{ marginBottom: '28px' }}>
            <label style={labelStyle}>Milestones</label>
            {selected.milestones.length > 0 && (
              <div style={{ borderLeft: '3px solid #22C55E', paddingLeft: '20px', marginBottom: '14px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {selected.milestones.map((ms) => (
                  <div key={ms.id}>
                    <div style={{
                      fontFamily: "'Courier New', monospace",
                      fontSize: '0.65rem', fontWeight: 700,
                      color: '#22C55E', letterSpacing: '0.08em',
                      marginBottom: '2px',
                    }}>
                      {ms.date}
                    </div>
                    <div style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontWeight: 700, fontSize: '0.9375rem',
                      textTransform: 'uppercase', letterSpacing: '-0.01em',
                      marginBottom: '3px', color: '#111827',
                    }}>
                      {ms.title}
                    </div>
                    {ms.description && (
                      <p style={{ fontSize: '0.875rem', lineHeight: 1.55, color: '#374151' }}>
                        {ms.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {addingMilestone ? (
              <div style={{ background: '#F3F4F5', padding: '18px', border: '2px solid #111827', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { label: 'Date', type: 'date', value: msDate, setter: setMsDate, placeholder: '' },
                  { label: 'Title', type: 'text', value: msTitle, setter: setMsTitle, placeholder: 'Milestone title' },
                ].map(({ label, type, value, setter, placeholder }) => (
                  <div key={label}>
                    <label style={labelStyle}>{label}</label>
                    <input type={type} value={value} onChange={(e) => setter(e.target.value)}
                      placeholder={placeholder} style={inputStyle}
                      onFocus={(e) => (e.target.style.outline = '2px solid #22C55E')}
                      onBlur={(e) => (e.target.style.outline = 'none')} />
                  </div>
                ))}
                <div>
                  <label style={labelStyle}>Description</label>
                  <textarea value={msDesc} onChange={(e) => setMsDesc(e.target.value)}
                    rows={2} placeholder="What did you accomplish?" style={{ ...inputStyle, resize: 'vertical' as const }}
                    onFocus={(e) => (e.target.style.outline = '2px solid #22C55E')}
                    onBlur={(e) => (e.target.style.outline = 'none')} />
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={addMilestone} style={saveBtnStyle}>Add</button>
                  <button onClick={() => setAddingMilestone(false)} style={cancelBtnStyle}>Cancel</button>
                </div>
              </div>
            ) : (
              <button onClick={() => setAddingMilestone(true)} style={{
                background: 'none', border: '2px dashed #111827', padding: '9px 18px',
                fontFamily: "'Courier New', monospace", fontSize: '0.65rem',
                fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.08em',
                cursor: 'pointer', color: '#191C1D',
              }}>
                + Add milestone
              </button>
            )}
          </div>

          {selected.stage !== 'Complete' && (
            confirmComplete ? (
              <div style={{ background: '#F3F4F5', padding: '18px', border: '2px solid #111827' }}>
                <p style={{ fontSize: '0.875rem', marginBottom: '12px', fontWeight: 600, color: '#111827' }}>
                  This will move your project to the Celebration Wall. Are you sure?
                </p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={markComplete} style={saveBtnStyle}>Confirm</button>
                  <button onClick={() => setConfirmComplete(false)} style={cancelBtnStyle}>Cancel</button>
                </div>
              </div>
            ) : (
              <button onClick={() => setConfirmComplete(true)} style={{
                padding: '10px 22px',
                background: 'transparent', border: '2px solid #111827',
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '0.75rem', fontWeight: 800,
                textTransform: 'uppercase' as const, letterSpacing: '0.08em',
                cursor: 'pointer', color: '#191C1D',
              }}>
                Mark as Complete
              </button>
            )
          )}
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
          Project desk // iterate and ship
        </span>
        <span style={{
          fontFamily: "'Courier New', monospace",
          fontSize: '0.6rem',
          textTransform: 'uppercase',
          letterSpacing: '0.2em',
          color: '#111827',
        }}>
          Active projects: {projects.length}
        </span>
      </footer>
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: "'Courier New', Courier, monospace",
  fontSize: '0.65rem', fontWeight: 700,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.1em', marginBottom: '6px',
  color: '#6b7280',
}

const saveBtnStyle: React.CSSProperties = {
  padding: '7px 16px',
  background: '#22C55E', color: '#fff',
  border: '2px solid #111827',
  fontFamily: "'Courier New', monospace",
  fontSize: '0.65rem', fontWeight: 700,
  textTransform: 'uppercase' as const, letterSpacing: '0.07em',
  cursor: 'pointer',
}

const cancelBtnStyle: React.CSSProperties = {
  padding: '7px 16px',
  background: 'transparent', color: '#191C1D',
  border: '2px solid #111827',
  fontFamily: "'Courier New', monospace",
  fontSize: '0.65rem', fontWeight: 700,
  textTransform: 'uppercase' as const, letterSpacing: '0.07em',
  cursor: 'pointer',
}
