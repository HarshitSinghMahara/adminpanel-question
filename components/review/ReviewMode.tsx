'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, AlignJustify, BookOpen } from 'lucide-react'
import type { MCQQuestion, SubjectiveQuestion } from '@/lib/store/questionsStore'

type ReviewLayout = 'scroll' | 'paged'
type QuestionEntry =
  | { kind: 'mcq'; q: MCQQuestion }
  | { kind: 'subjective'; q: SubjectiveQuestion }

interface ReviewModeProps {
  activeTab: 'MCQ' | 'Subjective'
  mcqQuestions: MCQQuestion[]
  subjectiveQuestions: SubjectiveQuestion[]
}

/* ── Scroll card for MCQ ─────────────────────────────────── */
function MCQScrollCard({ question, index }: { question: MCQQuestion; index: number }) {
  const [selected, setSelected] = useState<string | null>(null)
  const [checked, setChecked] = useState(false)
  const [showSolution, setShowSolution] = useState(false)

  const reset = () => { setSelected(null); setChecked(false); setShowSolution(false) }

  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ alignItems: 'center', display: 'flex', gap: 10, justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ background: 'var(--accent-dim)', borderRadius: 999, color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 700, padding: '3px 10px' }}>Q{index + 1}</span>
          <span style={{ background: question.type === 'MSQ' ? 'var(--amber-dim)' : 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 999, color: question.type === 'MSQ' ? 'var(--amber)' : 'var(--text-muted)', fontSize: '0.65rem', fontWeight: 700, padding: '2px 8px' }}>{question.type}</span>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <DiffBadge d={question.difficulty} />
          <span style={{ color: 'var(--green)', fontSize: '0.78rem', fontWeight: 600 }}>+{question.totalMarks}</span>
          <span style={{ color: 'var(--red)', fontSize: '0.78rem', fontWeight: 600 }}>−{question.negativeMarks}</span>
        </div>
      </div>

      <div className="rich-content" style={{ fontSize: '0.92rem', lineHeight: 1.75 }} dangerouslySetInnerHTML={{ __html: question.questionHTML || '<em style="color:var(--text-muted)">No question text</em>' }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {question.options.map((opt, i) => {
          const letter = String.fromCharCode(65 + i)
          const isSelected = selected === opt.id
          const isCorrect = opt.isCorrect
          const showResult = checked && isSelected
          const bg = showResult ? (isCorrect ? 'var(--green-dim)' : 'rgba(239,68,68,0.08)') : isSelected ? 'var(--accent-dim)' : 'var(--surface-2)'
          const border = showResult ? (isCorrect ? 'var(--green)' : 'var(--red)') : isSelected ? 'var(--accent)' : 'var(--border)'
          return (
            <div key={opt.id} onClick={() => !checked && setSelected(opt.id)} style={{ alignItems: 'flex-start', background: bg, border: `1.5px solid ${border}`, borderRadius: 'var(--radius-sm)', cursor: checked ? 'default' : 'pointer', display: 'flex', gap: 12, padding: '10px 14px', transition: 'all 0.18s' }}>
              <span style={{ color: isSelected ? 'var(--accent)' : 'var(--text-muted)', flexShrink: 0, fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700, marginTop: 1 }}>{letter}.</span>
              <div className="rich-content" style={{ flex: 1, fontSize: '0.87rem' }} dangerouslySetInnerHTML={{ __html: opt.html || `<em>Option ${letter}</em>` }} />
              {checked && isCorrect && <span style={{ color: 'var(--green)', flexShrink: 0, fontSize: '0.7rem', fontWeight: 700 }}>✓ Correct</span>}
              {checked && isSelected && !isCorrect && <span style={{ color: 'var(--red)', flexShrink: 0, fontSize: '0.7rem', fontWeight: 700 }}>✗ Wrong</span>}
            </div>
          )
        })}
      </div>

      {question.tags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {question.tags.map((t) => <span key={t} className="chip chip-muted">{t}</span>)}
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {!checked ? (
          <button type="button" className="btn btn-success" style={{ flex: 1 }} onClick={() => setChecked(true)} disabled={!selected}>Check Answer</button>
        ) : (
          <button type="button" className="btn btn-ghost" style={{ flex: 1 }} onClick={reset}>Try Again</button>
        )}
        {question.solutionHTML && (
          <button type="button" className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setShowSolution(v => !v)}>
            {showSolution ? 'Hide Solution' : 'View Solution'}
          </button>
        )}
      </div>

      {showSolution && question.solutionHTML && (
        <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '14px 16px' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.06em', marginBottom: 8, textTransform: 'uppercase' }}>Solution</p>
          <div className="rich-content" style={{ fontSize: '0.87rem' }} dangerouslySetInnerHTML={{ __html: question.solutionHTML }} />
        </div>
      )}
    </div>
  )
}

/* ── Scroll card for Subjective ──────────────────────────── */
function SubjScrollCard({ question, index }: { question: SubjectiveQuestion; index: number }) {
  const [show, setShow] = useState(false)
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ alignItems: 'center', display: 'flex', gap: 10, justifyContent: 'space-between' }}>
        <span style={{ background: 'var(--accent-dim)', borderRadius: 999, color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 700, padding: '3px 10px' }}>Q{index + 1}</span>
        <DiffBadge d={question.difficulty} />
      </div>
      <div className="rich-content" style={{ fontSize: '0.92rem', lineHeight: 1.75 }} dangerouslySetInnerHTML={{ __html: question.questionHTML || '<em style="color:var(--text-muted)">No question text</em>' }} />
      {question.tags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {question.tags.map((t) => <span key={t} className="chip chip-muted">{t}</span>)}
        </div>
      )}
      <button type="button" className="btn btn-success" onClick={() => setShow(v => !v)}>
        {show ? 'Hide Answer' : 'Reveal Answer'}
      </button>
      {show && question.solutionHTML && (
        <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '14px 16px' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.06em', marginBottom: 8, textTransform: 'uppercase' }}>{question.aiGenerated ? 'AI-Generated Answer' : 'Solution'}</p>
          <div className="rich-content" style={{ fontSize: '0.87rem' }} dangerouslySetInnerHTML={{ __html: question.solutionHTML }} />
        </div>
      )}
    </div>
  )
}

/* ── Per-page exam view ───────────────────────────────────── */
function PagedView({ entries }: { entries: QuestionEntry[] }) {
  const [idx, setIdx] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [checked, setChecked] = useState(false)
  const [showSolution, setShowSolution] = useState(false)

  const total = entries.length
  const entry = entries[idx]
  const progress = ((idx + 1) / total) * 100

  const goTo = (i: number) => {
    setIdx(i)
    setSelected(null)
    setChecked(false)
    setShowSolution(false)
  }

  if (!entry) return <div style={{ color: 'var(--text-muted)', padding: 40, textAlign: 'center' }}>No questions to review.</div>

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
      {/* Header bar */}
      <div style={{ alignItems: 'center', background: 'var(--surface)', borderBottom: '1px solid var(--border)', display: 'flex', flexShrink: 0, gap: 16, padding: '10px 24px' }}>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
          Question <span style={{ color: 'var(--text-primary)' }}>{idx + 1}</span> of {total}
        </span>
        <div style={{ background: 'var(--surface-2)', borderRadius: 999, flex: 1, height: 6, overflow: 'hidden' }}>
          <div style={{ background: 'var(--accent)', borderRadius: 999, height: '100%', transition: 'width 0.3s', width: `${progress}%` }} />
        </div>
        {entry.kind === 'mcq' && <DiffBadge d={entry.q.difficulty} />}
        {entry.kind === 'subjective' && <DiffBadge d={entry.q.difficulty} />}
      </div>

      {/* Question navigator pills */}
      <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', display: 'flex', flexShrink: 0, flexWrap: 'wrap', gap: 4, overflowX: 'auto', padding: '8px 24px' }}>
        {entries.map((_, i) => (
          <button key={i} type="button" onClick={() => goTo(i)} style={{ background: idx === i ? 'var(--accent)' : 'var(--surface-2)', border: `1px solid ${idx === i ? 'var(--accent)' : 'var(--border)'}`, borderRadius: 999, color: idx === i ? '#fff' : 'var(--text-muted)', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 600, minWidth: 30, padding: '3px 8px', transition: 'all 0.15s' }}>
            {i + 1}
          </button>
        ))}
      </div>

      {/* Main question area */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '32px 40px' }}>
        {entry.kind === 'mcq' && (() => {
          const q = entry.q
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, margin: '0 auto', maxWidth: 760 }}>
              <div style={{ alignItems: 'center', display: 'flex', gap: 10 }}>
                <span style={{ background: 'var(--accent-dim)', borderRadius: 999, color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700, padding: '3px 12px' }}>Q{idx + 1}</span>
                <span style={{ background: q.type === 'MSQ' ? 'var(--amber-dim)' : 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 999, color: q.type === 'MSQ' ? 'var(--amber)' : 'var(--text-muted)', fontSize: '0.65rem', fontWeight: 700, padding: '2px 8px' }}>{q.type}</span>
                <span style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--green)', fontSize: '0.75rem', fontWeight: 600, padding: '2px 10px' }}>+{q.totalMarks} / −{q.negativeMarks}</span>
              </div>

              <div className="rich-content" style={{ fontSize: '1rem', lineHeight: 1.8 }} dangerouslySetInnerHTML={{ __html: q.questionHTML || '<em style="color:var(--text-muted)">No question text</em>' }} />

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {q.options.map((opt, i) => {
                  const letter = String.fromCharCode(65 + i)
                  const isSel = selected === opt.id
                  const showResult = checked && isSel
                  const bg = showResult ? (opt.isCorrect ? 'var(--green-dim)' : 'rgba(239,68,68,0.08)') : isSel ? 'var(--accent-dim)' : 'var(--surface-2)'
                  const border = showResult ? (opt.isCorrect ? 'var(--green)' : 'var(--red)') : isSel ? 'var(--accent)' : 'var(--border)'
                  return (
                    <div key={opt.id} onClick={() => !checked && setSelected(opt.id)} style={{ alignItems: 'flex-start', background: bg, border: `1.5px solid ${border}`, borderRadius: 'var(--radius)', cursor: checked ? 'default' : 'pointer', display: 'flex', gap: 14, padding: '12px 16px', transition: 'all 0.18s' }}>
                      <span style={{ alignItems: 'center', background: isSel ? 'var(--accent)' : 'var(--surface)', border: `2px solid ${isSel ? 'var(--accent)' : 'var(--border)'}`, borderRadius: 999, color: isSel ? '#fff' : 'var(--text-muted)', display: 'flex', flexShrink: 0, fontSize: '0.72rem', fontWeight: 700, height: 24, justifyContent: 'center', marginTop: 2, transition: 'all 0.18s', width: 24 }}>{letter}</span>
                      <div className="rich-content" style={{ flex: 1, fontSize: '0.92rem', lineHeight: 1.6 }} dangerouslySetInnerHTML={{ __html: opt.html || `<em>Option ${letter}</em>` }} />
                      {checked && opt.isCorrect && <span style={{ color: 'var(--green)', flexShrink: 0, fontSize: '0.75rem', fontWeight: 700, marginTop: 3 }}>✓</span>}
                    </div>
                  )
                })}
              </div>

              {q.tags.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {q.tags.map((t) => <span key={t} className="chip chip-muted">{t}</span>)}
                </div>
              )}

              <div style={{ display: 'flex', gap: 10 }}>
                {!checked ? (
                  <button type="button" className="btn btn-success" style={{ flex: 1 }} onClick={() => setChecked(true)} disabled={!selected}>Check Answer</button>
                ) : (
                  <button type="button" className="btn btn-ghost" onClick={() => { setSelected(null); setChecked(false); setShowSolution(false) }}>Try Again</button>
                )}
                {q.solutionHTML && (
                  <button type="button" className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setShowSolution(v => !v)}>
                    {showSolution ? 'Hide Solution' : 'View Solution'}
                  </button>
                )}
              </div>

              {showSolution && q.solutionHTML && (
                <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '16px 18px' }}>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.06em', marginBottom: 10, textTransform: 'uppercase' }}>Solution</p>
                  <div className="rich-content" style={{ fontSize: '0.9rem', lineHeight: 1.7 }} dangerouslySetInnerHTML={{ __html: q.solutionHTML }} />
                </div>
              )}
            </div>
          )
        })()}

        {entry.kind === 'subjective' && (() => {
          const q = entry.q
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, margin: '0 auto', maxWidth: 760 }}>
              <div style={{ alignItems: 'center', display: 'flex', gap: 10 }}>
                <span style={{ background: 'var(--accent-dim)', borderRadius: 999, color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700, padding: '3px 12px' }}>Q{idx + 1}</span>
                <span style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 999, color: 'var(--text-muted)', fontSize: '0.65rem', fontWeight: 700, padding: '2px 8px' }}>Subjective</span>
              </div>
              <div className="rich-content" style={{ fontSize: '1rem', lineHeight: 1.8 }} dangerouslySetInnerHTML={{ __html: q.questionHTML || '<em style="color:var(--text-muted)">No question text</em>' }} />
              {q.descriptionHTML && (
                <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderLeft: '3px solid var(--accent)', borderRadius: 'var(--radius-sm)', padding: '12px 14px' }}>
                  <div className="rich-content" style={{ fontSize: '0.87rem' }} dangerouslySetInnerHTML={{ __html: q.descriptionHTML }} />
                </div>
              )}
              {q.tags.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {q.tags.map((t) => <span key={t} className="chip chip-muted">{t}</span>)}
                </div>
              )}
              <div style={{ background: 'var(--surface-2)', border: '1.5px dashed var(--border)', borderRadius: 'var(--radius)', color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic', padding: '20px', textAlign: 'center' }}>
                Think through your answer before revealing…
              </div>
              <button type="button" className="btn btn-success" onClick={() => setShowSolution(v => !v)}>
                {showSolution ? 'Hide Answer' : 'Reveal Answer'}
              </button>
              {showSolution && q.solutionHTML && (
                <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '16px 18px' }}>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.06em', marginBottom: 10, textTransform: 'uppercase' }}>{q.aiGenerated ? 'AI-Generated Answer' : 'Solution'}</p>
                  <div className="rich-content" style={{ fontSize: '0.9rem', lineHeight: 1.7 }} dangerouslySetInnerHTML={{ __html: q.solutionHTML }} />
                </div>
              )}
            </div>
          )
        })()}
      </div>

      {/* Footer navigation */}
      <div style={{ alignItems: 'center', background: 'var(--surface)', borderTop: '1px solid var(--border)', display: 'flex', flexShrink: 0, gap: 12, justifyContent: 'space-between', padding: '12px 24px' }}>
        <button type="button" className="btn btn-ghost" onClick={() => goTo(idx - 1)} disabled={idx === 0} style={{ alignItems: 'center', display: 'flex', gap: 6 }}>
          <ChevronLeft size={15} /> Previous
        </button>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{idx + 1} / {total}</span>
        <button type="button" className="btn btn-primary" onClick={() => goTo(idx + 1)} disabled={idx === total - 1} style={{ alignItems: 'center', display: 'flex', gap: 6 }}>
          Next <ChevronRight size={15} />
        </button>
      </div>
    </div>
  )
}

/* ── Difficulty badge helper ─────────────────────────────── */
function DiffBadge({ d }: { d: string }) {
  const color = d === 'Easy' ? 'var(--green)' : d === 'Medium' ? 'var(--amber)' : 'var(--red)'
  const bg = d === 'Easy' ? 'var(--green-dim)' : d === 'Medium' ? 'var(--amber-dim)' : 'rgba(239,68,68,0.1)'
  return <span style={{ background: bg, borderRadius: 999, color, fontSize: '0.65rem', fontWeight: 700, padding: '2px 8px' }}>{d}</span>
}

/* ── Main ReviewMode export ──────────────────────────────── */
export default function ReviewMode({ activeTab, mcqQuestions, subjectiveQuestions }: ReviewModeProps) {
  const [layout, setLayout] = useState<ReviewLayout>('scroll')

  const entries: QuestionEntry[] = activeTab === 'MCQ'
    ? mcqQuestions.map(q => ({ kind: 'mcq' as const, q }))
    : subjectiveQuestions.map(q => ({ kind: 'subjective' as const, q }))

  const empty = entries.length === 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
      {/* Review sub-header */}
      <div style={{ alignItems: 'center', background: 'var(--surface)', borderBottom: '1px solid var(--border)', display: 'flex', flexShrink: 0, gap: 12, justifyContent: 'space-between', padding: '10px 20px' }}>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
          <strong style={{ color: 'var(--text-primary)' }}>{entries.length}</strong> question{entries.length !== 1 ? 's' : ''} · {activeTab}
        </span>

        {/* Layout toggle */}
        <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 999, display: 'inline-flex', gap: 2, padding: 3 }}>
          {([
            { id: 'scroll', label: 'Scroll', Icon: AlignJustify },
            { id: 'paged', label: 'One Per Page', Icon: BookOpen },
          ] as const).map(({ id, label, Icon }) => (
            <button key={id} type="button" onClick={() => setLayout(id)} style={{ alignItems: 'center', background: layout === id ? 'var(--surface)' : 'transparent', border: 'none', borderRadius: 999, boxShadow: layout === id ? '0 1px 4px rgba(15,23,42,0.10)' : 'none', color: layout === id ? 'var(--accent)' : 'var(--text-muted)', cursor: 'pointer', display: 'flex', fontSize: '0.82rem', fontWeight: 600, gap: 6, padding: '5px 16px', transition: 'all 0.18s' }}>
              <Icon size={13} />{label}
            </button>
          ))}
        </div>
      </div>

      {empty && (
        <div style={{ alignItems: 'center', color: 'var(--text-muted)', display: 'flex', flex: 1, flexDirection: 'column', fontSize: '0.9rem', gap: 8, justifyContent: 'center' }}>
          <BookOpen size={36} style={{ opacity: 0.3 }} />
          <p>No {activeTab} questions to review yet.</p>
          <p style={{ fontSize: '0.8rem' }}>Switch to Compose mode to add some.</p>
        </div>
      )}

      {!empty && layout === 'scroll' && (
        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '24px 40px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, margin: '0 auto', maxWidth: 800 }}>
            {entries.map((e, i) =>
              e.kind === 'mcq'
                ? <MCQScrollCard key={e.q.id} question={e.q} index={i} />
                : <SubjScrollCard key={e.q.id} question={e.q} index={i} />
            )}
          </div>
        </div>
      )}

      {!empty && layout === 'paged' && (
        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          <PagedView entries={entries} />
        </div>
      )}
    </div>
  )
}
