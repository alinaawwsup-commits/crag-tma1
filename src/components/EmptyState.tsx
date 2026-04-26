interface EmptyStateProps {
  icon: string
  title: string
  subtitle: string
  action?: { label: string; onClick: () => void }
}

export function EmptyState({ icon, title, subtitle, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
      <span className="text-5xl mb-4">{icon}</span>
      <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--tg-theme-text-color)' }}>
        {title}
      </h3>
      <p className="text-sm mb-6" style={{ color: 'var(--tg-theme-hint-color)' }}>{subtitle}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-3 rounded-2xl text-sm font-semibold text-white"
          style={{ backgroundColor: '#1D9E75' }}
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
