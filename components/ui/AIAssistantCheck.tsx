'use client'

import { useState } from 'react'
import { Sparkles, X, CheckCircle, AlertTriangle, Info } from 'lucide-react'

const MCQ_INSIGHTS = [
  { type: 'success', text: 'The correct option clearly addresses the question without ambiguity.' },
  { type: 'warning', text: 'Option C seems very similar to Option A. Consider rephrasing or combining.' },
  { type: 'info', text: 'The distractors (wrong options) might be too easy to eliminate.' },
  { type: 'success', text: 'Scoring logic (+/-) perfectly matches the question type.' },
  { type: 'warning', text: 'The solution relies heavily on the options. Add a standalone explanation.' },
  { type: 'info', text: 'Consider making one of the distractors a common misconception.' },
]

const SUBJECTIVE_INSIGHTS = [
  { type: 'success', text: 'The question prompt is highly descriptive and encourages detailed answers.' },
  { type: 'warning', text: 'The description/rubric could be more specific about expected word count or formatting.' },
  { type: 'info', text: 'You might want to add a reference link to the suggested solution.' },
  { type: 'success', text: 'The tags accurately reflect the domains required to answer this subjective query.' },
  { type: 'warning', text: 'The AI-generated answer is slightly brief; you may want to expand it manually.' },
  { type: 'info', text: 'Ensure the difficulty rating aligns with the depth of explanation expected.' },
]

interface AIAssistantCheckProps {
  type: 'MCQ' | 'Subjective'
}

export default function AIAssistantCheck({ type }: AIAssistantCheckProps) {
  const [analyzing, setAnalyzing] = useState(false)
  const [insights, setInsights] = useState<{type: string, text: string}[] | null>(null)

  const handleCheck = () => {
    if (insights) {
      setInsights(null)
      return
    }
    
    setAnalyzing(true)
    setTimeout(() => {
      const source = type === 'MCQ' ? MCQ_INSIGHTS : SUBJECTIVE_INSIGHTS
      const shuffled = [...source].sort(() => 0.5 - Math.random())
      const selected = shuffled.slice(0, Math.floor(Math.random() * 2) + 2)
      setInsights(selected)
      setAnalyzing(false)
    }, 1200)
  }

  return (
    <div style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={handleCheck}
        disabled={analyzing}
        title={`Check ${type} quality with AI`}
        style={{
          alignItems: 'center',
          background: insights ? 'var(--accent)' : 'transparent',
          border: `1px solid ${insights ? 'var(--accent)' : 'var(--border)'}`,
          borderRadius: 'var(--radius-sm)',
          color: insights ? '#fff' : 'var(--accent)',
          cursor: analyzing ? 'wait' : 'pointer',
          display: 'flex',
          fontSize: '0.72rem',
          fontWeight: 600,
          gap: 5,
          padding: '4px 10px',
          transition: 'all 0.15s',
          whiteSpace: 'nowrap',
        }}
      >
        <Sparkles size={11} style={{ animation: analyzing ? 'pulse 1.5s infinite' : 'none' }} />
        {analyzing ? 'Analyzing...' : insights ? 'AI Insights' : 'AI Check'}
      </button>

      {insights && (
        <div style={{
          position: 'absolute',
          bottom: '100%',
          right: 0,
          marginBottom: 8,
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          width: 280,
          zIndex: 100,
          padding: '12px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: 10
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: 8 }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 5 }}>
              <Sparkles size={12} color="var(--accent)" />
              {type} AI Suggestions
            </span>
            <button type="button" onClick={() => setInsights(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}>
              <X size={12} />
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {insights.map((ins, i) => {
              const Icon = ins.type === 'success' ? CheckCircle : ins.type === 'warning' ? AlertTriangle : Info
              const color = ins.type === 'success' ? 'var(--green)' : ins.type === 'warning' ? 'var(--amber)' : 'var(--accent)'
              return (
                <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'flex-start' }}>
                  <Icon size={13} color={color} style={{ marginTop: 2, flexShrink: 0 }} />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-primary)', lineHeight: 1.4 }}>
                    {ins.text}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
