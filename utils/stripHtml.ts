/**
 * Strips all HTML tags from a string and returns plain text.
 */
export function stripHtml(html: string): string {
  if (!html) return ''
  // Server-safe: use regex if DOMParser not available
  if (typeof window === 'undefined') {
    return html
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, ' ')
      .trim()
  }
  const div = document.createElement('div')
  div.innerHTML = html
  return (div.textContent ?? div.innerText ?? '').replace(/\s+/g, ' ').trim()
}
