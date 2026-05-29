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
        // Revoke the temporary object URL only after we've replaced it
        try {
          URL.revokeObjectURL(localUrl)
        } catch {}
        return false
      }
    })
  } catch (err) {
    console.error('Image upload failed:', err)
    // Fallback for demo / frontend-only: convert blob to a data URL and
    // replace the object URL so the HTML contains a durable `data:` URL
    // which will persist in the client-side store.
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onerror = () => reject(new Error('Failed to read blob'))
        reader.onload = () => resolve(String(reader.result))
        reader.readAsDataURL(blob)
      })

      view.state.doc.descendants((node, pos) => {
        if (node.type.name === 'image' && node.attrs.src === localUrl) {
          const transaction = view.state.tr.setNodeMarkup(pos, undefined, {
            ...node.attrs,
            src: dataUrl,
          })
          view.dispatch(transaction)
          try {
            URL.revokeObjectURL(localUrl)
          } catch {}
          return false
        }
      })
    } catch (readErr) {
      console.error('Failed to convert image to data URL:', readErr)
      // Keep object URL preview as last resort
    }
  } finally {
    // Do not revoke here; we only revoke after a successful replacement so
    // the local preview remains while upload is in-flight. If upload fails
    // we keep the preview so the user sees what was pasted.
  }
}
