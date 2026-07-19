import type { CourseData } from '@/types/course'
import type { CompendiumItem, CompendiumMeta } from '@/types/compendium'
import type { ExamQuestion } from '@/types/exam'
import type { Flashcard } from '@/types/flashcard'

import { compendiumItemToFlashcard } from '@/modules/flashcards/helpers/compendiumItemToFlashcard'

import { inlgezpConfig } from './config'

// --- Flashcards ---
import flashcardsH1 from '../../flashcards/inlgezp/flashcards_h1.json'
import flashcardsH2 from '../../flashcards/inlgezp/flashcards_h2.json'
import flashcardsHM2 from '../../flashcards/inlgezp/flashcards_h2-M2.json'
import flashcardsHM1 from '../../flashcards/inlgezp/flashcards_h2-M1.json'
import flashcardsH3 from '../../flashcards/inlgezp/flashcards_h3.json'
import flashcardsH4 from '../../flashcards/inlgezp/flashcards_h4.json'
import flashcardsH5 from '../../flashcards/inlgezp/flashcards_h5.json'
import flashcardsH6 from '../../flashcards/inlgezp/flashcards_h6.json'
import flashcardsH7 from '../../flashcards/inlgezp/flashcards_h7.json'
import flashcardsH8 from '../../flashcards/inlgezp/flashcards_h8.json'
import flashcardsH9 from '../../flashcards/inlgezp/flashcards_h9.json'
import flashcardsH10 from '../../flashcards/inlgezp/flashcards_h10.json'
import flashcardsH11 from '../../flashcards/inlgezp/flashcards_h11.json'
import flashcardsH12 from '../../flashcards/inlgezp/flashcards_h12.json'
import flashcardsH13 from '../../flashcards/inlgezp/flashcards_h13.json'
import flashcardsH14 from '../../flashcards/inlgezp/flashcards_h14.json'

// --- Exams ---
import oefenvragenThema1Raw from '../../exams/inlgezp/oefenvragen_thema1.json'
import oefenvragenThema2Raw from '../../exams/inlgezp/oefenvragen_thema2.json'
import oefenvragenThema3Raw from '../../exams/inlgezp/oefenvragen_thema3.json'
import oefenvragenThema4Raw from '../../exams/inlgezp/oefenvragen_thema4.json'
import oefenvragenThema5Raw from '../../exams/inlgezp/oefenvragen_thema5.json'
import oefenexamenInstinkersRaw from '../../exams/inlgezp/oefenexamen_instinkers.json'

// --- Compendiums ---
import pathologyRaw from '../../compendiums/inlgezp/pathology.compendium.json'
import modellenRaw from '../../compendiums/inlgezp/modellen.compendium.json'
import lichaamssystemenRaw from '../../compendiums/inlgezp/lichaamssystemen.compendium.json'
import meetinstrumentenRaw from '../../compendiums/inlgezp/meetinstrumenten.compendium.json'

// ---- Flashcards setup ----

type RawFlashcard = Omit<Flashcard, 'source'>
type FlashcardSourceEntry = { source: string; cards: RawFlashcard[] }

const FLASHCARD_SOURCE_ENTRIES: FlashcardSourceEntry[] = [
  { source: 'flashcards_h1.json', cards: flashcardsH1 as RawFlashcard[] },
  { source: 'flashcards_h2.json', cards: flashcardsH2 as RawFlashcard[] },
  { source: 'flashcards_h2-M2.json', cards: flashcardsHM2 as RawFlashcard[] },
  { source: 'flashcards_h2-M1.json', cards: flashcardsHM1 as RawFlashcard[] },
  { source: 'flashcards_h3.json', cards: flashcardsH3 as RawFlashcard[] },
  { source: 'flashcards_h4.json', cards: flashcardsH4 as RawFlashcard[] },
  { source: 'flashcards_h5.json', cards: flashcardsH5 as RawFlashcard[] },
  { source: 'flashcards_h6.json', cards: flashcardsH6 as RawFlashcard[] },
  { source: 'flashcards_h7.json', cards: flashcardsH7 as RawFlashcard[] },
  { source: 'flashcards_h8.json', cards: flashcardsH8 as RawFlashcard[] },
  { source: 'flashcards_h9.json', cards: flashcardsH9 as RawFlashcard[] },
  { source: 'flashcards_h10.json', cards: flashcardsH10 as RawFlashcard[] },
  { source: 'flashcards_h11.json', cards: flashcardsH11 as RawFlashcard[] },
  { source: 'flashcards_h12.json', cards: flashcardsH12 as RawFlashcard[] },
  { source: 'flashcards_h13.json', cards: flashcardsH13 as RawFlashcard[] },
  { source: 'flashcards_h14.json', cards: flashcardsH14 as RawFlashcard[] },
]

const flashcards: Flashcard[] = FLASHCARD_SOURCE_ENTRIES.flatMap(({ source, cards }) =>
  cards.map((c) => ({ ...c, source })),
)
const flashcardSources: string[] = FLASHCARD_SOURCE_ENTRIES.map((e) => e.source)
const chapterNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14] as const

// ---- Exams setup ----

type RawExamQuestion = Omit<ExamQuestion, 'source'>
type ExamSourceEntry = { source: string; label: string; questions: RawExamQuestion[] }

const EXAM_SOURCE_ENTRIES: ExamSourceEntry[] = [
  {
    source: 'oefenvragen_thema1.json',
    label: 'Oefenvragen Thema 1',
    questions: oefenvragenThema1Raw as RawExamQuestion[],
  },
  {
    source: 'oefenvragen_thema2.json',
    label: 'Oefenvragen Thema 2',
    questions: oefenvragenThema2Raw as RawExamQuestion[],
  },
  {
    source: 'oefenvragen_thema3.json',
    label: 'Oefenvragen Thema 3',
    questions: oefenvragenThema3Raw as RawExamQuestion[],
  },
  {
    source: 'oefenvragen_thema4.json',
    label: 'Oefenvragen Thema 4',
    questions: oefenvragenThema4Raw as RawExamQuestion[],
  },
  {
    source: 'oefenvragen_thema5.json',
    label: 'Oefenvragen Thema 5',
    questions: oefenvragenThema5Raw as RawExamQuestion[],
  },
  {
    source: 'oefenexamen_instinkers.json',
    label: 'Oefenexamen Instinkers',
    questions: oefenexamenInstinkersRaw as RawExamQuestion[],
  },
]

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

const COMPENDIUM_SOURCE_ENTRIES: CompendiumSourceEntry[] = [
  {
    compendium: 'pathology',
    label: 'Pathologie',
    description: 'Aandoeningen, ziektebeelden en risicofactoren uit de gezondheidspsychologie.',
    items: pathologyRaw as RawCompendiumEntry[],
  },
  {
    compendium: 'modellen',
    label: 'Gezondheidspsychologie modellen',
    description: 'Modellen in de gezondheidspsychologie.',
    items: modellenRaw as RawCompendiumEntry[],
  },
  {
    compendium: 'lichaamssystemen',
    label: 'Lichaamssystemen',
    description: 'Lichaamssystemen in de gezondheidspsychologie.',
    items: lichaamssystemenRaw as RawCompendiumEntry[],
  },
  {
    compendium: 'meetinstrumenten',
    label: 'Meetinstrumenten',
    description: 'Meetinstrumenten in de gezondheidspsychologie.',
    items: meetinstrumentenRaw as RawCompendiumEntry[],
  },
]

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

export const inlgezpData: CourseData = {
  config: inlgezpConfig,
  flashcards,
  compendiumFlashcards,
  flashcardSources,
  chapterNumbers,
  exams,
  examSourceOptions,
  compendiumMeta,
  compendiumItems,
}
