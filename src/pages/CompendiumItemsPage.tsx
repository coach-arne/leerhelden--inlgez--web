import { useMemo } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { useAtom } from 'jotai'
import { SearchIcon, XIcon } from 'lucide-react'

import { CompendiumListItem } from '@/components/CompendiumListItem'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { getCompendiumMeta, getItemsByCompendium } from '@/data/compendiums'
import { compendiumSearchAtom } from '@/modules/compendiums/atoms'
import { searchCompendiumItems } from '@/modules/compendiums/helpers/searchCompendiums'
import { cn } from '@/lib/utils'

export function CompendiumItemsPage() {
  const { compendium: slug } = useParams<{ compendium: string }>()
  const meta = slug ? getCompendiumMeta(slug) : undefined

  if (!meta) {
    return <Navigate to="/compendiums" replace />
  }

  const items = getItemsByCompendium(meta.slug)
  const [search, setSearch] = useAtom(compendiumSearchAtom)

  const filtered = useMemo(
    () => searchCompendiumItems(items, search),
    [items, search],
  )

  return (
    <div className="mx-auto flex min-h-svh max-w-4xl flex-col p-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link to="/" />}>Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link to="/compendiums" />}>
                Compendia
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{meta.label}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Link
          to="/compendiums"
          className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
        >
          ← Terug
        </Link>
      </div>

      <div className="mb-4">
        <h1 className="text-2xl font-semibold tracking-tight">{meta.label}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {items.length} items · zoek om te filteren.
        </p>
      </div>

      <div className="relative mb-4">
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Zoek op naam of omschrijving…"
          className="pl-9 pr-9"
          aria-label="Zoek in compendium"
        />
        {search && (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="absolute right-1.5 top-1/2 -translate-y-1/2"
            aria-label="Zoekopdracht wissen"
            onClick={() => setSearch('')}
          >
            <XIcon className="size-4" />
          </Button>
        )}
      </div>

      {filtered.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">
          Geen items gevonden voor &ldquo;{search}&rdquo;.
        </p>
      ) : (
        <ScrollArea className="flex-1 rounded-lg border border-border">
          <div className="divide-y divide-border">
            {filtered.map((item) => (
              <CompendiumListItem
                key={item.id}
                item={item}
                basePath={`/compendiums/${meta.slug}`}
              />
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  )
}
