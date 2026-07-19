import { compendiumItemToFlashcard } from '@/modules/flashcards/helpers/compendiumItemToFlashcard'
import type { CompendiumItem } from '@/types/compendium'
import type { Flashcard } from '@/types/flashcard'

export function buildCompendiumFlashcards(items: CompendiumItem[]): Flashcard[] {
  return items.map(compendiumItemToFlashcard)
}
