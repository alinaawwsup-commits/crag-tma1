import { useStore } from '../store/useStore'
import { SessionCard } from '../components/SessionCard'
import { EmptyState } from '../components/EmptyState'
import { GradeTag } from '../components/GradeTag'
import type { ClimbingGrade } from '../types'
import { haptic, showConfirm } from '../lib/tma'

export function Dashboard() {
  const { profile, sessions, challenges, deleteSession, setActiveTab } = useStore()
  const recentSessions = sessions.slice(0, 5)
  const totalRoutes = sessions.flatMap((s) => s.routes).length
  const successRoutes = sessions
    .flatMap((s) => s.routes)
    .filter((r) => r.outcome === 'flash' || r.outcome === 'redpoint').length

  const handleDelete = (id: string) => {
    showConfirm('Удалить эту сессию?', (ok) => {
      if (ok) {
        haptic('medium')
        deleteSession(id)
      }
    })
  }

  return (
    <div className="px-4 pt-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--tg-theme-text-color)' }}>
          {profile ? `Привет, ${profile.name.split(' ')[0]} 🧗` : 'Crag 🧗'}
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--tg-theme-hint-color)' }}>
          {sessions.length === 0
            ? 'Начни логировать первую сессию'
            : `${sessions.length} сессий · ${totalRoutes} маршрутов`}
        </p>
      </div>

      {sessions.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: 'Сессий', value: sessions.length },
            { label: 'Пройдено', value: successRoutes },
            { label: 'Текущий уровень', value: profile?.currentLevel ?? '6a', isGrade: true },
          ].map(({ label, value, isGrade }) => (
            <div
              key={label}
              className="rounded-2xl p-3 text-center"
              style={{ backgroundColor: 'var(--tg-theme-secondary-bg-color, #f5f5f5)' }}
            >
              <div className="flex justify-center mb-1">
                {isGrade ? (
                  <GradeTag grade={value as ClimbingGrade} size="md" />
                ) : (
                  <span className="text-xl font-bold" style={{ color: 'var(--tg-theme-text-color)' }}>
                    {value}
                  </span>
                )}
              </div>
              <p className="text-[10px]" style={{ color: 'var(--tg-theme-hint-color)' }}>{label}</p>
            </div>
          ))}
        </div>
      )}

      {challenges.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold mb-3" style={{ color: 'var(--tg-theme-text-color)' }}>
            Активные челленджи
          </h2>
          <div className="space-y-2">
            {challenges.map((c) => (
              <div
                key={c.id}
                className="rounded-2xl p-3"
                style={{ backgroundColor: 'var(--tg-theme-secondary-bg-color, #f5f5f5)' }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium" style={{ color: 'var(--tg-theme-text-color)' }}>
                    {c.completed ? '✅ ' : ''}
                    {c.title}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--tg-theme-hint-color)' }}>
                    {c.progress}/{c.total}
                  </span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(0,0,0,0.08)' }}>
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${Math.min((c.progress / c.total) * 100, 100)}%`,
                      backgroundColor: c.completed ? '#1D9E75' : '#EF9F27',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-sm font-semibold mb-3" style={{ color: 'var(--tg-theme-text-color)' }}>
          Последние сессии
        </h2>
        {recentSessions.length === 0 ? (
          <EmptyState
            icon="🏔️"
            title="Нет записей"
            subtitle="Залезь первый раз и залогируй сессию"
            action={{ label: '+ Записать сессию', onClick: () => setActiveTab('log') }}
          />
        ) : (
          recentSessions.map((s) => (
            <SessionCard key={s.id} session={s} onDelete={() => handleDelete(s.id)} />
          ))
        )}
      </div>
    </div>
  )
}
