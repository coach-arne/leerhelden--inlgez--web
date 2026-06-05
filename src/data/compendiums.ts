import type { CompendiumItem, CompendiumMeta } from '@/types/compendium'

import pathologyRaw from './compendiums/pathology.compendium.json'
import healthPsychologyModelsRaw from './compendiums/modellen.compendium.json'

type RawCompendiumEntry = {
  id: string
  nameNL: string
  nameEN: string
  description: CompendiumItem['description']
  additions: CompendiumItem['additions']
}

type SourceEntry = {
  compendium: string
  label: string
  description: string
  items: RawCompendiumEntry[]
}

const SOURCE_ENTRIES: SourceEntry[] = [
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
    items: healthPsychologyModelsRaw as RawCompendiumEntry[],
  }
]

export const ALL_COMPENDIUM_META: CompendiumMeta[] = SOURCE_ENTRIES.map(
  ({ compendium, label, description, items }) => ({
    slug: compendium,
    label,
    description,
    itemCount: items.length,
  }),
)

export const ALL_COMPENDIUM_ITEMS: CompendiumItem[] = SOURCE_ENTRIES.flatMap(
  ({ compendium, items }) =>
    items.map((item) => ({ ...item, compendium })),
)

export function getItemsByCompendium(slug: string): CompendiumItem[] {
  return ALL_COMPENDIUM_ITEMS.filter((item) => item.compendium === slug)
}

export function getCompendiumItemById(
  slug: string,
  id: string,
): CompendiumItem | undefined {
  return ALL_COMPENDIUM_ITEMS.find(
    (item) => item.compendium === slug && item.id === id,
  )
}

export function getCompendiumMeta(slug: string): CompendiumMeta | undefined {
  return ALL_COMPENDIUM_META.find((m) => m.slug === slug)
}
