import type { CourseData } from '@/types/course'

import { inlgezpData } from './inlgezp/data'

export const courseRegistry = new Map<string, CourseData>([['inlgezp', inlgezpData]])

export const allCourses: CourseData[] = [...courseRegistry.values()]

export function getCourseData(slug: string): CourseData | undefined {
  return courseRegistry.get(slug)
}
