import { Link } from 'react-router-dom'

import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  Card,
  CardContent,
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
        <Card>
          <CardHeader>
            <CardTitle>Flashcards</CardTitle>
            <CardDescription>
              Oefen begrippen per hoofdstuk en type, met directe feedback en
              opgeslagen resultaten.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to={routes.flashcards} className={cn(buttonVariants())}>
              Naar flashcards
            </Link>
          </CardContent>
        </Card>
      )}

      {config.features.includes('compendiums') && (
        <Card>
          <CardHeader>
            <CardTitle>Compendia</CardTitle>
            <CardDescription>
              Zoek en bekijk aandoeningen en begrippen met beschrijvingen en
              aanvullende informatie.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to={routes.compendiums} className={cn(buttonVariants())}>
              Naar compendia
            </Link>
          </CardContent>
        </Card>
      )}

      {config.features.includes('exams') && (
        <Card>
          <CardHeader>
            <CardTitle>Oefenexamens</CardTitle>
            <CardDescription>
              Oefen meerkeuze-examenvragen per set, met directe feedback,
              uitleg en een overzicht van foute antwoorden.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to={routes.exams} className={cn(buttonVariants())}>
              Naar oefenexamens
            </Link>
          </CardContent>
        </Card>
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
