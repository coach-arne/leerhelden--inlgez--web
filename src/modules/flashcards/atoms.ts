import { atom } from 'jotai'

import type {
  ChapterSelection,
  Flashcard,
  TypeSelection,
} from '@/types/flashcard'

export const setupChapterAtom = atom<ChapterSelection>([])
export const setupTypeAtom = atom<TypeSelection>([])
/** Gekozen aantal kaarten in deze sessie (max = beschikbaar na filters). */
export const setupCountAtom = atom<number>(10)

export const termLanguageAtom = atom<'nl' | 'en'>('nl')

export const activeDeckAtom = atom<Flashcard[] | null>(null)

/** Unieke id per gestarte sessie (voor idempotente opslag in localStorage). */
export const sessionIdAtom = atom<string | null>(null)

export type SessionScores = {
  correct: number
  incorrect: number
  unsure: number
}

export const sessionScoresAtom = atom<SessionScores>({
  correct: 0,
  incorrect: 0,
  unsure: 0,
})

export const sessionIndexAtom = atom<number>(0)

/** Of de achterkant (definitie) zichtbaar is. */
export const cardRevealedAtom = atom<boolean>(false)

export const currentCardAtom = atom((get) => {
  const deck = get(activeDeckAtom)
  const i = get(sessionIndexAtom)
  if (!deck || deck.length === 0 || i < 0 || i >= deck.length) return null
  return deck[i] ?? null
})
