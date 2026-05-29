'use client'

import { Cpu } from 'lucide-react'
import RichEditor from '@/components/editor/RichEditor'

interface DescriptionCellProps {
  html: string
  aiGenerated?: boolean
  onChange: (html: string) => void
}

export default function DescriptionCell({
  html,
  aiGenerated = false,
  onChange,
}: DescriptionCellProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {aiGenerated && (
        <span
          className="chip chip-accent"
          style={{ alignSelf: 'flex-end', fontSize: '0.65rem' }}
        >
          <Cpu size={10} />
          AI Generated
        </span>
      )}
      <RichEditor
        content={html}
        onChange={onChange}
        placeholder="Write solution or let AI generate it…"
        minHeight={100}
      />
    </div>
  )
}
