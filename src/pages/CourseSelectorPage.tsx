import { Link } from 'react-router-dom'

import { buttonVariants } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { allCourses } from '@/data/courses/registry'
import { cn } from '@/lib/utils'
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
        <h1 className="text-3xl font-semibold tracking-tight">Kies een opleiding</h1>
        <p className="mt-2 text-muted-foreground">
          Selecteer een vak om te beginnen met oefenen.
        </p>
      </div>

      {allCourses.map((courseData) => (
        <Card key={courseData.config.slug}>
          <CardHeader>
            <CardTitle>{courseData.config.name}</CardTitle>
            <CardDescription>{courseData.config.description}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-2">
              {courseData.config.features.map((feature) => (
                <Badge key={feature} variant="secondary">
                  {featureLabels[feature]}
                </Badge>
              ))}
            </div>
            <Link
              to={`/${courseData.config.slug}`}
              className={cn(buttonVariants(), 'self-start')}
            >
              Naar {courseData.config.shortName}
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
