'use client'

import { useState } from 'react'
import { Download, ChevronDown, BookOpen, Keyboard, FileText, FileJson, FileSpreadsheet } from 'lucide-react'
import { useQuestionsStore } from '@/lib/store/questionsStore'
import {
  exportMCQasCSV,
  exportSubjectiveAsCSV,
  exportAllAsJSON,
} from '@/utils/export'

interface AppShellProps {
  children: React.ReactNode
}

export default function AppShell({ children }: AppShellProps) {
  const [exportOpen, setExportOpen] = useState(false)
  const { mcqQuestions, subjectiveQuestions } = useQuestionsStore()

  const exportOptions = [
    {
      icon: <FileSpreadsheet size={14} />,
      label: 'MCQ as CSV',
      sub: `${mcqQuestions.length} questions`,
      onClick: () => { exportMCQasCSV(mcqQuestions); setExportOpen(false) },
    },
    {
      icon: <FileText size={14} />,
      label: 'Subjective as CSV',
      sub: `${subjectiveQuestions.length} questions`,
      onClick: () => { exportSubjectiveAsCSV(subjectiveQuestions); setExportOpen(false) },
    },
    {
      icon: <FileJson size={14} />,
      label: 'All as JSON',
      sub: 'MCQ + Subjective',
      onClick: () => { exportAllAsJSON(mcqQuestions, subjectiveQuestions); setExportOpen(false) },
    },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header */}
      <header
        style={{
          alignItems: 'center',
          background: 'var(--surface)',
          borderBottom: '1px solid var(--border)',
          boxShadow: '0 1px 0 var(--border)',
          display: 'flex',
          height: 64,
          justifyContent: 'space-between',
          padding: '0 28px',
          position: 'sticky',
          top: 0,
          zIndex: 20,
        }}
      >
        {/* Logo */}
        <div style={{ alignItems: 'center', display: 'flex', gap: 12 }}>
          <div
            style={{
              alignItems: 'center',
              background: 'linear-gradient(135deg, var(--accent-dim) 0%, #dde4ff 100%)',
              borderRadius: 10,
              color: 'var(--accent)',
              display: 'flex',
              height: 36,
              justifyContent: 'center',
              width: 36,
              boxShadow: '0 0 0 1px rgba(79,110,247,0.15)',
            }}
          >
            <BookOpen size={18} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
            <span
              style={{
                color: 'var(--text-primary)',
                fontSize: '1.1rem',
                fontWeight: 700,
                letterSpacing: '-0.025em',
              }}
            >
              Question<span style={{ color: 'var(--accent)' }}>Bank</span>
            </span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem', fontWeight: 400 }}>
              Admin Panel
            </span>
          </div>
        </div>

        {/* Right */}
        <div style={{ alignItems: 'center', display: 'flex', gap: 10 }}>
          <span
            title="Ctrl+S: save all · Ctrl+N: add question · Esc: close preview"
            style={{ color: 'var(--text-muted)', cursor: 'help' }}
          >
            <Keyboard size={14} />
          </span>

          <div style={{ position: 'relative' }}>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => setExportOpen((o) => !o)}
              style={{ gap: 7 }}
            >
              <Download size={13} />
              Export
              <ChevronDown
                size={12}
                style={{
                  transform: exportOpen ? 'rotate(180deg)' : 'rotate(0)',
                  transition: 'transform 0.2s',
                }}
              />
            </button>

            {exportOpen && (
              <>
                {/* Backdrop */}
                <div
                  style={{ bottom: 0, left: 0, position: 'fixed', right: 0, top: 0, zIndex: 98 }}
                  onClick={() => setExportOpen(false)}
                />

                {/* Dropdown panel */}
                <div
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                    boxShadow: '0 8px 24px rgba(15,23,42,0.10), 0 2px 6px rgba(15,23,42,0.06)',
                    minWidth: 220,
                    padding: '6px',
                    position: 'absolute',
                    right: 0,
                    top: 'calc(100% + 8px)',
                    zIndex: 99,
                  }}
                >
                  {/* Header label */}
                  <div
                    style={{
                      color: 'var(--text-muted)',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      letterSpacing: '0.07em',
                      padding: '4px 10px 6px',
                      textTransform: 'uppercase',
                    }}
                  >
                    Export as
                  </div>

                  {exportOptions.map((opt) => (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={opt.onClick}
                      style={{
                        alignItems: 'center',
                        background: 'transparent',
                        border: 'none',
                        borderRadius: 'var(--radius-sm)',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                        display: 'flex',
                        gap: 10,
                        padding: '8px 10px',
                        transition: 'background 0.12s, color 0.12s',
                        width: '100%',
                        textAlign: 'left',
                      }}
                      onMouseEnter={(e) => {
                        const el = e.currentTarget
                        el.style.background = 'var(--accent-dim)'
                        el.style.color = 'var(--accent)'
                      }}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget
                        el.style.background = 'transparent'
                        el.style.color = 'var(--text-secondary)'
                      }}
                    >
                      <span style={{ color: 'inherit', flexShrink: 0 }}>{opt.icon}</span>
                      <span style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <span style={{ fontSize: '0.82rem', fontWeight: 500 }}>{opt.label}</span>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>{opt.sub}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      <main style={{ flex: 1 }}>{children}</main>
    </div>
  )
}
