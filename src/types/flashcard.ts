export type FlashcardTerm = {
  nl: string
  en: string
}

export type Flashcard = {
  id: string
  term: FlashcardTerm
  definition: string
  chapter: number
  additions: string[]
  importance: number
  type: string
}

/** Geselecteerde hoofdstuknummers. Lege array = geen filter (alle hoofdstukken). */
export type ChapterSelection = number[]

/** Geselecteerde type-strings. Lege array = geen filter (alle types binnen hoofdstukfilter). */
export type TypeSelection = string[]
