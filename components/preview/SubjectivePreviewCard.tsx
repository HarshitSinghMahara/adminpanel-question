'use client'

import { useState } from 'react'
import { ExternalLink } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import type { SubjectiveQuestion } from '@/lib/store/questionsStore'

interface SubjectivePreviewCardProps {
  question: SubjectiveQuestion
}

export default function SubjectivePreviewCard({
  question,
}: SubjectivePreviewCardProps) {
  const [revealAnswer, setRevealAnswer] = useState(false)

  const diffVariant =
    question.difficulty === 'Easy'
      ? 'green'
      : question.difficulty === 'Medium'
        ? 'amber'
        : 'red'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Header */}
      <div
        style={{
          alignItems: 'flex-start',
          display: 'flex',
          gap: 10,
          justifyContent: 'space-between',
        }}
      >
        <span
          style={{
            background: 'var(--surface-2)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            padding: '2px 8px',
          }}
        >
          Q{question.num}
        </span>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <Badge label={question.difficulty} variant={diffVariant} />
          <a
            href={`/questions/${question.id}/preview`}
            target="_blank"
            rel="noreferrer"
            title="Open full preview"
            style={{ color: 'var(--text-muted)' }}
          >
            <ExternalLink size={13} />
          </a>
        </div>
      </div>

      {/* Question */}
      <div
        className="rich-content"
        style={{ fontSize: '0.9rem', lineHeight: 1.7 }}
        dangerouslySetInnerHTML={{
          __html:
            question.questionHTML ||
            '<em style="color:var(--text-muted)">No question text</em>',
        }}
      />

      {/* Tags */}
      {question.tags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {question.tags.map((t) => (
            <span key={t} className="chip chip-muted">
              {t}
            </span>
          ))}
        </div>
      )}

      {/* Reveal */}
      <button
        type="button"
        className="btn btn-success"
        onClick={() => setRevealAnswer((v) => !v)}
      >
        {revealAnswer ? 'Hide Answer' : 'Reveal Answer'}
      </button>

      {revealAnswer && question.solutionHTML && (
        <div
          style={{
            background: 'var(--surface-2)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            padding: '12px 14px',
          }}
        >
          <p
            style={{
              color: 'var(--text-muted)',
              fontSize: '0.68rem',
              fontWeight: 700,
              letterSpacing: '0.06em',
              marginBottom: 8,
              textTransform: 'uppercase',
            }}
          >
            {question.aiGenerated ? 'AI-Generated Answer' : 'Solution'}
          </p>
          <div
            className="rich-content"
            style={{ fontSize: '0.85rem' }}
            dangerouslySetInnerHTML={{ __html: question.solutionHTML }}
          />
        </div>
      )}

      {revealAnswer && !question.solutionHTML && (
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic' }}>
          No solution provided yet
        </p>
      )}
    </div>
  )
}
