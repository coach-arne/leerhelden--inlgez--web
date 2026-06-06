import { useEffect } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { useAtomValue } from 'jotai'

import { CompendiumItemNav } from '@/components/CompendiumItemNav'
import { RichTextViewer } from '@/components/RichTextViewer'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { buttonVariants } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { getCompendiumItemById, getCompendiumMeta } from '@/data/compendiums'
import { compendiumSearchAtom } from '@/modules/compendiums/atoms'
import { cn } from '@/lib/utils'

export function CompendiumDetailPage() {
  const { compendium: slug, id } = useParams<{ compendium: string; id: string }>()
  const searchQuery = useAtomValue(compendiumSearchAtom)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [id])

  const meta = slug ? getCompendiumMeta(slug) : undefined
  const item = slug && id ? getCompendiumItemById(slug, id) : undefined

  if (!meta || !item) {
    return <Navigate to="/compendiums" replace />
  }

  const hasAdditions =
    Array.isArray(item.additions.content) && item.additions.content.length > 0

  return (
    <div className="mx-auto min-h-svh max-w-2xl space-y-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
              <BreadcrumbLink render={<Link to={`/compendiums/${slug}`} />}>
                {meta.label}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="max-w-[200px] truncate">
                {item.nameNL}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Link
          to={`/compendiums/${slug}`}
          className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
        >
          ← Terug naar lijst
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{item.nameNL}</h1>
        <p className="mt-1 text-sm text-muted-foreground italic">{item.nameEN}</p>
      </div>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Beschrijving</CardTitle>
          <CardDescription>Omschrijving van het begrip</CardDescription>
        </CardHeader>
        <CardContent>
          <RichTextViewer doc={item.description} />
        </CardContent>
      </Card>

      {hasAdditions && (
        <Card>
          <CardHeader>
            <CardTitle>Aanvullende informatie</CardTitle>
            <CardDescription>Extra context en details</CardDescription>
          </CardHeader>
          <CardContent>
            <RichTextViewer doc={item.additions} />
          </CardContent>
        </Card>
      )}

      {slug && id && (
        <CompendiumItemNav
          slug={slug}
          currentId={id}
          searchQuery={searchQuery}
        />
      )}
    </div>
  )
}
