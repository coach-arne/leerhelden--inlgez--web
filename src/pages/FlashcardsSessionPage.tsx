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
  hintErrorAtom,
  hintLoadingAtom,
  hintTextAtom,
  sessionIdAtom,
  sessionIndexAtom,
  sessionScoresAtom,
  termLanguageAtom,
} from '@/modules/flashcards/atoms'
import { requestHintFromLmStudio } from '@/modules/flashcards/helpers/requestHintFromLmStudio'
import { cn } from '@/lib/utils'
import { CheckIcon, HelpCircleIcon, XIcon } from 'lucide-react'

export function FlashcardsSessionPage() {
  const navigate = useNavigate()
  const deck = useAtomValue(activeDeckAtom)
  const setDeck = useSetAtom(activeDeckAtom)
  const setSessionId = useSetAtom(sessionIdAtom)
  const [index, setIndex] = useAtom(sessionIndexAtom)
  const [revealed, setRevealed] = useAtom(cardRevealedAtom)
  const [hintText, setHintText] = useAtom(hintTextAtom)
  const [hintLoading, setHintLoading] = useAtom(hintLoadingAtom)
  const [hintError, setHintError] = useAtom(hintErrorAtom)
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
      setHintText(null)
      setHintError(null)
      setHintLoading(false)
    },
    [
      deck,
      index,
      navigate,
      setHintError,
      setHintLoading,
      setHintText,
      setIndex,
      setRevealed,
      setScores,
    ],
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

  const handleRequestHint = async () => {
    if (hintLoading) return
    setHintLoading(true)
    setHintError(null)

    try {
      const hint = await requestHintFromLmStudio({
        term: termText,
        termLanguage: termLang,
      })
      setHintText(hint)
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Hint kon niet worden opgehaald. Controleer LM Studio.'
      setHintError(message)
      setHintText(null)
    } finally {
      setHintLoading(false)
    }
  }

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
            <div className="space-y-3">
              <button
                type="button"
                className="w-full rounded-lg border border-dashed border-border bg-muted/30 px-4 py-8 text-center text-sm text-muted-foreground transition-colors hover:bg-muted/50"
                onClick={() => setRevealed(true)}
                aria-expanded={false}
                aria-controls="flashcard-answer"
              >
                Tik of druk op spatie om de definitie te tonen
              </button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                disabled={hintLoading}
                onClick={handleRequestHint}
              >
                {hintLoading ? 'Hint ophalen...' : 'Geef hint'}
              </Button>
              {hintError && (
                <p className="text-sm text-destructive" role="status" aria-live="polite">
                  {hintError}
                </p>
              )}
              {hintText && (
                <div
                  className="rounded-md border border-border bg-muted/20 px-3 py-2"
                  role="status"
                  aria-live="polite"
                >
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Hint
                  </p>
                  <p className="mt-1 text-sm leading-relaxed">{hintText}</p>
                </div>
              )}
            </div>
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
              <p className="text-sm leading-relaxed whitespace-pre-line">{card.definition}</p>
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
          <CardFooter className="flex gap-4 flex-row justify-center">
            <Button
              variant="destructive"
              className="w-14 h-14 cursor-pointer"
              onClick={() => advance({ correct: 0, incorrect: 1, unsure: 0 })}
            >
              <XIcon className="" />
            </Button>
            <Button
              variant="secondary"
              className="w-14 h-14 cursor-pointer"
              onClick={() => advance({ correct: 0, incorrect: 0, unsure: 1 })}
            >
              <HelpCircleIcon className="" />
            </Button>
            <Button
              className="w-14 h-14 cursor-pointer"
              onClick={() => advance({ correct: 1, incorrect: 0, unsure: 0 })}
            >
              <CheckIcon className="" />
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}
