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

export function HomePage() {
  return (
    <div className="mx-auto flex min-h-svh max-w-lg flex-col justify-center gap-6 p-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">
          Inleiding gezondheidspsychologie
        </h1>
        <p className="mt-2 text-muted-foreground">
          Oefen interactief met de cursus. Meer modules volgen; nu beschikbaar:
          flashcards.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Flashcards</CardTitle>
          <CardDescription>
            Oefen begrippen per hoofdstuk en type, met directe feedback en
            opgeslagen resultaten.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link to="/flashcards" className={cn(buttonVariants())}>
            Naar flashcards
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
