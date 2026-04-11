import { useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'

import { Button, buttonVariants } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import {
  activeDeckAtom,
  cardRevealedAtom,
  currentCardAtom,
  sessionIdAtom,
  sessionIndexAtom,
  sessionScoresAtom,
  termLanguageAtom,
} from '@/modules/flashcards/atoms'
import { cn } from '@/lib/utils'

export function FlashcardsSessionPage() {
  const navigate = useNavigate()
  const deck = useAtomValue(activeDeckAtom)
  const setDeck = useSetAtom(activeDeckAtom)
  const setSessionId = useSetAtom(sessionIdAtom)
  const [index, setIndex] = useAtom(sessionIndexAtom)
  const [revealed, setRevealed] = useAtom(cardRevealedAtom)
  const [, setScores] = useAtom(sessionScoresAtom)
  const termLang = useAtomValue(termLanguageAtom)
  const card = useAtomValue(currentCardAtom)

  useEffect(() => {
    if (!deck || deck.length === 0) {
      navigate('/flashcards', { replace: true })
    }
  }, [deck, navigate])

  const advance = useCallback(
    (delta: { correct: number; incorrect: number; unsure: number }) => {
      if (!deck) return
      setScores((s) => ({
        correct: s.correct + delta.correct,
        incorrect: s.incorrect + delta.incorrect,
        unsure: s.unsure + delta.unsure,
      }))
      if (index + 1 >= deck.length) {
        navigate('/flashcards/results')
        return
      }
      setIndex(index + 1)
      setRevealed(false)
    },
    [deck, index, navigate, setIndex, setRevealed, setScores],
  )

  const onKeyDown = useCallback(
    (e: Event) => {
      if (!(e instanceof KeyboardEvent)) return
      if (e.code !== 'Space' && e.key !== ' ') return
      if (!revealed) {
        e.preventDefault()
        setRevealed(true)
      }
    },
    [revealed, setRevealed],
  )

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onKeyDown])

  if (!deck || deck.length === 0 || !card) {
    return null
  }

  const progressPct = ((index + 1) / deck.length) * 100
  const termText = termLang === 'nl' ? card.term.nl : card.term.en
  const otherTermLabel = termLang === 'nl' ? 'Engels' : 'Nederlands'
  const otherTermText = termLang === 'nl' ? card.term.en : card.term.nl

  return (
    <div className="mx-auto min-h-svh max-w-lg space-y-6 p-6">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          Kaart {index + 1} van {deck.length}
        </p>
        <Link
          to="/flashcards"
          className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }))}
          onClick={() => {
            setDeck(null)
            setSessionId(null)
          }}
        >
          Stoppen
        </Link>
      </div>

      <Progress value={progressPct} className="h-2" />

      <Card
        className="min-h-[280px]"
        role="region"
        aria-label={`Flashcard ${index + 1} van ${deck.length}`}
      >
        <CardHeader>
          <CardDescription>Term</CardDescription>
          <CardTitle className="text-xl leading-snug font-medium">
            {termText}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!revealed ? (
            <button
              type="button"
              className="w-full rounded-lg border border-dashed border-border bg-muted/30 px-4 py-8 text-center text-sm text-muted-foreground transition-colors hover:bg-muted/50"
              onClick={() => setRevealed(true)}
              aria-expanded={false}
              aria-controls="flashcard-answer"
            >
              Tik of druk op spatie om de definitie te tonen
            </button>
          ) : (
            <div
              id="flashcard-answer"
              className="space-y-3 text-left"
              aria-live="polite"
            >
              <div className="space-y-1 rounded-md border border-border bg-muted/20 px-3 py-2">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {otherTermLabel}
                </p>
                <p className="text-sm leading-snug text-foreground">{otherTermText}</p>
              </div>
              <p className="text-sm font-medium text-foreground">Definitie</p>
              <p className="text-sm leading-relaxed">{card.definition}</p>
              {card.additions.length > 0 && (
                <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                  {card.additions.map((line, i) => (
                    <li key={`${card.id}-a-${i}`}>{line}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </CardContent>
        {revealed && (
          <CardFooter className="flex flex-col gap-2 sm:flex-row">
            <Button
              variant="destructive"
              className="w-full sm:flex-1"
              onClick={() => advance({ correct: 0, incorrect: 1, unsure: 0 })}
            >
              Nog niet
            </Button>
            <Button
              variant="secondary"
              className="w-full sm:flex-1"
              onClick={() => advance({ correct: 0, incorrect: 0, unsure: 1 })}
            >
              Twijfel
            </Button>
            <Button
              className="w-full sm:flex-1"
              onClick={() => advance({ correct: 1, incorrect: 0, unsure: 0 })}
            >
              Goed
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}
