import type { CourseData } from '@/types/course'

/** Pinned courses first (stored order), then unpinned in registry order. Unknown slugs ignored. */
export function sortCoursesByPinned(
  courses: CourseData[],
  pinnedSlugs: string[],
): CourseData[] {
  const bySlug = new Map(courses.map((c) => [c.config.slug, c]))
  const pinnedSet = new Set(pinnedSlugs)

  const pinned = pinnedSlugs
    .map((slug) => bySlug.get(slug))
    .filter((c): c is CourseData => c !== undefined)

  const unpinned = courses.filter((c) => !pinnedSet.has(c.config.slug))

  return [...pinned, ...unpinned]
}
