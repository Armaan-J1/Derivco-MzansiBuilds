import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

type Tab = 'login' | 'register'

export default function AuthPage() {
  const navigate = useNavigate()
  const [tab, setTab] = useState<Tab>('login')

  // Login state
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  // Register state
  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regConfirm, setRegConfirm] = useState('')
  const [regBuilding, setRegBuilding] = useState('')

  const [loginHover, setLoginHover] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    navigate('/app')
  }

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

  const fieldStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0',
    marginBottom: '16px',
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#F3F4F5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          background: '#fff',
          border: '1px solid #111827',
        }}
      >
        {/* Header */}
        <div style={{ padding: '32px 32px 24px', borderBottom: '1px solid #E7E8E9' }}>
          <h1
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '1.5rem',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: '#191C1D',
              marginBottom: '6px',
            }}
          >
            BUILD IN PUBLIC
          </h1>
          <p
            style={{
              fontFamily: "'Courier New', Courier, monospace",
              fontSize: '0.75rem',
              color: '#191C1D',
            }}
          >
            // ship openly. grow together.
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid #E7E8E9' }}>
          {(['login', 'register'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                flex: 1,
                padding: '14px 0',
                background: 'none',
                border: 'none',
                borderBottom: tab === t ? '2px solid #22C55E' : '2px solid transparent',
                fontFamily: "'Courier New', Courier, monospace",
                fontSize: '0.75rem',
                fontWeight: tab === t ? 700 : 400,
                textTransform: 'uppercase' as const,
                letterSpacing: '0.08em',
                cursor: 'pointer',
                color: '#191C1D',
              }}
            >
              {t === 'login' ? 'Log in' : 'Register'}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '28px 32px 32px' }}>
          {tab === 'login' ? (
            <>
              <div style={fieldStyle}>
                <label style={labelStyle}>Email</label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.outline = '2px solid #22C55E')}
                  onBlur={(e) => (e.target.style.outline = 'none')}
                  placeholder="you@example.com"
                />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Password</label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.outline = '2px solid #22C55E')}
                  onBlur={(e) => (e.target.style.outline = 'none')}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  style={{
                    alignSelf: 'flex-start',
                    marginTop: '6px',
                    background: 'none',
                    border: 'none',
                    fontSize: '0.8125rem',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    padding: 0,
                    color: '#191C1D',
                  }}
                >
                  Forgot password?
                </button>
              </div>
            </>
          ) : (
            <>
              <div style={fieldStyle}>
                <label style={labelStyle}>Display Name</label>
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.outline = '2px solid #22C55E')}
                  onBlur={(e) => (e.target.style.outline = 'none')}
                  placeholder="Your name"
                />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Email</label>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.outline = '2px solid #22C55E')}
                  onBlur={(e) => (e.target.style.outline = 'none')}
                  placeholder="you@example.com"
                />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Password</label>
                <input
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.outline = '2px solid #22C55E')}
                  onBlur={(e) => (e.target.style.outline = 'none')}
                  placeholder="••••••••"
                />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Confirm Password</label>
                <input
                  type="password"
                  value={regConfirm}
                  onChange={(e) => setRegConfirm(e.target.value)}
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.outline = '2px solid #22C55E')}
                  onBlur={(e) => (e.target.style.outline = 'none')}
                  placeholder="••••••••"
                />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>What are you building? <span style={{ fontWeight: 400 }}>(optional)</span></label>
                <input
                  type="text"
                  value={regBuilding}
                  onChange={(e) => setRegBuilding(e.target.value)}
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.outline = '2px solid #22C55E')}
                  onBlur={(e) => (e.target.style.outline = 'none')}
                  placeholder="e.g. a CLI tool for developers"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            onMouseEnter={() => setLoginHover(true)}
            onMouseLeave={() => setLoginHover(false)}
            style={{
              width: '100%',
              padding: '12px 0',
              background: loginHover ? '#006E2F' : '#22C55E',
              color: '#fff',
              border: 'none',
              fontFamily: "'Courier New', Courier, monospace",
              fontSize: '0.8125rem',
              fontWeight: 700,
              textTransform: 'uppercase' as const,
              letterSpacing: '0.08em',
              cursor: 'pointer',
              marginTop: '8px',
            }}
          >
            {tab === 'login' ? 'Log in' : 'Create account'}
          </button>
        </form>
      </div>
    </div>
  )
}
