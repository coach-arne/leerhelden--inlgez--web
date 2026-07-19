import type { ExamQuestion } from '@/types/exam'
import { shuffle } from './flashcardHelpers'

export const MAX_EXAM_COUNT = 50

export function filterExamsBySources(
  questions: ExamQuestion[],
  sources: string[],
): ExamQuestion[] {
  if (sources.length === 0) return questions
  const set = new Set(sources)
  return questions.filter((q) => set.has(q.source))
}

export function countExamAvailable(questions: ExamQuestion[], sources: string[]): number {
  return filterExamsBySources(questions, sources).length
}

export function buildExamDeck(
  questions: ExamQuestion[],
  sources: string[],
  count: number,
): ExamQuestion[] {
  const pool = filterExamsBySources(questions, sources)
  const shuffled = shuffle(pool)
  return shuffled.slice(0, Math.min(count, MAX_EXAM_COUNT))
}
