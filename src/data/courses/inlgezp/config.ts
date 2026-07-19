import type { CourseConfig } from '@/types/course'

export const inlgezpConfig: CourseConfig = {
  slug: 'inlgezp',
  name: 'Inleiding gezondheidspsychologie',
  shortName: 'Gezondheidspsychologie',
  description:
    'Interactief oefenen met de cursus PB0522-252633B. Flashcards, compendia en oefenexamens.',
  features: ['flashcards', 'compendiums', 'exams'],
  chapterCount: 14,
  themeLabels: {
    T1: 'Inleiding en achtergrond',
    T2: 'Stress en coping',
    T3: 'Leefstijl en gezondheidsgedrag',
    T4: 'Ziekte en medische zorg',
    T5: 'Chronische en levensbedreigende ziekten',
  },
}
