import { Link } from 'react-router-dom'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { allCourses } from '@/data/courses/registry'
import type { CourseFeature } from '@/types/course'

const featureLabels: Record<CourseFeature, string> = {
  flashcards: 'Flashcards',
  exams: 'Oefenexamens',
  compendiums: 'Compendia',
}

export function CourseSelectorPage() {
  return (
    <div className="mx-auto flex min-h-svh max-w-lg flex-col justify-center gap-6 p-6">
      <div>
        <p className="text-sm text-muted-foreground">Denkbende</p>
        <h1 className="text-3xl font-semibold tracking-tight">Psychologie</h1>
        <p className="text-muted-foreground">
          Selecteer een vak om te beginnen met oefenen.
        </p>
      </div>

      {allCourses.map((courseData) => (
        <Link
          key={courseData.config.slug}
          to={`/${courseData.config.slug}`}
          className="block rounded-xl outline-none transition-shadow hover:shadow-theme-md focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Card className="h-full transition-colors hover:bg-accent/40">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                {courseData.config.name}
              </CardTitle>
              <CardDescription>{courseData.config.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {courseData.config.features.map((feature) => (
                  <Badge key={feature} variant="secondary">
                    {featureLabels[feature]}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
