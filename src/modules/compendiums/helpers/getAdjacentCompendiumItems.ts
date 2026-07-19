import { searchCompendiumItems } from '@/modules/compendiums/helpers/searchCompendiums'
import type { CompendiumItem } from '@/types/compendium'

export type AdjacentCompendiumItems = {
  prev?: CompendiumItem
  next?: CompendiumItem
  index: number
  total: number
}

function resolveAdjacent(
  items: CompendiumItem[],
  currentId: string,
): AdjacentCompendiumItems {
  const currentIndex = items.findIndex((item) => item.id === currentId)

  if (currentIndex === -1) {
    return { index: 0, total: items.length }
  }

  return {
    prev: currentIndex > 0 ? items[currentIndex - 1] : undefined,
    next:
      currentIndex < items.length - 1 ? items[currentIndex + 1] : undefined,
    index: currentIndex + 1,
    total: items.length,
  }
}

export function getAdjacentCompendiumItems(
  allItems: CompendiumItem[],
  currentId: string,
  searchQuery: string,
): AdjacentCompendiumItems {
  const filteredItems = searchCompendiumItems(allItems, searchQuery)
  const adjacent = resolveAdjacent(filteredItems, currentId)

  if (adjacent.index === 0 && searchQuery.trim()) {
    return resolveAdjacent(allItems, currentId)
  }

  return adjacent
}
