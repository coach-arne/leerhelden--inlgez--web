import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAtomValue, useSetAtom } from 'jotai'

import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  activeDeckAtom,
  sessionIdAtom,
  sessionScoresAtom,
  setupChapterAtom,
  setupCompendiumAtom,
  setupCountAtom,
  setupSourceAtom,
  setupTypeAtom,
} from '@/modules/flashcards/atoms'
import {
  appendFlashcardResult,
  loadFlashcardResults,
} from '@/modules/flashcards/flashcardStorage'
import {
  formatChaptersLabel,
  formatCompendiumsLabel,
  formatSourcesLabel,
  formatTypesLabel,
} from '@/modules/flashcards/formatLabels'
import { cn } from '@/lib/utils'

export function FlashcardsResultsPage() {
  const deck = useAtomValue(activeDeckAtom)
  const scores = useAtomValue(sessionScoresAtom)
  const chapters = useAtomValue(setupChapterAtom)
  const types = useAtomValue(setupTypeAtom)
  const sources = useAtomValue(setupSourceAtom)
  const compendiums = useAtomValue(setupCompendiumAtom)
  const sessionId = useAtomValue(sessionIdAtom)
  const setDeck = useSetAtom(activeDeckAtom)
  const setSessionId = useSetAtom(sessionIdAtom)
  const setChapters = useSetAtom(setupChapterAtom)
  const setTypes = useSetAtom(setupTypeAtom)
  const setSources = useSetAtom(setupSourceAtom)
  const setCompendiums = useSetAtom(setupCompendiumAtom)
  const setCount = useSetAtom(setupCountAtom)

  const total = deck?.length ?? 0
  const weightedPct =
    total > 0
      ? Math.round(
          ((scores.correct + 0.5 * scores.unsure) / total) * 100,
        )
      : 0

  useEffect(() => {
    if (!deck || deck.length === 0 || !sessionId) return
    const existing = loadFlashcardResults()
    if (existing.some((r) => r.id === sessionId)) return
    appendFlashcardResult({
      id: sessionId,
      finishedAt: new Date().toISOString(),
      chapters,
      types,
      sources,
      compendiums,
      requestedCount: deck.length,
      correct: scores.correct,
      incorrect: scores.incorrect,
      unsure: scores.unsure,
    })
  }, [chapters, compendiums, deck, scores, sessionId, sources, types])

  const clearSession = () => {
    setDeck(null)
    setSessionId(null)
  }

  const resetFiltersAndGo = () => {
    setChapters([])
    setTypes([])
    setSources([])
    setCompendiums([])
    setCount(10)
    clearSession()
  }

  if (!deck || deck.length === 0) {
    return (
      <div className="mx-auto max-w-lg p-6">
        <p className="text-muted-foreground">Geen sessie om te tonen.</p>
        <Link to="/flashcards" className={cn(buttonVariants({ className: 'mt-4' }))}>
          Naar instellingen
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto min-h-svh max-w-lg space-y-8 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Resultaat</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Over {total} kaart{total === 1 ? '' : 'en'}.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Score</CardTitle>
          <CardDescription>
            Gewogen percentage (twijfel telt half mee):{' '}
            <span className="font-medium text-foreground">{weightedPct}%</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge>Goed: {scores.correct}</Badge>
            <Badge variant="secondary">Twijfel: {scores.unsure}</Badge>
            <Badge variant="destructive">Nog niet: {scores.incorrect}</Badge>
          </div>
          <Separator />
          <div className="text-sm text-muted-foreground">
            <p>
              <span className="font-medium text-foreground">Hoofdstuk:</span>{' '}
              {formatChaptersLabel(chapters)}
            </p>
            <p>
              <span className="font-medium text-foreground">Type:</span>{' '}
              {formatTypesLabel(types)}
            </p>
            {sources.length > 0 && (
              <p>
                <span className="font-medium text-foreground">Bron:</span>{' '}
                {formatSourcesLabel(sources)}
              </p>
            )}
            {compendiums.length > 0 && (
              <p>
                <span className="font-medium text-foreground">Compendium:</span>{' '}
                {formatCompendiumsLabel(compendiums)}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Link
          to="/flashcards"
          className={cn(buttonVariants({ variant: 'secondary' }), 'sm:flex-1')}
          onClick={clearSession}
        >
          Opnieuw (zelfde filters)
        </Link>
        <Link
          to="/flashcards"
          className={cn(buttonVariants(), 'sm:flex-1')}
          onClick={resetFiltersAndGo}
        >
          Nieuwe sessie
        </Link>
      </div>
    </div>
  )
}
