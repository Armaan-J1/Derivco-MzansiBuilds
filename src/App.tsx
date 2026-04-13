import { Routes, Route, Navigate } from 'react-router-dom'
import AuthPage from './app/AuthPage'
import AppPage from './app/AppPage'
import ProfilePage from './app/ProfilePage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route path="/app" element={<AppPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
