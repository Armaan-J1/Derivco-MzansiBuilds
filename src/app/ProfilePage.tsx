import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import DotGrid from '../component/DotGrid'

const MOCK_PROFILE = {
  displayName: 'Alex Chen',
  email: 'alex@example.com',
  bio: 'Building in public since 2024. Working on CLI tools and developer productivity apps.',
}

function getInitials(name: string): string {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
}

export default function ProfilePage() {
  const navigate = useNavigate()
  const [displayName, setDisplayName] = useState(MOCK_PROFILE.displayName)
  const [bio, setBio] = useState(MOCK_PROFILE.bio)
  const [isDirty, setIsDirty] = useState(false)
  const [passwordExpanded, setPasswordExpanded] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [saveHover, setSaveHover] = useState(false)

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setIsDirty(false)
  }

  function handleLogout() {
    navigate('/')
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '11px 12px',
    border: '2px solid #111827', fontSize: '0.9375rem',
    outline: 'none', background: '#fff', color: '#191C1D',
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontFamily: "'Courier New', Courier, monospace",
    fontSize: '0.65rem', fontWeight: 700,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.1em', marginBottom: '6px', color: '#6b7280',
  }

  return (
    <div
      style={{ minHeight: '100vh', background: '#F3F4F5', padding: '40px 24px', position: 'relative', overflow: 'hidden' }}
    >
      {/* DotGrid background */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <DotGrid
          dotSize={4}
          gap={26}
          baseColor="#ededed"
          activeColor="#2bff00"
          proximity={100}
          speedTrigger={100}
          shockRadius={250}
          shockStrength={6}
          maxSpeed={5000}
          resistance={750}
          returnDuration={1.5}
        />
      </div>

      <div style={{ maxWidth: '600px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
        {/* Back */}
        <Link to="/app" style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          marginBottom: '32px',
          fontFamily: "'Courier New', monospace",
          fontSize: '0.7rem', fontWeight: 700,
          textTransform: 'uppercase', letterSpacing: '0.1em',
          color: '#191C1D', textDecoration: 'none',
          borderBottom: '2px solid #111827',
        }}>
          ← Back to feed
        </Link>

        {/* Hero header */}
        <div style={{ marginBottom: '32px', borderBottom: '4px solid #111827', paddingBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <div style={{ height: '2px', width: '24px', background: '#22C55E' }} />
            <span style={{
              fontFamily: "'Courier New', monospace", fontSize: '0.6rem',
              fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#6b7280',
            }}>
              // Account
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{
              width: '72px', height: '72px',
              background: '#22C55E', border: '3px solid #111827',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 900, fontSize: '1.5rem', color: '#fff',
              flexShrink: 0,
              boxShadow: '4px 4px 0px 0px #111827',
            }}>
              {getInitials(displayName || 'AC')}
            </div>
            <div>
              <h1 style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                fontWeight: 900, letterSpacing: '-0.04em',
                textTransform: 'uppercase', lineHeight: 0.95, color: '#111827',
              }}>
                {displayName || 'Your'}<br />
                <span style={{ color: '#22C55E' }}>Profile</span>
              </h1>
              <p style={{
                fontFamily: "'Courier New', monospace",
                fontSize: '0.7rem', color: '#6b7280', marginTop: '6px',
              }}>
                {MOCK_PROFILE.email}
              </p>
            </div>
          </div>
        </div>

        {/* Form card */}
        <div style={{ background: '#fff', border: '2px solid #111827', padding: '28px', boxShadow: '6px 6px 0px 0px #111827' }}>
          <form onSubmit={handleSave}>
            {/* Display name */}
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Display Name</label>
              <input type="text" value={displayName}
                onChange={(e) => { setDisplayName(e.target.value); setIsDirty(true) }}
                style={inputStyle}
                onFocus={(e) => (e.target.style.outline = '2px solid #22C55E')}
                onBlur={(e) => (e.target.style.outline = 'none')} />
            </div>

            {/* Email */}
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Email</label>
              <input type="email" value={MOCK_PROFILE.email} readOnly
                style={{ ...inputStyle, background: '#F3F4F5', cursor: 'not-allowed', border: '2px solid #E7E8E9' }} />
              <p style={{
                marginTop: '5px', fontFamily: "'Courier New', monospace",
                fontSize: '0.6rem', letterSpacing: '0.05em', color: '#6b7280',
              }}>
                Email cannot be changed
              </p>
            </div>

            {/* Bio */}
            <div style={{ marginBottom: '24px' }}>
              <label style={labelStyle}>What I'm building</label>
              <textarea value={bio}
                onChange={(e) => { setBio(e.target.value); setIsDirty(true) }}
                rows={3} style={{ ...inputStyle, resize: 'vertical' as const }}
                onFocus={(e) => (e.target.style.outline = '2px solid #22C55E')}
                onBlur={(e) => (e.target.style.outline = 'none')} />
            </div>

            {/* Change password */}
            <div style={{ marginBottom: '24px', borderTop: '2px solid #E7E8E9', paddingTop: '20px' }}>
              <button type="button" onClick={() => setPasswordExpanded(!passwordExpanded)}
                style={{
                  background: 'none', border: 'none', padding: 0,
                  fontFamily: "'Courier New', monospace",
                  fontSize: '0.7rem', fontWeight: 700,
                  textTransform: 'uppercase' as const, letterSpacing: '0.08em',
                  cursor: 'pointer', color: '#191C1D',
                  borderBottom: '2px solid #111827',
                }}>
                {passwordExpanded ? '▲ Hide' : '▼ Change password'}
              </button>

              {passwordExpanded && (
                <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {[
                    { label: 'Current Password', value: currentPassword, setter: setCurrentPassword },
                    { label: 'New Password', value: newPassword, setter: setNewPassword },
                  ].map(({ label, value, setter }) => (
                    <div key={label}>
                      <label style={labelStyle}>{label}</label>
                      <input type="password" value={value}
                        onChange={(e) => { setter(e.target.value); setIsDirty(true) }}
                        style={inputStyle} placeholder="••••••••"
                        onFocus={(e) => (e.target.style.outline = '2px solid #22C55E')}
                        onBlur={(e) => (e.target.style.outline = 'none')} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Save */}
            {isDirty && (
              <button type="submit"
                onMouseEnter={() => setSaveHover(true)}
                onMouseLeave={() => setSaveHover(false)}
                style={{
                  padding: '11px 28px',
                  background: saveHover ? '#111827' : '#22C55E',
                  color: '#fff',
                  border: '2px solid #111827',
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: '0.75rem', fontWeight: 800,
                  textTransform: 'uppercase' as const, letterSpacing: '0.08em',
                  cursor: 'pointer', marginBottom: '8px',
                  boxShadow: saveHover ? 'none' : '4px 4px 0px 0px #111827',
                  transform: saveHover ? 'translate(4px,4px)' : 'none',
                  transition: 'none',
                }}>
                Save changes →
              </button>
            )}
          </form>

          {/* Session */}
          <div style={{ borderTop: '2px solid #E7E8E9', paddingTop: '20px', marginTop: '8px' }}>
            <p style={{
              fontFamily: "'Courier New', monospace",
              fontSize: '0.6rem', fontWeight: 700,
              textTransform: 'uppercase' as const, letterSpacing: '0.15em',
              marginBottom: '10px', color: '#6b7280',
            }}>
              Session
            </p>
            <button type="button" onClick={handleLogout} style={{
              background: 'none', border: '2px solid #111827',
              padding: '7px 16px',
              fontFamily: "'Courier New', monospace",
              fontSize: '0.65rem', fontWeight: 700,
              textTransform: 'uppercase' as const, letterSpacing: '0.08em',
              cursor: 'pointer', color: '#191C1D',
            }}>
              Log out
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
