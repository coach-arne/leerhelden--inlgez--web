import { Navigate, Route, Routes } from 'react-router-dom'

import { FlashcardsResultsPage } from '@/pages/FlashcardsResultsPage'
import { FlashcardsSessionPage } from '@/pages/FlashcardsSessionPage'
import { FlashcardsSetupPage } from '@/pages/FlashcardsSetupPage'
import { HomePage } from '@/pages/HomePage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/flashcards" element={<FlashcardsSetupPage />} />
      <Route path="/flashcards/session" element={<FlashcardsSessionPage />} />
      <Route path="/flashcards/results" element={<FlashcardsResultsPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
