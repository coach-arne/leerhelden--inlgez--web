import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSetAtom } from 'jotai'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from 'recharts'

import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { Separator } from '@/components/ui/separator'
import {
  setupChapterAtom,
  setupCompendiumAtom,
  setupCountAtom,
  setupSourceAtom,
  setupTypeAtom,
} from '@/modules/flashcards/atoms'
import {
  getChapterBreakdown,
  getOverallStats,
  getScoreOverTime,
  getWeakChapters,
} from '@/modules/flashcards/helpers/computeFlashcardStats'
import { loadFlashcardResults } from '@/modules/flashcards/flashcardStorage'
import { useCourseRoutes, useCourseSlug } from '@/hooks/useCourseData'
import { cn } from '@/lib/utils'

const barChartConfig = {
  correct: {
    label: 'Goed',
    color: 'hsl(var(--chart-1))',
  },
  unsure: {
    label: 'Twijfel',
    color: 'hsl(var(--chart-2))',
  },
  incorrect: {
    label: 'Fout',
    color: 'hsl(var(--chart-3))',
  },
} satisfies ChartConfig

const lineChartConfig = {
  pct: {
    label: 'Score (%)',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig

const REMEDIATION_THRESHOLD = 60
const REMEDIATION_COUNT = 15

export function FlashcardsStatsPage() {
  const navigate = useNavigate()
  const courseSlug = useCourseSlug()
  const routes = useCourseRoutes()

  const setChapters = useSetAtom(setupChapterAtom)
  const setTypes = useSetAtom(setupTypeAtom)
  const setSources = useSetAtom(setupSourceAtom)
  const setCompendiums = useSetAtom(setupCompendiumAtom)
  const setCount = useSetAtom(setupCountAtom)

  const [results] = useState(() => loadFlashcardResults(courseSlug))

  const overall = useMemo(() => getOverallStats(results), [results])
  const scoreOverTime = useMemo(() => getScoreOverTime(results), [results])
  const chapterBreakdown = useMemo(() => getChapterBreakdown(results), [results])
  const weakChapters = useMemo(
    () => getWeakChapters(results, REMEDIATION_THRESHOLD),
    [results],
  )

  const handleStartRemediation = () => {
    setChapters(weakChapters.map((w) => w.chapter))
    setTypes([])
    setSources([])
    setCompendiums([])
    setCount(REMEDIATION_COUNT)
    navigate(routes.flashcards)
  }

  return (
    <div className="mx-auto min-h-svh max-w-2xl space-y-8 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Statistieken</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Overzicht van je flashcard-sessies.
          </p>
        </div>
        <Link
          to={routes.flashcards}
          className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
        >
          Terug
        </Link>
      </div>

      {results.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            <p>Nog geen opgeslagen sessies.</p>
            <Link to={routes.flashcards} className={cn(buttonVariants({ className: 'mt-4' }))}>
              Start een sessie
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Overzichtskaart */}
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Sessies</CardDescription>
                <CardTitle className="text-3xl">{overall.totalSessions}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Gemiddelde score</CardDescription>
                <CardTitle className="text-3xl">{overall.averagePct}%</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Kaarten geoefend</CardDescription>
                <CardTitle className="text-3xl">{overall.totalCards}</CardTitle>
              </CardHeader>
            </Card>
          </div>

          {/* Score over tijd */}
          {scoreOverTime.length > 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Score over tijd</CardTitle>
                <CardDescription>
                  Gewogen percentage per sessie (twijfel telt half mee) —
                  laatste {scoreOverTime.length} sessies.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={lineChartConfig}
                  className="min-h-[200px] w-full"
                >
                  <LineChart data={scoreOverTime}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 11 }}
                    />
                    <YAxis
                      domain={[0, 100]}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v) => `${v}%`}
                      tick={{ fontSize: 11 }}
                      width={38}
                    />
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          formatter={(value) => [`${value}%`, 'Score']}
                        />
                      }
                    />
                    <Line
                      type="monotone"
                      dataKey="pct"
                      stroke="var(--color-pct)"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>
          )}

          {/* Score per hoofdstuk */}
          {chapterBreakdown.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Score per hoofdstuk</CardTitle>
                <CardDescription>
                  Gecumuleerde kaarten per hoofdstuk (alleen sessies met expliciete
                  hoofdstuk-selectie).
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={barChartConfig}
                  className="min-h-[220px] w-full"
                >
                  <BarChart data={chapterBreakdown} barCategoryGap="30%">
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="chapter"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 11 }}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 11 }}
                      width={30}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Bar
                      dataKey="correct"
                      stackId="a"
                      fill="var(--color-correct)"
                      radius={[0, 0, 0, 0]}
                    />
                    <Bar
                      dataKey="unsure"
                      stackId="a"
                      fill="var(--color-unsure)"
                    />
                    <Bar
                      dataKey="incorrect"
                      stackId="a"
                      fill="var(--color-incorrect)"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          )}

          <Separator />

          {/* Remediering */}
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-medium">Remediering</h2>
              <p className="text-sm text-muted-foreground">
                Hoofdstukken met een gewogen score onder {REMEDIATION_THRESHOLD}%.
              </p>
            </div>

            {weakChapters.length === 0 ? (
              <Card>
                <CardContent className="py-6 text-center text-sm text-muted-foreground">
                  Alle hoofdstukken zitten boven {REMEDIATION_THRESHOLD}% — goed bezig!
                </CardContent>
              </Card>
            ) : (
              <>
                <ul className="space-y-2">
                  {weakChapters.map((w) => (
                    <li
                      key={w.chapter}
                      className="flex items-center justify-between rounded-lg border border-border bg-card px-3 py-2 text-sm"
                    >
                      <span className="font-medium">Hoofdstuk {w.chapter}</span>
                      <Badge
                        variant={w.pct < 40 ? 'destructive' : 'secondary'}
                      >
                        {w.pct}%
                      </Badge>
                    </li>
                  ))}
                </ul>
                <Button className="w-full" onClick={handleStartRemediation}>
                  Start remediering ({weakChapters.length} hoofdstuk
                  {weakChapters.length === 1 ? '' : 'ken'}, {REMEDIATION_COUNT} kaarten)
                </Button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  )
}
