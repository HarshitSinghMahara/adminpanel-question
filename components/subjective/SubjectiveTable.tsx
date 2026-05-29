'use client'

import {
  DndContext, closestCenter, PointerSensor,
  useSensor, useSensors, DragEndEvent,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Plus, FileText } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useQuestionsStore } from '@/lib/store/questionsStore'
import { createDefaultSubjective } from '@/constants/defaultQuestion'
import SubjectiveRow from './SubjectiveRow'
import QuestionPreview from '@/components/preview/QuestionPreview'
import TableHeader from '@/components/ui/TableHeader'
import { useColumnResize, type ColDef } from '@/hooks/useColumnResize'

const SUBJ_COLS: ColDef[] = [
  { name: '',            defaultWidth: 32,  minWidth: 32,  fixed: true },
  { name: '#',           defaultWidth: 44,  minWidth: 44,  fixed: true },
  { name: 'Question',    defaultWidth: 380, minWidth: 200 },
  { name: 'Solution',    defaultWidth: 360, minWidth: 200 },
  { name: 'Description', defaultWidth: 260, minWidth: 160 },
  { name: 'Actions',     defaultWidth: 80,  minWidth: 80,  fixed: true },
]

export default function SubjectiveTable() {
  const { subjectiveQuestions, addSubjective, reorderSubjective } = useQuestionsStore()
  const [hydrated, setHydrated] = useState(false)
  const [previewId, setPreviewId] = useState<string | null>(null)
  const [activeRowId, setActiveRowId] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const justAddedRef = useRef(false)
  const newRowIdRef = useRef<string | null>(null)

  const { widths, gridTemplate, totalWidth, startResize } =
    useColumnResize(SUBJ_COLS, 'col-widths:subjective')

  useEffect(() => { setHydrated(true) }, [])

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    reorderSubjective(String(active.id), String(over.id))
  }

  const handleAdd = () => {
    const newQ = createDefaultSubjective(subjectiveQuestions.length + 1)
    try { localStorage.setItem(`row-height:${newQ.id}`, '400') } catch { /* ignore */ }
    addSubjective(newQ)
    setActiveRowId(newQ.id)
    newRowIdRef.current = newQ.id
    justAddedRef.current = true
  }

  useEffect(() => {
    if (justAddedRef.current && newRowIdRef.current) {
      const el = document.querySelector<HTMLElement>(`[data-qid="${newRowIdRef.current}"]`)
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      justAddedRef.current = false
      newRowIdRef.current = null
    }
  }, [subjectiveQuestions.length])

  const toggleRow = (id: string) => {
    setActiveRowId((prev) => (prev === id ? null : id))
  }

  if (!hydrated) {
    return (
      <div style={{ padding: '16px 0' }}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton" style={{ borderRadius: 'var(--radius)', height: 100, marginBottom: 6 }} />
        ))}
      </div>
    )
  }

  if (subjectiveQuestions.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon"><FileText size={44} /></div>
        <p className="empty-state-title">No subjective questions yet</p>
        <p className="empty-state-desc">Add a question and generate an AI answer</p>
        <button type="button" className="btn btn-primary" onClick={handleAdd}>
          <Plus size={14} /> Add Question
        </button>
      </div>
    )
  }

  return (
    <div style={{ overflowX: 'auto', width: '100%' }}>
      <div style={{ minWidth: totalWidth, position: 'relative' }}>

        <TableHeader
          columns={SUBJ_COLS}
          widths={widths}
          gridTemplate={gridTemplate}
          onStartResize={startResize}
        />

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext
            items={subjectiveQuestions.map((q) => q.id)}
            strategy={verticalListSortingStrategy}
          >
            {subjectiveQuestions.map((q) => (
              <SubjectiveRow
                key={q.id}
                question={q}
                gridTemplate={gridTemplate}
                colWidths={widths}
                isExpanded={activeRowId === q.id}
                onToggle={() => toggleRow(q.id)}
                onPreview={setPreviewId}
              />
            ))}
          </SortableContext>
        </DndContext>

        <div ref={bottomRef} />

        <button
          type="button"
          onClick={handleAdd}
          style={{
            alignItems: 'center', background: 'transparent',
            border: '1.5px dashed var(--border)', borderRadius: 'var(--radius)',
            color: 'var(--text-muted)', cursor: 'pointer', display: 'flex',
            fontSize: '0.82rem', fontWeight: 500, gap: 8, justifyContent: 'center',
            marginTop: 6, padding: '11px', transition: 'all 0.15s', width: '100%',
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement
            el.style.borderColor = 'var(--accent)'
            el.style.color = 'var(--accent)'
            el.style.background = 'var(--accent-dim)'
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement
            el.style.borderColor = 'var(--border)'
            el.style.color = 'var(--text-muted)'
            el.style.background = 'transparent'
          }}
        >
          <Plus size={14} /> Add Question
        </button>
      </div>

      {previewId && (
        <QuestionPreview questionId={previewId} type="Subjective" onClose={() => setPreviewId(null)} />
      )}
    </div>
  )
}
