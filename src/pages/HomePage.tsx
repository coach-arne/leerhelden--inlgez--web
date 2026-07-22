import { Link } from 'react-router-dom'

import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useCourseData, useCourseRoutes } from '@/hooks/useCourseData'

export function HomePage() {
  const { config, customComponents } = useCourseData()
  const routes = useCourseRoutes()

  return (
    <div className="mx-auto flex min-h-svh max-w-lg flex-col justify-center gap-6 p-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">{config.name}</h1>
        <p className="mt-2 text-muted-foreground">
          Oefen interactief met de cursus. Beschikbare modules:
        </p>
      </div>

      {config.features.includes('flashcards') && (
        <Link
          to={routes.flashcards}
          className="block rounded-xl outline-none transition-shadow hover:shadow-theme-md focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Card className="h-full transition-colors hover:bg-accent/40">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Flashcards</CardTitle>
              <CardDescription>
                Oefen begrippen per hoofdstuk en type, met directe feedback en
                opgeslagen resultaten.
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      )}

      {config.features.includes('compendiums') && (
        <Link
          to={routes.compendiums}
          className="block rounded-xl outline-none transition-shadow hover:shadow-theme-md focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Card className="h-full transition-colors hover:bg-accent/40">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Compendia</CardTitle>
              <CardDescription>
                Zoek en bekijk aandoeningen en begrippen met beschrijvingen en
                aanvullende informatie.
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      )}

      {config.features.includes('exams') && (
        <Link
          to={routes.exams}
          className="block rounded-xl outline-none transition-shadow hover:shadow-theme-md focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Card className="h-full transition-colors hover:bg-accent/40">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Oefenexamens</CardTitle>
              <CardDescription>
                Oefen meerkeuze-examenvragen per set, met directe feedback,
                uitleg en een overzicht van foute antwoorden.
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      )}

      {customComponents?.HomeExtra && <customComponents.HomeExtra />}

      <Link
        to="/"
        className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'self-start')}
      >
        ← Alle opleidingen
      </Link>
    </div>
  )
}
