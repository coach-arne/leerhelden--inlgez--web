import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAtomValue, useSetAtom } from 'jotai'
import { CheckIcon, XIcon } from 'lucide-react'

import { RichTextViewer } from '@/components/RichTextViewer'
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
  examAnswersAtom,
  examCountAtom,
  examDeckAtom,
  examIndexAtom,
  examSessionIdAtom,
  examSourcesAtom,
} from '@/modules/exams/atoms'
import {
  appendExamResult,
  loadExamResults,
} from '@/modules/exams/examStorage'
import { cn } from '@/lib/utils'

export function ExamResultsPage() {
  const deck = useAtomValue(examDeckAtom)
  const answers = useAtomValue(examAnswersAtom)
  const sources = useAtomValue(examSourcesAtom)
  const sessionId = useAtomValue(examSessionIdAtom)
  const setDeck = useSetAtom(examDeckAtom)
  const setSessionId = useSetAtom(examSessionIdAtom)
  const setSources = useSetAtom(examSourcesAtom)
  const setCount = useSetAtom(examCountAtom)
  const setIndex = useSetAtom(examIndexAtom)

  const total = deck?.length ?? 0
  const correct =
    deck?.filter((q) => answers.get(q.id) === q.correctAnswerId).length ?? 0
  const incorrect = total - correct
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0

  useEffect(() => {
    if (!deck || deck.length === 0 || !sessionId) return
    const existing = loadExamResults()
    if (existing.some((r) => r.id === sessionId)) return
    appendExamResult({
      id: sessionId,
      finishedAt: new Date().toISOString(),
      sources,
      totalQuestions: deck.length,
      correct,
      incorrect,
    })
  }, [correct, deck, incorrect, sessionId, sources])

  const clearSession = () => {
    setDeck(null)
    setSessionId(null)
    setIndex(0)
  }

  const resetFiltersAndGo = () => {
    setSources([])
    setCount(20)
    clearSession()
  }

  if (!deck || deck.length === 0) {
    return (
      <div className="mx-auto max-w-lg p-6">
        <p className="text-muted-foreground">Geen sessie om te tonen.</p>
        <Link to="/exams" className={cn(buttonVariants({ className: 'mt-4' }))}>
          Naar oefenexamens
        </Link>
      </div>
    )
  }

  const wrongQuestions = deck.filter(
    (q) => answers.get(q.id) !== q.correctAnswerId,
  )

  return (
    <div className="mx-auto min-h-svh max-w-lg space-y-8 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Resultaat</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Over {total} vraag{total === 1 ? '' : 'en'}.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Score</CardTitle>
          <CardDescription>
            {correct} van {total} correct — {pct}%
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge className="gap-1">
              <CheckIcon className="size-3" />
              Correct: {correct}
            </Badge>
            <Badge variant="destructive" className="gap-1">
              <XIcon className="size-3" />
              Incorrect: {incorrect}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {wrongQuestions.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-medium">Foute antwoorden</h2>
          {wrongQuestions.map((q) => {
            const chosen = answers.get(q.id)
            const chosenAnswer = q.answers.find((a) => a.id === chosen)
            const correctAnswer = q.answers.find(
              (a) => a.id === q.correctAnswerId,
            )
            return (
              <Card key={q.id}>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">
                    <RichTextViewer doc={q.question} />
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  {chosenAnswer && (
                    <div className="flex items-start gap-2 text-destructive">
                      <XIcon className="mt-0.5 size-4 shrink-0" />
                      <span>
                        <span className="font-medium uppercase">{chosenAnswer.id}.</span>{' '}
                        {chosenAnswer.text}
                      </span>
                    </div>
                  )}
                  {correctAnswer && (
                    <div className="flex items-start gap-2 text-green-700 dark:text-green-400">
                      <CheckIcon className="mt-0.5 size-4 shrink-0" />
                      <span>
                        <span className="font-medium uppercase">{correctAnswer.id}.</span>{' '}
                        {correctAnswer.text}
                      </span>
                    </div>
                  )}
                  <Separator />
                  <p className="text-muted-foreground leading-relaxed">
                    {q.explanation}
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    {q.relatedConcept && (
                      <Badge variant="secondary">{q.relatedConcept}</Badge>
                    )}
                    {q.reference && (
                      <span className="italic text-muted-foreground">
                        {q.reference}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      <div className="flex flex-col gap-2 sm:flex-row">
        <Link
          to="/exams"
          className={cn(buttonVariants({ variant: 'secondary' }), 'sm:flex-1')}
          onClick={clearSession}
        >
          Opnieuw (zelfde set)
        </Link>
        <Link
          to="/exams"
          className={cn(buttonVariants(), 'sm:flex-1')}
          onClick={resetFiltersAndGo}
        >
          Nieuwe sessie
        </Link>
      </div>
    </div>
  )
}
