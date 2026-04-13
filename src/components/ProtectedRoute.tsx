import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../features/auth/useAuthStore'

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuthStore()
  if (loading) return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Courier New', monospace", fontSize: '0.75rem',
      textTransform: 'uppercase', letterSpacing: '0.1em', color: '#191C1D', background: '#F3F4F5',
    }}>
      // booting...
    </div>
  )
  if (!user) return <Navigate to="/" replace />
  return <>{children}</>
}
