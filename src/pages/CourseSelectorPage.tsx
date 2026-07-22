import { useEffect, useRef } from 'react'
import { useAtom } from 'jotai'

import { CourseCard } from '@/components/CourseCard'
import { allCourses } from '@/data/courses/registry'
import { pinnedCourseSlugsAtom } from '@/modules/course/atoms'
import {
  loadPinnedCourses,
  togglePinnedCourse,
} from '@/modules/course/coursePinStorage'
import { sortCoursesByPinned } from '@/modules/course/helpers/sortCoursesByPinned'

export function CourseSelectorPage() {
  const [pinnedSlugs, setPinnedSlugs] = useAtom(pinnedCourseSlugsAtom)
  const hydratedRef = useRef(false)

  useEffect(() => {
    if (hydratedRef.current) return
    hydratedRef.current = true
    setPinnedSlugs(loadPinnedCourses())
  }, [setPinnedSlugs])

  const courses = sortCoursesByPinned(allCourses, pinnedSlugs)

  return (
    <div className="mx-auto flex min-h-svh max-w-lg flex-col justify-center gap-6 p-6">
      <div>
        <p className="text-sm text-muted-foreground">Denkbende</p>
        <h1 className="text-3xl font-semibold tracking-tight">Psychologie</h1>
        <p className="text-muted-foreground">
          Selecteer een vak om te beginnen met oefenen.
        </p>
      </div>

      {courses.map((courseData) => (
        <CourseCard
          key={courseData.config.slug}
          courseData={courseData}
          pinned={pinnedSlugs.includes(courseData.config.slug)}
          onTogglePin={(slug) => {
            setPinnedSlugs((prev) => togglePinnedCourse(slug, prev))
          }}
        />
      ))}
    </div>
  )
}
