'use client'

interface RowResizeHandleProps {
  onMouseDown: (e: React.MouseEvent) => void
}

/**
 * Thin drag strip rendered at the very bottom of a row.
 * Position the parent row with position: 'relative'.
 */
export default function RowResizeHandle({ onMouseDown }: RowResizeHandleProps) {
  return (
    <div
      onMouseDown={onMouseDown}
      title="Drag to resize row"
      style={{
        bottom: 0,
        cursor: 'ns-resize',
        height: 4,
        left: 0,
        position: 'absolute',
        right: 0,
        zIndex: 5,
        // Show a subtle highlight on hover
      }}
      onMouseEnter={(e) => {
        ;(e.currentTarget as HTMLElement).style.background = 'var(--accent)'
        ;(e.currentTarget as HTMLElement).style.opacity = '0.35'
      }}
      onMouseLeave={(e) => {
        ;(e.currentTarget as HTMLElement).style.background = 'transparent'
        ;(e.currentTarget as HTMLElement).style.opacity = '1'
      }}
    />
  )
}
