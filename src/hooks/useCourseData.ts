import { useAtomValue } from 'jotai'

import type { CourseData } from '@/types/course'
import { activeCourseAtom } from '@/modules/course/atoms'

export function useCourseData(): CourseData {
  const courseData = useAtomValue(activeCourseAtom)
  if (!courseData) {
    throw new Error('useCourseData must be used within a CourseLayout (/:course route)')
  }
  return courseData
}

export function useCourseSlug(): string {
  return useCourseData().config.slug
}

export function useCourseRoutes() {
  const slug = useCourseSlug()
  return {
    home: `/${slug}`,
    flashcards: `/${slug}/flashcards`,
    flashcardsSession: `/${slug}/flashcards/session`,
    flashcardsResults: `/${slug}/flashcards/results`,
    flashcardsStats: `/${slug}/flashcards/stats`,
    compendiums: `/${slug}/compendiums`,
    compendium: (compSlug: string) => `/${slug}/compendiums/${compSlug}`,
    compendiumItem: (compSlug: string, id: string) => `/${slug}/compendiums/${compSlug}/${id}`,
    exams: `/${slug}/exams`,
    examsSession: `/${slug}/exams/session`,
    examsResults: `/${slug}/exams/results`,
  }
}
