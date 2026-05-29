import type { EditorView } from '@tiptap/pm/view'

/**
 * Upload a File/Blob to /api/upload and insert into editor.
 * Shows a local object URL placeholder immediately, replaces on success.
 */
export async function uploadAndInsertImage(
  blob: File | Blob,
  view: EditorView
): Promise<void> {
  const localUrl = URL.createObjectURL(blob)

  // Insert placeholder with local object URL
  const { state, dispatch } = view
  const { tr, schema } = state
  const imageNode = schema.nodes.image?.create({ src: localUrl })
  if (!imageNode) return

  dispatch(tr.replaceSelectionWith(imageNode))

  try {
    const formData = new FormData()
    formData.append('file', blob)

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    if (!res.ok) throw new Error('Upload failed')
    const { url } = await res.json()

    // Replace local URL with server URL in editor
    view.state.doc.descendants((node, pos) => {
      if (node.type.name === 'image' && node.attrs.src === localUrl) {
        const transaction = view.state.tr.setNodeMarkup(pos, undefined, {
          ...node.attrs,
          src: url,
        })
        view.dispatch(transaction)
        return false
      }
    })
  } catch (err) {
    console.error('Image upload failed:', err)
    // Keep local URL as fallback — user sees image but it won't persist
  } finally {
    URL.revokeObjectURL(localUrl)
  }
}
