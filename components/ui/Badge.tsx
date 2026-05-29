'use client'

type BadgeVariant = 'green' | 'amber' | 'red' | 'accent' | 'muted'

interface BadgeProps {
  label: string
  variant?: BadgeVariant
  size?: 'sm' | 'md'
}

const variantMap: Record<BadgeVariant, string> = {
  green: 'chip chip-green',
  amber: 'chip chip-amber',
  red: 'chip chip-red',
  accent: 'chip chip-accent',
  muted: 'chip chip-muted',
}

export default function Badge({
  label,
  variant = 'muted',
  size = 'sm',
}: BadgeProps) {
  return (
    <span
      className={variantMap[variant]}
      style={{ fontSize: size === 'sm' ? '0.68rem' : '0.78rem' }}
    >
      {label}
    </span>
  )
}
