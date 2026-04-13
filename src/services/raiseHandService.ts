import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  getDocs,
  collection,
  serverTimestamp,
  updateDoc,
  increment,
  Timestamp,
} from 'firebase/firestore'
import { db } from '../lib/firebase'

export interface RaiseHandRequest {
  userId: string
  userName: string
  email: string
  note: string
  status: 'pending' | 'accepted' | 'dismissed'
  createdAt: string
}

export async function getRaiseHandStatus(feedItemId: string, userId: string): Promise<boolean> {
  const snap = await getDoc(doc(db, 'feedItems', feedItemId, 'raiseHands', userId))
  return snap.exists()
}

export async function raiseHand(
  feedItemId: string,
  userId: string,
  userName: string,
  email: string,
  note = ''
) {
  await setDoc(doc(db, 'feedItems', feedItemId, 'raiseHands', userId), {
    userId,
    userName,
    email,
    note,
    status: 'pending',
    createdAt: serverTimestamp(),
  })
  await updateDoc(doc(db, 'feedItems', feedItemId), { raiseHandCount: increment(1) })
}

export async function lowerHand(feedItemId: string, userId: string) {
  await deleteDoc(doc(db, 'feedItems', feedItemId, 'raiseHands', userId))
  await updateDoc(doc(db, 'feedItems', feedItemId), { raiseHandCount: increment(-1) })
}

export async function getRaiseHandRequests(feedItemId: string): Promise<RaiseHandRequest[]> {
  const snap = await getDocs(collection(db, 'feedItems', feedItemId, 'raiseHands'))
  return snap.docs.map((d) => {
    const data = d.data()
    return {
      userId: data.userId as string,
      userName: data.userName as string,
      email: data.email as string,
      note: data.note as string,
      status: data.status as 'pending' | 'accepted' | 'dismissed',
      createdAt: data.createdAt ? (data.createdAt as Timestamp).toDate().toISOString().slice(0, 10) : '',
    }
  })
}

export async function updateRequestStatus(
  feedItemId: string,
  userId: string,
  status: 'accepted' | 'dismissed'
) {
  await updateDoc(doc(db, 'feedItems', feedItemId, 'raiseHands', userId), { status })
}
