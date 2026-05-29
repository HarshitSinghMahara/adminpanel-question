import type { Metadata } from 'next'
import '@/styles/globals.css'
import { ToastContainer } from '@/components/ui/Toast'
import AppShell from '@/components/shell/AppShell'

export const metadata: Metadata = {
  title: 'QuestionBank — MCQ & Subjective Question Management',
  description:
    'Professional question bank for creating and managing MCQ and subjective exam questions with rich text editing, AI-powered answers, and CSV/JSON export.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </head>
      <body>
        <AppShell>{children}</AppShell>
        <ToastContainer />
      </body>
    </html>
  )
}
