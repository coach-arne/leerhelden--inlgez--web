import type { CompendiumItem } from '@/types/compendium'
import { extractPlainText } from './extractPlainText'

export function searchCompendiumItems(
  items: CompendiumItem[],
  query: string,
): CompendiumItem[] {
  const q = query.trim().toLowerCase()
  if (!q) return items

  return items.filter((item) => {
    if (item.nameNL.toLowerCase().includes(q)) return true
    if (item.nameEN.toLowerCase().includes(q)) return true
    if (extractPlainText(item.description).toLowerCase().includes(q)) return true
    if (extractPlainText(item.additions).toLowerCase().includes(q)) return true
    return false
  })
}
