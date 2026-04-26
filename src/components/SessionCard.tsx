import { MapPin, Clock, Flame } from 'lucide-react'
import type { Session, ClimbingGrade } from '../types'
import { GradeTag } from './GradeTag'
import { formatDate, formatDuration, getTopGrade } from '../lib/storage'

interface SessionCardProps {
  session: Session
  onDelete?: () => void
}

export function SessionCard({ session, onDelete }: SessionCardProps) {
  const topGrade = getTopGrade(session)
  const successCount = session.routes.filter(
    (r) => r.outcome === 'flash' || r.outcome === 'redpoint'
  ).length

  return (
    <div
      className="rounded-2xl p-4 mb-3"
      style={{ backgroundColor: 'var(--tg-theme-secondary-bg-color, #f5f5f5)' }}
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <span className="text-sm font-semibold" style={{ color: 'var(--tg-theme-text-color)' }}>
            {formatDate(session.date)}
          </span>
          {topGrade && (
            <div className="mt-1">
              <GradeTag grade={topGrade as ClimbingGrade} size="sm" />
              <span className="text-xs ml-1" style={{ color: 'var(--tg-theme-hint-color)' }}>
                топ маршрут
              </span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Flame
              key={i}
              size={12}
              color={i < session.energy ? '#EF9F27' : '#e0e0e0'}
              fill={i < session.energy ? '#EF9F27' : 'none'}
            />
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--tg-theme-hint-color)' }}>
        <span className="flex items-center gap-1"><MapPin size={12} />{session.location}</span>
        <span className="flex items-center gap-1"><Clock size={12} />{formatDuration(session.durationMin)}</span>
        <span>{successCount}/{session.routes.length} маршрутов</span>
      </div>

      {session.notes && (
        <p className="mt-2 text-xs italic" style={{ color: 'var(--tg-theme-hint-color)' }}>
          {session.notes}
        </p>
      )}

      {onDelete && (
        <button onClick={onDelete} className="mt-3 text-xs text-red-400 underline">
          Удалить
        </button>
      )}
    </div>
  )
}
