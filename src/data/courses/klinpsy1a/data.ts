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
import flashcardsH11_01_basis from '../../flashcards/klinpsy1a/flashcards_h11_01_basis.json'
import flashcardsH11_02_cattell from '../../flashcards/klinpsy1a/flashcards_h11_02_cattell.json'
import flashcardsH11_03_eysenck from '../../flashcards/klinpsy1a/flashcards_h11_03_eysenck.json'
import flashcardsH12_01_basis from '../../flashcards/klinpsy1a/flashcards_h12_01_basis.json'
import flashcardsH12_02_big_five from '../../flashcards/klinpsy1a/flashcards_h12_02_big_five.json'
import flashcardsH12_03_alternatieven from '../../flashcards/klinpsy1a/flashcards_h12_03_alternatieven.json'
import flashcardsH13_matthews_01 from '../../flashcards/klinpsy1a/flashcards_h13_matthews_01.json'
import flashcardsH13_matthews_02 from '../../flashcards/klinpsy1a/flashcards_h13_matthews_02.json'
import flashcardsH13_matthews_03 from '../../flashcards/klinpsy1a/flashcards_h13_matthews_03.json'
import flashcardsH14 from '../../flashcards/klinpsy1a/flashcards_h14.json'
import flashcardsH15 from '../../flashcards/klinpsy1a/flashcards_h15.json'
// --- Exams ---
import examQuestionsH1Raw from '../../exams/klinpsy1a/exam_questions_h1.json'
import examQuestionsH2Raw from '../../exams/klinpsy1a/exam_questions_h2.json'
import examQuestionsH3Raw from '../../exams/klinpsy1a/exam_questions_h3.json'
import examQuestionsH4Raw from '../../exams/klinpsy1a/exam_questions_h4.json'
import examQuestionsH5Raw from '../../exams/klinpsy1a/exam_questions_h5.json'
import examQuestionsH6Raw from '../../exams/klinpsy1a/exam_questions_h6.json'
import examQuestionsH7Raw from '../../exams/klinpsy1a/exam_questions_h7.json'
import examQuestionsH8Raw from '../../exams/klinpsy1a/exam_questions_h8.json'
import examQuestionsH9Raw from '../../exams/klinpsy1a/exam_questions_h9.json'
import examQuestionsH10Raw from '../../exams/klinpsy1a/exam_questions_h10.json'
import examQuestionsH21Raw from '../../exams/klinpsy1a/exam_questions_h21.json'
import examQuestionsH22Raw from '../../exams/klinpsy1a/exam_questions_h22.json'
import examQuestionsH23Raw from '../../exams/klinpsy1a/exam_questions_h23.json'

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
  { source: 'flashcards_h11_01_basis.json', cards: flashcardsH11_01_basis as RawFlashcard[] },
  { source: 'flashcards_h11_02_cattell.json', cards: flashcardsH11_02_cattell as RawFlashcard[] },
  { source: 'flashcards_h11_03_eysenck.json', cards: flashcardsH11_03_eysenck as RawFlashcard[] },
  { source: 'flashcards_h12_01_basis.json', cards: flashcardsH12_01_basis as RawFlashcard[] },
  { source: 'flashcards_h12_02_big_five.json', cards: flashcardsH12_02_big_five as RawFlashcard[] },
  { source: 'flashcards_h12_03_alternatieven.json', cards: flashcardsH12_03_alternatieven as RawFlashcard[] },
  { source: 'flashcards_h13_matthews_01.json', cards: flashcardsH13_matthews_01 as RawFlashcard[] },
  { source: 'flashcards_h13_matthews_02.json', cards: flashcardsH13_matthews_02 as RawFlashcard[] },
  { source: 'flashcards_h13_matthews_03.json', cards: flashcardsH13_matthews_03 as RawFlashcard[] },
  { source: 'flashcards_h14.json', cards: flashcardsH14 as RawFlashcard[] },
  { source: 'flashcards_h15.json', cards: flashcardsH15 as RawFlashcard[] },

]

const flashcards: Flashcard[] = FLASHCARD_SOURCE_ENTRIES.flatMap(({ source, cards }) =>
  cards.map((c) => ({ ...c, source })),
)
const flashcardSources: string[] = FLASHCARD_SOURCE_ENTRIES.map((e) => e.source)
const chapterNumbers = [1, 2, 3, 4, 5, 6, 7, 11, 12, 13, 14, 15] as const

// ---- Exams setup ----

type RawExamQuestion = Omit<ExamQuestion, 'source'>
type ExamSourceEntry = { source: string; label: string; questions: RawExamQuestion[] }

const EXAM_SOURCE_ENTRIES: ExamSourceEntry[] = [
  {
    source: 'exam_questions_h1.json',
    label: 'Examen vragen Hoofdstuk 1',
    questions: examQuestionsH1Raw as RawExamQuestion[],
  },
  {
    source: 'exam_questions_h2.json',
    label: 'Examen vragen Hoofdstuk 2',
    questions: examQuestionsH2Raw as RawExamQuestion[],
  },
  {
    source: 'exam_questions_h3.json',
    label: 'Examen vragen Hoofdstuk 3',
    questions: examQuestionsH3Raw as RawExamQuestion[],
  },
  {
    source: 'exam_questions_h4.json',
    label: 'Examen vragen Hoofdstuk 4',
    questions: examQuestionsH4Raw as RawExamQuestion[],
  },
  {
    source: 'exam_questions_h5.json',
    label: 'Examen vragen Hoofdstuk 5',
    questions: examQuestionsH5Raw as RawExamQuestion[],
  },
  {
    source: 'exam_questions_h6.json',
    label: 'Examen vragen Hoofdstuk 6',
    questions: examQuestionsH6Raw as RawExamQuestion[],
  },
  {
    source: 'exam_questions_h7.json',
    label: 'Examen vragen Hoofdstuk 7',
    questions: examQuestionsH7Raw as RawExamQuestion[],
  },
  {
    source: 'exam_questions_h8.json',
    label: 'Examen vragen Hoofdstuk 8',
    questions: examQuestionsH8Raw as RawExamQuestion[],
  },
  {
    source: 'exam_questions_h9.json',
    label: 'Examen vragen Hoofdstuk 9',
    questions: examQuestionsH9Raw as RawExamQuestion[],
  },
  {
    source: 'exam_questions_h10.json',
    label: 'Examen vragen Hoofdstuk 10',
    questions: examQuestionsH10Raw as RawExamQuestion[],
  },
  {
    source: 'exam_questions_h21.json',
    label: 'Examen vragen Hoofdstuk 21',
    questions: examQuestionsH21Raw as RawExamQuestion[],
  },
  {
    source: 'exam_questions_h22.json',
    label: 'Examen vragen Hoofdstuk 22',
    questions: examQuestionsH22Raw as RawExamQuestion[],
  },
  {
    source: 'exam_questions_h23.json',
    label: 'Examen vragen Hoofdstuk 23',
    questions: examQuestionsH23Raw as RawExamQuestion[],
  }
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
