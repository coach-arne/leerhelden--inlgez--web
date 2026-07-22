import { atom } from 'jotai'

import type { CourseData } from '@/types/course'
import { savePinnedCourses } from '@/modules/course/coursePinStorage'

export const activeCourseAtom = atom<CourseData | null>(null)

const pinnedCourseSlugsBaseAtom = atom<string[]>([])

export const pinnedCourseSlugsAtom = atom(
  (get) => get(pinnedCourseSlugsBaseAtom),
  (
    get,
    set,
    update: string[] | ((prev: string[]) => string[]),
  ) => {
    const prev = get(pinnedCourseSlugsBaseAtom)
    const next = typeof update === 'function' ? update(prev) : update
    set(pinnedCourseSlugsBaseAtom, next)
    savePinnedCourses(next)
  },
)
