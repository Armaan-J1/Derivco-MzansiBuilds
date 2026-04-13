import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '../features/auth/useAuthStore'
import ProtectedRoute from '../components/ProtectedRoute'
import AuthPage from './AuthPage'
import AppPage from './AppPage'
import ProfilePage from './ProfilePage'

export default function App() {
  const init = useAuthStore((s) => s._init)
  useEffect(() => { return init() }, [init])

  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route path="/app" element={<ProtectedRoute><AppPage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
