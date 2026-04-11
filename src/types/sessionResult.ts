import type { ChapterSelection, TypeSelection } from '@/types/flashcard'

/** Opgeslagen sessieresultaat (genormaliseerd: arrays; leeg = alle). */
export type StoredSessionResult = {
  id: string
  finishedAt: string
  chapters: ChapterSelection
  types: TypeSelection
  requestedCount: number
  correct: number
  incorrect: number
  unsure: number
}
