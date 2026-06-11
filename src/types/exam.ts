import type { TiptapDoc } from '@/types/compendium'

export type ExamAnswer = {
  id: string
  text: string
}

export type ExamQuestion = {
  id: string
  question: TiptapDoc
  answers: ExamAnswer[]
  correctAnswerId: string
  relatedConcept: string
  explanation: string
  reference: string
  /** Bestandsnaam van de bron-JSON. Wordt bij laden toegewezen. */
  source: string
}
