import { v4 as uuidv4 } from 'uuid'

// Inline the minimal types needed to avoid cross-directory resolution issues
// in the language server. The real types live in lib/store/questionsStore.ts.
interface MCQQuestion {
  id: string
  num: number
  type: 'MCQ' | 'MSQ'
  questionHTML: string
  options: { id: string; html: string; imageUrl?: string; isCorrect: boolean }[]
  difficulty: 'Easy' | 'Medium' | 'Hard'
  totalMarks: number
  negativeMarks: number
  partialPositive?: number
  partialNegative?: number
  tags: string[]
  solutionHTML: string
  savedAt?: string
  isDirty: boolean
}

interface SubjectiveQuestion {
  id: string
  num: number
  questionHTML: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  aiAnswer?: string
  solutionHTML: string
  descriptionHTML?: string
  tags: string[]
  savedAt?: string
  isDirty: boolean
  aiGenerated?: boolean
}

export function createDefaultMCQ(num: number): MCQQuestion {
  let tags: string[] = []
  try {
    const raw = localStorage.getItem('pinned-tags')
    if (raw) tags = JSON.parse(raw)
  } catch { /* ignore */ }

  let marks = {
    totalMarks: 4,
    negativeMarks: 1,
    partialPositive: 0,
    partialNegative: 0
  }
  try {
    const rawMarks = localStorage.getItem('pinned-marks')
    if (rawMarks) {
      const parsed = JSON.parse(rawMarks)
      if (typeof parsed.totalMarks === 'number') marks = parsed
    }
  } catch { /* ignore */ }

  return {
    id: uuidv4(),
    num,
    type: 'MCQ',
    questionHTML: '',
    options: [
      { id: uuidv4(), html: '', isCorrect: false },
      { id: uuidv4(), html: '', isCorrect: false },
      { id: uuidv4(), html: '', isCorrect: false },
      { id: uuidv4(), html: '', isCorrect: false },
    ],
    difficulty: 'Medium',
    ...marks,
    tags,
    solutionHTML: '',
    isDirty: true,
  }
}

export function createDefaultSubjective(num: number): SubjectiveQuestion {
  let tags: string[] = []
  try {
    const raw = localStorage.getItem('pinned-tags')
    if (raw) tags = JSON.parse(raw)
  } catch { /* ignore */ }

  return {
    id: uuidv4(),
    num,
    questionHTML: '',
    difficulty: 'Medium',
    aiAnswer: undefined,
    solutionHTML: '',
    descriptionHTML: '',
    tags,
    isDirty: true,
    aiGenerated: false,
  }
}
