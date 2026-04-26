import type { StoredSessionResult } from '@/types/sessionResult'

export const FLASHCARD_RESULTS_STORAGE_KEY = 'inlgezp-flashcard-results'

/** Legacy vorm vóór multiselect (één waarde of 'all'). */
type LegacyStoredSessionResult = {
  id: string
  finishedAt: string
  chapter: number | 'all'
  type: string | 'all'
  requestedCount: number
  correct: number
  incorrect: number
  unsure: number
}

function isNumberArray(x: unknown): x is number[] {
  return Array.isArray(x) && x.every((n) => typeof n === 'number')
}

function isStringArray(x: unknown): x is string[] {
  return Array.isArray(x) && x.every((s) => typeof s === 'string' && s.length > 0)
}

function normalizeStoredResult(raw: unknown): StoredSessionResult | null {
  if (raw === null || typeof raw !== 'object') return null
  const o = raw as Record<string, unknown>
  if (
    typeof o.id !== 'string' ||
    typeof o.finishedAt !== 'string' ||
    typeof o.requestedCount !== 'number' ||
    typeof o.correct !== 'number' ||
    typeof o.incorrect !== 'number' ||
    typeof o.unsure !== 'number'
  ) {
    return null
  }

  if (isNumberArray(o.chapters) && isStringArray(o.types)) {
    return {
      id: o.id,
      finishedAt: o.finishedAt,
      chapters: o.chapters,
      types: o.types,
      sources: isStringArray(o.sources) ? o.sources : [],
      requestedCount: o.requestedCount,
      correct: o.correct,
      incorrect: o.incorrect,
      unsure: o.unsure,
    }
  }

  const legacy = raw as Partial<LegacyStoredSessionResult>
  if (
    (typeof legacy.chapter === 'number' || legacy.chapter === 'all') &&
    (legacy.type === 'all' || (typeof legacy.type === 'string' && legacy.type.length > 0))
  ) {
    const chapters: number[] =
      legacy.chapter === 'all' ? [] : [legacy.chapter as number]
    const types: string[] =
      legacy.type === 'all' ? [] : [legacy.type as string]
    return {
      id: o.id as string,
      finishedAt: o.finishedAt as string,
      chapters,
      types,
      sources: [],
      requestedCount: o.requestedCount as number,
      correct: o.correct as number,
      incorrect: o.incorrect as number,
      unsure: o.unsure as number,
    }
  }

  return null
}

function parseResults(raw: string | null): StoredSessionResult[] {
  if (!raw) return []
  try {
    const data = JSON.parse(raw) as unknown
    if (!Array.isArray(data)) return []
    return data
      .map(normalizeStoredResult)
      .filter((x): x is StoredSessionResult => x != null)
  } catch {
    return []
  }
}

export function loadFlashcardResults(): StoredSessionResult[] {
  if (typeof window === 'undefined') return []
  return parseResults(localStorage.getItem(FLASHCARD_RESULTS_STORAGE_KEY))
}

export function appendFlashcardResult(result: StoredSessionResult): void {
  if (typeof window === 'undefined') return
  const prev = loadFlashcardResults()
  const next = [result, ...prev]
  localStorage.setItem(FLASHCARD_RESULTS_STORAGE_KEY, JSON.stringify(next))
}
