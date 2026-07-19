import type { CourseData } from '@/types/course'

import { inlgezpData } from './inlgezp/data'
import { klinpsy1aData } from './klinpsy1a/data'

export const courseRegistry = new Map<string, CourseData>([
  ['inlgezp', inlgezpData],
  ['klinpsy1a', klinpsy1aData],
])

export const allCourses: CourseData[] = [...courseRegistry.values()]

export function getCourseData(slug: string): CourseData | undefined {
  return courseRegistry.get(slug)
}
