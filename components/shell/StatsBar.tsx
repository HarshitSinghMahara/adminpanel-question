'use client'

import { useQuestionsStore } from '@/lib/store/questionsStore'

export default function StatsBar() {
  const { mcqQuestions, subjectiveQuestions } = useQuestionsStore()

  const totalMarks = mcqQuestions.reduce((sum, q) => sum + q.totalMarks, 0)
  const countDiff = (qs: Array<{ difficulty: string }>, d: string) =>
    qs.filter((q) => q.difficulty === d).length

  const totalEasy = countDiff(mcqQuestions, 'Easy') + countDiff(subjectiveQuestions, 'Easy')
  const totalMed = countDiff(mcqQuestions, 'Medium') + countDiff(subjectiveQuestions, 'Medium')
  const totalHard = countDiff(mcqQuestions, 'Hard') + countDiff(subjectiveQuestions, 'Hard')

  const Stat = ({
    label,
    value,
    dotColor,
  }: {
    label: string
    value: number | string
    dotColor?: string
  }) => (
    <div style={{ alignItems: 'center', display: 'flex', gap: 7 }}>
      {dotColor && (
        <span
          style={{
            background: dotColor,
            borderRadius: '50%',
            display: 'inline-block',
            flexShrink: 0,
            height: 8,
            width: 8,
          }}
        />
      )}
      <span
        style={{
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-mono)',
          fontSize: '1.05rem',
          fontWeight: 700,
          letterSpacing: '-0.02em',
        }}
      >
        {value}
      </span>
      <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 500 }}>
        {label}
      </span>
    </div>
  )

  const Sep = () => (
    <div style={{ background: 'var(--border)', height: 18, width: 1, flexShrink: 0 }} />
  )

  return (
    <div
      style={{
        alignItems: 'center',
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        flexWrap: 'wrap',
        gap: 24,
        padding: '16px 32px',
        position: 'sticky',
        top: 64,
        zIndex: 10,
      }}
    >
      <Stat label="MCQ" value={mcqQuestions.length} />
      <Sep />
      <Stat label="Subjective" value={subjectiveQuestions.length} />
      <Sep />
      <Stat label="Total Marks" value={totalMarks} />
      <Sep />
      <Stat label="Easy" value={totalEasy} dotColor="var(--green)" />
      <Stat label="Medium" value={totalMed} dotColor="var(--amber)" />
      <Stat label="Hard" value={totalHard} dotColor="var(--red)" />
    </div>
  )
}
