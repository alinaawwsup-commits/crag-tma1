import { useState } from 'react'
import { Plus, Trash2, ChevronDown } from 'lucide-react'
import { useStore } from '../store/useStore'
import { GRADES, generateId } from '../lib/storage'
import { haptic } from '../lib/tma'
import type { Route, SessionOutcome, ClimbingGrade } from '../types'

const OUTCOMES: { id: SessionOutcome; label: string; emoji: string }[] = [
  { id: 'flash', label: 'Flash', emoji: '⚡' },
  { id: 'redpoint', label: 'Redpoint', emoji: '🔴' },
  { id: 'project', label: 'Проект', emoji: '🎯' },
  { id: 'fell', label: 'Упал', emoji: '💥' },
]

function RouteRow({
  route,
  onChange,
  onDelete,
}: {
  route: Route
  onChange: (r: Route) => void
  onDelete: () => void
}) {
  return (
    <div className="rounded-2xl p-3 mb-2" style={{ backgroundColor: 'var(--tg-theme-secondary-bg-color, #f5f5f5)' }}>
      <div className="flex items-center gap-2 mb-2">
        <div className="relative flex-1">
          <select
            value={route.grade}
            onChange={(e) => onChange({ ...route, grade: e.target.value as ClimbingGrade })}
            className="w-full appearance-none rounded-xl px-3 py-2 text-sm font-semibold pr-8"
            style={{
              backgroundColor: 'var(--tg-theme-bg-color, #fff)',
              color: 'var(--tg-theme-text-color)',
              border: '1px solid rgba(0,0,0,0.1)',
            }}
          >
            {GRADES.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-2 top-3 pointer-events-none" style={{ color: 'var(--tg-theme-hint-color)' }} />
        </div>

        <div className="relative flex-1">
          <select
            value={route.outcome}
            onChange={(e) => onChange({ ...route, outcome: e.target.value as SessionOutcome })}
            className="w-full appearance-none rounded-xl px-3 py-2 text-sm pr-8"
            style={{
              backgroundColor: 'var(--tg-theme-bg-color, #fff)',
              color: 'var(--tg-theme-text-color)',
              border: '1px solid rgba(0,0,0,0.1)',
            }}
          >
            {OUTCOMES.map((o) => (
              <option key={o.id} value={o.id}>{o.emoji} {o.label}</option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-2 top-3 pointer-events-none" style={{ color: 'var(--tg-theme-hint-color)' }} />
        </div>

        <button onClick={onDelete} className="p-1.5 rounded-lg" style={{ color: '#D85A30' }}>
          <Trash2 size={16} />
        </button>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs" style={{ color: 'var(--tg-theme-hint-color)' }}>Попытки:</span>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            onClick={() => onChange({ ...route, attempts: n })}
            className="w-7 h-7 rounded-full text-xs font-semibold"
            style={{
              backgroundColor: route.attempts === n ? '#1D9E75' : 'var(--tg-theme-bg-color, #fff)',
              color: route.attempts === n ? '#fff' : 'var(--tg-theme-text-color)',
              border: '1px solid rgba(0,0,0,0.1)',
            }}
          >
            {n}
          </button>
        ))}
        <span className="text-xs" style={{ color: 'var(--tg-theme-hint-color)' }}>5+</span>
      </div>
    </div>
  )
}

export function Log() {
  const { addSession, setActiveTab } = useStore()

  const [location, setLocation] = useState('')
  const [duration, setDuration] = useState(90)
  const [energy, setEnergy] = useState<1 | 2 | 3 | 4 | 5>(3)
  const [notes, setNotes] = useState('')
  const [routes, setRoutes] = useState<Route[]>([
    { id: generateId(), grade: '6b', outcome: 'redpoint', attempts: 1 },
  ])
  const [saved, setSaved] = useState(false)

  const addRoute = () => {
    haptic('light')
    setRoutes((prev) => [
      ...prev,
      { id: generateId(), grade: '6b', outcome: 'redpoint', attempts: 1 },
    ])
  }

  const updateRoute = (id: string, r: Route) => {
    setRoutes((prev) => prev.map((x) => (x.id === id ? r : x)))
  }

  const deleteRoute = (id: string) => {
    setRoutes((prev) => prev.filter((x) => x.id !== id))
  }

  const handleSave = () => {
    if (!location.trim()) {
      haptic('error')
      return
    }

    haptic('success')
    addSession({
      id: generateId(),
      date: new Date().toISOString(),
      sport: 'climbing',
      location: location.trim(),
      durationMin: duration,
      routes,
      energy,
      notes: notes.trim() || undefined,
      createdAt: new Date().toISOString(),
    })

    setSaved(true)
    setTimeout(() => {
      setSaved(false)
      setLocation('')
      setDuration(90)
      setEnergy(3)
      setNotes('')
      setRoutes([{ id: generateId(), grade: '6b', outcome: 'redpoint', attempts: 1 }])
      setActiveTab('dashboard')
    }, 1200)
  }

  if (saved) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-24">
        <span className="text-6xl mb-4">✅</span>
        <p className="text-xl font-bold" style={{ color: 'var(--tg-theme-text-color)' }}>
          Сессия сохранена!
        </p>
      </div>
    )
  }

  const inputStyle = {
    backgroundColor: 'var(--tg-theme-secondary-bg-color, #f5f5f5)',
    color: 'var(--tg-theme-text-color)',
    border: 'none',
    outline: 'none',
  }

  return (
    <div className="px-4 pt-6 pb-8">
      <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--tg-theme-text-color)' }}>
        Новая сессия
      </h1>

      <label className="block mb-4">
        <span className="text-xs font-semibold mb-1 block" style={{ color: 'var(--tg-theme-hint-color)' }}>
          МЕСТО / СКАЛОДРОМ
        </span>
        <input
          type="text"
          placeholder="Например: Движение, Лебедев..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full rounded-2xl px-4 py-3 text-sm"
          style={inputStyle}
        />
      </label>

      <label className="block mb-4">
        <span className="text-xs font-semibold mb-1 block" style={{ color: 'var(--tg-theme-hint-color)' }}>
          ДЛИТЕЛЬНОСТЬ: {duration} мин
        </span>
        <input
          type="range"
          min={30}
          max={240}
          step={15}
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          className="w-full accent-[#1D9E75]"
        />
        <div className="flex justify-between text-xs mt-1" style={{ color: 'var(--tg-theme-hint-color)' }}>
          <span>30 мин</span><span>4 часа</span>
        </div>
      </label>

      <div className="mb-4">
        <span className="text-xs font-semibold mb-2 block" style={{ color: 'var(--tg-theme-hint-color)' }}>
          ЭНЕРГИЯ / САМОЧУВСТВИЕ
        </span>
        <div className="flex gap-2">
          {([1, 2, 3, 4, 5] as const).map((n) => (
            <button
              key={n}
              onClick={() => setEnergy(n)}
              className="flex-1 py-2 rounded-xl text-sm font-semibold transition-all"
              style={{
                backgroundColor: energy === n ? '#EF9F27' : 'var(--tg-theme-secondary-bg-color, #f5f5f5)',
                color: energy === n ? '#fff' : 'var(--tg-theme-text-color)',
              }}
            >
              {n}
            </button>
          ))}
        </div>
        <div className="flex justify-between text-xs mt-1" style={{ color: 'var(--tg-theme-hint-color)' }}>
          <span>Плохо</span><span>Отлично</span>
        </div>
      </div>

      <div className="mb-4">
        <span className="text-xs font-semibold mb-2 block" style={{ color: 'var(--tg-theme-hint-color)' }}>
          МАРШРУТЫ ({routes.length})
        </span>
        {routes.map((r) => (
          <RouteRow
            key={r.id}
            route={r}
            onChange={(updated) => updateRoute(r.id, updated)}
            onDelete={() => deleteRoute(r.id)}
          />
        ))}
        <button
          onClick={addRoute}
          className="w-full py-3 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 mt-2"
          style={{
            backgroundColor: 'var(--tg-theme-secondary-bg-color, #f5f5f5)',
            color: '#1D9E75',
            border: '1.5px dashed #1D9E75',
          }}
        >
          <Plus size={16} /> Добавить маршрут
        </button>
      </div>

      <label className="block mb-6">
        <span className="text-xs font-semibold mb-1 block" style={{ color: 'var(--tg-theme-hint-color)' }}>
          ЗАМЕТКИ (необязательно)
        </span>
        <textarea
          placeholder="Что было важным сегодня?"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="w-full rounded-2xl px-4 py-3 text-sm resize-none"
          style={inputStyle}
        />
      </label>

      <button
        onClick={handleSave}
        disabled={!location.trim()}
        className="w-full py-4 rounded-2xl text-base font-bold text-white transition-opacity"
        style={{
          backgroundColor: '#1D9E75',
          opacity: location.trim() ? 1 : 0.4,
        }}
      >
        Сохранить сессию
      </button>
    </div>
  )
}
