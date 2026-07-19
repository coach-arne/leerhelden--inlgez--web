import { Navigate, Route, Routes } from 'react-router-dom'

import { CourseLayout } from '@/components/layout/CourseLayout'
import { CompendiumDetailPage } from '@/pages/CompendiumDetailPage'
import { CompendiumItemsPage } from '@/pages/CompendiumItemsPage'
import { CompendiumsPage } from '@/pages/CompendiumsPage'
import { CourseSelectorPage } from '@/pages/CourseSelectorPage'
import { ExamResultsPage } from '@/pages/ExamResultsPage'
import { ExamSessionPage } from '@/pages/ExamSessionPage'
import { ExamSetupPage } from '@/pages/ExamSetupPage'
import { FlashcardsResultsPage } from '@/pages/FlashcardsResultsPage'
import { FlashcardsSessionPage } from '@/pages/FlashcardsSessionPage'
import { FlashcardsSetupPage } from '@/pages/FlashcardsSetupPage'
import { FlashcardsStatsPage } from '@/pages/FlashcardsStatsPage'
import { HomePage } from '@/pages/HomePage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<CourseSelectorPage />} />
      <Route path="/:course" element={<CourseLayout />}>
        <Route index element={<HomePage />} />
        <Route path="flashcards" element={<FlashcardsSetupPage />} />
        <Route path="flashcards/session" element={<FlashcardsSessionPage />} />
        <Route path="flashcards/results" element={<FlashcardsResultsPage />} />
        <Route path="flashcards/stats" element={<FlashcardsStatsPage />} />
        <Route path="compendiums" element={<CompendiumsPage />} />
        <Route path="compendiums/:compendium" element={<CompendiumItemsPage />} />
        <Route path="compendiums/:compendium/:id" element={<CompendiumDetailPage />} />
        <Route path="exams" element={<ExamSetupPage />} />
        <Route path="exams/session" element={<ExamSessionPage />} />
        <Route path="exams/results" element={<ExamResultsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
