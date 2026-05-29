import type { MCQQuestion, SubjectiveQuestion } from '@/lib/store/questionsStore'
import { stripHtml } from './stripHtml'

export interface ValidationError {
  field: string
  message: string
}

export function validateMCQ(q: MCQQuestion): ValidationError[] {
  const errors: ValidationError[] = []
  if (!stripHtml(q.questionHTML).trim()) {
    errors.push({ field: 'question', message: 'Question cannot be empty' })
  }
  const hasCorrect = q.options.some((o) => o.isCorrect)
  if (!hasCorrect) {
    errors.push({
      field: 'options',
      message: 'At least one correct option must be selected',
    })
  }
  if (q.options.length < 2) {
    errors.push({ field: 'options', message: 'At least 2 options required' })
  }
  return errors
}

export function validateSubjective(q: SubjectiveQuestion): ValidationError[] {
  const errors: ValidationError[] = []
  if (!stripHtml(q.questionHTML).trim()) {
    errors.push({ field: 'question', message: 'Question cannot be empty' })
  }
  return errors
}
