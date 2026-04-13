import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { updateProfile } from 'firebase/auth'
import { auth, db } from '../lib/firebase'

export interface UserProfile {
  displayName: string
  email: string
  bio: string
  createdAt: string
}

export async function getUser(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, 'users', uid))
  if (!snap.exists()) return null
  const d = snap.data()
  return {
    displayName: d.displayName ?? '',
    email: d.email ?? '',
    bio: d.bio ?? '',
    createdAt: d.createdAt?.toDate?.()?.toISOString?.()?.slice(0, 10) ?? '',
  }
}

export async function updateUser(uid: string, fields: { displayName?: string; bio?: string }) {
  await updateDoc(doc(db, 'users', uid), {
    ...fields,
    updatedAt: serverTimestamp(),
  })
  if (fields.displayName && auth.currentUser) {
    await updateProfile(auth.currentUser, { displayName: fields.displayName })
  }
}
