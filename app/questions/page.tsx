import type { Metadata } from 'next'
import QuestionBank from '@/components/question-bank/QuestionBank'

export const metadata: Metadata = {
  title: 'Questions — QuestionBank',
  description: 'Manage your MCQ and Subjective question bank',
}

export default function QuestionsPage() {
  return <QuestionBank />
}
