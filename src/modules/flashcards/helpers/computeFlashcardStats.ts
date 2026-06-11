import type { StoredSessionResult } from '@/types/sessionResult'

export type ScoreOverTimeEntry = {
  date: string
  pct: number
}

export type ChapterBreakdownEntry = {
  chapter: string
  correct: number
  unsure: number
  incorrect: number
  total: number
  pct: number
}

export type WeakChapter = {
  chapter: number
  pct: number
}

export type WeakType = {
  type: string
  pct: number
}

function weightedPct(correct: number, unsure: number, total: number): number {
  if (total === 0) return 0
  return Math.round(((correct + 0.5 * unsure) / total) * 100)
}

/** Last 30 sessions sorted by date ascending, one entry per session. */
export function getScoreOverTime(results: StoredSessionResult[]): ScoreOverTimeEntry[] {
  return [...results]
    .sort((a, b) => a.finishedAt.localeCompare(b.finishedAt))
    .slice(-30)
    .map((r) => ({
      date: new Date(r.finishedAt).toLocaleDateString('nl-BE', {
        day: '2-digit',
        month: '2-digit',
      }),
      pct: weightedPct(r.correct, r.unsure, r.requestedCount),
    }))
}

/**
 * Aggregates totals per chapter across all sessions.
 * Sessions with empty chapters array (= all chapters) are included in every chapter
 * bucket proportionally — but since we can't know the per-chapter split we skip
 * those entries to keep the data meaningful.
 */
export function getChapterBreakdown(
  results: StoredSessionResult[],
): ChapterBreakdownEntry[] {
  const map = new Map<
    number,
    { correct: number; unsure: number; incorrect: number; total: number }
  >()

  for (const r of results) {
    if (r.chapters.length === 0) continue
    for (const ch of r.chapters) {
      const prev = map.get(ch) ?? { correct: 0, unsure: 0, incorrect: 0, total: 0 }
      map.set(ch, {
        correct: prev.correct + r.correct,
        unsure: prev.unsure + r.unsure,
        incorrect: prev.incorrect + r.incorrect,
        total: prev.total + r.requestedCount,
      })
    }
  }

  return [...map.entries()]
    .sort(([a], [b]) => a - b)
    .map(([chapter, { correct, unsure, incorrect, total }]) => ({
      chapter: `H${chapter}`,
      correct,
      unsure,
      incorrect,
      total,
      pct: weightedPct(correct, unsure, total),
    }))
}

/** Returns chapter numbers whose weighted score is below the threshold. */
export function getWeakChapters(
  results: StoredSessionResult[],
  threshold = 60,
): WeakChapter[] {
  const breakdown = getChapterBreakdown(results)
  return breakdown
    .filter((e) => e.pct < threshold)
    .map((e) => ({
      chapter: Number(e.chapter.replace('H', '')),
      pct: e.pct,
    }))
    .sort((a, b) => a.pct - b.pct)
}

/** Returns type strings whose weighted score is below the threshold. */
export function getWeakTypes(
  results: StoredSessionResult[],
  threshold = 60,
): WeakType[] {
  const map = new Map<
    string,
    { correct: number; unsure: number; total: number }
  >()

  for (const r of results) {
    if (r.types.length === 0) continue
    for (const t of r.types) {
      const prev = map.get(t) ?? { correct: 0, unsure: 0, total: 0 }
      map.set(t, {
        correct: prev.correct + r.correct,
        unsure: prev.unsure + r.unsure,
        total: prev.total + r.requestedCount,
      })
    }
  }

  return [...map.entries()]
    .map(([type, { correct, unsure, total }]) => ({
      type,
      pct: weightedPct(correct, unsure, total),
    }))
    .filter((e) => e.pct < threshold)
    .sort((a, b) => a.pct - b.pct)
}

export type OverallStats = {
  totalSessions: number
  averagePct: number
  totalCards: number
}

export function getOverallStats(results: StoredSessionResult[]): OverallStats {
  const totalSessions = results.length
  const totalCards = results.reduce((s, r) => s + r.requestedCount, 0)
  const averagePct =
    totalSessions === 0
      ? 0
      : Math.round(
          results.reduce(
            (s, r) => s + weightedPct(r.correct, r.unsure, r.requestedCount),
            0,
          ) / totalSessions,
        )
  return { totalSessions, averagePct, totalCards }
}
