import type { CourseConfig } from '@/types/course'

export const klinpsy1aConfig: CourseConfig = {
  slug: 'klinpsy1a',
  name: 'Klinische Psychologie 1A',
  shortName: 'Klinische Psychologie 1A',
  description:
    'Interactief oefenen met de cursus PB3002-262711B. Flashcards, compendia en oefenexamens.',
  features: ['flashcards', 'compendiums', 'exams'],
  chapterCount: 14,
  themeLabels: {
    T1: 'Wat is klinische psychologie?',
    T2: 'Persoonlijkheidsleer',
    T3: 'Theoretische referentiekaders',
    T4: 'Classificatie en diagnostiek',    
  },
}
