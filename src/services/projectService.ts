import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import type { Project, Milestone } from '../types'

function docToProject(id: string, d: Record<string, unknown>): Project {
  return {
    id,
    ownerId: d.ownerId as string,
    ownerName: d.ownerName as string,
    title: d.title as string,
    description: d.description as string,
    stage: d.stage as Project['stage'],
    supportRequired: d.supportRequired as string,
    githubUrl: d.githubUrl as string,
    githubVisible: d.githubVisible as boolean,
    tags: (d.tags as string[]) ?? [],
    featured: (d.featured as boolean) ?? false,
    completedAt: d.completedAt ? (d.completedAt as Timestamp).toDate().toISOString().slice(0, 10) : undefined,
    createdAt: d.createdAt ? (d.createdAt as Timestamp).toDate().toISOString().slice(0, 10) : '',
    milestones: [],
  }
}

export async function createProject(
  ownerId: string,
  ownerName: string,
  data: {
    title: string
    description: string
    stage: Project['stage']
    supportRequired: string
    githubUrl: string
    githubVisible: boolean
  }
): Promise<string> {
  const ref = await addDoc(collection(db, 'projects'), {
    ownerId,
    ownerName,
    ...data,
    tags: [],
    featured: false,
    completedAt: null,
    createdAt: serverTimestamp(),
  })
  return ref.id
}

export async function getMyProjects(ownerId: string): Promise<Project[]> {
  const q = query(collection(db, 'projects'), where('ownerId', '==', ownerId))
  const snap = await getDocs(q)
  const projects: Project[] = []
  for (const docSnap of snap.docs) {
    const project = docToProject(docSnap.id, docSnap.data() as Record<string, unknown>)
    // Fetch milestones subcollection
    const msSnap = await getDocs(collection(db, 'projects', docSnap.id, 'milestones'))
    project.milestones = msSnap.docs.map((m) => {
      const md = m.data()
      return {
        id: m.id,
        date: md.date as string,
        title: md.title as string,
        description: md.description as string,
      }
    }).sort((a, b) => a.date.localeCompare(b.date))
    projects.push(project)
  }
  return projects.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export async function getCompletedProjects(): Promise<Project[]> {
  const q = query(collection(db, 'projects'), where('stage', '==', 'Complete'))
  const snap = await getDocs(q)
  return snap.docs
    .map((d) => docToProject(d.id, d.data() as Record<string, unknown>))
    .sort((a, b) => (b.completedAt ?? '').localeCompare(a.completedAt ?? ''))
}

export async function updateProject(projectId: string, fields: Partial<Omit<Project, 'id' | 'milestones'>>) {
  await updateDoc(doc(db, 'projects', projectId), {
    ...fields,
    updatedAt: serverTimestamp(),
  })
}

export async function markProjectComplete(projectId: string) {
  await updateDoc(doc(db, 'projects', projectId), {
    stage: 'Complete',
    completedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export async function addMilestone(projectId: string, milestone: Omit<Milestone, 'id'>): Promise<string> {
  const ref = await addDoc(collection(db, 'projects', projectId, 'milestones'), {
    ...milestone,
    createdAt: serverTimestamp(),
  })
  return ref.id
}

export async function getProjectById(projectId: string): Promise<Project | null> {
  const snap = await getDoc(doc(db, 'projects', projectId))
  if (!snap.exists()) return null
  return docToProject(snap.id, snap.data() as Record<string, unknown>)
}
