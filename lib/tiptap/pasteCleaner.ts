/**
 * Cleans pasted HTML from Word / Google Docs:
 * - Removes Word namespace tags
 * - Strips all style/class/id attributes
 * - Keeps only src, href, alt, colspan, rowspan
 * - Uploads base64 images to server, replaces src with URL
 * - Removes empty tags
 */
export async function cleanPastedHTML(html: string): Promise<string> {
  if (typeof window === 'undefined') return html

  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')

  // Remove Word / Office namespace elements
  const nsSelectors = [
    'o\\:p',
    'w\\:*',
    'm\\:*',
    'o\\:p',
    '[class^="Mso"]',
    'style',
    'meta',
    'link',
  ]
  nsSelectors.forEach((sel) => {
    try {
      doc.querySelectorAll(sel).forEach((el) => el.remove())
    } catch {
      // ignore invalid selector
    }
  })

  // Strip attributes from all elements
  const allowedAttrs = new Set(['src', 'href', 'alt', 'colspan', 'rowspan'])
  doc.querySelectorAll('*').forEach((el) => {
    const attrs = Array.from(el.attributes)
    attrs.forEach((attr) => {
      if (!allowedAttrs.has(attr.name.toLowerCase())) {
        el.removeAttribute(attr.name)
      }
    })
  })

  // Find all base64 images and upload them
  const imgs = Array.from(
    doc.querySelectorAll<HTMLImageElement>('img[src^="data:image"]')
  )

  await Promise.all(
    imgs.map(async (img) => {
      try {
        const dataUrl = img.getAttribute('src') ?? ''
        const match = dataUrl.match(/^data:(image\/\w+);base64,(.+)$/)
        if (!match) return
        const mimeType = match[1]
        const base64 = match[2]
        const url = await uploadBase64Image(base64, mimeType)
        img.setAttribute('src', url)
      } catch {
        // keep original src on failure
      }
    })
  )

  // Remove empty tags (but not img, br, hr)
  const voidTags = new Set(['img', 'br', 'hr', 'input', 'meta', 'link'])
  doc.querySelectorAll('*').forEach((el) => {
    if (!voidTags.has(el.tagName.toLowerCase())) {
      if (!el.textContent?.trim() && !el.querySelector('img')) {
        el.remove()
      }
    }
  })

  return doc.body.innerHTML
}

/**
 * Upload a base64 image string to /api/upload
 */
export async function uploadBase64Image(
  base64: string,
  mimeType: string
): Promise<string> {
  const res = await fetch('/api/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ base64, mimeType }),
  })
  if (!res.ok) throw new Error('Upload failed')
  const data = await res.json()
  return data.url as string
}
