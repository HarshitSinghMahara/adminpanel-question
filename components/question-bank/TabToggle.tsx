'use client'

type Tab = 'MCQ' | 'Subjective'

interface TabToggleProps {
  active: Tab
  onChange: (tab: Tab) => void
}

export default function TabToggle({ active, onChange }: TabToggleProps) {
  return (
    <div
      style={{
        background: 'var(--surface-2)',
        border: '1px solid var(--border)',
        borderRadius: 999,
        display: 'inline-flex',
        gap: 2,
        padding: 3,
      }}
    >
      {(['MCQ', 'Subjective'] as const).map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => onChange(tab)}
          style={{
            background: active === tab ? 'var(--surface)' : 'transparent',
            border: 'none',
            borderRadius: 999,
            boxShadow: active === tab ? '0 1px 4px rgba(15,23,42,0.10)' : 'none',
            color: active === tab ? 'var(--accent)' : 'var(--text-muted)',
            cursor: 'pointer',
            fontSize: '0.95rem',
            fontWeight: 600,
            letterSpacing: '-0.01em',
            padding: '8px 26px',
            transition: 'all 0.18s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {tab}
        </button>
      ))}
    </div>
  )
}
