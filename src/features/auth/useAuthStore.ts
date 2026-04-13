import { create } from 'zustand'
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth'
import { auth } from '../../lib/firebase'

interface AuthState {
  user: FirebaseUser | null
  loading: boolean
  _init: () => () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  _init: () => {
    const unsub = onAuthStateChanged(auth, (user) => {
      set({ user, loading: false })
    })
    return unsub
  },
}))
