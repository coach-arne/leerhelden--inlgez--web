import { atom } from 'jotai'

import type { ExamQuestion } from '@/types/exam'

export const examSourcesAtom = atom<string[]>([])
export const examCountAtom = atom<number>(20)
export const examDeckAtom = atom<ExamQuestion[] | null>(null)
export const examSessionIdAtom = atom<string | null>(null)
export const examIndexAtom = atom<number>(0)

/** Map van questionId → gekozen answerId (of null als nog niet beantwoord) */
export const examAnswersAtom = atom<Map<string, string>>(new Map())

export const currentExamQuestionAtom = atom((get) => {
  const deck = get(examDeckAtom)
  const i = get(examIndexAtom)
  if (!deck || deck.length === 0 || i < 0 || i >= deck.length) return null
  return deck[i] ?? null
})
