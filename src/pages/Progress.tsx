import { useStore } from '../store/useStore'
import { EmptyState } from '../components/EmptyState'
import { GradeTag } from '../components/GradeTag'
import { GRADES, GRADE_COLORS } from '../lib/storage'
import type { ClimbingGrade } from '../types'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'

export function Progress() {
  const { sessions, setActiveTab } = useStore()

  if (sessions.length === 0) {
    return (
      <EmptyState
        icon="📈"
        title="Нет данных"
        subtitle="Залогируй хотя бы одну сессию, чтобы увидеть прогресс"
        action={{ label: '+ Записать сессию', onClick: () => setActiveTab('log') }}
      />
    )
  }

  const allRoutes = sessions.flatMap((s) => s.routes)
  const gradeStats = GRADES.map((grade) => {
    const routesForGrade = allRoutes.filter((r) => r.grade === grade)
    const success = routesForGrade.filter(
      (r) => r.outcome === 'flash' || r.outcome === 'redpoint'
    ).length
    return { grade, total: routesForGrade.length, success }
  }).filter((g) => g.total > 0)

  const weeklyData = (() => {
    const map: Record<string, number> = {}
    sessions.forEach((s) => {
      const d = new Date(s.date)
      const week = `${d.getMonth() + 1}/${Math.ceil(d.getDate() / 7)}`
      map[week] = (map[week] ?? 0) + 1
    })
    return Object.entries(map)
      .slice(-8)
      .map(([week, count]) => ({ week, count }))
  })()

  const gradeOrder: Record<string, number> = {}
  GRADES.forEach((g, i) => {
    gradeOrder[g] = i
  })

  const bestRoute = allRoutes
    .filter((r) => r.outcome === 'flash' || r.outcome === 'redpoint')
    .sort((a, b) => (gradeOrder[b.grade] ?? 0) - (gradeOrder[a.grade] ?? 0))[0]

  const textColor = 'var(--tg-theme-text-color, #000)'
  const hintColor = 'var(--tg-theme-hint-color, #999)'
  const bgColor = 'var(--tg-theme-secondary-bg-color, #f5f5f5)'

  return (
    <div className="px-4 pt-6">
      <h1 className="text-2xl font-bold mb-6" style={{ color: textColor }}>
        Прогресс
      </h1>

      {bestRoute && (
        <div className="rounded-2xl p-4 mb-6" style={{ backgroundColor: bgColor }}>
          <p className="text-xs font-semibold mb-2" style={{ color: hintColor }}>
            ЛУЧШИЙ ПРОЙДЕННЫЙ МАРШРУТ
          </p>
          <div className="flex items-center gap-3">
            <GradeTag grade={bestRoute.grade as ClimbingGrade} size="lg" />
            <span className="text-sm" style={{ color: textColor }}>
              {bestRoute.outcome === 'flash' ? '⚡ Flash' : '🔴 Redpoint'}
            </span>
          </div>
        </div>
      )}

      {weeklyData.length > 1 && (
        <div className="rounded-2xl p-4 mb-6" style={{ backgroundColor: bgColor }}>
          <p className="text-xs font-semibold mb-3" style={{ color: hintColor }}>
            СЕССИИ ПО НЕДЕЛЯМ
          </p>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={weeklyData} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
              <XAxis dataKey="week" tick={{ fontSize: 10, fill: hintColor }} />
              <YAxis tick={{ fontSize: 10, fill: hintColor }} allowDecimals={false} />
              <Tooltip
                contentStyle={{ backgroundColor: bgColor, border: 'none', borderRadius: 12 }}
                labelStyle={{ color: textColor }}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]} fill="#1D9E75" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="rounded-2xl p-4 mb-6" style={{ backgroundColor: bgColor }}>
        <p className="text-xs font-semibold mb-3" style={{ color: hintColor }}>
          МАРШРУТЫ ПО КАТЕГОРИЯМ
        </p>
        <ResponsiveContainer width="100%" height={150}>
          <BarChart data={gradeStats} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
            <XAxis dataKey="grade" tick={{ fontSize: 9, fill: hintColor }} />
            <YAxis tick={{ fontSize: 10, fill: hintColor }} allowDecimals={false} />
            <Tooltip
              contentStyle={{ backgroundColor: bgColor, border: 'none', borderRadius: 12 }}
              labelStyle={{ color: textColor }}
            />
            <Bar dataKey="total" radius={[4, 4, 0, 0]} name="Всего">
              {gradeStats.map((entry) => (
                <Cell key={entry.grade} fill={GRADE_COLORS[entry.grade] ?? '#1D9E75'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mb-6">
        <p className="text-xs font-semibold mb-3" style={{ color: hintColor }}>
          SKILL MAP
        </p>
        <div className="flex flex-wrap gap-2">
          {GRADES.map((grade) => {
            const stat = gradeStats.find((g) => g.grade === grade)
            const hasSuccess = (stat?.success ?? 0) > 0
            return (
              <div
                key={grade}
                className="flex flex-col items-center"
                style={{ opacity: stat ? 1 : 0.25 }}
              >
                <GradeTag grade={grade as ClimbingGrade} size="sm" />
                {hasSuccess && (
                  <span className="text-[9px] mt-0.5" style={{ color: hintColor }}>
                    ✓
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
