export type Sport = 'climbing' | 'surfing' | 'bjj'

export type ClimbingGrade =
  | '5a' | '5b' | '5c'
  | '6a' | '6a+' | '6b' | '6b+' | '6c' | '6c+'
  | '7a' | '7a+' | '7b' | '7b+' | '7c' | '7c+'
  | '8a' | '8a+' | '8b' | '8b+' | '8c' | '8c+'
  | '9a'

export type SessionOutcome = 'flash' | 'redpoint' | 'project' | 'fell'

export interface Route {
  id: string
  grade: ClimbingGrade
  name?: string
  outcome: SessionOutcome
  attempts: number
  notes?: string
}

export interface Session {
  id: string
  date: string
  sport: Sport
  location: string
  durationMin: number
  routes: Route[]
  energy: 1 | 2 | 3 | 4 | 5
  notes?: string
  createdAt: string
}

export interface UserProfile {
  telegramId?: number
  name: string
  username?: string
  avatar?: string
  sport: Sport
  startDate: string
  currentLevel: ClimbingGrade
  targetLevel: ClimbingGrade
}

export interface Challenge {
  id: string
  title: string
  description: string
  targetGrade?: ClimbingGrade
  targetSessions?: number
  progress: number
  total: number
  completed: boolean
  expiresAt?: string
}

export interface AppState {
  profile: UserProfile | null
  sessions: Session[]
  challenges: Challenge[]
  activeTab: TabId
}

export type TabId = 'dashboard' | 'log' | 'progress' | 'community' | 'profile'
