import type { ClimbingGrade } from '../types'
import { GRADE_COLORS } from '../lib/storage'

interface GradeTagProps {
  grade: ClimbingGrade
  size?: 'sm' | 'md' | 'lg'
}

export function GradeTag({ grade, size = 'md' }: GradeTagProps) {
  const bg = GRADE_COLORS[grade] ?? '#999'
  const sizeClass = size === 'sm'
    ? 'text-[10px] px-1.5 py-0.5'
    : size === 'lg'
      ? 'text-base px-3 py-1.5'
      : 'text-xs px-2 py-1'

  return (
    <span
      className={`inline-block rounded-md font-bold text-white ${sizeClass}`}
      style={{ backgroundColor: bg }}
    >
      {grade}
    </span>
  )
}
