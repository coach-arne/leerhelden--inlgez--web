import type { Flashcard } from '@/types/flashcard'

import flashcardsH1 from './flashcards/flashcards_h1.json'
import flashcardsH2 from './flashcards/flashcards_h2.json'
import flashcardsH3 from './flashcards/flashcards_h3.json'

export const ALL_FLASHCARDS: Flashcard[] = [
  ...(flashcardsH1 as Flashcard[]),
  ...(flashcardsH2 as Flashcard[]),
  ...(flashcardsH3 as Flashcard[]),
]

export const CHAPTER_NUMBERS = [1, 2, 3] as const

export function filterByChapters(
  cards: Flashcard[],
  chapters: number[],
): Flashcard[] {
  if (chapters.length === 0) return cards
  const set = new Set(chapters)
  return cards.filter((c) => set.has(c.chapter))
}

export function filterByTypes(cards: Flashcard[], types: string[]): Flashcard[] {
  if (types.length === 0) return cards
  const set = new Set(types)
  return cards.filter((c) => set.has(c.type))
}

export function getTypesForChapters(
  cards: Flashcard[],
  chapters: number[],
): string[] {
  const subset = filterByChapters(cards, chapters)
  const uniq = new Set(subset.map((c) => c.type))
  return [...uniq].sort((a, b) => a.localeCompare(b, 'nl'))
}

/** Fisher–Yates shuffle (copy) */
export function shuffle<T>(items: T[]): T[] {
  const out = [...items]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j]!, out[i]!]
  }
  return out
}

export function takeFirstN<T>(items: T[], n: number): T[] {
  return items.slice(0, Math.min(n, items.length))
}

export function buildDeck(
  cards: Flashcard[],
  chapters: number[],
  types: string[],
  count: number,
): Flashcard[] {
  let pool = filterByChapters(cards, chapters)
  pool = filterByTypes(pool, types)
  const shuffled = shuffle(pool)
  return takeFirstN(shuffled, count)
}

export function countAvailable(
  cards: Flashcard[],
  chapters: number[],
  types: string[],
): number {
  return filterByTypes(filterByChapters(cards, chapters), types).length
}
