import { Link } from 'react-router-dom'

import { buttonVariants } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ALL_COMPENDIUM_META } from '@/data/compendiums'
import { cn } from '@/lib/utils'

export function CompendiumsPage() {
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
          to="/"
          className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
        >
          Home
        </Link>
      </div>

      <div className="flex flex-col gap-4">
        {ALL_COMPENDIUM_META.map((meta) => (
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
                to={`/compendiums/${meta.slug}`}
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
