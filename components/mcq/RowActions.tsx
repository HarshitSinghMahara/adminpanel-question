'use client'

import { Eye, Trash2 } from 'lucide-react'

interface RowActionsProps {
  onPreview: () => void
  onDelete: () => void
}

export default function RowActions({ onPreview, onDelete }: RowActionsProps) {
  const handleDelete = () => {
    if (window.confirm('Delete this question? This cannot be undone.')) {
      onDelete()
    }
  }

  return (
    <div
      style={{
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
        gap: 6,
        justifyContent: 'center',
      }}
    >
      {/* Preview */}
      <button
        type="button"
        onClick={onPreview}
        title="Preview question"
        className="btn-icon"
      >
        <Eye size={15} />
      </button>

      {/* Delete */}
      <button
        type="button"
        onClick={handleDelete}
        title="Delete question"
        className="btn-icon"
        style={{
          color: 'var(--red)',
          opacity: 0.6,
          transition: 'opacity 0.15s',
        }}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLElement).style.opacity = '1')
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLElement).style.opacity = '0.6')
        }
      >
        <Trash2 size={15} />
      </button>
    </div>
  )
}
