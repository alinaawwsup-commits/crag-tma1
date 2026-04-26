import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Session, UserProfile, Challenge, TabId } from '../types'

interface StoreState {
  profile: UserProfile | null
  sessions: Session[]
  challenges: Challenge[]
  activeTab: TabId
  setProfile: (profile: UserProfile) => void
  addSession: (session: Session) => void
  deleteSession: (id: string) => void
  setActiveTab: (tab: TabId) => void
  initFromTelegram: () => void
  updateChallenges: () => void
}

const SAMPLE_CHALLENGES: Challenge[] = [
  {
    id: 'ch1',
    title: 'Первая 7а',
    description: 'Пройди маршрут категории 7а или выше',
    targetGrade: '7a',
    progress: 0,
    total: 1,
    completed: false,
  },
  {
    id: 'ch2',
    title: '10 сессий в месяц',
    description: 'Лазай регулярно — 10 тренировок за 30 дней',
    targetSessions: 10,
    progress: 0,
    total: 10,
    completed: false,
  },
  {
    id: 'ch3',
    title: 'Разнообразие',
    description: 'Пройди маршруты 5 разных категорий за неделю',
    progress: 0,
    total: 5,
    completed: false,
  },
]

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      profile: null,
      sessions: [],
      challenges: SAMPLE_CHALLENGES,
      activeTab: 'dashboard',

      setProfile: (profile) => set({ profile }),

      addSession: (session) => {
        set((s) => ({ sessions: [session, ...s.sessions] }))
        get().updateChallenges()
      },

      deleteSession: (id) =>
        set((s) => ({ sessions: s.sessions.filter((s2) => s2.id !== id) })),

      setActiveTab: (tab) => set({ activeTab: tab }),

      initFromTelegram: () => {
        const tg = window.Telegram?.WebApp
        if (!tg) return
        const user = tg.initDataUnsafe?.user
        if (!user) return

        const existing = get().profile
        if (existing) return

        set({
          profile: {
            telegramId: user.id,
            name: user.first_name + (user.last_name ? ` ${user.last_name}` : ''),
            username: user.username,
            avatar: user.photo_url,
            sport: 'climbing',
            startDate: new Date().toISOString(),
            currentLevel: '6a',
            targetLevel: '7a',
          },
        })
      },

      updateChallenges: () => {
        const { sessions, challenges } = get()
        const now = new Date()
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

        const gradeOrder: Record<string, number> = {
          '5a':0,'5b':1,'5c':2,'6a':3,'6a+':4,'6b':5,'6b+':6,
          '6c':7,'6c+':8,'7a':9,'7a+':10,'7b':11,'7b+':12,
          '7c':13,'7c+':14,'8a':15,'8a+':16,'8b':17,'8b+':18,
          '8c':19,'8c+':20,'9a':21,
        }

        const recentSessions = sessions.filter((s) => new Date(s.date) >= thirtyDaysAgo)
        const allRoutes = sessions.flatMap((s) => s.routes)
        const successRoutes = allRoutes.filter((r) => r.outcome === 'flash' || r.outcome === 'redpoint')

        const updated = challenges.map((c) => {
          if (c.id === 'ch1') {
            const done = successRoutes.some((r) => gradeOrder[r.grade] >= gradeOrder['7a'])
            return { ...c, progress: done ? 1 : 0, completed: done }
          }
          if (c.id === 'ch2') {
            const prog = Math.min(recentSessions.length, 10)
            return { ...c, progress: prog, completed: prog >= 10 }
          }
          if (c.id === 'ch3') {
            const grades = new Set(recentSessions.flatMap((s) => s.routes.map((r) => r.grade)))
            const prog = Math.min(grades.size, 5)
            return { ...c, progress: prog, completed: prog >= 5 }
          }
          return c
        })

        set({ challenges: updated })
      },
    }),
    {
      name: 'crag-storage',
      partialize: (state) => ({
        profile: state.profile,
        sessions: state.sessions,
        challenges: state.challenges,
      }),
    }
  )
)
