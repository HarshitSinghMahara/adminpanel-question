/**
 * Upload an image file to /api/upload via FormData.
 * Returns the server URL.
 */
export async function uploadImageFile(file: File): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)
  const res = await fetch('/api/upload', { method: 'POST', body: formData })
  if (!res.ok) throw new Error('Image upload failed')
  const data = await res.json()
  return data.url as string
}
