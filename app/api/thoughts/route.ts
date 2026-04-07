import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export const dynamic = 'force-dynamic'

interface PostFrontmatter {
  title: string
  date: string
  tags: string[]
  excerpt: string
  featured?: boolean
  quote?: string
  closingText?: string
}

interface Post extends PostFrontmatter {
  slug: string
}

export async function GET() {
  try {
    const postsDirectory = path.join(process.cwd(), 'content', 'thoughts')

    if (!fs.existsSync(postsDirectory)) {
      return NextResponse.json([])
    }

    const fileNames = fs.readdirSync(postsDirectory)
    const posts: Post[] = fileNames
      .filter((fileName) => fileName.endsWith('.md'))
      .map((fileName) => {
        const slug = fileName.replace(/\.md$/, '')
        const fullPath = path.join(postsDirectory, fileName)
        const fileContents = fs.readFileSync(fullPath, 'utf8')
        const { data } = matter(fileContents) as unknown as { data: PostFrontmatter }

        return {
          slug,
          ...data,
        }
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    return NextResponse.json(posts)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load thoughts' }, { status: 500 })
  }
}
