'use client'

import { useEffect, useState } from 'react'
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'info'

export interface ToastItem {
  id: string
  message: string
  type: ToastType
}

interface ToastProps {
  item: ToastItem
  onDismiss: (id: string) => void
}

function Toast({ item, onDismiss }: ToastProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const showTimer = setTimeout(() => setVisible(true), 10)
    const hideTimer = setTimeout(() => {
      setVisible(false)
      setTimeout(() => onDismiss(item.id), 300)
    }, 3200)
    return () => { clearTimeout(showTimer); clearTimeout(hideTimer) }
  }, [item.id, onDismiss])

  const config = {
    success: { border: 'var(--green)', icon: CheckCircle, iconColor: 'var(--green)' },
    error:   { border: 'var(--red)',   icon: AlertCircle, iconColor: 'var(--red)' },
    info:    { border: 'var(--accent)', icon: Info,       iconColor: 'var(--accent)' },
  }[item.type]

  const Icon = config.icon

  return (
    <div
      style={{
        alignItems: 'center',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderLeft: `4px solid ${config.border}`,
        borderRadius: 'var(--radius)',
        boxShadow: 'var(--shadow-md)',
        display: 'flex',
        gap: 10,
        maxWidth: 360,
        minWidth: 260,
        opacity: visible ? 1 : 0,
        padding: '12px 14px',
        transform: visible ? 'translateX(0)' : 'translateX(20px)',
        transition: 'all 0.28s cubic-bezier(0.4,0,0.2,1)',
      }}
    >
      <Icon size={15} color={config.iconColor} style={{ flexShrink: 0 }} />
      <span style={{ color: 'var(--text-primary)', flex: 1, fontSize: '0.82rem', lineHeight: 1.4 }}>
        {item.message}
      </span>
      <button
        type="button"
        onClick={() => onDismiss(item.id)}
        style={{ alignItems: 'center', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', flexShrink: 0, padding: 0 }}
      >
        <X size={13} />
      </button>
    </div>
  )
}

/* ── Global singleton ── */
let globalToastFn: ((msg: string, type?: ToastType) => void) | null = null

export function showToast(message: string, type: ToastType = 'info') {
  globalToastFn?.(message, type)
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  useEffect(() => {
    globalToastFn = (message, type = 'info') => {
      const id = Math.random().toString(36).slice(2)
      setToasts((prev) => [...prev, { id, message, type }])
    }
    return () => { globalToastFn = null }
  }, [])

  const dismiss = (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id))

  return (
    <div className="toast-container">
      {toasts.map((t) => <Toast key={t.id} item={t} onDismiss={dismiss} />)}
    </div>
  )
}

export default Toast
