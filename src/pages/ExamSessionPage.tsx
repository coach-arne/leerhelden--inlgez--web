import { useCallback, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { CheckIcon, XIcon } from 'lucide-react'

import { RichTextViewer } from '@/components/RichTextViewer'
import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
import { useCourseRoutes } from '@/hooks/useCourseData'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import {
  currentExamQuestionAtom,
  examAnswersAtom,
  examDeckAtom,
  examIndexAtom,
  examSessionIdAtom,
} from '@/modules/exams/atoms'
import { cn } from '@/lib/utils'

export function ExamSessionPage() {
  const navigate = useNavigate()
  const routes = useCourseRoutes()
  const deck = useAtomValue(examDeckAtom)
  const setDeck = useSetAtom(examDeckAtom)
  const setSessionId = useSetAtom(examSessionIdAtom)
  const [index, setIndex] = useAtom(examIndexAtom)
  const [answers, setAnswers] = useAtom(examAnswersAtom)
  const question = useAtomValue(currentExamQuestionAtom)

  useEffect(() => {
    if (!deck || deck.length === 0) {
      navigate(routes.exams, { replace: true })
    }
  }, [deck, navigate, routes.exams])

  const selectedAnswerId = question ? (answers.get(question.id) ?? null) : null
  const isAnswered = selectedAnswerId !== null

  const handleSelectAnswer = (answerId: string) => {
    if (!question || isAnswered) return
    setAnswers((prev) => {
      const next = new Map(prev)
      next.set(question.id, answerId)
      return next
    })
  }

  const handleNext = useCallback(() => {
    if (!deck) return
    if (index + 1 >= deck.length) {
      navigate(routes.examsResults)
      return
    }
    setIndex(index + 1)
  }, [deck, index, navigate, setIndex])

  if (!deck || deck.length === 0 || !question) {
    return null
  }

  const progressPct = ((index + 1) / deck.length) * 100
  const isCorrect = selectedAnswerId === question.correctAnswerId

  return (
    <div className="mx-auto min-h-svh max-w-lg space-y-6 p-6">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          Vraag {index + 1} van {deck.length}
        </p>
        <Link
          to={routes.exams}
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

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium leading-snug">
            <RichTextViewer doc={question.question} />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {question.answers.map((answer) => {
            const isSelected = selectedAnswerId === answer.id
            const isThisCorrect = answer.id === question.correctAnswerId

            let variant: 'outline' | 'default' | 'destructive' | 'secondary' = 'outline'
            let extraClass = 'justify-start h-auto py-3 text-left whitespace-normal'

            if (isAnswered) {
              if (isThisCorrect) {
                extraClass = cn(extraClass, 'border-green-500 bg-green-50 text-green-900 dark:bg-green-950 dark:text-green-100 hover:bg-green-50 dark:hover:bg-green-950')
              } else if (isSelected && !isThisCorrect) {
                extraClass = cn(extraClass, 'border-destructive bg-destructive/10 text-destructive hover:bg-destructive/10')
              } else {
                extraClass = cn(extraClass, 'opacity-60')
              }
            }

            return (
              <Button
                key={answer.id}
                variant={variant}
                className={cn('w-full', extraClass)}
                disabled={isAnswered && !isThisCorrect && !isSelected}
                onClick={() => handleSelectAnswer(answer.id)}
              >
                <span className="mr-2 shrink-0 font-semibold uppercase">
                  {answer.id}
                </span>
                <span className="flex-1">{answer.text}</span>
                {isAnswered && isThisCorrect && (
                  <CheckIcon className="ml-2 size-4 shrink-0 text-green-600" />
                )}
                {isAnswered && isSelected && !isThisCorrect && (
                  <XIcon className="ml-2 size-4 shrink-0 text-destructive" />
                )}
              </Button>
            )
          })}
        </CardContent>

        {isAnswered && (
          <CardFooter className="flex flex-col items-start gap-3">
            <Separator />
            <div
              className={cn(
                'w-full rounded-md px-3 py-2 text-sm',
                isCorrect
                  ? 'border border-green-200 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-950 dark:text-green-100'
                  : 'border border-destructive/30 bg-destructive/5 text-foreground',
              )}
            >
              <p className="font-medium">
                {isCorrect ? 'Juist!' : 'Niet juist'}
              </p>
              <p className="mt-1 leading-relaxed">{question.explanation}</p>
            </div>
            <div className="flex w-full flex-wrap items-center gap-2 text-sm text-muted-foreground">
              {question.relatedConcept && (
                <Badge variant="secondary">{question.relatedConcept}</Badge>
              )}
              {question.reference && (
                <span className="italic">{question.reference}</span>
              )}
            </div>
            <Button className="w-full" onClick={handleNext}>
              {index + 1 >= deck.length ? 'Bekijk resultaten' : 'Volgende vraag'}
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}
