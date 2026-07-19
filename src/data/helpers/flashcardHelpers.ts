import type {
  ChapterSelection,
  CompendiumSelection,
  Flashcard,
  SourceSelection,
  TypeSelection,
} from '@/types/flashcard'

export function filterByChapters(cards: Flashcard[], chapters: ChapterSelection): Flashcard[] {
  if (chapters.length === 0) return cards
  const set = new Set(chapters)
  return cards.filter((c) => set.has(c.chapter))
}

export function filterByTypes(cards: Flashcard[], types: TypeSelection): Flashcard[] {
  if (types.length === 0) return cards
  const set = new Set(types)
  return cards.filter((c) => set.has(c.type))
}

export function filterBySources(cards: Flashcard[], sources: SourceSelection): Flashcard[] {
  if (sources.length === 0) return cards
  const set = new Set(sources)
  return cards.filter((c) => set.has(c.source))
}

export function getTypesForChapters(cards: Flashcard[], chapters: ChapterSelection): string[] {
  const subset = filterByChapters(cards, chapters)
  const uniq = new Set(subset.map((c) => c.type))
  return [...uniq].sort((a, b) => a.localeCompare(b, 'nl'))
}

function filterTextbookFlashcards(
  cards: Flashcard[],
  chapters: ChapterSelection,
  types: TypeSelection,
  sources: SourceSelection,
): Flashcard[] {
  let pool = filterByChapters(cards, chapters)
  pool = filterByTypes(pool, types)
  pool = filterBySources(pool, sources)
  return pool
}

function filterCompendiumFlashcards(
  compendiumCards: Flashcard[],
  compendiums: CompendiumSelection,
): Flashcard[] {
  if (compendiums.length === 0) return []
  const set = new Set(compendiums)
  return compendiumCards.filter((c) => set.has(c.type))
}

export function getAvailableFlashcards(
  allCards: Flashcard[],
  compendiumCards: Flashcard[],
  chapters: ChapterSelection,
  types: TypeSelection,
  sources: SourceSelection,
  compendiums: CompendiumSelection = [],
): Flashcard[] {
  const hasCompendiumSelection = compendiums.length > 0
  const hasTextbookFilters = chapters.length > 0 || types.length > 0 || sources.length > 0
  const includeTextbook = !hasCompendiumSelection || hasTextbookFilters
  const textbookPool = includeTextbook
    ? filterTextbookFlashcards(allCards, chapters, types, sources)
    : []
  const compendiumPool = filterCompendiumFlashcards(compendiumCards, compendiums)
  return [...textbookPool, ...compendiumPool]
}

export function countAvailable(
  allCards: Flashcard[],
  compendiumCards: Flashcard[],
  chapters: ChapterSelection,
  types: TypeSelection,
  sources: SourceSelection = [],
  compendiums: CompendiumSelection = [],
): number {
  return getAvailableFlashcards(allCards, compendiumCards, chapters, types, sources, compendiums)
    .length
}

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
  allCards: Flashcard[],
  compendiumCards: Flashcard[],
  chapters: ChapterSelection,
  types: TypeSelection,
  count: number,
  sources: SourceSelection = [],
  compendiums: CompendiumSelection = [],
): Flashcard[] {
  const pool = getAvailableFlashcards(allCards, compendiumCards, chapters, types, sources, compendiums)
  const shuffled = shuffle(pool)
  return takeFirstN(shuffled, count)
}
