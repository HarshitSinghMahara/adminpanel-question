'use client'

import { useEffect } from 'react'
import { X } from 'lucide-react'
import { useQuestionsStore } from '@/lib/store/questionsStore'
import MCQPreviewCard from './MCQPreviewCard'
import SubjectivePreviewCard from './SubjectivePreviewCard'

interface QuestionPreviewProps {
  questionId: string
  type: 'MCQ' | 'Subjective'
  onClose: () => void
}

export default function QuestionPreview({ questionId, type, onClose }: QuestionPreviewProps) {
  const { mcqQuestions, subjectiveQuestions } = useQuestionsStore()

  const mcq = mcqQuestions.find((q) => q.id === questionId)
  const subj = subjectiveQuestions.find((q) => q.id === questionId)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <>
      <div className="slideover-overlay" onClick={onClose} />
      <div className="slideover-panel">
        {/* Header */}
        <div style={{
          alignItems: 'center', borderBottom: '1px solid var(--border)',
          display: 'flex', justifyContent: 'space-between',
          marginBottom: 20, paddingBottom: 14,
        }}>
          <h2 style={{ color: 'var(--text-primary)', fontSize: '0.95rem', fontWeight: 700 }}>
            Preview
          </h2>
          <button type="button" onClick={onClose} className="btn-icon" aria-label="Close">
            <X size={16} />
          </button>
        </div>

        {type === 'MCQ' && mcq ? (
          <MCQPreviewCard question={mcq} />
        ) : type === 'Subjective' && subj ? (
          <SubjectivePreviewCard question={subj} />
        ) : (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Question not found.</p>
        )}
      </div>
    </>
  )
}
