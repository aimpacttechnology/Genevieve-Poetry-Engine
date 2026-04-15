import type { SavedPoem, PoetryFormId } from '@/types'
import { generateId } from '@/lib/utils'

const KEY = 'genevieve_notebook'

function load(): SavedPoem[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]')
  } catch {
    return []
  }
}

function persist(poems: SavedPoem[]) {
  localStorage.setItem(KEY, JSON.stringify(poems))
}

export function getSavedPoems(): SavedPoem[] {
  return load().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}

export function savePoem(data: {
  title: string
  content: string
  form: PoetryFormId | null
  source: 'ai' | 'wizard' | 'template'
}): SavedPoem {
  const poem: SavedPoem = { ...data, id: generateId(), createdAt: new Date().toISOString() }
  persist([...load(), poem])
  return poem
}

export function deletePoem(id: string) {
  persist(load().filter((p) => p.id !== id))
}
