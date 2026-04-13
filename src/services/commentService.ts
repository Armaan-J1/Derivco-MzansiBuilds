import { collection, addDoc, getDocs, query, orderBy, serverTimestamp, Timestamp } from 'firebase/firestore'
import { db } from '../lib/firebase'
import type { Comment } from '../types'

export async function getComments(feedItemId: string): Promise<Comment[]> {
  const q = query(collection(db, 'feedItems', feedItemId, 'comments'), orderBy('createdAt', 'asc'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => {
    const data = d.data()
    return {
      id: d.id,
      authorId: data.authorId as string,
      authorName: data.authorName as string,
      text: data.text as string,
      createdAt: data.createdAt ? (data.createdAt as Timestamp).toDate().toISOString().slice(0, 10) : '',
    }
  })
}

export async function addComment(
  feedItemId: string,
  authorId: string,
  authorName: string,
  text: string
): Promise<Comment> {
  const ref = await addDoc(collection(db, 'feedItems', feedItemId, 'comments'), {
    authorId,
    authorName,
    text,
    createdAt: serverTimestamp(),
  })
  return {
    id: ref.id,
    authorId,
    authorName,
    text,
    createdAt: new Date().toISOString().slice(0, 10),
  }
}
