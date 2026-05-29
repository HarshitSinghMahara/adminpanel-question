'use client'

import RichEditor from '@/components/editor/RichEditor'

interface SolutionCellProps {
  html: string
  onChange: (html: string) => void
}

export default function SolutionCell({ html, onChange }: SolutionCellProps) {
  return (
    <RichEditor
      content={html}
      onChange={onChange}
      placeholder="Explain the correct answer…"
      minHeight={80}
    />
  )
}
