import { useState, useCallback, useRef } from 'react'

export interface ColDef {
  name: string
  defaultWidth: number
  minWidth: number
  fixed?: boolean // if true, cannot be resized
}

function loadWidths(storageKey: string, columns: ColDef[]): number[] {
  try {
    const raw = localStorage.getItem(storageKey)
    if (raw) {
      const parsed: number[] = JSON.parse(raw)
      // Only use stored widths if column count matches
      if (Array.isArray(parsed) && parsed.length === columns.length) {
        return parsed.map((w, i) => Math.max(w, columns[i].minWidth))
      }
    }
  } catch { /* ignore */ }
  return columns.map((c) => c.defaultWidth)
}

export function useColumnResize(columns: ColDef[], storageKey: string) {
  const [widths, setWidths] = useState<number[]>(() =>
    loadWidths(storageKey, columns)
  )
  const resizingRef = useRef(false)

  /** Call on mousedown on a resize handle for column at `colIndex`. */
  const startResize = useCallback(
    (colIndex: number, startClientX: number) => {
      if (columns[colIndex].fixed) return
      const startWidth = widths[colIndex]
      resizingRef.current = true

      // Prevent text selection and show col-resize cursor globally
      document.body.style.userSelect = 'none'
      document.body.style.cursor = 'col-resize'

      const onMove = (e: MouseEvent) => {
        const delta = e.clientX - startClientX
        const newWidth = Math.max(columns[colIndex].minWidth, startWidth + delta)
        setWidths((prev) => {
          const next = [...prev]
          next[colIndex] = newWidth
          try { localStorage.setItem(storageKey, JSON.stringify(next)) } catch { /* ignore */ }
          return next
        })
      }

      const onUp = () => {
        resizingRef.current = false
        document.body.style.userSelect = ''
        document.body.style.cursor = ''
        document.removeEventListener('mousemove', onMove)
        document.removeEventListener('mouseup', onUp)
      }

      document.addEventListener('mousemove', onMove)
      document.addEventListener('mouseup', onUp)
    },
    [widths, columns, storageKey]
  )

  /** CSS grid-template-columns string */
  const gridTemplate = widths.map((w) => `${w}px`).join(' ')

  /** Total computed width (for min-width on scroll container) */
  const totalWidth = widths.reduce((s, w) => s + w, 0)

  return { widths, gridTemplate, totalWidth, startResize }
}
