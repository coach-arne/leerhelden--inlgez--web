import type { Flashcard } from '@/types/flashcard'

import flashcardsH1 from './flashcards/flashcards_h1.json'
import flashcardsH2 from './flashcards/flashcards_h2.json'
import flashcardsHM2 from './flashcards/flashcards_h2-M2.json'
import flashcardsHM1 from './flashcards/flashcards_h2-M1.json'
import flashcardsH3 from './flashcards/flashcards_h3.json'
import flashcardsH4 from './flashcards/flashcards_h4.json'
import flashcardsH5 from './flashcards/flashcards_h5.json'
import flashcardsH6 from './flashcards/flashcards_h6.json'
import flashcardsH7 from './flashcards/flashcards_h7.json'
import flashcardsH8 from './flashcards/flashcards_h8.json'
import flashcardsH9 from './flashcards/flashcards_h9.json'

type SourceEntry = { source: string; cards: Omit<Flashcard, 'source'>[] }

const SOURCE_ENTRIES: SourceEntry[] = [
  { source: 'flashcards_h1.json', cards: flashcardsH1 as Omit<Flashcard, 'source'>[] },
  { source: 'flashcards_h2.json', cards: flashcardsH2 as Omit<Flashcard, 'source'>[] },
  { source: 'flashcards_h2-M2.json', cards: flashcardsHM2 as Omit<Flashcard, 'source'>[] },
  { source: 'flashcards_h2-M1.json', cards: flashcardsHM1 as Omit<Flashcard, 'source'>[] },
  { source: 'flashcards_h3.json', cards: flashcardsH3 as Omit<Flashcard, 'source'>[] },
  { source: 'flashcards_h4.json', cards: flashcardsH4 as Omit<Flashcard, 'source'>[] },
  { source: 'flashcards_h5.json', cards: flashcardsH5 as Omit<Flashcard, 'source'>[] },
  { source: 'flashcards_h6.json', cards: flashcardsH6 as Omit<Flashcard, 'source'>[] },
  { source: 'flashcards_h7.json', cards: flashcardsH7 as Omit<Flashcard, 'source'>[] },
  { source: 'flashcards_h8.json', cards: flashcardsH8 as Omit<Flashcard, 'source'>[] },
  { source: 'flashcards_h9.json', cards: flashcardsH9 as Omit<Flashcard, 'source'>[] },
]

export const ALL_SOURCES: string[] = SOURCE_ENTRIES.map((e) => e.source)

export const ALL_FLASHCARDS: Flashcard[] = SOURCE_ENTRIES.flatMap(({ source, cards }) =>
  cards.map((c) => ({ ...c, source })),
)

export const CHAPTER_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14] as const

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

export function filterBySources(cards: Flashcard[], sources: string[]): Flashcard[] {
  if (sources.length === 0) return cards
  const set = new Set(sources)
  return cards.filter((c) => set.has(c.source))
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
  sources: string[] = [],
): Flashcard[] {
  let pool = filterByChapters(cards, chapters)
  pool = filterByTypes(pool, types)
  pool = filterBySources(pool, sources)
  const shuffled = shuffle(pool)
  return takeFirstN(shuffled, count)
}

export function countAvailable(
  cards: Flashcard[],
  chapters: number[],
  types: string[],
  sources: string[] = [],
): number {
  return filterBySources(
    filterByTypes(filterByChapters(cards, chapters), types),
    sources,
  ).length
}
