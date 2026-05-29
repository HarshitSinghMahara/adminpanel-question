'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ChevronDown, Search } from 'lucide-react'
import { PREDEFINED_TAGS } from '@/constants/tags'
import TagChip from '@/components/ui/TagChip'

interface TagSelectorProps {
  selected: string[]
  onChange: (tags: string[]) => void
  showChips?: boolean
}

export default function TagSelector({ selected, onChange, showChips = true }: TagSelectorProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 })
  const triggerRef = useRef<HTMLButtonElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const filtered = PREDEFINED_TAGS.filter((t) =>
    t.toLowerCase().includes(search.toLowerCase())
  )

  const toggle = (tag: string) => {
    onChange(selected.includes(tag) ? selected.filter((t) => t !== tag) : [...selected, tag])
  }

  const handleOpen = () => {
    if (!open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      const dropWidth = Math.max(rect.width, 200)
      // Try right-align first; fall back to left if it clips viewport
      let left = rect.right - dropWidth
      if (left < 8) left = rect.left
      setDropdownPos({
        top: rect.bottom + 4,
        left,
        width: dropWidth,
      })
    }
    setOpen((o) => !o)
  }

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as Node
      if (
        containerRef.current && !containerRef.current.contains(target) &&
        !(document.getElementById('tag-dropdown-portal')?.contains(target))
      ) {
        setOpen(false)
        setSearch('')
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Close on scroll — but not when scrolling inside the dropdown itself
  useEffect(() => {
    if (!open) return
    const handler = (e: Event) => {
      const portal = document.getElementById('tag-dropdown-portal')
      if (portal && portal.contains(e.target as Node)) return
      setOpen(false)
    }
    window.addEventListener('scroll', handler, true)
    return () => window.removeEventListener('scroll', handler, true)
  }, [open])

  const dropdown = open ? (
    <div
      id="tag-dropdown-portal"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        boxShadow: 'var(--shadow-md)',
        left: dropdownPos.left,
        maxHeight: 270,
        minWidth: dropdownPos.width,
        overflowY: 'auto',
        padding: 4,
        position: 'fixed',
        top: dropdownPos.top,
        width: dropdownPos.width,
        zIndex: 9999,
      }}
    >
      <div style={{ alignItems: 'center', display: 'flex', gap: 6, padding: '6px 10px' }}>
        <Search size={11} color="var(--text-muted)" />
        <input
          type="search"
          placeholder="Search tags…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          autoFocus
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              if (filtered.length > 0) {
                toggle(filtered[0])
                setSearch('')
              }
            } else if (e.key === 'Escape') {
              setOpen(false)
              setSearch('')
            }
          }}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-primary)',
            flex: 1,
            fontSize: '0.78rem',
            outline: 'none',
            padding: 0,
            width: '100%',
          }}
        />
      </div>
      <hr className="divider" />
      {filtered.map((tag) => (
        <div
          key={tag}
          className="dropdown-item"
          onClick={() => toggle(tag)}
          style={{ justifyContent: 'space-between' }}
        >
          <span>{tag}</span>
          {selected.includes(tag) && (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 6L5 9L10 3" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
      ))}
      {filtered.length === 0 && (
        <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', padding: '10px 12px', textAlign: 'center' }}>
          No tags found
        </p>
      )}
    </div>
  ) : null

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      <button
        ref={triggerRef}
        type="button"
        onClick={handleOpen}
        style={{
          alignItems: 'center',
          background: 'var(--surface-2)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-sm)',
          color: selected.length ? 'var(--text-primary)' : 'var(--text-muted)',
          cursor: 'pointer',
          display: 'flex',
          fontSize: '0.78rem',
          gap: 6,
          justifyContent: 'space-between',
          padding: '5px 10px',
          transition: 'border-color 0.15s',
          width: '100%',
        }}
      >
        <span>{selected.length ? `${selected.length} tag${selected.length > 1 ? 's' : ''}` : 'Add tags…'}</span>
        <ChevronDown
          size={12}
          style={{
            flexShrink: 0,
            transform: open ? 'rotate(180deg)' : 'rotate(0)',
            transition: 'transform 0.15s',
          }}
        />
      </button>

      {showChips && selected.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 5 }}>
          {selected.map((tag) => (
            <TagChip key={tag} label={tag} variant="accent" onRemove={() => toggle(tag)} />
          ))}
        </div>
      )}

      {typeof window !== 'undefined' && createPortal(dropdown, document.body)}
    </div>
  )
}
