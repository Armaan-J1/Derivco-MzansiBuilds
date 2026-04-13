import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

type Tab = 'login' | 'register'

export default function AuthPage() {
  const navigate = useNavigate()
  const [tab, setTab] = useState<Tab>('login')
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regConfirm, setRegConfirm] = useState('')
  const [regBuilding, setRegBuilding] = useState('')
  const [submitHover, setSubmitHover] = useState(false)
  const [mouse, setMouse] = useState({ x: -9999, y: -9999 })

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    setMouse({ x: e.clientX, y: e.clientY })
  }, [])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    navigate('/app')
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
    color: '#191C1D',
  }

  const fieldStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '16px',
  }

  return (
    <div
      onMouseMove={handleMouseMove}
      style={{
        minHeight: '100vh',
        background: '#F3F4F5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Dot grid */}
      <div aria-hidden style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: 'radial-gradient(circle, #191C1D 1px, transparent 1px)',
        backgroundSize: '28px 28px',
        opacity: 0.07,
      }} />
      {/* Mouse glow */}
      <div aria-hidden style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1,
        background: `radial-gradient(circle 260px at ${mouse.x}px ${mouse.y}px, rgba(34,197,94,0.15) 0%, transparent 70%)`,
      }} />

      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '440px' }}>
        {/* Platform label above card */}
        <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ height: '2px', width: '24px', background: '#22C55E' }} />
          <span style={{
            fontFamily: "'Courier New', monospace",
            fontSize: '0.6rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            color: '#191C1D',
          }}>
            Build in Public Platform
          </span>
        </div>

        {/* Card */}
        <div style={{
          background: '#fff',
          border: '2px solid #111827',
          boxShadow: '6px 6px 0px 0px #111827',
        }}>
          {/* Header */}
          <div style={{ padding: '28px 32px 20px', borderBottom: '2px solid #111827' }}>
            <h1 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '2rem',
              fontWeight: 900,
              letterSpacing: '-0.04em',
              textTransform: 'uppercase',
              color: '#111827',
              lineHeight: 0.95,
              marginBottom: '8px',
            }}>
              BUILD<br />
              <span style={{ color: '#22C55E' }}>IN PUBLIC</span>
            </h1>
            <p style={{
              fontFamily: "'Courier New', monospace",
              fontSize: '0.65rem',
              letterSpacing: '0.05em',
              color: '#6b7280',
            }}>
              // ship openly. grow together.
            </p>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '2px solid #111827' }}>
            {(['login', 'register'] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  flex: 1,
                  padding: '13px 0',
                  background: tab === t ? '#111827' : 'none',
                  border: 'none',
                  borderRight: t === 'login' ? '2px solid #111827' : 'none',
                  fontFamily: "'Courier New', monospace",
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  textTransform: 'uppercase' as const,
                  letterSpacing: '0.1em',
                  cursor: 'pointer',
                  color: tab === t ? '#fff' : '#191C1D',
                  transition: 'none',
                }}
              >
                {t === 'login' ? 'Log in' : 'Register'}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ padding: '24px 32px 28px' }}>
            {tab === 'login' ? (
              <>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Email</label>
                  <input type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)}
                    style={inputStyle} placeholder="you@example.com"
                    onFocus={(e) => (e.target.style.outline = '2px solid #22C55E')}
                    onBlur={(e) => (e.target.style.outline = 'none')} />
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Password</label>
                  <input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)}
                    style={inputStyle} placeholder="••••••••"
                    onFocus={(e) => (e.target.style.outline = '2px solid #22C55E')}
                    onBlur={(e) => (e.target.style.outline = 'none')} />
                  <button type="button" style={{
                    alignSelf: 'flex-start', marginTop: '6px',
                    background: 'none', border: 'none',
                    fontFamily: "'Courier New', monospace",
                    fontSize: '0.65rem', letterSpacing: '0.05em',
                    textDecoration: 'underline', cursor: 'pointer',
                    padding: 0, color: '#191C1D',
                  }}>
                    Forgot password?
                  </button>
                </div>
              </>
            ) : (
              <>
                {[
                  { label: 'Display Name', type: 'text', value: regName, setter: setRegName, placeholder: 'Your name' },
                  { label: 'Email', type: 'email', value: regEmail, setter: setRegEmail, placeholder: 'you@example.com' },
                  { label: 'Password', type: 'password', value: regPassword, setter: setRegPassword, placeholder: '••••••••' },
                  { label: 'Confirm Password', type: 'password', value: regConfirm, setter: setRegConfirm, placeholder: '••••••••' },
                ].map(({ label, type, value, setter, placeholder }) => (
                  <div key={label} style={fieldStyle}>
                    <label style={labelStyle}>{label}</label>
                    <input type={type} value={value} onChange={(e) => setter(e.target.value)}
                      style={inputStyle} placeholder={placeholder}
                      onFocus={(e) => (e.target.style.outline = '2px solid #22C55E')}
                      onBlur={(e) => (e.target.style.outline = 'none')} />
                  </div>
                ))}
                <div style={fieldStyle}>
                  <label style={labelStyle}>
                    What are you building?{' '}
                    <span style={{ fontWeight: 400, textTransform: 'none' }}>(optional)</span>
                  </label>
                  <input type="text" value={regBuilding} onChange={(e) => setRegBuilding(e.target.value)}
                    style={inputStyle} placeholder="e.g. a CLI tool for developers"
                    onFocus={(e) => (e.target.style.outline = '2px solid #22C55E')}
                    onBlur={(e) => (e.target.style.outline = 'none')} />
                </div>
              </>
            )}

            <button
              type="submit"
              onMouseEnter={() => setSubmitHover(true)}
              onMouseLeave={() => setSubmitHover(false)}
              style={{
                width: '100%',
                padding: '13px 0',
                background: submitHover ? '#111827' : '#22C55E',
                color: '#fff',
                border: '2px solid #111827',
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '0.8rem',
                fontWeight: 800,
                textTransform: 'uppercase' as const,
                letterSpacing: '0.1em',
                cursor: 'pointer',
                marginTop: '8px',
                boxShadow: submitHover ? 'none' : '4px 4px 0px 0px #111827',
                transform: submitHover ? 'translate(4px, 4px)' : 'none',
                transition: 'none',
              }}
            >
              {tab === 'login' ? 'Sign in →' : 'Create account →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
