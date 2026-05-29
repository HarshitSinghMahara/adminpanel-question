'use client'

import { useState } from 'react'
import { Sparkles, RefreshCw, CheckCircle2 } from 'lucide-react'
import { stripHtml } from '@/utils/stripHtml'
import { showToast } from '@/components/ui/Toast'

interface AIAnswerButtonProps {
  questionHTML: string
  hasAnswer: boolean
  onStreamStart: () => void
  onChunk: (chunk: string) => void
  onComplete: () => void
}

export default function AIAnswerButton({
  questionHTML,
  hasAnswer,
  onStreamStart,
  onChunk,
  onComplete,
}: AIAnswerButtonProps) {
  const [generating, setGenerating] = useState(false)

  const generate = async () => {
    if (generating) return
    setGenerating(true)
    onStreamStart()

    try {
      const questionText = stripHtml(questionHTML)
      const res = await fetch('/api/ai-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: questionText }),
      })

      if (!res.ok) throw new Error('AI request failed')

      const reader = res.body?.getReader()
      if (!reader) throw new Error('No response body')

      const decoder = new TextDecoder()
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        onChunk(chunk)
      }

      onComplete()
      showToast('AI answer generated', 'success')
    } catch (err) {
      console.error('AI answer error:', err)
      showToast('Failed to generate AI answer', 'error')
    } finally {
      setGenerating(false)
    }
  }

  if (hasAnswer) {
    return (
      <button
        type="button"
        onClick={generate}
        disabled={generating}
        title="Regenerate AI answer"
        style={{
          alignItems: 'center',
          background: 'var(--green-dim)',
          border: '1px solid transparent',
          borderRadius: 999,
          color: 'var(--green)',
          cursor: generating ? 'not-allowed' : 'pointer',
          display: 'inline-flex',
          fontSize: '0.68rem',
          fontWeight: 600,
          gap: 4,
          padding: '3px 10px',
          transition: 'all 0.15s',
          whiteSpace: 'nowrap',
        }}
      >
        {generating ? (
          <><RefreshCw size={11} style={{ animation: 'spin 1s linear infinite' }} /> Regenerating…</>
        ) : (
          <><CheckCircle2 size={11} /> AI ✓</>
        )}
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={generate}
      disabled={generating}
      style={{
        alignItems: 'center',
        background: generating ? 'var(--surface-2)' : 'var(--accent-dim)',
        border: `1px solid ${generating ? 'var(--border)' : 'rgba(79,110,247,0.25)'}`,
        borderRadius: 999,
        color: generating ? 'var(--text-muted)' : 'var(--accent)',
        cursor: generating ? 'not-allowed' : 'pointer',
        display: 'inline-flex',
        fontSize: '0.68rem',
        fontWeight: 600,
        gap: 4,
        padding: '3px 10px',
        transition: 'all 0.2s',
        whiteSpace: 'nowrap',
      }}
    >
      {generating ? (
        <><RefreshCw size={11} style={{ animation: 'spin 1s linear infinite' }} /> Generating…</>
      ) : (
        <><Sparkles size={11} /> Answer with AI</>
      )}
    </button>
  )
}
