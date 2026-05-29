import { useState } from 'react'
import { Pin } from 'lucide-react'

interface ScoringCellProps {
  type: 'MCQ' | 'MSQ'
  totalMarks: number
  negativeMarks: number
  partialPositive?: number
  partialNegative?: number
  colWidth?: number
  onChange: (patch: {
    totalMarks?: number
    negativeMarks?: number
    partialPositive?: number
    partialNegative?: number
  }) => void
}

const NumInput = ({
  label, value, field, labelColor, onChange
}: {
  label: string; value: number; field: string; labelColor?: string; onChange: (field: string, val: number) => void
}) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
    <label style={{
      color: labelColor ?? 'var(--text-muted)',
      fontSize: '0.62rem',
      fontWeight: 700,
      letterSpacing: '0.05em',
      textTransform: 'uppercase',
    }}>
      {label}
    </label>
    <input
      type="number"
      value={value}
      step="0.5"
      min="0"
      onChange={(e) => onChange(field, parseFloat(e.target.value) || 0)}
      style={{
        background: 'var(--surface-2)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-sm)',
        color: 'var(--text-primary)',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.82rem',
        fontWeight: 600,
        padding: '4px 6px',
        textAlign: 'center',
        width: 54,
      }}
    />
  </div>
)

export default function ScoringCell({
  type, totalMarks, negativeMarks,
  partialPositive = 0, partialNegative = 0, colWidth = 96, onChange,
}: ScoringCellProps) {
  const wide = colWidth >= 130

  const [pinActive, setPinActive] = useState<boolean>(() => {
    try {
      const raw = localStorage.getItem('pinned-marks')
      if (raw) {
        const parsed = JSON.parse(raw)
        return parsed.totalMarks === totalMarks && 
               parsed.negativeMarks === negativeMarks && 
               (parsed.partialPositive || 0) === partialPositive && 
               (parsed.partialNegative || 0) === partialNegative
      }
    } catch { /* ignore */ }
    return false
  })

  const handlePinToggle = () => {
    const next = !pinActive
    setPinActive(next)
    if (next) {
      try {
        localStorage.setItem('pinned-marks', JSON.stringify({ 
          totalMarks, negativeMarks, partialPositive, partialNegative 
        }))
      } catch { /* ignore */ }
    } else {
      localStorage.removeItem('pinned-marks')
    }
  }

  const handleMarkChange = (field: string, val: number) => {
    const updated = {
      totalMarks, negativeMarks, partialPositive, partialNegative,
      [field]: val
    }
    onChange({ [field]: val })
    
    if (pinActive) {
      try { localStorage.setItem('pinned-marks', JSON.stringify(updated)) } catch {}
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div
        style={{
          display: 'flex',
          flexDirection: wide ? 'row' : 'column',
          flexWrap: 'wrap',
          gap: wide ? 8 : 7,
          alignItems: wide ? 'flex-end' : 'flex-start',
        }}
      >
        <NumInput label="Marks" value={totalMarks} field="totalMarks" labelColor="var(--green)" onChange={handleMarkChange} />
        <NumInput label="Neg" value={negativeMarks} field="negativeMarks" labelColor="var(--red)" onChange={handleMarkChange} />
        {type === 'MSQ' && (
          <>
            <NumInput label="Part+" value={partialPositive} field="partialPositive" labelColor="var(--accent)" onChange={handleMarkChange} />
            <NumInput label="Part−" value={partialNegative} field="partialNegative" labelColor="var(--amber)" onChange={handleMarkChange} />
          </>
        )}
      </div>
      <button
        type="button"
        title={pinActive ? 'Unpin marks from future questions' : 'Apply these marks to all future new questions'}
        onClick={handlePinToggle}
        style={{
          alignItems: 'center',
          background: pinActive ? 'var(--accent-dim)' : 'transparent',
          border: `1px solid ${pinActive ? 'var(--accent)' : 'var(--border)'}`,
          borderRadius: 'var(--radius-sm)',
          color: pinActive ? 'var(--accent)' : 'var(--text-muted)',
          cursor: 'pointer',
          display: 'inline-flex',
          fontSize: '0.65rem',
          fontWeight: 600,
          gap: 4,
          padding: '3px 8px',
          transition: 'all 0.15s',
          whiteSpace: 'nowrap',
          width: 'fit-content'
        }}
      >
        <Pin size={10} style={{ transform: pinActive ? 'rotate(-45deg)' : 'none', transition: 'transform 0.15s' }} />
        {pinActive ? 'Pinned' : 'Pin Marks'}
      </button>
    </div>
  )
}
