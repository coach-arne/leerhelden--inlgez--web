import { atom } from 'jotai'

import type { CourseData } from '@/types/course'

export const activeCourseAtom = atom<CourseData | null>(null)
