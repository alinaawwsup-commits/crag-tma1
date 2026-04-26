import { useState } from 'react'
import { useStore } from '../store/useStore'
import { GradeTag } from '../components/GradeTag'
import { GRADES } from '../lib/storage'
import { haptic } from '../lib/tma'
import type { ClimbingGrade } from '../types'

export function Profile() {
  const { profile, sessions, setProfile } = useStore()
  const [editing, setEditing] = useState(false)
  const [currentLevel, setCurrentLevel] = useState<ClimbingGrade>(profile?.currentLevel ?? '6a')
  const [targetLevel, setTargetLevel] = useState<ClimbingGrade>(profile?.targetLevel ?? '7a')

  const totalSessions = sessions.length
  const totalRoutes = sessions.flatMap((s) => s.routes).length
  const totalMinutes = sessions.reduce((acc, s) => acc + s.durationMin, 0)
  const totalHours = Math.round(totalMinutes / 60)

  const textColor = 'var(--tg-theme-text-color, #000)'
  const hintColor = 'var(--tg-theme-hint-color, #999)'
  const bgColor = 'var(--tg-theme-secondary-bg-color, #f5f5f5)'

  const handleSave = () => {
    if (!profile) return
    haptic('success')
    setProfile({ ...profile, currentLevel, targetLevel })
    setEditing(false)
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-24 px-8">
        <span className="text-5xl mb-4">👤</span>
        <p className="text-lg font-semibold text-center" style={{ color: textColor }}>
          Открой приложение через Telegram, чтобы подгрузить профиль
        </p>
      </div>
    )
  }

  return (
    <div className="px-4 pt-6">
      <h1 className="text-2xl font-bold mb-6" style={{ color: textColor }}>Профиль</h1>

      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white" style={{ backgroundColor: '#1D9E75' }}>
          {profile.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-lg font-bold" style={{ color: textColor }}>{profile.name}</p>
          {profile.username && <p className="text-sm" style={{ color: hintColor }}>@{profile.username}</p>}
          <p className="text-xs mt-0.5" style={{ color: hintColor }}>🧗 Скалолазание</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Сессий', value: totalSessions },
          { label: 'Маршрутов', value: totalRoutes },
          { label: 'Часов', value: totalHours },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-2xl p-3 text-center" style={{ backgroundColor: bgColor }}>
            <p className="text-xl font-bold" style={{ color: textColor }}>{value}</p>
            <p className="text-[10px] mt-0.5" style={{ color: hintColor }}>{label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl p-4 mb-4" style={{ backgroundColor: bgColor }}>
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-semibold" style={{ color: hintColor }}>МОЙ УРОВЕНЬ</p>
          <button onClick={() => (editing ? handleSave() : setEditing(true))} className="text-xs font-semibold" style={{ color: '#1D9E75' }}>
            {editing ? 'Сохранить' : 'Изменить'}
          </button>
        </div>

        {editing ? (
          <div className="space-y-3">
            <div>
              <p className="text-xs mb-1" style={{ color: hintColor }}>Текущий уровень</p>
              <div className="flex flex-wrap gap-1.5">
                {GRADES.map((g) => (
                  <button
                    key={g}
                    onClick={() => setCurrentLevel(g as ClimbingGrade)}
                    className="rounded-md px-2 py-1 text-xs font-bold text-white transition-transform"
                    style={{
                      backgroundColor: currentLevel === g ? '#1D9E75' : '#ccc',
                      transform: currentLevel === g ? 'scale(1.1)' : 'scale(1)',
                    }}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs mb-1" style={{ color: hintColor }}>Цель</p>
              <div className="flex flex-wrap gap-1.5">
                {GRADES.map((g) => (
                  <button
                    key={g}
                    onClick={() => setTargetLevel(g as ClimbingGrade)}
                    className="rounded-md px-2 py-1 text-xs font-bold text-white transition-transform"
                    style={{
                      backgroundColor: targetLevel === g ? '#EF9F27' : '#ccc',
                      transform: targetLevel === g ? 'scale(1.1)' : 'scale(1)',
                    }}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-xs mb-1" style={{ color: hintColor }}>Сейчас</p>
              <GradeTag grade={profile.currentLevel} size="lg" />
            </div>
            <div className="text-2xl" style={{ color: hintColor }}>→</div>
            <div className="text-center">
              <p className="text-xs mb-1" style={{ color: hintColor }}>Цель</p>
              <GradeTag grade={profile.targetLevel} size="lg" />
            </div>
          </div>
        )}
      </div>

      <p className="text-xs text-center mt-6" style={{ color: hintColor }}>
        Crag v1.0 · Твой спорт, твой прогресс 🧗
      </p>
    </div>
  )
}
