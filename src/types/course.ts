import type React from 'react'

import type { CompendiumItem, CompendiumMeta } from './compendium'
import type { ExamQuestion } from './exam'
import type { Flashcard } from './flashcard'

export type CourseFeature = 'flashcards' | 'exams' | 'compendiums'

export type CourseConfig = {
  slug: string
  name: string
  shortName: string
  description: string
  features: CourseFeature[]
  chapterCount?: number
  chapterLabels?: Record<number, string>
  themeLabels?: Record<string, string>
}

export type CourseData = {
  config: CourseConfig
  flashcards: Flashcard[]
  compendiumFlashcards: Flashcard[]
  flashcardSources: string[]
  chapterNumbers: readonly number[]
  exams: ExamQuestion[]
  examSourceOptions: { value: string; label: string }[]
  compendiumMeta: CompendiumMeta[]
  compendiumItems: CompendiumItem[]
  customComponents?: {
    HomeExtra?: React.ComponentType
    FlashcardSetupExtra?: React.ComponentType
  }
}
