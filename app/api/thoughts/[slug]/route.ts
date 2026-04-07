import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import remarkHtml from 'remark-html'

export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const fullPath = path.join(process.cwd(), 'content', 'thoughts', `${slug}.md`)

    if (!fs.existsSync(fullPath)) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    const processedContent = await remark()
      .use(remarkHtml)
      .process(content)
    const contentHtml = processedContent.toString()

    return NextResponse.json({
      slug,
      contentHtml,
      ...data,
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load post' }, { status: 500 })
  }
}
