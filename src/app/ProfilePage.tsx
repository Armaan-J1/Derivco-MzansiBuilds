import { useState } from 'react'
import { Link } from 'react-router-dom'

const MOCK_PROFILE = {
  displayName: 'Alex Chen',
  email: 'alex@example.com',
  bio: 'Building in public since 2024. Working on CLI tools and developer productivity apps.',
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export default function ProfilePage() {
  const [displayName, setDisplayName] = useState(MOCK_PROFILE.displayName)
  const [bio, setBio] = useState(MOCK_PROFILE.bio)
  const [isDirty, setIsDirty] = useState(false)
  const [passwordExpanded, setPasswordExpanded] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [saveHover, setSaveHover] = useState(false)
  const [deleteHover, setDeleteHover] = useState(false)

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #111827',
    fontSize: '0.9375rem',
    outline: 'none',
    background: '#fff',
    color: '#191C1D',
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontFamily: "'Courier New', Courier, monospace",
    fontSize: '0.6875rem',
    fontWeight: 600,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.08em',
    marginBottom: '6px',
    color: '#191C1D',
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setIsDirty(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F3F4F5', padding: '32px 24px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        {/* Back link */}
        <Link
          to="/app"
          style={{
            display: 'inline-block',
            marginBottom: '24px',
            fontSize: '0.875rem',
            color: '#191C1D',
            textDecoration: 'underline',
          }}
        >
          ← Back to feed
        </Link>

        {/* Avatar + name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              background: '#22C55E',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: '1.25rem',
              flexShrink: 0,
            }}
          >
            {getInitials(displayName || 'AC')}
          </div>
          <div>
            <h1
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '1.375rem',
                fontWeight: 700,
              }}
            >
              {displayName || 'Your Profile'}
            </h1>
            <p style={{ fontSize: '0.875rem', color: '#191C1D' }}>{MOCK_PROFILE.email}</p>
          </div>
        </div>

        {/* Form card */}
        <div style={{ background: '#fff', border: '1px solid #E7E8E9', padding: '28px' }}>
          <form onSubmit={handleSave}>
            {/* Display name */}
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => { setDisplayName(e.target.value); setIsDirty(true) }}
                style={inputStyle}
                onFocus={(e) => (e.target.style.outline = '2px solid #22C55E')}
                onBlur={(e) => (e.target.style.outline = 'none')}
              />
            </div>

            {/* Email */}
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Email</label>
              <input
                type="email"
                value={MOCK_PROFILE.email}
                readOnly
                style={{ ...inputStyle, background: '#F3F4F5', cursor: 'not-allowed' }}
              />
              <p
                style={{
                  marginTop: '4px',
                  fontFamily: "'Courier New', Courier, monospace",
                  fontSize: '0.6875rem',
                  color: '#191C1D',
                }}
              >
                Email cannot be changed
              </p>
            </div>

            {/* Bio */}
            <div style={{ marginBottom: '24px' }}>
              <label style={labelStyle}>What I'm building</label>
              <textarea
                value={bio}
                onChange={(e) => { setBio(e.target.value); setIsDirty(true) }}
                rows={3}
                style={{ ...inputStyle, resize: 'vertical' as const }}
                onFocus={(e) => (e.target.style.outline = '2px solid #22C55E')}
                onBlur={(e) => (e.target.style.outline = 'none')}
              />
            </div>

            {/* Change password */}
            <div style={{ marginBottom: '24px', borderTop: '1px solid #E7E8E9', paddingTop: '20px' }}>
              <button
                type="button"
                onClick={() => setPasswordExpanded(!passwordExpanded)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  fontFamily: "'Courier New', Courier, monospace",
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase' as const,
                  letterSpacing: '0.08em',
                  cursor: 'pointer',
                  color: '#191C1D',
                  textDecoration: 'underline',
                }}
              >
                {passwordExpanded ? '▲ Hide' : '▼ Change password'}
              </button>

              {passwordExpanded && (
                <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={labelStyle}>Current Password</label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      style={inputStyle}
                      onFocus={(e) => (e.target.style.outline = '2px solid #22C55E')}
                      onBlur={(e) => (e.target.style.outline = 'none')}
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      style={inputStyle}
                      onFocus={(e) => (e.target.style.outline = '2px solid #22C55E')}
                      onBlur={(e) => (e.target.style.outline = 'none')}
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Save button */}
            {isDirty && (
              <button
                type="submit"
                onMouseEnter={() => setSaveHover(true)}
                onMouseLeave={() => setSaveHover(false)}
                style={{
                  padding: '10px 28px',
                  background: saveHover ? '#006E2F' : '#22C55E',
                  color: '#fff',
                  border: 'none',
                  fontFamily: "'Courier New', Courier, monospace",
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase' as const,
                  letterSpacing: '0.08em',
                  cursor: 'pointer',
                  marginBottom: '8px',
                }}
              >
                Save changes
              </button>
            )}
          </form>

          {/* Danger zone */}
          <div style={{ borderTop: '1px solid #E7E8E9', paddingTop: '20px', marginTop: '8px' }}>
            <p
              style={{
                fontFamily: "'Courier New', Courier, monospace",
                fontSize: '0.6875rem',
                fontWeight: 700,
                textTransform: 'uppercase' as const,
                letterSpacing: '0.08em',
                marginBottom: '10px',
              }}
            >
              Danger Zone
            </p>
            <button
              type="button"
              onMouseEnter={() => setDeleteHover(true)}
              onMouseLeave={() => setDeleteHover(false)}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                fontSize: '0.875rem',
                color: '#DC2626',
                cursor: 'pointer',
                textDecoration: deleteHover ? 'underline' : 'none',
              }}
            >
              Delete account
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
