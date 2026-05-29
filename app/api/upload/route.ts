import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

function extFromMime(mime: string): string {
  const map: Record<string, string> = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/gif': 'gif',
    'image/webp': 'webp',
    'image/svg+xml': 'svg',
    'image/bmp': 'bmp',
  }
  return map[mime] ?? 'png'
}

async function ensureUploadsDir() {
  const dir = path.join(process.cwd(), 'public', 'uploads')
  await mkdir(dir, { recursive: true })
  return dir
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') ?? ''

    let buffer: Buffer
    let ext: string

    if (contentType.includes('multipart/form-data')) {
      // File upload via FormData
      const formData = await request.formData()
      const file = formData.get('file') as File | null
      if (!file) {
        return NextResponse.json({ error: 'No file provided' }, { status: 400 })
      }
      const bytes = await file.arrayBuffer()
      buffer = Buffer.from(bytes)
      ext = extFromMime(file.type)
    } else if (contentType.includes('application/json')) {
      // Base64 upload
      const body = await request.json()
      const { base64, mimeType } = body as {
        base64: string
        mimeType: string
      }
      if (!base64 || !mimeType) {
        return NextResponse.json(
          { error: 'base64 and mimeType required' },
          { status: 400 }
        )
      }
      buffer = Buffer.from(base64, 'base64')
      ext = extFromMime(mimeType)
    } else {
      return NextResponse.json(
        { error: 'Unsupported content type' },
        { status: 415 }
      )
    }

    const filename = `${uuidv4()}.${ext}`
    const dir = await ensureUploadsDir()
    await writeFile(path.join(dir, filename), buffer)

    const url = `/uploads/${filename}`
    return NextResponse.json({ url })
  } catch (err) {
    console.error('Upload error:', err)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
