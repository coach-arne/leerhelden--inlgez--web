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
  ALL_FLASHCARDS,
  ALL_SOURCES,
  buildDeck,
  CHAPTER_NUMBERS,
  countAvailable,
  getTypesForChapters,
} from '@/data/flashcards'
import {
  activeDeckAtom,
  cardRevealedAtom,
  hintErrorAtom,
  hintLoadingAtom,
  hintTextAtom,
  sessionIdAtom,
  sessionIndexAtom,
  sessionScoresAtom,
  setupChapterAtom,
  setupCountAtom,
  setupSourceAtom,
  setupTypeAtom,
  termLanguageAtom,
} from '@/modules/flashcards/atoms'
import { formatChaptersLabel, formatSourcesLabel, formatTypesLabel } from '@/modules/flashcards/formatLabels'
import { loadFlashcardResults } from '@/modules/flashcards/flashcardStorage'
import { cn } from '@/lib/utils'

const CHAPTER_OPTIONS = CHAPTER_NUMBERS.map((n) => ({
  value: String(n),
  label: `Hoofdstuk ${n}`,
}))

const SOURCE_OPTIONS = ALL_SOURCES.map((s) => ({ value: s, label: s }))

export function FlashcardsSetupPage() {
  const navigate = useNavigate()
  const [chapters, setChapters] = useAtom(setupChapterAtom)
  const [types, setTypes] = useAtom(setupTypeAtom)
  const [sources, setSources] = useAtom(setupSourceAtom)
  const [count, setCount] = useAtom(setupCountAtom)
  const [termLang, setTermLang] = useAtom(termLanguageAtom)

  const setDeck = useSetAtom(activeDeckAtom)
  const setSessionId = useSetAtom(sessionIdAtom)
  const setIndex = useSetAtom(sessionIndexAtom)
  const setScores = useSetAtom(sessionScoresAtom)
  const setRevealed = useSetAtom(cardRevealedAtom)
  const setHintText = useSetAtom(hintTextAtom)
  const setHintLoading = useSetAtom(hintLoadingAtom)
  const setHintError = useSetAtom(hintErrorAtom)

  const chapterStrings = useMemo(
    () => chapters.map(String),
    [chapters],
  )

  const setChapterStrings = (next: string[]) => {
    const nums = next
      .map((s) => Number(s))
      .filter((n): n is 1 | 2 | 3 =>
        CHAPTER_NUMBERS.includes(n as (typeof CHAPTER_NUMBERS)[number]),
      )
    setChapters([...new Set(nums)].sort((a, b) => a - b))
  }

  const availableTypes = useMemo(
    () => getTypesForChapters(ALL_FLASHCARDS, chapters),
    [chapters],
  )

  const typeOptions = useMemo(
    () => availableTypes.map((t) => ({ value: t, label: t })),
    [availableTypes],
  )

  const available = useMemo(
    () => countAvailable(ALL_FLASHCARDS, chapters, types, sources),
    [chapters, types, sources],
  )

  const [history, setHistory] = useState(() => loadFlashcardResults())

  useEffect(() => {
    const allowed = new Set(availableTypes)
    const next = types.filter((t) => allowed.has(t))
    if (next.length !== types.length) {
      setTypes(next)
    }
  }, [availableTypes, types, setTypes])

  useEffect(() => {
    if (available === 0) return
    setCount((c) => Math.min(Math.max(1, c), available))
  }, [available, setCount])

  const handleStart = () => {
    if (available === 0) return
    const n = Math.min(count, available)
    const deck = buildDeck(ALL_FLASHCARDS, chapters, types, n, sources)
    setSessionId(crypto.randomUUID())
    setDeck(deck)
    setIndex(0)
    setScores({ correct: 0, incorrect: 0, unsure: 0 })
    setRevealed(false)
    setHintText(null)
    setHintLoading(false)
    setHintError(null)
    navigate('/flashcards/session')
  }

  return (
    <div className="mx-auto min-h-svh max-w-lg space-y-8 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Flashcards</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Kies hoofdstuk, type en aantal, daarna start je de oefening.
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
              ? 'Geen kaarten voor deze combinatie — pas de filters aan.'
              : `${available} kaart${available === 1 ? '' : 'en'} beschikbaar.`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="chapter-multiselect">Hoofdstuk</Label>
            <MultiSelectChips
              id="chapter-multiselect"
              options={CHAPTER_OPTIONS}
              selected={chapterStrings}
              onChange={setChapterStrings}
              placeholder="Alle hoofdstukken"
              enableSearch={false}
              showSelectAll
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type-multiselect">Type begrip</Label>
            <MultiSelectChips
              id="type-multiselect"
              options={typeOptions}
              selected={types}
              onChange={setTypes}
              placeholder="Alle types"
              enableSearch
              showSelectAll={typeOptions.length > 1}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="source-multiselect">Bronbestand</Label>
            <MultiSelectChips
              id="source-multiselect"
              options={SOURCE_OPTIONS}
              selected={sources}
              onChange={setSources}
              placeholder="Alle bronbestanden"
              enableSearch
              showSelectAll={SOURCE_OPTIONS.length > 1}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <Label htmlFor="count-slider">Aantal kaarten</Label>
              <span className="text-sm tabular-nums text-muted-foreground">
                {available === 0 ? 0 : Math.min(count, available)}
              </span>
            </div>
            <Slider
              id="count-slider"
              min={1}
              max={Math.max(1, available)}
              step={1}
              disabled={available === 0}
              value={[Math.min(count, Math.max(1, available))]}
              onValueChange={(v) => {
                const arr = Array.isArray(v) ? v : [v]
                const next = arr[0]
                if (typeof next === 'number') setCount(next)
              }}
            />
          </div>

          <div className="space-y-2">
            <Label>Taal term op kaart</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={termLang === 'nl' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTermLang('nl')}
              >
                Nederlands
              </Button>
              <Button
                type="button"
                variant={termLang === 'en' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTermLang('en')}
              >
                English
              </Button>
            </div>
          </div>

          <Button
            className="w-full max-w-md"
            disabled={available === 0}
            onClick={handleStart}
          >
            Start oefening
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
                  <Badge variant="secondary">{formatChaptersLabel(h.chapters)}</Badge>
                  <Badge variant="outline">{formatTypesLabel(h.types)}</Badge>
                  {h.sources.length > 0 && (
                    <Badge variant="outline">{formatSourcesLabel(h.sources)}</Badge>
                  )}
                  <span className="tabular-nums">
                    goed {h.correct} · twijfel {h.unsure} · fout {h.incorrect}{' '}
                    ({h.requestedCount} kaarten)
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
          onClick={() => setHistory(loadFlashcardResults())}
        >
          Vernieuwen
        </Button>
      </div>
    </div>
  )
}
