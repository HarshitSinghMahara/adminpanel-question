'use client'

import { GripVertical } from 'lucide-react'

interface DragHandleProps {
  listeners?: Record<string, unknown>
  attributes?: Record<string, unknown>
}

export default function DragHandle({ listeners, attributes }: DragHandleProps) {
  return (
    <button
      type="button"
      style={{
        alignItems: 'center',
        background: 'transparent',
        border: 'none',
        color: 'var(--text-muted)',
        cursor: 'grab',
        display: 'inline-flex',
        justifyContent: 'center',
        opacity: 0.4,
        padding: '4px 2px',
        touchAction: 'none',
        transition: 'opacity 0.15s',
      }}
      onMouseEnter={(e) =>
        ((e.currentTarget as HTMLElement).style.opacity = '0.9')
      }
      onMouseLeave={(e) =>
        ((e.currentTarget as HTMLElement).style.opacity = '0.4')
      }
      {...listeners}
      {...attributes}
      aria-label="Drag to reorder"
    >
      <GripVertical size={16} />
    </button>
  )
}
