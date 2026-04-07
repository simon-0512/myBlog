import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'content', 'config', 'about.md')
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const { data, content } = matter(fileContents)

    return NextResponse.json({
      ...data,
      bio: content.trim(),
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load about data' }, { status: 500 })
  }
}
