import type { CourseData } from '@/types/course'
import type { CompendiumItem, CompendiumMeta } from '@/types/compendium'
import type { ExamQuestion } from '@/types/exam'
import type { Flashcard } from '@/types/flashcard'

import { compendiumItemToFlashcard } from '@/modules/flashcards/helpers/compendiumItemToFlashcard'

import { klinpsy1aConfig } from './config'

// --- Flashcards ---
import flashcardsH1 from '../../flashcards/klinpsy1a/flashcards_h1.json'
import flashcardsH2 from '../../flashcards/klinpsy1a/flashcards_h2.json'
import flashcardsH3 from '../../flashcards/klinpsy1a/flashcards_h3.json'
import flashcardsH4 from '../../flashcards/klinpsy1a/flashcards_h4.json'
import flashcardsH5 from '../../flashcards/klinpsy1a/flashcards_h5.json'
import flashcardsH6 from '../../flashcards/klinpsy1a/flashcards_h6.json'
import flashcardsH7 from '../../flashcards/klinpsy1a/flashcards_h7.json'

// --- Exams ---

// --- Compendiums ---

// ---- Flashcards setup ----

type RawFlashcard = Omit<Flashcard, 'source'>
type FlashcardSourceEntry = { source: string; cards: RawFlashcard[] }

const FLASHCARD_SOURCE_ENTRIES: FlashcardSourceEntry[] = [
  { source: 'flashcards_h1.json', cards: flashcardsH1 as RawFlashcard[] },
  { source: 'flashcards_h2.json', cards: flashcardsH2 as RawFlashcard[] },
  { source: 'flashcards_h3.json', cards: flashcardsH3 as RawFlashcard[] },
  { source: 'flashcards_h4.json', cards: flashcardsH4 as RawFlashcard[] },
  { source: 'flashcards_h5.json', cards: flashcardsH5 as RawFlashcard[] },
  { source: 'flashcards_h6.json', cards: flashcardsH6 as RawFlashcard[] },
  { source: 'flashcards_h7.json', cards: flashcardsH7 as RawFlashcard[] },
]

const flashcards: Flashcard[] = FLASHCARD_SOURCE_ENTRIES.flatMap(({ source, cards }) =>
  cards.map((c) => ({ ...c, source })),
)
const flashcardSources: string[] = FLASHCARD_SOURCE_ENTRIES.map((e) => e.source)
const chapterNumbers = [1, 2, 3, 4, 5, 6, 7] as const

// ---- Exams setup ----

type RawExamQuestion = Omit<ExamQuestion, 'source'>
type ExamSourceEntry = { source: string; label: string; questions: RawExamQuestion[] }

const EXAM_SOURCE_ENTRIES: ExamSourceEntry[] = []

const exams: ExamQuestion[] = EXAM_SOURCE_ENTRIES.flatMap(({ source, questions }) =>
  questions.map((q) => ({ ...q, source })),
)
const examSourceOptions: { value: string; label: string }[] = EXAM_SOURCE_ENTRIES.map(
  ({ source, label }) => ({ value: source, label }),
)

// ---- Compendiums setup ----

type RawCompendiumEntry = {
  id: string
  nameNL: string
  nameEN: string
  description: CompendiumItem['description']
  additions: CompendiumItem['additions']
}
type CompendiumSourceEntry = {
  compendium: string
  label: string
  description: string
  items: RawCompendiumEntry[]
}

const COMPENDIUM_SOURCE_ENTRIES: CompendiumSourceEntry[] = [ ]

const compendiumItems: CompendiumItem[] = COMPENDIUM_SOURCE_ENTRIES.flatMap(
  ({ compendium, items }) => items.map((item) => ({ ...item, compendium })),
)

const compendiumMeta: CompendiumMeta[] = COMPENDIUM_SOURCE_ENTRIES.map(
  ({ compendium, label, description, items }) => ({
    slug: compendium,
    label,
    description,
    itemCount: items.length,
  }),
)

const compendiumFlashcards: Flashcard[] = compendiumItems.map(compendiumItemToFlashcard)

// ---- Exported CourseData ----

export const klinpsy1aData: CourseData = {
  config: klinpsy1aConfig,
  flashcards,
  compendiumFlashcards,
  flashcardSources,
  chapterNumbers,
  exams,
  examSourceOptions,
  compendiumMeta,
  compendiumItems,
}
