import type { ExamQuestion } from '@/types/exam'


import oefenvragenThema1Raw from './exams/oefenvragen_thema1.json'
import oefenvragenThema2Raw from './exams/oefenvragen_thema2.json'
import oefenvragenThema3Raw from './exams/oefenvragen_thema3.json'
import oefenvragenThema4Raw from './exams/oefenvragen_thema4.json'
import oefenvragenThema5Raw from './exams/oefenvragen_thema5.json'

type RawExamQuestion = Omit<ExamQuestion, 'source'>

type ExamSourceEntry = {
  source: string
  label: string
  questions: RawExamQuestion[]
}

export const MAX_EXAM_COUNT = 50

const SOURCE_ENTRIES: ExamSourceEntry[] = [
  {
    source: 'oefenvragen_thema1.json',
    label: 'Oefenvragen Thema 1',
    questions: oefenvragenThema1Raw as RawExamQuestion[],
  },
  {
    source: 'oefenvragen_thema2.json',
    label: 'Oefenvragen Thema 2',
    questions: oefenvragenThema2Raw as RawExamQuestion[],
  },
  {
    source: 'oefenvragen_thema3.json',
    label: 'Oefenvragen Thema 3',
    questions: oefenvragenThema3Raw as RawExamQuestion[],
  },
  {
    source: 'oefenvragen_thema4.json',
    label: 'Oefenvragen Thema 4',
    questions: oefenvragenThema4Raw as RawExamQuestion[],
  },
  {
    source: 'oefenvragen_thema5.json',
    label: 'Oefenvragen Thema 5',
    questions: oefenvragenThema5Raw as RawExamQuestion[],
  },
]

export const ALL_EXAM_SOURCE_OPTIONS: { value: string; label: string }[] =
  SOURCE_ENTRIES.map(({ source, label }) => ({ value: source, label }))

export const ALL_EXAM_QUESTIONS: ExamQuestion[] = SOURCE_ENTRIES.flatMap(
  ({ source, questions }) => questions.map((q) => ({ ...q, source })),
)

export function filterExamsBySources(
  questions: ExamQuestion[],
  sources: string[],
): ExamQuestion[] {
  if (sources.length === 0) return questions
  const set = new Set(sources)
  return questions.filter((q) => set.has(q.source))
}

export function countExamAvailable(sources: string[]): number {
  return filterExamsBySources(ALL_EXAM_QUESTIONS, sources).length
}

/** Fisher–Yates shuffle (copy) */
function shuffle<T>(items: T[]): T[] {
  const out = [...items]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j]!, out[i]!]
  }
  return out
}

export function buildExamDeck(sources: string[], count: number): ExamQuestion[] {
  const pool = filterExamsBySources(ALL_EXAM_QUESTIONS, sources)
  const shuffled = shuffle(pool)
  return shuffled.slice(0, Math.min(count, MAX_EXAM_COUNT))
}
