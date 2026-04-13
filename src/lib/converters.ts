import { Timestamp } from 'firebase/firestore'

export function tsToDate(ts: Timestamp | string | undefined): string {
  if (!ts) return new Date().toISOString().slice(0, 10)
  if (typeof ts === 'string') return ts
  return ts.toDate().toISOString().slice(0, 10)
}

export function nowTimestamp(): Timestamp {
  return Timestamp.now()
}
