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
import { Slider } from '@/components/ui/slider'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  buildDeck,
  countAvailable,
  getTypesForChapters,
} from '@/data/helpers/flashcardHelpers'
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
  setupCompendiumAtom,
  setupCountAtom,
  setupSourceAtom,
  setupTypeAtom,
  termLanguageAtom,
} from '@/modules/flashcards/atoms'
import {
  formatSourcesLabel,
  formatTypesLabel,
  getChapterLabels,
  getCompendiumLabels,
} from '@/modules/flashcards/formatLabels'
import { loadFlashcardResults } from '@/modules/flashcards/flashcardStorage'
import { useCourseData, useCourseRoutes, useCourseSlug } from '@/hooks/useCourseData'
import { cn } from '@/lib/utils'

export function FlashcardsSetupPage() {
  const navigate = useNavigate()
  const courseSlug = useCourseSlug()
  const routes = useCourseRoutes()
  const {
    flashcards,
    compendiumFlashcards,
    flashcardSources,
    chapterNumbers,
    compendiumMeta,
    customComponents,
  } = useCourseData()

  const [chapters, setChapters] = useAtom(setupChapterAtom)
  const [types, setTypes] = useAtom(setupTypeAtom)
  const [sources, setSources] = useAtom(setupSourceAtom)
  const [compendiums, setCompendiums] = useAtom(setupCompendiumAtom)
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

  const chapterOptions = useMemo(
    () => chapterNumbers.map((n) => ({ value: String(n), label: `Hoofdstuk ${n}` })),
    [chapterNumbers],
  )

  const sourceOptions = useMemo(
    () => flashcardSources.map((s) => ({ value: s, label: s })),
    [flashcardSources],
  )

  const compendiumOptions = useMemo(
    () => compendiumMeta.map((meta) => ({ value: meta.slug, label: meta.label })),
    [compendiumMeta],
  )

  const chapterStrings = useMemo(() => chapters.map(String), [chapters])

  const setChapterStrings = (next: string[]) => {
    const nums = next
      .map((s) => Number(s))
      .filter((n): n is (typeof chapterNumbers)[number] =>
        (chapterNumbers as readonly number[]).includes(n),
      )
    setChapters([...new Set(nums)].sort((a, b) => a - b))
  }

  const availableTypes = useMemo(
    () => getTypesForChapters(flashcards, chapters),
    [flashcards, chapters],
  )

  const typeOptions = useMemo(
    () => availableTypes.map((t) => ({ value: t, label: t })),
    [availableTypes],
  )

  const available = useMemo(
    () => countAvailable(flashcards, compendiumFlashcards, chapters, types, sources, compendiums),
    [flashcards, compendiumFlashcards, chapters, types, sources, compendiums],
  )

  const [history, setHistory] = useState(() => loadFlashcardResults(courseSlug))

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
    const deck = buildDeck(flashcards, compendiumFlashcards, chapters, types, n, sources, compendiums)
    setSessionId(crypto.randomUUID())
    setDeck(deck)
    setIndex(0)
    setScores({ correct: 0, incorrect: 0, unsure: 0 })
    setRevealed(false)
    setHintText(null)
    setHintLoading(false)
    setHintError(null)
    navigate(routes.flashcardsSession)
  }

  return (
    <div className="mx-auto min-h-svh max-w-lg space-y-6 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Flashcards</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Kies hoofdstuk, type, compendium en aantal, daarna start je de oefening.
          </p>
        </div>
        <Link to={routes.home} className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}>
          Home
        </Link>
      </div>

      <Tabs defaultValue="oefenen">
        <TabsList className="w-full">
          <TabsTrigger value="oefenen">Oefenen</TabsTrigger>
          <TabsTrigger value="resultaten">Eerdere resultaten</TabsTrigger>
        </TabsList>

        <TabsContent value="oefenen" className="space-y-6 pt-2">
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
                  options={chapterOptions}
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
                  options={sourceOptions}
                  selected={sources}
                  onChange={setSources}
                  placeholder="Alle bronbestanden"
                  enableSearch
                  showSelectAll={sourceOptions.length > 1}
                />
              </div>

              {compendiumOptions.length > 0 && (
                <div className="space-y-2">
                  <Label htmlFor="compendium-multiselect">Compendium</Label>
                  <MultiSelectChips
                    id="compendium-multiselect"
                    options={compendiumOptions}
                    selected={compendiums}
                    onChange={setCompendiums}
                    placeholder="Geen compendia"
                    enableSearch={false}
                    showSelectAll={compendiumOptions.length > 1}
                  />
                </div>
              )}

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

          {customComponents?.FlashcardSetupExtra && <customComponents.FlashcardSetupExtra />}
        </TabsContent>

        <TabsContent value="resultaten" className="space-y-4 pt-2">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm text-muted-foreground">
              {history.length === 0
                ? 'Nog geen opgeslagen sessies.'
                : `${history.length} opgeslagen sessie${history.length === 1 ? '' : 's'}.`}
            </p>
            <div className="flex items-center gap-1">
              <Link
                to={routes.flashcardsStats}
                className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }))}
              >
                Statistieken
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setHistory(loadFlashcardResults(courseSlug))}
              >
                Vernieuwen
              </Button>
            </div>
          </div>

          {history.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Na een ronde verschijnen je resultaten hier.
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
                    {getChapterLabels(h.chapters).map((label, i) => (
                      <Badge key={`${h.id}-ch-${i}`} variant="secondary">
                        {label}
                      </Badge>
                    ))}
                    <Badge variant="outline">{formatTypesLabel(h.types)}</Badge>
                    {h.sources.length > 0 && (
                      <Badge variant="outline">{formatSourcesLabel(h.sources)}</Badge>
                    )}
                    {getCompendiumLabels(h.compendiums ?? [], compendiumMeta).map((label, i) => (
                      <Badge key={`${h.id}-comp-${i}`} variant="secondary">
                        {label}
                      </Badge>
                    ))}
                    <span className="tabular-nums">
                      goed {h.correct} · twijfel {h.unsure} · fout {h.incorrect}{' '}
                      ({h.requestedCount} kaarten)
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
