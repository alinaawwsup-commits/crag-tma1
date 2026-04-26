import { MapPin, Users, Star } from 'lucide-react'

const SPOTS = [
  { name: 'Движение Яуза', city: 'Москва', type: 'Скалодром', users: 234, rating: 4.8 },
  { name: 'Лебедев', city: 'Москва', type: 'Скалодром', users: 189, rating: 4.7 },
  { name: 'BigStone', city: 'СПб', type: 'Скалодром', users: 156, rating: 4.6 },
  { name: 'Столбы', city: 'Красноярск', type: 'Скалы', users: 320, rating: 4.9 },
  { name: 'Бойцовский клуб', city: 'Москва', type: 'Зал единоборств', users: 98, rating: 4.5 },
]

const CHALLENGES_GLOBAL = [
  { title: '🏆 Апрельский кубок', subtitle: 'Лучший маршрут за апрель', participants: 48, daysLeft: 3 },
  { title: '🔥 10 сессий за 30 дней', subtitle: 'Регулярность решает', participants: 124, daysLeft: 18 },
  { title: '⚡ Flash-марафон', subtitle: '5 флэшей за неделю', participants: 31, daysLeft: 5 },
]

export function Community() {
  const textColor = 'var(--tg-theme-text-color, #000)'
  const hintColor = 'var(--tg-theme-hint-color, #999)'
  const bgColor = 'var(--tg-theme-secondary-bg-color, #f5f5f5)'

  return (
    <div className="px-4 pt-6">
      <h1 className="text-2xl font-bold mb-6" style={{ color: textColor }}>
        Комьюнити
      </h1>

      <p className="text-xs font-semibold mb-3" style={{ color: hintColor }}>
        АКТИВНЫЕ ЧЕЛЛЕНДЖИ
      </p>
      <div className="space-y-2 mb-6">
        {CHALLENGES_GLOBAL.map((c) => (
          <div key={c.title} className="rounded-2xl p-4" style={{ backgroundColor: bgColor }}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold" style={{ color: textColor }}>{c.title}</p>
                <p className="text-xs mt-0.5" style={{ color: hintColor }}>{c.subtitle}</p>
              </div>
              <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ backgroundColor: '#E1F5EE', color: '#0F6E56' }}>
                {c.daysLeft}д осталось
              </span>
            </div>
            <div className="flex items-center gap-1 mt-2">
              <Users size={12} style={{ color: hintColor }} />
              <span className="text-xs" style={{ color: hintColor }}>{c.participants} участников</span>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs font-semibold mb-3" style={{ color: hintColor }}>
        ПОПУЛЯРНЫЕ СПОТЫ
      </p>
      <div className="space-y-2 mb-6">
        {SPOTS.map((spot) => (
          <div key={spot.name} className="rounded-2xl p-4 flex items-center gap-3" style={{ backgroundColor: bgColor }}>
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: '#E1F5EE' }}
            >
              <MapPin size={18} color="#1D9E75" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate" style={{ color: textColor }}>
                {spot.name}
              </p>
              <p className="text-xs" style={{ color: hintColor }}>
                {spot.city} · {spot.type}
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="flex items-center gap-1 justify-end">
                <Star size={12} color="#EF9F27" fill="#EF9F27" />
                <span className="text-xs font-semibold" style={{ color: textColor }}>{spot.rating}</span>
              </div>
              <p className="text-xs" style={{ color: hintColor }}>{spot.users} чел.</p>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-center" style={{ color: hintColor }}>
        Полный каталог спотов — скоро 🗺️
      </p>
    </div>
  )
}
