'use client'

import { X } from 'lucide-react'

interface TagChipProps {
  label: string
  onRemove?: () => void
  variant?: 'accent' | 'muted'
}

export default function TagChip({
  label,
  onRemove,
  variant = 'accent',
}: TagChipProps) {
  return (
    <span className={`chip chip-${variant}`} style={{ gap: 4 }}>
      {label}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          style={{
            alignItems: 'center',
            background: 'transparent',
            border: 'none',
            color: 'inherit',
            cursor: 'pointer',
            display: 'inline-flex',
            marginLeft: 2,
            opacity: 0.7,
            padding: 0,
          }}
          aria-label={`Remove ${label}`}
        >
          <X size={10} />
        </button>
      )}
    </span>
  )
}
