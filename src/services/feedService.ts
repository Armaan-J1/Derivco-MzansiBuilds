import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
  DocumentSnapshot,
  Timestamp,
  updateDoc,
  doc,
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import type { FeedItem, Project } from '../types'

function docToFeedItem(id: string, d: Record<string, unknown>): FeedItem {
  const snap = d.projectSnapshot as Record<string, unknown>
  return {
    id,
    type: d.type as 'new_project' | 'update',
    project: {
      id: d.projectId as string,
      ownerId: d.ownerId as string,
      ownerName: d.ownerName as string,
      title: snap?.title as string,
      description: snap?.description as string,
      stage: snap?.stage as Project['stage'],
      supportRequired: snap?.supportRequired as string,
      githubUrl: snap?.githubUrl as string,
      githubVisible: snap?.githubVisible as boolean,
      milestones: [],
      tags: (snap?.tags as string[]) ?? [],
      featured: (snap?.featured as boolean) ?? false,
      createdAt: d.createdAt ? (d.createdAt as Timestamp).toDate().toISOString().slice(0, 10) : '',
    },
    comments: [],
    raiseHandCount: (d.raiseHandCount as number) ?? 0,
    raisedByMe: false,
    raiseHandRequests: [],
    createdAt: d.createdAt ? (d.createdAt as Timestamp).toDate().toISOString().slice(0, 10) : '',
  }
}

export async function createFeedItem(
  type: 'new_project' | 'update',
  projectId: string,
  ownerId: string,
  ownerName: string,
  projectSnapshot: {
    title: string
    description: string
    stage: Project['stage']
    supportRequired: string
    githubUrl: string
    githubVisible: boolean
  }
): Promise<string> {
  const ref = await addDoc(collection(db, 'feedItems'), {
    type,
    projectId,
    ownerId,
    ownerName,
    projectSnapshot,
    raiseHandCount: 0,
    createdAt: serverTimestamp(),
  })
  return ref.id
}

export async function getFeed(
  pageSize = 10,
  lastDoc?: DocumentSnapshot
): Promise<{ items: FeedItem[]; lastDoc: DocumentSnapshot | null }> {
  let q = query(collection(db, 'feedItems'), orderBy('createdAt', 'desc'), limit(pageSize))
  if (lastDoc) {
    q = query(collection(db, 'feedItems'), orderBy('createdAt', 'desc'), startAfter(lastDoc), limit(pageSize))
  }
  const snap = await getDocs(q)
  const items = snap.docs.map((d) => docToFeedItem(d.id, d.data() as Record<string, unknown>))
  return { items, lastDoc: snap.docs[snap.docs.length - 1] ?? null }
}

export async function updateFeedItemSnapshot(
  feedItemId: string,
  projectSnapshot: Partial<{
    title: string
    description: string
    stage: string
    supportRequired: string
    githubUrl: string
    githubVisible: boolean
  }>
) {
  // Build a dot-notation update for the nested projectSnapshot map
  const updates: Record<string, unknown> = {}
  for (const [key, val] of Object.entries(projectSnapshot)) {
    updates[`projectSnapshot.${key}`] = val
  }
  await updateDoc(doc(db, 'feedItems', feedItemId), updates)
}
