import { useState, useRef, useCallback } from 'react'

const MIN_HEIGHT = 36
const STORAGE_PREFIX = 'row-height:'

function loadHeight(rowId: string): number | null {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + rowId)
    if (raw !== null) {
      const n = Number(raw)
      return Number.isFinite(n) && n >= MIN_HEIGHT ? n : null
    }
  } catch { /* ignore */ }
  return null
}

function saveHeight(rowId: string, h: number | null) {
  try {
    if (h === null) {
      localStorage.removeItem(STORAGE_PREFIX + rowId)
    } else {
      localStorage.setItem(STORAGE_PREFIX + rowId, String(h))
    }
  } catch { /* ignore */ }
}

export function useRowHeight(rowId: string) {
  const [height, setHeight] = useState<number | null>(() => loadHeight(rowId))
  const rowRef = useRef<HTMLDivElement>(null)

  const startResize = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const startY = e.clientY
    const startH = rowRef.current?.offsetHeight ?? 80

    document.body.style.userSelect = 'none'
    document.body.style.cursor = 'ns-resize'

    const onMove = (ev: MouseEvent) => {
      const newH = Math.max(MIN_HEIGHT, startH + (ev.clientY - startY))
      setHeight(newH)
      saveHeight(rowId, newH)
    }

    const onUp = () => {
      document.body.style.userSelect = ''
      document.body.style.cursor = ''
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
    }

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
  }, [rowId])

  return { rowRef, height, startResize }
}
