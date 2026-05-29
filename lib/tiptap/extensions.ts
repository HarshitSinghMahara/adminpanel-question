import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableHeader } from '@tiptap/extension-table-header'
import { TableCell } from '@tiptap/extension-table-cell'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'

/**
 * Base extensions without Placeholder (placeholder text is instance-specific).
 * Memoized at module level so they are never recreated on re-render.
 */
export const baseExtensions = [
  StarterKit.configure({
    heading: { levels: [1, 2] },
    // Disabled here — the standalone Underline extension below takes over
    underline: false,
  }),
  Image.configure({
    inline: false,
    allowBase64: false,
    HTMLAttributes: {
      style: 'max-width: 100%; height: auto; border-radius: 4px;',
    },
  }),
  Table.configure({ resizable: true }),
  TableRow,
  TableHeader,
  TableCell,
  TextStyle,
  Color,
  Underline,
]

/**
 * Create full extension list with a specific placeholder.
 * Still stable as long as placeholder text doesn't change on every render.
 */
export function createExtensions(placeholder: string) {
  return [
    ...baseExtensions,
    Placeholder.configure({ placeholder }),
  ]
}
