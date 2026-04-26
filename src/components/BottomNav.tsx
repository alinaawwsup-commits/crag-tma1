import type { ElementType } from 'react'
import { Mountain, PlusCircle, TrendingUp, Users, User } from 'lucide-react'
import { useStore } from '../store/useStore'
import type { TabId } from '../types'
import { haptic } from '../lib/tma'

const tabs: { id: TabId; icon: ElementType; label: string }[] = [
  { id: 'dashboard', icon: Mountain, label: 'Главная' },
  { id: 'log', icon: PlusCircle, label: 'Запись' },
  { id: 'progress', icon: TrendingUp, label: 'Прогресс' },
  { id: 'community', icon: Users, label: 'Комьюнити' },
  { id: 'profile', icon: User, label: 'Профиль' },
]

export function BottomNav() {
  const { activeTab, setActiveTab } = useStore()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 border-t flex"
      style={{
        backgroundColor: 'var(--tg-theme-secondary-bg-color, #f8f8f8)',
        borderColor: 'rgba(0,0,0,0.08)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {tabs.map(({ id, icon: Icon, label }) => {
        const active = activeTab === id
        return (
          <button
            key={id}
            onClick={() => {
              haptic('light')
              setActiveTab(id)
            }}
            className="flex-1 flex flex-col items-center justify-center py-2 gap-0.5 transition-opacity"
            style={{ opacity: active ? 1 : 0.45 }}
          >
            <Icon
              size={22}
              color={active ? '#1D9E75' : 'var(--tg-theme-text-color, #000)'}
              strokeWidth={active ? 2.2 : 1.8}
            />
            <span
              className="text-[10px] font-medium"
              style={{ color: active ? '#1D9E75' : 'var(--tg-theme-hint-color, #999)' }}
            >
              {label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
