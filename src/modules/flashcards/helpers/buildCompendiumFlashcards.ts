import { ALL_COMPENDIUM_ITEMS } from '@/data/compendiums'
import { compendiumItemToFlashcard } from '@/modules/flashcards/helpers/compendiumItemToFlashcard'
import type { Flashcard } from '@/types/flashcard'

export function buildCompendiumFlashcards(): Flashcard[] {
  return ALL_COMPENDIUM_ITEMS.map(compendiumItemToFlashcard)
}
