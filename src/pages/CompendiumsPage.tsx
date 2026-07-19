import { Link } from 'react-router-dom'

import { buttonVariants } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useCourseData, useCourseRoutes } from '@/hooks/useCourseData'
import { cn } from '@/lib/utils'

export function CompendiumsPage() {
  const { compendiumMeta } = useCourseData()
  const routes = useCourseRoutes()

  return (
    <div className="mx-auto flex min-h-svh max-w-lg flex-col justify-center gap-6 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Compendia</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Kies een compendium om de inhoud te bekijken.
          </p>
        </div>
        <Link
          to={routes.home}
          className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
        >
          Home
        </Link>
      </div>

      <div className="flex flex-col gap-4">
        {compendiumMeta.map((meta) => (
          <Card key={meta.slug}>
            <CardHeader>
              <CardTitle>{meta.label}</CardTitle>
              <CardDescription>{meta.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between gap-4">
              <span className="text-sm text-muted-foreground">
                {meta.itemCount} items
              </span>
              <Link
                to={routes.compendium(meta.slug)}
                className={cn(buttonVariants())}
              >
                Bekijk inhoud
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
