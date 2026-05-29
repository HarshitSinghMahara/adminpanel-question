'use client'

import type { ColDef } from '@/hooks/useColumnResize'

interface TableHeaderProps {
  columns: ColDef[]
  widths: number[]
  gridTemplate: string
  onStartResize: (colIndex: number, startX: number) => void
}

export default function TableHeader({
  columns,
  widths,
  gridTemplate,
  onStartResize,
}: TableHeaderProps) {
  return (
    <div
      style={{
        background: 'var(--surface)',
        borderBottom: '2px solid var(--border)',
        display: 'grid',
        gridTemplateColumns: gridTemplate,
        position: 'sticky',
        top: 0,
        userSelect: 'none',
        zIndex: 12,
      }}
    >
      {columns.map((col, i) => (
        <div
          key={i}
          style={{
            alignItems: 'center',
            borderRight: i < columns.length - 1 ? '1px solid var(--border)' : 'none',
            display: 'flex',
            justifyContent: i <= 1 ? 'center' : 'flex-start',
            overflow: 'hidden',
            padding: '10px 14px',
            position: 'relative',
          }}
        >
          <span
            style={{
              color: 'var(--text-muted)',
              fontSize: '0.68rem',
              fontWeight: 700,
              letterSpacing: '0.06em',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
            }}
          >
            {col.name}
          </span>

          {/* Resize handle — only for resizable columns */}
          {!col.fixed && (
            <div
              title="Drag to resize"
              onMouseDown={(e) => {
                e.preventDefault()
                onStartResize(i, e.clientX)
              }}
              style={{
                background: 'transparent',
                bottom: 0,
                cursor: 'col-resize',
                position: 'absolute',
                right: 0,
                top: 0,
                transition: 'background 0.1s',
                width: 6,
                zIndex: 1,
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLElement).style.background =
                  'var(--accent)'
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLElement).style.background =
                  'transparent'
              }}
            />
          )}
        </div>
      ))}
    </div>
  )
}
