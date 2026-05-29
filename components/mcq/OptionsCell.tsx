'use client'

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { Plus } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'
import OptionRow from './OptionRow'
import type { MCQOption } from '@/lib/store/questionsStore'

interface OptionsCellProps {
  options: MCQOption[]
  type: 'MCQ' | 'MSQ'
  onUpdate: (options: MCQOption[]) => void
  onTypeChange: (type: 'MCQ' | 'MSQ') => void
}

const MAX_OPTIONS = 10
const MIN_OPTIONS = 2

export default function OptionsCell({
  options,
  type,
  onUpdate,
  onTypeChange,
}: OptionsCellProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const from = options.findIndex((o) => o.id === active.id)
    const to = options.findIndex((o) => o.id === over.id)
    if (from === -1 || to === -1) return
    const newOptions = [...options]
    const [moved] = newOptions.splice(from, 1)
    newOptions.splice(to, 0, moved)
    onUpdate(newOptions)
  }

  const updateOption = (id: string, patch: Partial<MCQOption>) => {
    onUpdate(options.map((o) => (o.id === id ? { ...o, ...patch } : o)))
  }

  const handleCorrectChange = (id: string, checked: boolean) => {
    // Treat all options as independent checkboxes to allow seamless switching
    const updated = options.map((o) => (o.id === id ? { ...o, isCorrect: checked } : o))
    onUpdate(updated)

    // Auto-switch type based on how many are now correct
    const correctCount = updated.filter((o) => o.isCorrect).length
    if (type === 'MCQ' && correctCount > 1) onTypeChange('MSQ')
    if (type === 'MSQ' && correctCount <= 1) onTypeChange('MCQ')
  }

  const addOption = () => {
    if (options.length >= MAX_OPTIONS) return
    onUpdate([...options, { id: uuidv4(), html: '', isCorrect: false }])
  }

  const removeOption = (id: string) => {
    if (options.length <= MIN_OPTIONS) return
    onUpdate(options.filter((o) => o.id !== id))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={options.map((o) => o.id)}
          strategy={verticalListSortingStrategy}
        >
          {options.map((option, i) => (
            <OptionRow
              key={option.id}
              option={option}
              index={i}
              isRadio={type === 'MCQ'}
              canRemove={options.length > MIN_OPTIONS}
              onUpdate={(patch) => updateOption(option.id, patch)}
              onRemove={() => removeOption(option.id)}
              onCorrectChange={(checked) =>
                handleCorrectChange(option.id, checked)
              }
            />
          ))}
        </SortableContext>
      </DndContext>

      {/* Add option */}
      <button
        type="button"
        onClick={addOption}
        disabled={options.length >= MAX_OPTIONS}
        style={{
          alignItems: 'center',
          background: 'transparent',
          border: '1px dashed var(--border)',
          borderRadius: 'var(--radius-sm)',
          color: 'var(--text-muted)',
          cursor:
            options.length >= MAX_OPTIONS ? 'not-allowed' : 'pointer',
          display: 'flex',
          fontSize: '0.75rem',
          gap: 6,
          marginTop: 4,
          opacity: options.length >= MAX_OPTIONS ? 0.4 : 1,
          padding: '6px 10px',
          transition: 'all 0.15s',
          width: '100%',
        }}
        onMouseEnter={(e) => {
          if (options.length < MAX_OPTIONS) {
            ;(e.currentTarget as HTMLElement).style.borderColor =
              'var(--accent)'
            ;(e.currentTarget as HTMLElement).style.color = 'var(--accent)'
          }
        }}
        onMouseLeave={(e) => {
          ;(e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'
          ;(e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'
        }}
      >
        <Plus size={12} />
        Add Option
      </button>
    </div>
  )
}
