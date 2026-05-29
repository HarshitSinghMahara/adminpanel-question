'use client'

import RichEditor from '@/components/editor/RichEditor'
import DifficultySelector from './DifficultySelector'
import type { MCQQuestion } from '@/lib/store/questionsStore'

interface QuestionCellProps {
  question: MCQQuestion
  onUpdate: (patch: Partial<MCQQuestion>) => void
  invalid?: boolean
}

export default function QuestionCell({ question, onUpdate, invalid = false }: QuestionCellProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {/* Controls row */}
      <div style={{ alignItems: 'center', display: 'flex', gap: 8, justifyContent: 'space-between' }}>
        <DifficultySelector
          value={question.difficulty}
          onChange={(difficulty) => onUpdate({ difficulty })}
        />
        {/* MCQ/MSQ toggle */}
        <div
          style={{
            background: 'var(--surface-2)',
            border: '1px solid var(--border)',
            borderRadius: 999,
            display: 'flex',
            overflow: 'hidden',
          }}
        >
          {(['MCQ', 'MSQ'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => onUpdate({ type: t })}
              style={{
                background: question.type === t ? 'var(--accent)' : 'transparent',
                border: 'none',
                borderRadius: 999,
                color: question.type === t ? '#fff' : 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: '0.66rem',
                fontWeight: 700,
                padding: '3px 10px',
                transition: 'all 0.15s',
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Editor */}
      <RichEditor
        content={question.questionHTML}
        onChange={(questionHTML) => onUpdate({ questionHTML })}
        placeholder="Enter question…"
        minHeight={72}
        invalid={invalid}
      />
    </div>
  )
}
