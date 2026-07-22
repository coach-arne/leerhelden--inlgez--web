const STORAGE_KEY = 'pinned-courses'

function isStringArray(x: unknown): x is string[] {
  return Array.isArray(x) && x.every((s) => typeof s === 'string')
}

function parsePinnedCourses(raw: string | null): string[] {
  if (!raw) return []
  try {
    const data = JSON.parse(raw) as unknown
    return isStringArray(data) ? data : []
  } catch {
    return []
  }
}

export function loadPinnedCourses(): string[] {
  if (typeof window === 'undefined') return []
  return parsePinnedCourses(localStorage.getItem(STORAGE_KEY))
}

export function savePinnedCourses(slugs: string[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs))
}

export function togglePinnedCourse(slug: string, current: string[]): string[] {
  if (current.includes(slug)) {
    return current.filter((s) => s !== slug)
  }
  return [slug, ...current]
}
