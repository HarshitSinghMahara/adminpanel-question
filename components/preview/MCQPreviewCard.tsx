'use client'

import { useState } from 'react'
import { ExternalLink } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import type { MCQQuestion } from '@/lib/store/questionsStore'

interface MCQPreviewCardProps {
  question: MCQQuestion
}

export default function MCQPreviewCard({ question }: MCQPreviewCardProps) {
  const [revealAnswer, setRevealAnswer] = useState(false)
  const [revealSolution, setRevealSolution] = useState(false)

  const diffVariant =
    question.difficulty === 'Easy' ? 'green' : question.difficulty === 'Medium' ? 'amber' : 'red'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Header */}
      <div style={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{
            background: 'var(--surface-2)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)', color: 'var(--text-muted)',
            fontFamily: 'var(--font-mono)', fontSize: '0.72rem', padding: '2px 8px',
          }}>
            Q{question.num}
          </span>
          <Badge label={question.type} variant="accent" />
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <Badge label={question.difficulty} variant={diffVariant} />
          <a href={`/questions/${question.id}/preview`} target="_blank" rel="noreferrer"
            title="Open full preview" style={{ color: 'var(--text-muted)' }}>
            <ExternalLink size={13} />
          </a>
        </div>
      </div>

      {/* Question */}
      <div
        className="rich-content"
        style={{ fontSize: '0.9rem', lineHeight: 1.7 }}
        dangerouslySetInnerHTML={{ __html: question.questionHTML || '<em style="color:var(--text-muted)">No question text</em>' }}
      />

      {/* Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        {question.options.map((opt, i) => {
          const letter = String.fromCharCode(65 + i)
          const showHighlight = revealAnswer && opt.isCorrect
          return (
            <div
              key={opt.id}
              style={{
                alignItems: 'flex-start',
                background: showHighlight ? 'var(--green-dim)' : 'var(--surface-2)',
                border: `1px solid ${showHighlight ? 'var(--green)' : 'var(--border)'}`,
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                gap: 10,
                padding: '8px 12px',
                transition: 'all 0.2s',
              }}
            >
              <span style={{
                color: showHighlight ? 'var(--green)' : 'var(--accent)',
                flexShrink: 0, fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem', fontWeight: 700,
              }}>
                {letter}.
              </span>
              <div
                className="rich-content"
                style={{ fontSize: '0.85rem' }}
                dangerouslySetInnerHTML={{ __html: opt.html || `<em style="color:var(--text-muted)">Option ${letter}</em>` }}
              />
            </div>
          )
        })}
      </div>

      {/* Marks */}
      <div style={{
        background: 'var(--surface-2)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-sm)', display: 'flex', fontSize: '0.78rem',
        gap: 16, padding: '8px 12px',
      }}>
        <span>Correct: <strong style={{ color: 'var(--green)' }}>+{question.totalMarks}</strong></span>
        <span>Wrong: <strong style={{ color: 'var(--red)' }}>−{question.negativeMarks}</strong></span>
      </div>

      {/* Tags */}
      {question.tags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {question.tags.map((t) => (
            <span key={t} className="chip chip-muted">{t}</span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button type="button" className="btn btn-success" onClick={() => setRevealAnswer((v) => !v)} style={{ flex: 1 }}>
          {revealAnswer ? 'Hide Answer' : 'Reveal Answer'}
        </button>
        {question.solutionHTML && (
          <button type="button" className="btn btn-ghost" onClick={() => setRevealSolution((v) => !v)} style={{ flex: 1 }}>
            {revealSolution ? 'Hide Solution' : 'Reveal Solution'}
          </button>
        )}
      </div>

      {/* Solution */}
      {revealSolution && question.solutionHTML && (
        <div style={{
          background: 'var(--surface-2)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius)', padding: '12px 14px',
        }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.06em', marginBottom: 8, textTransform: 'uppercase' }}>
            Solution
          </p>
          <div
            className="rich-content"
            style={{ fontSize: '0.85rem' }}
            dangerouslySetInnerHTML={{ __html: question.solutionHTML }}
          />
        </div>
      )}
    </div>
  )
}
