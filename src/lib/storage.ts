import type { Session } from '../types'

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function formatDate(isoString: string): string {
  const d = new Date(isoString)
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
}

export function formatDuration(min: number): string {
  if (min < 60) return `${min} мин`
  const h = Math.floor(min / 60)
  const m = min % 60
  return m > 0 ? `${h}ч ${m}м` : `${h}ч`
}

export function getTopGrade(session: Session): string | null {
  const gradeOrder: Record<string, number> = {
    '5a':0,'5b':1,'5c':2,'6a':3,'6a+':4,'6b':5,'6b+':6,
    '6c':7,'6c+':8,'7a':9,'7a+':10,'7b':11,'7b+':12,
    '7c':13,'7c+':14,'8a':15,'8a+':16,'8b':17,'8b+':18,
    '8c':19,'8c+':20,'9a':21,
  }

  const successRoutes = session.routes.filter(
    (r) => r.outcome === 'flash' || r.outcome === 'redpoint'
  )
  if (!successRoutes.length) return null

  return successRoutes.sort(
    (a, b) => (gradeOrder[b.grade] ?? 0) - (gradeOrder[a.grade] ?? 0)
  )[0].grade
}

export const GRADES = [
  '5a','5b','5c',
  '6a','6a+','6b','6b+','6c','6c+',
  '7a','7a+','7b','7b+','7c','7c+',
  '8a','8a+','8b','8b+','8c','8c+',
  '9a',
] as const

export const GRADE_COLORS: Record<string, string> = {
  '5a': '#9FE1CB', '5b': '#9FE1CB', '5c': '#9FE1CB',
  '6a': '#1D9E75', '6a+': '#1D9E75', '6b': '#1D9E75', '6b+': '#1D9E75',
  '6c': '#0F6E56', '6c+': '#0F6E56',
  '7a': '#EF9F27', '7a+': '#EF9F27', '7b': '#EF9F27', '7b+': '#EF9F27',
  '7c': '#D85A30', '7c+': '#D85A30',
  '8a': '#A32D2D', '8a+': '#A32D2D', '8b': '#A32D2D', '8b+': '#A32D2D',
  '8c': '#7F77DD', '8c+': '#7F77DD', '9a': '#26215C',
}
