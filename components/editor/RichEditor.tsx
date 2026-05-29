'use client'

import { useEditor, EditorContent, type Editor } from '@tiptap/react'
import { useEffect, useRef, useState, useMemo } from 'react'
import { createExtensions } from '@/lib/tiptap/extensions'
import { cleanPastedHTML } from '@/lib/tiptap/pasteCleaner'
import { uploadAndInsertImage } from '@/lib/tiptap/imagePasteHandler'
import '@/styles/editor.css'

interface RichEditorProps {
  content: string
  onChange: (html: string) => void
  placeholder?: string
  minHeight?: number
  maxImageWidth?: number
  invalid?: boolean
  className?: string
}

export default function RichEditor({
  content,
  onChange,
  placeholder = 'Type here…',
  minHeight = 80,
  maxImageWidth,
  invalid = false,
  className = '',
}: RichEditorProps) {
  const [focused, setFocused] = useState(false)
  const blurTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isUpdatingRef = useRef(false)
  const lastSavedHTMLRef = useRef(content)
  // Stable ref so the paste closure always has the latest editor instance
  const editorRef = useRef<Editor | null>(null)

  const extensions = useMemo(() => createExtensions(placeholder), [placeholder])

  const editor = useEditor({
    extensions,
    content,
    immediatelyRender: false,
    onUpdate({ editor }) {
      if (isUpdatingRef.current) return
      const html = editor.getHTML()
      // Don't persist transient blob: URLs — wait until uploads complete
      if (html.includes('blob:')) return
      // Remember last HTML we saved so the external-sync effect can avoid
      // overwriting it while persistence is in-flight.
      lastSavedHTMLRef.current = html
      // Debug: log whether we're saving and whether a data:image is present
      try {
        // eslint-disable-next-line no-console
        console.log('RichEditor:onUpdate saving, has data url:', html.includes('data:image'))
      } catch {}
      onChange(html)
    },
    onFocus() {
      setFocused(true)
      if (blurTimerRef.current) clearTimeout(blurTimerRef.current)
    },
    onBlur() {
      setFocused(false)
    },
    editorProps: {
      handlePaste(view, event) {
        const items = Array.from(event.clipboardData?.items ?? [])

        // Priority 1: direct image blob
        const imageItem = items.find((item) => item.type.startsWith('image/'))
        if (imageItem) {
          event.preventDefault()
          const blob = imageItem.getAsFile()
          if (blob) uploadAndInsertImage(blob, view)
          return true
        }

        // Priority 2: HTML — strip all inline styles/classes before inserting
        const htmlItem = items.find((item) => item.type === 'text/html')
        if (htmlItem) {
          event.preventDefault()
          htmlItem.getAsString(async (html) => {
            try {
              const clean = await cleanPastedHTML(html)
              const ed = editorRef.current
              if (ed && !ed.isDestroyed) {
                ed.chain().focus().insertContent(clean, {
                  parseOptions: { preserveWhitespace: false },
                }).run()
              }
            } catch (err) {
              console.error('Paste clean error:', err)
              // Fallback: insert as plain text
              const plain = event.clipboardData?.getData('text/plain') ?? ''
              const ed = editorRef.current
              if (ed && !ed.isDestroyed) {
                ed.chain().focus().insertContent(plain).run()
              }
            }
          })
          return true
        }

        return false
      },
      handleDrop(view, event) {
        const files = Array.from(event.dataTransfer?.files ?? [])
        const imageFiles = files.filter((f) => f.type.startsWith('image/'))
        if (imageFiles.length > 0) {
          event.preventDefault()
          imageFiles.forEach((file) => uploadAndInsertImage(file, view))
          return true
        }
        return false
      },
    },
  })

  // Keep ref in sync with latest editor instance
  useEffect(() => {
    editorRef.current = editor
  }, [editor])

  // Sync content when changed externally (e.g. store hydration)
  useEffect(() => {
    if (!editor) return
    const currentHTML = editor.getHTML()
    if (
      content !== currentHTML &&
      // Skip syncing if the incoming `content` matches the last HTML the
      // editor just emitted — this avoids a race where we just saved and
      // the store hasn't propagated the value back yet.
      content !== lastSavedHTMLRef.current &&
      !focused
    ) {
      // Don't overwrite if editor already contains an inlined data image
      // that the persistent `content` doesn't yet have. This prevents
      // a race where the store replaces the editor right after paste.
      if (currentHTML.includes('data:image') && !content.includes('data:image')) {
        return
      }
      isUpdatingRef.current = true
      editor.commands.setContent(content, { emitUpdate: false })
      isUpdatingRef.current = false
    }
  }, [content, editor, focused])

  // Cleanup
  useEffect(() => {
    return () => {
      if (blurTimerRef.current) clearTimeout(blurTimerRef.current)
      if (editor && !editor.isDestroyed) {
        editor.destroy()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      className={`rich-editor-wrapper ${invalid ? 'invalid' : ''} ${className}`}
      style={{ minHeight }}
    >
      <EditorContent
        editor={editor}
        style={{
          minHeight,
          ...(maxImageWidth
            ? { ['--max-img-width' as string]: `${maxImageWidth}px` }
            : {}),
        }}
      />
    </div>
  )
}
