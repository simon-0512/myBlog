import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'content', 'config', 'resume.md')
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const { data } = matter(fileContents)

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load resume data' }, { status: 500 })
  }
}
