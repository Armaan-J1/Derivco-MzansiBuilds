import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import DotGrid from '../component/DotGrid'
import { login, register, resetPassword } from '../services/authService'
import { useAuthStore } from '../features/auth/useAuthStore'

type Tab = 'login' | 'register'

export default function AuthPage() {
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuthStore()
  const [tab, setTab] = useState<Tab>('login')
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regConfirm, setRegConfirm] = useState('')
  const [regBuilding, setRegBuilding] = useState('')
  const [submitHover, setSubmitHover] = useState(false)
  const [authError, setAuthError] = useState('')
  const [authSuccess, setAuthSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [showLoginPassword, setShowLoginPassword] = useState(false)
  const [showRegPassword, setShowRegPassword] = useState(false)
  const [showRegConfirm, setShowRegConfirm] = useState(false)

  // Navigate once Firebase confirms the user is authenticated
  useEffect(() => {
    if (!authLoading && user) navigate('/app')
  }, [user, authLoading, navigate])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setAuthError('')
    setAuthSuccess('')
    setLoading(true)
    try {
      if (tab === 'login') {
        await login(loginEmail, loginPassword)
      } else {
        if (regPassword !== regConfirm) throw new Error('Passwords do not match')
        await register(regName, regEmail, regPassword, regBuilding)
      }
      // navigation is handled by the useEffect above once onAuthStateChanged fires
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong'
      setAuthError(msg.replace('Firebase: ', '').replace(/\(auth\/.*\)/, '').trim())
    } finally {
      setLoading(false)
    }
  }

  async function handleForgotPassword() {
    if (!loginEmail) { setAuthError('Enter your email first'); return }
    setAuthError('')
    setAuthSuccess('')
    try {
      await resetPassword(loginEmail)
      setAuthSuccess('Password reset email sent. Check your inbox.')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong'
      setAuthError(msg.replace('Firebase: ', '').replace(/\(auth\/.*\)/, '').trim())
    }
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
      {/* DotGrid background */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <DotGrid
          dotSize={4}
          gap={26}
          baseColor="#e5e5e5"
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

      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '440px' }}>

        {/* Top Branding */}
<div style={{ textAlign: 'center', marginBottom: '24px' }}>
  <h1 style={{
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: '3.2rem',
    fontWeight: 900,
    letterSpacing: '-0.04em',
    textTransform: 'uppercase',
    color: '#191C1D',
    marginBottom: '6px',
  }}>
    MZANSIBUILDS
  </h1>

  <p style={{
    fontFamily: "'Courier New', monospace",
    fontSize: '0.85rem',
    letterSpacing: '0.25em',
    color: '#6b7280',
    textTransform: 'uppercase',
  }}>
    BUILD. UPDATE. CELEBRATE.
  </p>
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
                  <div style={{ position: 'relative' }}>
                    <input type={showLoginPassword ? 'text' : 'password'} value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)}
                      style={{ ...inputStyle, paddingRight: '48px' }} placeholder="••••••••"
                      onFocus={(e) => (e.target.style.outline = '2px solid #22C55E')}
                      onBlur={(e) => (e.target.style.outline = 'none')} />
                    <button type="button" onClick={() => setShowLoginPassword((v) => !v)} style={{
                      position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px',
                      fontFamily: "'Courier New', monospace", fontSize: '0.6rem', fontWeight: 700,
                      color: '#6b7280', letterSpacing: '0.05em', textTransform: 'uppercase',
                    }}>
                      {showLoginPassword ? 'HIDE' : 'SHOW'}
                    </button>
                  </div>
                  <button type="button" onClick={handleForgotPassword} style={{
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
                <div style={fieldStyle}>
                  <label style={labelStyle}>Display Name</label>
                  <input type="text" value={regName} onChange={(e) => setRegName(e.target.value)}
                    style={inputStyle} placeholder="Your name"
                    onFocus={(e) => (e.target.style.outline = '2px solid #22C55E')}
                    onBlur={(e) => (e.target.style.outline = 'none')} />
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Email</label>
                  <input type="email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)}
                    style={inputStyle} placeholder="you@example.com"
                    onFocus={(e) => (e.target.style.outline = '2px solid #22C55E')}
                    onBlur={(e) => (e.target.style.outline = 'none')} />
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Password</label>
                  <div style={{ position: 'relative' }}>
                    <input type={showRegPassword ? 'text' : 'password'} value={regPassword} onChange={(e) => setRegPassword(e.target.value)}
                      style={{ ...inputStyle, paddingRight: '48px' }} placeholder="••••••••"
                      onFocus={(e) => (e.target.style.outline = '2px solid #22C55E')}
                      onBlur={(e) => (e.target.style.outline = 'none')} />
                    <button type="button" onClick={() => setShowRegPassword((v) => !v)} style={{
                      position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px',
                      fontFamily: "'Courier New', monospace", fontSize: '0.6rem', fontWeight: 700,
                      color: '#6b7280', letterSpacing: '0.05em', textTransform: 'uppercase',
                    }}>
                      {showRegPassword ? 'HIDE' : 'SHOW'}
                    </button>
                  </div>
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Confirm Password</label>
                  <div style={{ position: 'relative' }}>
                    <input type={showRegConfirm ? 'text' : 'password'} value={regConfirm} onChange={(e) => setRegConfirm(e.target.value)}
                      style={{ ...inputStyle, paddingRight: '48px' }} placeholder="••••••••"
                      onFocus={(e) => (e.target.style.outline = '2px solid #22C55E')}
                      onBlur={(e) => (e.target.style.outline = 'none')} />
                    <button type="button" onClick={() => setShowRegConfirm((v) => !v)} style={{
                      position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px',
                      fontFamily: "'Courier New', monospace", fontSize: '0.6rem', fontWeight: 700,
                      color: '#6b7280', letterSpacing: '0.05em', textTransform: 'uppercase',
                    }}>
                      {showRegConfirm ? 'HIDE' : 'SHOW'}
                    </button>
                  </div>
                </div>
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
              disabled={loading}
              onMouseEnter={() => setSubmitHover(true)}
              onMouseLeave={() => setSubmitHover(false)}
              style={{
                width: '100%',
                padding: '13px 0',
                background: loading ? '#9CA3AF' : submitHover ? '#111827' : '#22C55E',
                color: '#fff',
                border: '2px solid #111827',
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '0.8rem',
                fontWeight: 800,
                textTransform: 'uppercase' as const,
                letterSpacing: '0.1em',
                cursor: loading ? 'not-allowed' : 'pointer',
                marginTop: '8px',
                boxShadow: submitHover && !loading ? 'none' : '4px 4px 0px 0px #111827',
                transform: submitHover && !loading ? 'translate(4px, 4px)' : 'none',
                transition: 'none',
              }}
            >
              {loading ? 'Please wait...' : tab === 'login' ? 'Sign in →' : 'Create account →'}
            </button>

            {authError && (
              <p style={{
                marginTop: '10px',
                fontFamily: "'Courier New', monospace",
                fontSize: '0.7rem',
                color: '#DC2626',
                letterSpacing: '0.03em',
              }}>
                {authError}
              </p>
            )}
            {authSuccess && (
              <p style={{
                marginTop: '10px',
                fontFamily: "'Courier New', monospace",
                fontSize: '0.7rem',
                color: '#22C55E',
                letterSpacing: '0.03em',
              }}>
                {authSuccess}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}
