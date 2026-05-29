import type { MCQQuestion, SubjectiveQuestion } from '@/lib/store/questionsStore'
import { stripHtml } from './stripHtml'

/* ──────────────── CSV helpers ──────────────── */

function escapeCsv(val: string | number | undefined): string {
  if (val === undefined || val === null) return ''
  const str = String(val)
  if (str.includes('"') || str.includes(',') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

function downloadText(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

/* ──────────────── MCQ CSV ──────────────── */

export function exportMCQasCSV(questions: MCQQuestion[]) {
  const headers = [
    'num',
    'type',
    'question',
    'option_a',
    'option_b',
    'option_c',
    'option_d',
    'correct_options',
    'difficulty',
    'marks',
    'negative_marks',
    'tags',
    'solution',
  ]

  const rows = questions.map((q) => {
    const opts = q.options
    const correct = q.options
      .map((o, i) => (o.isCorrect ? String.fromCharCode(65 + i) : null))
      .filter(Boolean)
      .join(';')

    return [
      q.num,
      q.type,
      stripHtml(q.questionHTML),
      stripHtml(opts[0]?.html ?? ''),
      stripHtml(opts[1]?.html ?? ''),
      stripHtml(opts[2]?.html ?? ''),
      stripHtml(opts[3]?.html ?? ''),
      correct,
      q.difficulty,
      q.totalMarks,
      q.negativeMarks,
      q.tags.join(';'),
      stripHtml(q.solutionHTML),
    ]
      .map(escapeCsv)
      .join(',')
  })

  const csv = [headers.join(','), ...rows].join('\n')
  downloadText(csv, 'mcq_questions.csv', 'text/csv')
}

/* ──────────────── Subjective CSV ──────────────── */

export function exportSubjectiveAsCSV(questions: SubjectiveQuestion[]) {
  const headers = ['num', 'question', 'difficulty', 'tags', 'solution']

  const rows = questions.map((q) =>
    [
      q.num,
      stripHtml(q.questionHTML),
      q.difficulty,
      q.tags.join(';'),
      stripHtml(q.solutionHTML),
    ]
      .map(escapeCsv)
      .join(',')
  )

  const csv = [headers.join(','), ...rows].join('\n')
  downloadText(csv, 'subjective_questions.csv', 'text/csv')
}

/* ──────────────── JSON Export / Import ──────────────── */

export function exportAllAsJSON(
  mcq: MCQQuestion[],
  subjective: SubjectiveQuestion[]
) {
  const data = { mcq, subjective, exportedAt: new Date().toISOString() }
  downloadText(
    JSON.stringify(data, null, 2),
    'question_bank.json',
    'application/json'
  )
}

export function importFromJSON(
  file: File
): Promise<{ mcq: MCQQuestion[]; subjective: SubjectiveQuestion[] }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        if (!data.mcq || !data.subjective) {
          reject(new Error('Invalid JSON format'))
          return
        }
        resolve({ mcq: data.mcq, subjective: data.subjective })
      } catch {
        reject(new Error('Failed to parse JSON'))
      }
    }
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsText(file)
  })
}
