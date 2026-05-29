'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { X, ImagePlus } from 'lucide-react'
import { useRef, useState } from 'react'
import RichEditor from '@/components/editor/RichEditor'
import Checkbox from '@/components/ui/Checkbox'
import DragHandle from '@/components/ui/DragHandle'
import type { MCQOption } from '@/lib/store/questionsStore'
import { uploadImageFile } from '@/lib/tiptap/imageUpload'
import { showToast } from '@/components/ui/Toast'

interface OptionRowProps {
  option: MCQOption
  index: number
  isRadio: boolean
  canRemove: boolean
  onUpdate: (patch: Partial<MCQOption>) => void
  onRemove: () => void
  onCorrectChange: (checked: boolean) => void
}

export default function OptionRow({
  option, index, isRadio, canRemove, onUpdate, onRemove, onCorrectChange,
}: OptionRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: option.id })

  const [showDropzone, setShowDropzone] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const letter = String.fromCharCode(65 + index)

  const handleImageFile = async (file: File) => {
    setUploading(true)
    try {
      const url = await uploadImageFile(file)
      onUpdate({ imageUrl: url })
    } catch {
      showToast('Image upload failed', 'error')
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file?.type.startsWith('image/')) handleImageFile(file)
    setShowDropzone(false)
  }

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        alignItems: 'flex-start',
        background: option.isCorrect ? 'rgba(22, 163, 74, 0.05)' : 'transparent',
        border: `1px solid ${option.isCorrect ? 'rgba(22,163,74,0.25)' : 'transparent'}`,
        borderRadius: 'var(--radius-sm)',
        display: 'flex',
        gap: 5,
        padding: '3px',
        transition: 'background 0.15s, border-color 0.15s',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Drag handle */}
      <div style={{ opacity: hovered ? 1 : 0, transition: 'opacity 0.15s', flexShrink: 0 }}>
        <DragHandle
          listeners={listeners as unknown as Record<string, unknown>}
          attributes={attributes as unknown as Record<string, unknown>}
        />
      </div>

      {/* Letter badge */}
      <span
        style={{
          alignItems: 'center',
          background: option.isCorrect ? 'var(--green-dim)' : 'var(--surface-2)',
          border: `1px solid ${option.isCorrect ? 'var(--green)' : 'var(--border)'}`,
          borderRadius: 'var(--radius-sm)',
          color: option.isCorrect ? 'var(--green)' : 'var(--accent)',
          display: 'inline-flex',
          flexShrink: 0,
          fontFamily: 'var(--font-mono)',
          fontSize: '0.68rem',
          fontWeight: 700,
          height: 22,
          justifyContent: 'center',
          minWidth: 22,
          padding: '0 4px',
          transition: 'all 0.15s',
        }}
      >
        {letter}
      </span>

      {/* Editor + image */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <RichEditor
          content={option.html}
          onChange={(html) => onUpdate({ html })}
          placeholder={`Option ${letter}`}
          minHeight={38}
        />
        {option.imageUrl && (
          <div style={{ marginTop: 4, position: 'relative' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={option.imageUrl}
              alt={`Option ${letter}`}
              style={{ borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', height: 'auto', maxWidth: 360, width: '100%' }}
            />
            <button
              type="button"
              onClick={() => onUpdate({ imageUrl: undefined })}
              title="Remove image"
              style={{
                alignItems: 'center',
                background: 'var(--red)',
                border: 'none',
                borderRadius: '50%',
                color: '#fff',
                cursor: 'pointer',
                display: 'flex',
                height: 18,
                justifyContent: 'center',
                position: 'absolute',
                right: 4,
                top: 4,
                width: 18,
              }}
            >
              <X size={10} />
            </button>
          </div>
        )}
        {showDropzone && (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onDragLeave={() => setShowDropzone(false)}
            style={{
              background: 'var(--accent-dim)',
              border: '2px dashed var(--accent)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-muted)',
              fontSize: '0.73rem',
              marginTop: 5,
              padding: '10px',
              textAlign: 'center',
            }}
          >
            {uploading ? 'Uploading…' : (
              <>
                Drop image here or{' '}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: 'inherit' }}
                >
                  browse
                </button>
              </>
            )}
          </div>
        )}
        <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }}
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageFile(f) }}
        />
      </div>

      {/* Controls */}
      <div style={{ alignItems: 'center', display: 'flex', flexShrink: 0, gap: 3, paddingTop: 3 }}>
        <button
          type="button"
          title="Attach image"
          onClick={() => setShowDropzone((v) => !v)}
          className="btn-icon"
          style={{ opacity: hovered ? 1 : 0.25, transition: 'opacity 0.15s' }}
        >
          <ImagePlus size={12} />
        </button>
        <Checkbox checked={option.isCorrect} onChange={onCorrectChange} radio={isRadio} />
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="btn-icon"
            title="Remove"
            style={{ color: 'var(--red)', opacity: hovered ? 1 : 0, transition: 'opacity 0.15s' }}
          >
            <X size={12} />
          </button>
        )}
      </div>
    </div>
  )
}
