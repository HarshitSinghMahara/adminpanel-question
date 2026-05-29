'use client'

import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { ChevronRight, Pin } from 'lucide-react'
import QuestionCell from './QuestionCell'
import OptionsCell from './OptionsCell'
import ScoringCell from './ScoringCell'
import SolutionCell from './SolutionCell'
import RowActions from './RowActions'
import DragHandle from '@/components/ui/DragHandle'
import RowResizeHandle from '@/components/ui/RowResizeHandle'
import TagSelector from './TagSelector'
import TagChip from '@/components/ui/TagChip'
import AIAssistantCheck from '@/components/ui/AIAssistantCheck'
import { useQuestionsStore } from '@/lib/store/questionsStore'
import type { MCQQuestion } from '@/lib/store/questionsStore'
import { useRowHeight } from '@/hooks/useRowHeight'

interface MCQRowProps {
  question: MCQQuestion
  gridTemplate: string
  colWidths: number[]
  isExpanded: boolean
  onToggle: () => void
  onPreview: (id: string) => void
}

const cellStyle: React.CSSProperties = {
  borderRight: '1px solid var(--border)',
  minWidth: 0,
  overflowX: 'hidden',
  overflowY: 'auto',
  padding: '8px 10px',
}

function getPinnedTags(): string[] {
  try {
    const raw = localStorage.getItem('pinned-tags')
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

function savePinnedTags(tags: string[]) {
  try { localStorage.setItem('pinned-tags', JSON.stringify(tags)) } catch { /* ignore */ }
}

const COLLAPSED_HEIGHT = 44

export default function MCQRow({
  question, gridTemplate, colWidths, isExpanded, onToggle, onPreview,
}: MCQRowProps) {
  const { updateMCQ, deleteMCQ } = useQuestionsStore()
  const { rowRef, height, startResize } = useRowHeight(question.id)
  const wrapRef = (rowRef as React.MutableRefObject<HTMLDivElement | null>)

  const [pinActive, setPinActive] = useState<boolean>(() =>
    getPinnedTags().join(',') === question.tags.join(',') && question.tags.length > 0
  )

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: question.id })

  const dndStyle: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.45 : 1,
    zIndex: isDragging ? 50 : 'auto',
  }

  const patch = (p: Partial<MCQQuestion>) => updateMCQ(question.id, p)

  const questionPreview = question.questionHTML
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 120) || 'Untitled question…'

  const handleTagChange = (tags: string[]) => {
    patch({ tags })
    if (pinActive) savePinnedTags(tags)
  }

  const handlePinToggle = () => {
    const next = !pinActive
    setPinActive(next)
    if (next) savePinnedTags(question.tags)
    else savePinnedTags([])
  }

  return (
    <div
      data-qid={question.id}
      ref={(node) => {
        setNodeRef(node)
        wrapRef.current = node
      }}
      style={{
        ...dndStyle,
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        boxShadow: question.isDirty ? 'inset 3px 0 0 var(--amber)' : 'none',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        transition: 'box-shadow 0.2s',
        // Height: collapsed = 44px clips the grid; expanded = user-set height or auto
        ...(isExpanded
          ? height !== null ? { height, overflow: 'hidden' } : {}
          : { height: COLLAPSED_HEIGHT, overflow: 'hidden' }),
      }}
    >
      {/* ── MAIN GRID ROW ── */}
      <div
        className="sheet-row"
        style={{
          display: 'grid',
          flex: isExpanded ? '1 1 0' : '0 0 auto',
          gridTemplateColumns: gridTemplate,
          minHeight: 0,
          overflow: 'hidden',
        }}
      >
        {/* Drag handle */}
        <div style={{ alignItems: 'center', borderRight: '1px solid var(--border)', display: 'flex', justifyContent: 'center', padding: '8px 0' }}>
          <DragHandle
            listeners={listeners as unknown as Record<string, unknown>}
            attributes={attributes as unknown as Record<string, unknown>}
          />
        </div>

        {/* # — click to expand/collapse */}
        <div
          onClick={onToggle}
          title={isExpanded ? 'Collapse row' : 'Expand row'}
          style={{
            ...cellStyle,
            alignItems: 'center',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            justifyContent: 'center',
            userSelect: 'none',
          }}
        >
          <ChevronRight
            size={12}
            style={{
              color: 'var(--text-muted)',
              flexShrink: 0,
              transform: isExpanded ? 'rotate(90deg)' : 'rotate(0)',
              transition: 'transform 0.18s',
            }}
          />
          <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 600 }}>
            {question.num}
          </span>
        </div>

        {/* Question */}
        <div style={cellStyle}>
          {isExpanded ? (
            <QuestionCell question={question} onUpdate={patch} />
          ) : (
            <div
              onClick={onToggle}
              style={{
                alignItems: 'center',
                color: question.questionHTML ? 'var(--text-primary)' : 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                fontSize: '0.82rem',
                gap: 8,
                lineHeight: 1.4,
                minHeight: 36,
                overflow: 'hidden',
              }}
            >
              <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {questionPreview}
              </span>
              <span style={{
                background: question.type === 'MSQ' ? 'var(--amber-dim)' : 'var(--accent-dim)',
                borderRadius: 999,
                color: question.type === 'MSQ' ? 'var(--amber)' : 'var(--accent)',
                flexShrink: 0,
                fontSize: '0.62rem',
                fontWeight: 700,
                padding: '2px 7px',
              }}>
                {question.type}
              </span>
            </div>
          )}
        </div>

        {/* Options */}
        <div style={cellStyle}>
          {isExpanded ? (
            <OptionsCell
              options={question.options}
              type={question.type}
              onUpdate={(options) => patch({ options })}
              onTypeChange={(type) => patch({ type })}
            />
          ) : (
            <div style={{ alignItems: 'center', color: 'var(--text-muted)', display: 'flex', fontSize: '0.75rem', gap: 4, height: '100%' }}>
              {question.options.length} options
              {question.options.some(o => o.isCorrect) && (
                <span style={{ color: 'var(--green)', fontSize: '0.68rem' }}>
                  • {question.options.filter(o => o.isCorrect).length} correct
                </span>
              )}
            </div>
          )}
        </div>

        {/* Marks */}
        <div style={cellStyle}>
          {isExpanded ? (
            <ScoringCell
              type={question.type}
              totalMarks={question.totalMarks}
              negativeMarks={question.negativeMarks}
              partialPositive={question.partialPositive}
              partialNegative={question.partialNegative}
              colWidth={colWidths[4]}
              onChange={(p) => patch(p)}
            />
          ) : (
            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: 2, justifyContent: 'center', height: '100%' }}>
              {question.type === 'MCQ' ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ color: 'var(--green)', fontWeight: 600 }}>+{question.totalMarks}</span>
                  <span style={{ color: 'var(--border)' }}>/</span>
                  <span style={{ color: 'var(--red)', fontWeight: 600 }}>−{question.negativeMarks}</span>
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <span style={{ color: 'var(--green)', fontWeight: 600 }} title="Total Positive">+{question.totalMarks}</span>
                    <span style={{ color: 'var(--red)', fontWeight: 600 }} title="Total Negative">−{question.negativeMarks}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <span style={{ color: 'var(--green)', fontWeight: 600 }} title="Partial Positive">+{question.partialPositive}</span>
                    <span style={{ color: 'var(--red)', fontWeight: 600 }} title="Partial Negative">−{question.partialNegative}</span>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Solution */}
        <div style={cellStyle}>
          {isExpanded ? (
            <SolutionCell html={question.solutionHTML} onChange={(solutionHTML) => patch({ solutionHTML })} />
          ) : (
            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontStyle: question.solutionHTML ? 'normal' : 'italic', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {question.solutionHTML
                ? question.solutionHTML.replace(/<[^>]+>/g, ' ').trim().slice(0, 60)
                : 'No solution'}
            </div>
          )}
        </div>

        {/* Actions */}
        <div style={{ ...cellStyle, borderRight: 'none' }}>
          <RowActions
            onPreview={() => onPreview(question.id)}
            onDelete={() => deleteMCQ(question.id)}
          />
        </div>
      </div>

      {/* ── TAG SUB-ROW — only when expanded ── */}
      {isExpanded && (
        <div
          style={{
            borderTop: '1px dashed var(--border)',
            display: 'flex',
            flex: '0 0 auto',
            // Indent by drag col + # col so tags align under the question cell
            paddingLeft: colWidths[0] + colWidths[1],
          }}
        >
          <div
            style={{
              alignItems: 'center',
              display: 'flex',
              flex: 1,
              flexWrap: 'wrap',
              gap: 6,
              minWidth: 0,
              padding: '5px 10px 7px',
            }}
          >
            <div style={{ flexShrink: 0 }}>
              <TagSelector selected={question.tags} onChange={handleTagChange} showChips={false} />
            </div>

            {question.tags.map((tag) => (
              <TagChip
                key={tag}
                label={tag}
                variant="accent"
                onRemove={() => handleTagChange(question.tags.filter((t) => t !== tag))}
              />
            ))}

            <div style={{ flex: 1 }} />

            <AIAssistantCheck type="MCQ" />

            <button
              type="button"
              title={pinActive ? 'Unpin tags from future questions' : 'Apply these tags to all future new questions'}
              onClick={handlePinToggle}
              style={{
                alignItems: 'center',
                background: pinActive ? 'var(--accent-dim)' : 'transparent',
                border: `1px solid ${pinActive ? 'var(--accent)' : 'var(--border)'}`,
                borderRadius: 'var(--radius-sm)',
                color: pinActive ? 'var(--accent)' : 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                fontSize: '0.72rem',
                fontWeight: 600,
                gap: 5,
                padding: '4px 10px',
                transition: 'all 0.15s',
                whiteSpace: 'nowrap',
              }}
            >
              <Pin size={11} style={{ transform: pinActive ? 'rotate(-45deg)' : 'none', transition: 'transform 0.15s' }} />
              {pinActive ? 'Pinned to future' : 'Pin to future'}
            </button>
          </div>
        </div>
      )}

      {isExpanded && <RowResizeHandle onMouseDown={startResize} />}
    </div>
  )
}
