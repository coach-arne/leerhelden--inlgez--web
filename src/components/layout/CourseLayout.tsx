import { useEffect } from 'react'
import { Navigate, Outlet, useParams } from 'react-router-dom'
import { useAtom } from 'jotai'

import { getCourseData } from '@/data/courses/registry'
import { activeCourseAtom } from '@/modules/course/atoms'

export function CourseLayout() {
  const { course: slug } = useParams<{ course: string }>()
  const [activeCourse, setCourse] = useAtom(activeCourseAtom)
  const courseData = slug ? getCourseData(slug) : undefined

  if (courseData && activeCourse !== courseData) {
    setCourse(courseData)
  }

  useEffect(() => {
    return () => {
      setCourse(null)
    }
  }, [setCourse])

  if (!courseData) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
