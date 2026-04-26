import type { ReactNode } from 'react'
import { BottomNav } from './BottomNav'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div
      className="flex flex-col h-screen overflow-hidden"
      style={{ backgroundColor: 'var(--tg-theme-bg-color, #fff)' }}
    >
      <main className="flex-1 overflow-y-auto overflow-x-hidden pb-20">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}
