import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'

/* ──────────────── Types ──────────────── */

export interface MCQOption {
  id: string
  html: string
  imageUrl?: string
  isCorrect: boolean
}

export interface MCQQuestion {
  id: string
  num: number
  type: 'MCQ' | 'MSQ'
  questionHTML: string
  options: MCQOption[]
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

export interface SubjectiveQuestion {
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

/* ──────────────── Store interface ──────────────── */

interface QuestionsState {
  mcqQuestions: MCQQuestion[]
  subjectiveQuestions: SubjectiveQuestion[]

  // MCQ actions
  addMCQ: (q: MCQQuestion) => void
  updateMCQ: (id: string, patch: Partial<MCQQuestion>) => void
  deleteMCQ: (id: string) => void
  reorderMCQ: (activeId: string, overId: string) => void
  saveMCQ: (id: string) => void

  // Subjective actions
  addSubjective: (q: SubjectiveQuestion) => void
  updateSubjective: (id: string, patch: Partial<SubjectiveQuestion>) => void
  deleteSubjective: (id: string) => void
  reorderSubjective: (activeId: string, overId: string) => void
  saveSubjective: (id: string) => void

  // Bulk save
  saveAll: () => void

  // Import (replaces state)
  importData: (mcq: MCQQuestion[], subjective: SubjectiveQuestion[]) => void
}

/* ──────────────── Store ──────────────── */

export const useQuestionsStore = create<QuestionsState>()(
  persist(
    (set, get) => ({
      mcqQuestions: [],
      subjectiveQuestions: [],

      /* ── MCQ ── */
      addMCQ: (q) =>
        set((s) => ({
          mcqQuestions: [...s.mcqQuestions, q],
        })),

      updateMCQ: (id, patch) =>
        set((s) => ({
          mcqQuestions: s.mcqQuestions.map((q) =>
            q.id === id ? { ...q, ...patch, isDirty: true } : q
          ),
        })),

      deleteMCQ: (id) =>
        set((s) => {
          const filtered = s.mcqQuestions.filter((q) => q.id !== id)
          return {
            mcqQuestions: filtered.map((q, i) => ({ ...q, num: i + 1 })),
          }
        }),

      reorderMCQ: (activeId, overId) =>
        set((s) => {
          const items = [...s.mcqQuestions]
          const from = items.findIndex((q) => q.id === activeId)
          const to = items.findIndex((q) => q.id === overId)
          if (from === -1 || to === -1) return {}
          const [moved] = items.splice(from, 1)
          items.splice(to, 0, moved)
          return {
            mcqQuestions: items.map((q, i) => ({ ...q, num: i + 1 })),
          }
        }),

      saveMCQ: (id) =>
        set((s) => ({
          mcqQuestions: s.mcqQuestions.map((q) =>
            q.id === id
              ? { ...q, isDirty: false, savedAt: new Date().toISOString() }
              : q
          ),
        })),

      /* ── Subjective ── */
      addSubjective: (q) =>
        set((s) => ({
          subjectiveQuestions: [...s.subjectiveQuestions, q],
        })),

      updateSubjective: (id, patch) =>
        set((s) => ({
          subjectiveQuestions: s.subjectiveQuestions.map((q) =>
            q.id === id ? { ...q, ...patch, isDirty: true } : q
          ),
        })),

      deleteSubjective: (id) =>
        set((s) => {
          const filtered = s.subjectiveQuestions.filter((q) => q.id !== id)
          return {
            subjectiveQuestions: filtered.map((q, i) => ({
              ...q,
              num: i + 1,
            })),
          }
        }),

      reorderSubjective: (activeId, overId) =>
        set((s) => {
          const items = [...s.subjectiveQuestions]
          const from = items.findIndex((q) => q.id === activeId)
          const to = items.findIndex((q) => q.id === overId)
          if (from === -1 || to === -1) return {}
          const [moved] = items.splice(from, 1)
          items.splice(to, 0, moved)
          return {
            subjectiveQuestions: items.map((q, i) => ({ ...q, num: i + 1 })),
          }
        }),

      saveSubjective: (id) =>
        set((s) => ({
          subjectiveQuestions: s.subjectiveQuestions.map((q) =>
            q.id === id
              ? { ...q, isDirty: false, savedAt: new Date().toISOString() }
              : q
          ),
        })),

      /* ── Bulk ── */
      saveAll: () =>
        set((s) => {
          const now = new Date().toISOString()
          return {
            mcqQuestions: s.mcqQuestions.map((q) =>
              q.isDirty ? { ...q, isDirty: false, savedAt: now } : q
            ),
            subjectiveQuestions: s.subjectiveQuestions.map((q) =>
              q.isDirty ? { ...q, isDirty: false, savedAt: now } : q
            ),
          }
        }),

      /* ── Import ── */
      importData: (mcq, subjective) =>
        set({ mcqQuestions: mcq, subjectiveQuestions: subjective }),
    }),
    {
      name: 'question-bank-storage',
      version: 1,
    }
  )
)
