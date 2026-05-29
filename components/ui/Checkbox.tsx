'use client'

interface CheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
  radio?: boolean
  disabled?: boolean
}

export default function Checkbox({
  checked,
  onChange,
  radio = false,
  disabled = false,
}: CheckboxProps) {
  return (
    <button
      type="button"
      role={radio ? 'radio' : 'checkbox'}
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      style={{
        alignItems: 'center',
        background: checked ? 'var(--green)' : 'transparent',
        border: `2px solid ${checked ? 'var(--green)' : 'var(--border)'}`,
        borderRadius: radio ? '50%' : 'var(--radius-sm)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'inline-flex',
        flexShrink: 0,
        height: 18,
        justifyContent: 'center',
        opacity: disabled ? 0.5 : 1,
        transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
        width: 18,
      }}
    >
      {checked && (
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          style={{ transform: 'scale(1)', transition: 'transform 0.15s' }}
        >
          <path
            d="M2 5L4 7L8 3"
            stroke="#0f1117"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  )
}
