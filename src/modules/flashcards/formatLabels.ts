import type { ChapterSelection, SourceSelection, TypeSelection } from '@/types/flashcard'

export function getChapterLabels(chapters: ChapterSelection): string[] {
  if (chapters.length === 0) return ['Alle hoofdstukken']
  return [...chapters]
    .sort((a, b) => a - b)
    .map((c) => `Hoofdstuk ${c}`)
}

export function formatChaptersLabel(chapters: ChapterSelection): string {
  return getChapterLabels(chapters).join(', ')
}

export function formatTypesLabel(types: TypeSelection): string {
  if (types.length === 0) return 'Alle types'
  return [...types].sort((a, b) => a.localeCompare(b, 'nl')).join(', ')
}

export function formatSourcesLabel(sources: SourceSelection): string {
  if (sources.length === 0) return 'Alle bronnen'
  return [...sources].sort((a, b) => a.localeCompare(b, 'nl')).join(', ')
}
