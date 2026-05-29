'use client'

import { useState, useCallback, useRef } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { ChevronRight, Pin } from 'lucide-react'
import RichEditor from '@/components/editor/RichEditor'
import DifficultySelector from '@/components/mcq/DifficultySelector'
import TagSelector from '@/components/mcq/TagSelector'
import TagChip from '@/components/ui/TagChip'
import AIAssistantCheck from '@/components/ui/AIAssistantCheck'
import RowActions from '@/components/mcq/RowActions'
import DragHandle from '@/components/ui/DragHandle'
import AIAnswerButton from './AIAnswerButton'
import DescriptionCell from './DescriptionCell'
import RowResizeHandle from '@/components/ui/RowResizeHandle'
import { useQuestionsStore } from '@/lib/store/questionsStore'
import type { SubjectiveQuestion } from '@/lib/store/questionsStore'
import { useRowHeight } from '@/hooks/useRowHeight'

interface SubjectiveRowProps {
  question: SubjectiveQuestion
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

export default function SubjectiveRow({
  question, gridTemplate, colWidths, isExpanded, onToggle, onPreview,
}: SubjectiveRowProps) {
  const { updateSubjective, deleteSubjective } = useQuestionsStore()
  const streamBufferRef = useRef('')
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
    opacity: isDragging ? 0.4 : 1,
  }

  const patch = (p: Partial<SubjectiveQuestion>) => updateSubjective(question.id, p)

  const handleStreamStart = useCallback(() => {
    streamBufferRef.current = ''
    patch({ solutionHTML: '', aiGenerated: true })
  }, [question.id]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleChunk = useCallback((chunk: string) => {
    streamBufferRef.current += chunk
    const lines = streamBufferRef.current
      .split('\n')
      .map((l) => `<p>${l || '&nbsp;'}</p>`)
      .join('')
    patch({ solutionHTML: lines })
  }, [question.id]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleComplete = useCallback(() => {}, [])

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

  // Collapsed preview: strip HTML to plain text
  const questionPreview = question.questionHTML
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 120) || 'Untitled question…'

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
        {/* Drag */}
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <DifficultySelector
                value={question.difficulty}
                onChange={(difficulty) => patch({ difficulty })}
              />
              <RichEditor
                content={question.questionHTML}
                onChange={(questionHTML) => patch({ questionHTML })}
                placeholder="Enter the question…"
                minHeight={72}
              />
            </div>
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
                background: 'var(--surface-2)',
                border: '1px solid var(--border)',
                borderRadius: 999,
                color: 'var(--text-muted)',
                flexShrink: 0,
                fontSize: '0.62rem',
                fontWeight: 700,
                padding: '2px 7px',
              }}>
                {question.difficulty}
              </span>
            </div>
          )}
        </div>

        {/* Solution (AI) */}
        <div style={cellStyle}>
          {isExpanded ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <AIAnswerButton
                  questionHTML={question.questionHTML}
                  hasAnswer={!!question.aiAnswer || question.aiGenerated === true}
                  onStreamStart={handleStreamStart}
                  onChunk={handleChunk}
                  onComplete={handleComplete}
                />
              </div>
              <DescriptionCell
                html={question.solutionHTML}
                aiGenerated={question.aiGenerated}
                onChange={(solutionHTML) => patch({ solutionHTML })}
              />
            </div>
          ) : (
            <div style={{ alignItems: 'center', color: 'var(--text-muted)', display: 'flex', fontSize: '0.75rem', gap: 6, height: '100%' }}>
              {question.aiGenerated && (
                <span style={{ background: 'var(--accent-dim)', borderRadius: 999, color: 'var(--accent)', fontSize: '0.62rem', fontWeight: 700, padding: '2px 7px' }}>AI</span>
              )}
              <span style={{ flex: 1, fontStyle: question.solutionHTML ? 'normal' : 'italic', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {question.solutionHTML
                  ? question.solutionHTML.replace(/<[^>]+>/g, ' ').trim().slice(0, 50)
                  : 'No solution'}
              </span>
            </div>
          )}
        </div>

        {/* Description */}
        <div style={cellStyle}>
          {isExpanded ? (
            <RichEditor
              content={question.descriptionHTML ?? ''}
              onChange={(descriptionHTML) => patch({ descriptionHTML } as Partial<SubjectiveQuestion>)}
              placeholder="Add a description or note…"
              minHeight={72}
            />
          ) : (
            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontStyle: question.descriptionHTML ? 'normal' : 'italic', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {question.descriptionHTML
                ? question.descriptionHTML.replace(/<[^>]+>/g, ' ').trim().slice(0, 50)
                : '—'}
            </div>
          )}
        </div>

        {/* Actions */}
        <div style={{ ...cellStyle, borderRight: 'none' }}>
          <RowActions
            onPreview={() => onPreview(question.id)}
            onDelete={() => deleteSubjective(question.id)}
          />
        </div>
      </div>

      {/* ── TAG SUB-ROW — only when expanded, indented to align under Question column ── */}
      {isExpanded && (
        <div
          style={{
            borderTop: '1px dashed var(--border)',
            display: 'flex',
            flex: '0 0 auto',
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

            <AIAssistantCheck type="Subjective" />

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
