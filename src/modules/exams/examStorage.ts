export type StoredExamResult = {
  id: string
  finishedAt: string
  sources: string[]
  totalQuestions: number
  correct: number
  incorrect: number
}

export const EXAM_RESULTS_STORAGE_KEY = 'inlgezp-exam-results'

function isStringArray(x: unknown): x is string[] {
  return Array.isArray(x) && x.every((s) => typeof s === 'string')
}

function normalizeStoredResult(raw: unknown): StoredExamResult | null {
  if (raw === null || typeof raw !== 'object') return null
  const o = raw as Record<string, unknown>
  if (
    typeof o.id !== 'string' ||
    typeof o.finishedAt !== 'string' ||
    typeof o.totalQuestions !== 'number' ||
    typeof o.correct !== 'number' ||
    typeof o.incorrect !== 'number'
  ) {
    return null
  }
  return {
    id: o.id,
    finishedAt: o.finishedAt,
    sources: isStringArray(o.sources) ? o.sources : [],
    totalQuestions: o.totalQuestions,
    correct: o.correct,
    incorrect: o.incorrect,
  }
}

function parseResults(raw: string | null): StoredExamResult[] {
  if (!raw) return []
  try {
    const data = JSON.parse(raw) as unknown
    if (!Array.isArray(data)) return []
    return data
      .map(normalizeStoredResult)
      .filter((x): x is StoredExamResult => x !== null)
  } catch {
    return []
  }
}

export function loadExamResults(): StoredExamResult[] {
  if (typeof window === 'undefined') return []
  return parseResults(localStorage.getItem(EXAM_RESULTS_STORAGE_KEY))
}

export function appendExamResult(result: StoredExamResult): void {
  if (typeof window === 'undefined') return
  const prev = loadExamResults()
  const next = [result, ...prev]
  localStorage.setItem(EXAM_RESULTS_STORAGE_KEY, JSON.stringify(next))
}
