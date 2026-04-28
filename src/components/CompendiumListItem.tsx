import { Link } from 'react-router-dom'

import { Badge } from '@/components/ui/badge'
import { extractPlainText } from '@/modules/compendiums/helpers/extractPlainText'
import type { CompendiumItem } from '@/types/compendium'
import { cn } from '@/lib/utils'

const PREVIEW_LENGTH = 120

type CompendiumListItemProps = {
  item: CompendiumItem
  basePath: string
  isActive?: boolean
}

export function CompendiumListItem({ item, basePath, isActive }: CompendiumListItemProps) {
  const preview = extractPlainText(item.description)
  const truncated =
    preview.length > PREVIEW_LENGTH
      ? `${preview.slice(0, PREVIEW_LENGTH).trimEnd()}…`
      : preview

  return (
    <Link
      to={`${basePath}/${item.id}`}
      className={cn(
        'block rounded-lg border border-transparent px-4 py-3 transition-colors hover:bg-muted/50',
        isActive && 'border-border bg-muted/60',
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium leading-snug">{item.nameNL}</p>
          <p className="truncate text-sm text-muted-foreground">{item.nameEN}</p>
        </div>
        <Badge variant="outline" className="shrink-0 text-xs capitalize">
          {item.compendium}
        </Badge>
      </div>
      {truncated && (
        <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
          {truncated}
        </p>
      )}
    </Link>
  )
}
