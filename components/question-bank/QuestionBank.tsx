'use client'

import { useState, useEffect, useCallback } from 'react'
import { PenLine, Eye } from 'lucide-react'
import TabToggle from './TabToggle'
import StatsBar from '@/components/shell/StatsBar'
import MCQTable from '@/components/mcq/MCQTable'
import SubjectiveTable from '@/components/subjective/SubjectiveTable'
import ReviewMode from '@/components/review/ReviewMode'
import { useQuestionsStore } from '@/lib/store/questionsStore'
import { createDefaultMCQ, createDefaultSubjective } from '@/constants/defaultQuestion'

type Tab = 'MCQ' | 'Subjective'
type Mode = 'compose' | 'review'

export default function QuestionBank() {
  const [activeTab, setActiveTab] = useState<Tab>('MCQ')
  const [mode, setMode] = useState<Mode>('compose')
  const { mcqQuestions, subjectiveQuestions, addMCQ, addSubjective, saveAll } =
    useQuestionsStore()

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const ctrl = e.ctrlKey || e.metaKey
      if (ctrl && e.key === 's') { e.preventDefault(); saveAll() }
      if (ctrl && e.key === 'n' && mode === 'compose') {
        e.preventDefault()
        if (activeTab === 'MCQ') {
          addMCQ(createDefaultMCQ(mcqQuestions.length + 1))
        } else {
          addSubjective(createDefaultSubjective(subjectiveQuestions.length + 1))
        }
      }
    },
    [activeTab, mode, addMCQ, addSubjective, saveAll, mcqQuestions.length, subjectiveQuestions.length]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  useEffect(() => {
    const hasDirty =
      mcqQuestions.some((q) => q.isDirty) || subjectiveQuestions.some((q) => q.isDirty)
    const handler = (e: BeforeUnloadEvent) => {
      if (hasDirty) { e.preventDefault(); e.returnValue = '' }
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [mcqQuestions, subjectiveQuestions])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)' }}>
      <StatsBar />

      {/* Tab bar */}
      <div
        style={{
          alignItems: 'center',
          background: 'var(--surface)',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          flexShrink: 0,
          gap: 16,
          justifyContent: 'space-between',
          padding: '14px 24px',
        }}
      >
        {/* Left: MCQ / Subjective */}
        <TabToggle active={activeTab} onChange={setActiveTab} />

        {/* Right: Compose / Review */}
        <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 999, display: 'inline-flex', gap: 2, padding: 3 }}>
          {([
            { id: 'compose', label: 'Compose', Icon: PenLine },
            { id: 'review', label: 'Review', Icon: Eye },
          ] as const).map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setMode(id)}
              style={{
                alignItems: 'center',
                background: mode === id ? 'var(--surface)' : 'transparent',
                border: 'none',
                borderRadius: 999,
                boxShadow: mode === id ? '0 1px 4px rgba(15,23,42,0.10)' : 'none',
                color: mode === id ? 'var(--accent)' : 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                fontSize: '0.92rem',
                fontWeight: 600,
                gap: 8,
                letterSpacing: '-0.01em',
                padding: '8px 22px',
                transition: 'all 0.18s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              <Icon size={13} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content area */}
      {mode === 'compose' ? (
        <div style={{ flex: 1, overflow: 'auto', padding: '16px 20px 40px', background: 'var(--bg)' }}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
            {activeTab === 'MCQ' ? <MCQTable /> : <SubjectiveTable />}
          </div>
        </div>
      ) : (
        <div style={{ flex: 1, minHeight: 0, background: 'var(--bg)' }}>
          <ReviewMode
            activeTab={activeTab}
            mcqQuestions={mcqQuestions}
            subjectiveQuestions={subjectiveQuestions}
          />
        </div>
      )}
    </div>
  )
}
