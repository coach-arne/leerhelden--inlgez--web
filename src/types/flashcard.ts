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
  /** Bestandsnaam van de bron-JSON (bv. 'flashcards_h1.json'). Wordt bij laden toegewezen. */
  source: string
}

/** Geselecteerde hoofdstuknummers. Lege array = geen filter (alle hoofdstukken). */
export type ChapterSelection = number[]

/** Geselecteerde type-strings. Lege array = geen filter (alle types binnen hoofdstukfilter). */
export type TypeSelection = string[]

/** Geselecteerde bron-bestandsnamen. Lege array = geen filter (alle bronnen). */
export type SourceSelection = string[]
