import type { EditorView } from '@tiptap/pm/view'

/**
 * Upload a File/Blob to /api/upload and insert into editor.
 * Shows a local object URL placeholder immediately, replaces on success.
 */
export async function uploadAndInsertImage(
  blob: File | Blob,
  view: EditorView
): Promise<void> {
  // Demo-only behavior: convert the blob to a `data:` URL immediately and
  // insert that into the editor. This bypasses any server upload and works
  // offline, at the expense of larger stored HTML payloads.
  try {
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onerror = () => reject(new Error('Failed to read blob'))
      reader.onload = () => resolve(String(reader.result))
      reader.readAsDataURL(blob)
    })

    const { state, dispatch } = view
    const { tr, schema } = state
    const imageNode = schema.nodes.image?.create({ src: dataUrl })
    if (!imageNode) return

    dispatch(tr.replaceSelectionWith(imageNode))
  } catch (err) {
    console.error('Failed to insert image as data URL:', err)
  }
}
