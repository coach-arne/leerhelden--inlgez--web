import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAtom, useSetAtom } from 'jotai'

import { MultiSelectChips } from '@/components/MultiSelectChips'
import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/slider'
import {
  ALL_EXAM_SOURCE_OPTIONS,
  buildExamDeck,
  countExamAvailable,
  MAX_EXAM_COUNT,
} from '@/data/exams'
import {
  examAnswersAtom,
  examCountAtom,
  examDeckAtom,
  examIndexAtom,
  examSessionIdAtom,
  examSourcesAtom,
} from '@/modules/exams/atoms'
import { loadExamResults } from '@/modules/exams/examStorage'
import { cn } from '@/lib/utils'

export function ExamSetupPage() {
  const navigate = useNavigate()
  const [sources, setSources] = useAtom(examSourcesAtom)
  const [count, setCount] = useAtom(examCountAtom)

  const setDeck = useSetAtom(examDeckAtom)
  const setSessionId = useSetAtom(examSessionIdAtom)
  const setIndex = useSetAtom(examIndexAtom)
  const setAnswers = useSetAtom(examAnswersAtom)

  const available = useMemo(
    () => countExamAvailable(sources),
    [sources],
  )

  const effectiveMax = Math.min(available, MAX_EXAM_COUNT)

  useEffect(() => {
    if (effectiveMax > 0) {
      setCount((c) => Math.min(Math.max(1, c), effectiveMax))
    }
  }, [effectiveMax, setCount])

  const [history, setHistory] = useState(() => loadExamResults())

  const handleStart = () => {
    if (available === 0) return
    const n = Math.min(count, effectiveMax)
    const deck = buildExamDeck(sources, n)
    setSessionId(crypto.randomUUID())
    setDeck(deck)
    setIndex(0)
    setAnswers(new Map())
    navigate('/exams/session')
  }

  return (
    <div className="mx-auto min-h-svh max-w-lg space-y-8 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Oefenexamens</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Kies een examenset en aantal vragen, daarna start je het examen.
          </p>
        </div>
        <Link to="/" className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}>
          Home
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Instellingen</CardTitle>
          <CardDescription>
            {available === 0
              ? 'Geen vragen beschikbaar — selecteer een examenset.'
              : `${available} vraag${available === 1 ? '' : 'en'} beschikbaar${available > MAX_EXAM_COUNT ? ` (max ${MAX_EXAM_COUNT})` : ''}.`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="exam-source-multiselect">Examenset</Label>
            <MultiSelectChips
              id="exam-source-multiselect"
              options={ALL_EXAM_SOURCE_OPTIONS}
              selected={sources}
              onChange={setSources}
              placeholder="Alle examens"
              enableSearch={false}
              showSelectAll={ALL_EXAM_SOURCE_OPTIONS.length > 1}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <Label htmlFor="exam-count-slider">Aantal vragen</Label>
              <span className="text-sm tabular-nums text-muted-foreground">
                {available === 0 ? 0 : Math.min(count, effectiveMax)}
              </span>
            </div>
            <Slider
              id="exam-count-slider"
              min={1}
              max={Math.max(1, effectiveMax)}
              step={1}
              disabled={available === 0}
              value={[Math.min(count, Math.max(1, effectiveMax))]}
              onValueChange={(v) => {
                const arr = Array.isArray(v) ? v : [v]
                const next = arr[0]
                if (typeof next === 'number') setCount(next)
              }}
            />
          </div>

          <Button
            className="w-full max-w-md"
            disabled={available === 0}
            onClick={handleStart}
          >
            Start examen
          </Button>
        </CardContent>
      </Card>

      <div>
        <h2 className="mb-3 text-lg font-medium">Eerdere resultaten</h2>
        {history.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nog geen opgeslagen sessies. Na een ronde verschijnen ze hier.
          </p>
        ) : (
          <ul className="space-y-2">
            {history.slice(0, 15).map((h) => (
              <li
                key={h.id}
                className="flex flex-col gap-1 rounded-lg border border-border bg-card px-3 py-2 text-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <span className="text-muted-foreground">
                  {new Date(h.finishedAt).toLocaleString('nl-BE', {
                    dateStyle: 'short',
                    timeStyle: 'short',
                  })}
                </span>
                <span className="flex flex-wrap items-center gap-2">
                  {h.sources.map((src) => (
                    <Badge key={src} variant="secondary">
                      {ALL_EXAM_SOURCE_OPTIONS.find((o) => o.value === src)?.label ?? src}
                    </Badge>
                  ))}
                  <span className="tabular-nums">
                    {h.correct}/{h.totalQuestions} correct
                  </span>
                </span>
              </li>
            ))}
          </ul>
        )}
        <Separator className="my-6" />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setHistory(loadExamResults())}
        >
          Vernieuwen
        </Button>
      </div>
    </div>
  )
}
