'use client'

import type { Editor } from '@tiptap/react'
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Quote,
  Code,
  Table,
  Image,
  RemoveFormatting,
} from 'lucide-react'
import { useRef } from 'react'
import { uploadImageFile } from '@/lib/tiptap/imageUpload'

interface EditorToolbarProps {
  editor: Editor
}

export default function EditorToolbar({ editor }: EditorToolbarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const url = await uploadImageFile(file)
      editor.chain().focus().setImage({ src: url }).run()
    } catch {
      console.error('Image upload failed')
    }
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const insertTable = () => {
    editor
      .chain()
      .focus()
      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
      .run()
  }

  const ToolBtn = ({
    onClick,
    active,
    title,
    children,
  }: {
    onClick: () => void
    active?: boolean
    title: string
    children: React.ReactNode
  }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`toolbar-btn ${active ? 'active' : ''}`}
    >
      {children}
    </button>
  )

  return (
    <div className="editor-toolbar">
      <ToolBtn
        onClick={() => editor.chain().focus().toggleBold().run()}
        active={editor.isActive('bold')}
        title="Bold (Ctrl+B)"
      >
        <Bold size={13} />
      </ToolBtn>
      <ToolBtn
        onClick={() => editor.chain().focus().toggleItalic().run()}
        active={editor.isActive('italic')}
        title="Italic (Ctrl+I)"
      >
        <Italic size={13} />
      </ToolBtn>
      <ToolBtn
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        active={editor.isActive('underline')}
        title="Underline (Ctrl+U)"
      >
        <Underline size={13} />
      </ToolBtn>
      <ToolBtn
        onClick={() => editor.chain().focus().toggleStrike().run()}
        active={editor.isActive('strike')}
        title="Strikethrough"
      >
        <Strikethrough size={13} />
      </ToolBtn>
      <div className="toolbar-divider" />
      <ToolBtn
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 1 }).run()
        }
        active={editor.isActive('heading', { level: 1 })}
        title="Heading 1"
      >
        <Heading1 size={13} />
      </ToolBtn>
      <ToolBtn
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 2 }).run()
        }
        active={editor.isActive('heading', { level: 2 })}
        title="Heading 2"
      >
        <Heading2 size={13} />
      </ToolBtn>
      <div className="toolbar-divider" />
      <ToolBtn
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        active={editor.isActive('orderedList')}
        title="Ordered List"
      >
        <ListOrdered size={13} />
      </ToolBtn>
      <ToolBtn
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        active={editor.isActive('bulletList')}
        title="Bullet List"
      >
        <List size={13} />
      </ToolBtn>
      <div className="toolbar-divider" />
      <ToolBtn
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        active={editor.isActive('blockquote')}
        title="Blockquote"
      >
        <Quote size={13} />
      </ToolBtn>
      <ToolBtn
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        active={editor.isActive('codeBlock')}
        title="Code Block"
      >
        <Code size={13} />
      </ToolBtn>
      <div className="toolbar-divider" />
      <ToolBtn onClick={insertTable} title="Insert Table">
        <Table size={13} />
      </ToolBtn>
      <ToolBtn
        onClick={() => fileInputRef.current?.click()}
        title="Insert Image"
      >
        <Image size={13} />
      </ToolBtn>
      <div className="toolbar-divider" />
      <ToolBtn
        onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
        title="Clear Formatting"
      >
        <RemoveFormatting size={13} />
      </ToolBtn>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleImageUpload}
      />
    </div>
  )
}
