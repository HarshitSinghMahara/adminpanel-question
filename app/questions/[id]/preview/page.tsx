'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Printer, ArrowLeft } from 'lucide-react'
import { useQuestionsStore } from '@/lib/store/questionsStore'
import type { MCQQuestion, SubjectiveQuestion } from '@/lib/store/questionsStore'
import '@/styles/globals.css'

export default function PreviewPage() {
  const params = useParams()
  const id = params?.id as string
  const { mcqQuestions, subjectiveQuestions } = useQuestionsStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  if (!mounted) {
    return (
      <div style={{ alignItems: 'center', background: '#f4f6fb', display: 'flex', height: '100vh', justifyContent: 'center' }}>
        <p style={{ color: '#9ca3af', fontFamily: 'DM Sans, sans-serif' }}>Loading…</p>
      </div>
    )
  }

  const mcq = mcqQuestions.find((q) => q.id === id)
  const subj = subjectiveQuestions.find((q) => q.id === id)
  const question: MCQQuestion | SubjectiveQuestion | undefined = mcq ?? subj
  const isMCQ = !!mcq

  if (!question) {
    return (
      <div style={{ alignItems: 'center', background: '#f4f6fb', display: 'flex', flexDirection: 'column', gap: 16, height: '100vh', justifyContent: 'center' }}>
        <p style={{ color: '#4b5563', fontFamily: 'DM Sans, sans-serif' }}>Question not found.</p>
        <a href="/questions" style={{ color: '#4f6ef7', fontFamily: 'DM Sans, sans-serif', fontSize: '0.9rem' }}>← Back to Question Bank</a>
      </div>
    )
  }

  const diffColor =
    question.difficulty === 'Easy' ? '#16a34a'
    : question.difficulty === 'Medium' ? '#d97706'
    : '#dc2626'

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700&family=JetBrains+Mono&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #f4f6fb; color: #111827; font-family: 'DM Sans', sans-serif; }
        @media print {
          .no-print { display: none !important; }
          body { background: white; }
          .print-card { box-shadow: none !important; border: none !important; }
        }
      `}</style>

      {/* Toolbar */}
      <div
        className="no-print"
        style={{
          alignItems: 'center',
          background: '#ffffff',
          borderBottom: '1px solid #e4e8f2',
          boxShadow: '0 1px 3px rgba(15,23,42,0.06)',
          display: 'flex',
          gap: 12,
          justifyContent: 'space-between',
          padding: '10px 24px',
        }}
      >
        <a
          href="/questions"
          style={{ alignItems: 'center', color: '#9ca3af', display: 'flex', fontSize: '0.82rem', gap: 6, textDecoration: 'none', fontFamily: 'DM Sans, sans-serif' }}
        >
          <ArrowLeft size={14} />
          Back to Question Bank
        </a>
        <button
          type="button"
          onClick={() => window.print()}
          style={{
            alignItems: 'center', background: '#4f6ef7', border: 'none',
            borderRadius: 6, color: '#fff', cursor: 'pointer', display: 'flex',
            fontFamily: 'DM Sans, sans-serif', fontSize: '0.82rem', fontWeight: 600,
            gap: 6, padding: '8px 16px',
          }}
        >
          <Printer size={14} />
          Print
        </button>
      </div>

      {/* Card */}
      <div style={{ margin: '40px auto', maxWidth: 720, padding: '0 20px 60px' }}>
        <div
          className="print-card"
          style={{
            background: '#fff',
            border: '1px solid #e4e8f2',
            borderRadius: 12,
            boxShadow: '0 4px 20px rgba(15,23,42,0.07)',
            padding: 40,
          }}
        >
          {/* Header */}
          <div style={{
            alignItems: 'center', borderBottom: '1px solid #f0f2f8', display: 'flex',
            justifyContent: 'space-between', marginBottom: 28, paddingBottom: 18,
          }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <span style={{
                background: '#eef0ff', borderRadius: 6, color: '#4f6ef7',
                fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem',
                fontWeight: 600, padding: '4px 10px',
              }}>
                Q{question.num}
              </span>
              {isMCQ && (
                <span style={{
                  background: '#eef0ff', borderRadius: 999, color: '#4f6ef7',
                  fontSize: '0.7rem', fontWeight: 700, padding: '3px 10px',
                }}>
                  {(question as MCQQuestion).type}
                </span>
              )}
            </div>
            <span style={{
              background: `${diffColor}18`, borderRadius: 999, color: diffColor,
              fontSize: '0.7rem', fontWeight: 700, padding: '3px 12px',
            }}>
              {question.difficulty}
            </span>
          </div>

          {/* Question */}
          <div style={{ fontSize: '1rem', lineHeight: 1.75, marginBottom: 28, color: '#111827' }}
            dangerouslySetInnerHTML={{ __html: question.questionHTML }}
          />

          {/* Options */}
          {isMCQ && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
              {(question as MCQQuestion).options.map((opt, i) => (
                <div
                  key={opt.id}
                  style={{
                    alignItems: 'flex-start', background: '#f8f9fc', border: '1px solid #e4e8f2',
                    borderRadius: 8, display: 'flex', gap: 12, padding: '10px 14px',
                  }}
                >
                  <span style={{ color: '#4f6ef7', flexShrink: 0, fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', fontWeight: 700, minWidth: 18 }}>
                    {String.fromCharCode(65 + i)}.
                  </span>
                  <div style={{ fontSize: '0.9rem', color: '#111827' }}
                    dangerouslySetInnerHTML={{ __html: opt.html }}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Tags */}
          {question.tags.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
              {question.tags.map((t) => (
                <span key={t} style={{ background: '#f0f2f8', borderRadius: 999, color: '#4b5563', fontSize: '0.7rem', padding: '3px 10px' }}>
                  {t}
                </span>
              ))}
            </div>
          )}

          {/* Marks */}
          {isMCQ && (
            <div style={{
              background: '#f8f9fc', border: '1px solid #e4e8f2', borderRadius: 8,
              display: 'flex', fontSize: '0.82rem', gap: 20, marginBottom: 24, padding: '10px 14px',
            }}>
              <span>Correct: <strong style={{ color: '#16a34a' }}>+{(question as MCQQuestion).totalMarks}</strong></span>
              <span>Wrong: <strong style={{ color: '#dc2626' }}>−{(question as MCQQuestion).negativeMarks}</strong></span>
            </div>
          )}

          {/* Footer */}
          <div style={{ borderTop: '2px dashed #e4e8f2', color: '#d1d5db', fontSize: '0.72rem', marginTop: 8, paddingTop: 12, textAlign: 'center' }}>
            — For examiner use only —
          </div>
        </div>
      </div>
    </>
  )
}
