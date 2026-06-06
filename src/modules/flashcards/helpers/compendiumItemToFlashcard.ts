import {
  extractFlashcardDefinition,
  extractFlashcardParagraphs,
  parseChapterFromDoc,
} from '@/modules/compendiums/helpers/extractFlashcardTextFromDoc'
import type { CompendiumItem } from '@/types/compendium'
import type { Flashcard } from '@/types/flashcard'

export function compendiumItemToFlashcard(item: CompendiumItem): Flashcard {
  return {
    id: `compendium-${item.compendium}-${item.id}`,
    term: {
      nl: item.nameNL,
      en: item.nameEN,
    },
    definition: extractFlashcardDefinition(item.description),
    chapter: parseChapterFromDoc(item.description),
    additions: extractFlashcardParagraphs(item.additions),
    importance: 3,
    type: item.compendium,
    source: `compendium:${item.compendium}`,
  }
}
