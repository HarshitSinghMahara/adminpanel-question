'use client'

type Difficulty = 'Easy' | 'Medium' | 'Hard'

interface DifficultySelectorProps {
  value: Difficulty
  onChange: (v: Difficulty) => void
  size?: 'sm' | 'md'
}

const pills: { label: Difficulty; activeColor: string; activeBg: string }[] = [
  { label: 'Easy',   activeColor: 'var(--green)', activeBg: 'var(--green-dim)' },
  { label: 'Medium', activeColor: 'var(--amber)', activeBg: 'var(--amber-dim)' },
  { label: 'Hard',   activeColor: 'var(--red)',   activeBg: 'var(--red-dim)' },
]

export default function DifficultySelector({
  value,
  onChange,
  size = 'sm',
}: DifficultySelectorProps) {
  return (
    <div style={{ display: 'flex', gap: 3 }}>
      {pills.map((pill) => {
        const isActive = value === pill.label
        return (
          <button
            key={pill.label}
            type="button"
            onClick={() => onChange(pill.label)}
            style={{
              background: isActive ? pill.activeBg : 'transparent',
              border: `1px solid ${isActive ? pill.activeColor : 'var(--border)'}`,
              borderRadius: 999,
              color: isActive ? pill.activeColor : 'var(--text-muted)',
              cursor: 'pointer',
              fontSize: size === 'sm' ? '0.66rem' : '0.74rem',
              fontWeight: 600,
              padding: size === 'sm' ? '2px 8px' : '3px 12px',
              transition: 'all 0.15s',
              whiteSpace: 'nowrap',
            }}
          >
            {pill.label}
          </button>
        )
      })}
    </div>
  )
}
