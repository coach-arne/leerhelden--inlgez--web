import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { getAdjacentCompendiumItems } from '@/modules/compendiums/helpers/getAdjacentCompendiumItems'
import type { CompendiumItem } from '@/types/compendium'
import { cn } from '@/lib/utils'

type CompendiumItemNavProps = {
  items: CompendiumItem[]
  currentId: string
  searchQuery: string
  basePath: string
  className?: string
}

export function CompendiumItemNav({
  items,
  currentId,
  searchQuery,
  basePath,
  className,
}: CompendiumItemNavProps) {
  const { prev, next, index, total } = getAdjacentCompendiumItems(
    items,
    currentId,
    searchQuery,
  )

  return (
    <nav
      aria-label="Compendium navigatie"
      className={cn(
        'flex flex-col gap-2 rounded-xl border border-border bg-card p-3',
        className,
      )}
    >
      <p className="text-center text-sm tabular-nums text-muted-foreground">
        {index} / {total}
      </p>

      <div className="grid grid-cols-2 gap-2">
        <div className="min-w-0">
          {prev ? (
            <Button
              variant="outline"
              className="h-auto w-full justify-start gap-2 overflow-hidden py-2"
              render={
                <Link
                  to={`${basePath}/${prev.id}`}
                  aria-label={`Vorige: ${prev.nameNL}`}
                />
              }
            >
              <ChevronLeft className="size-4 shrink-0" />
              <span className="min-w-0 text-left">
                <span className="block text-xs text-muted-foreground">Vorige</span>
                <span className="block truncate font-medium">{prev.nameNL}</span>
              </span>
            </Button>
          ) : (
            <Button
              variant="outline"
              className="h-auto w-full justify-start gap-2 overflow-hidden py-2"
              disabled
            >
              <ChevronLeft className="size-4 shrink-0" />
              <span className="min-w-0 text-left">
                <span className="block text-xs text-muted-foreground">Vorige</span>
                <span className="block truncate font-medium">—</span>
              </span>
            </Button>
          )}
        </div>

        <div className="min-w-0">
          {next ? (
            <Button
              variant="outline"
              className="h-auto w-full justify-end gap-2 overflow-hidden py-2"
              render={
                <Link
                  to={`${basePath}/${next.id}`}
                  aria-label={`Volgende: ${next.nameNL}`}
                />
              }
            >
              <span className="min-w-0 text-right">
                <span className="block text-xs text-muted-foreground">Volgende</span>
                <span className="block truncate font-medium">{next.nameNL}</span>
              </span>
              <ChevronRight className="size-4 shrink-0" />
            </Button>
          ) : (
            <Button
              variant="outline"
              className="h-auto w-full justify-end gap-2 overflow-hidden py-2"
              disabled
            >
              <span className="min-w-0 text-right">
                <span className="block text-xs text-muted-foreground">Volgende</span>
                <span className="block truncate font-medium">—</span>
              </span>
              <ChevronRight className="size-4 shrink-0" />
            </Button>
          )}
        </div>
      </div>
    </nav>
  )
}
