import { Link } from 'react-router-dom'
import { Pin } from 'lucide-react'

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { CourseData, CourseFeature } from '@/types/course'

const featureLabels: Record<CourseFeature, string> = {
  flashcards: 'Flashcards',
  exams: 'Oefenexamens',
  compendiums: 'Compendia',
}

type CourseCardProps = {
  courseData: CourseData
  pinned: boolean
  onTogglePin: (slug: string) => void
}

export function CourseCard({ courseData, pinned, onTogglePin }: CourseCardProps) {
  const { slug, name, description, features } = courseData.config

  return (
    <Link
      to={`/${slug}`}
      className="block rounded-xl outline-none transition-shadow hover:shadow-theme-md focus-visible:ring-2 focus-visible:ring-ring"
    >
      <Card className="h-full transition-colors hover:bg-accent/40">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">{name}</CardTitle>
          <CardDescription>{description}</CardDescription>
          <CardAction>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="cursor-pointer text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label={pinned ? 'Cursus losmaken' : 'Cursus vastzetten'}
              aria-pressed={pinned}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onTogglePin(slug)
              }}
            >
              <Pin className={pinned ? 'fill-current text-foreground' : undefined} />
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {features.map((feature) => (
              <Badge key={feature} variant="secondary">
                {featureLabels[feature]}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
