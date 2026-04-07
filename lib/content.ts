import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import remarkHtml from 'remark-html'

const contentDirectory = path.join(process.cwd(), 'content')

// Types
export interface AboutData {
  name: string
  chineseName: string
  englishName: string
  title: string
  tagline: string
  subtitle: string
  region: string
  established: number
  email: string
  github: string
  twitter: string
  instagram: string
  bio?: string
  tags: string[]
  contentHtml?: string
}

export interface ResumeData {
  timeline: {
    period: string
    title: string
    description: string
    color: string
  }[]
  skills: string[]
}

export interface PostFrontmatter {
  title: string
  date: string
  tags: string[]
  excerpt: string
  coverImage?: string
  featured?: boolean
}

export interface Post extends PostFrontmatter {
  slug: string
  contentHtml?: string
}

export interface PhotoMeta {
  src: string
  alt: string
  location: string
  camera: {
    aperture: string
    shutter: string
    iso: number
  }
  width: number
  height: number
  featured?: boolean
  span?: string
}

export interface PhotoManifest {
  photos: PhotoMeta[]
}

// Content Readers
export function getAboutData(): AboutData {
  const filePath = path.join(contentDirectory, 'config', 'about.md')
  const fileContents = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(fileContents)

  return {
    ...data,
    bio: data.bio,
    contentHtml: content,
  } as AboutData
}

export function getResumeData(): ResumeData {
  const filePath = path.join(contentDirectory, 'config', 'resume.md')
  const fileContents = fs.readFileSync(filePath, 'utf8')
  const { data } = matter(fileContents)

  return data as ResumeData
}

export function getThoughtsPosts(): Post[] {
  const postsDirectory = path.join(contentDirectory, 'thoughts')

  if (!fs.existsSync(postsDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(postsDirectory)
  const posts = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '')
      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data } = matter(fileContents)

      return {
        slug,
        ...(data as PostFrontmatter),
      }
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return posts
}

export function getTechPosts(): Post[] {
  const postsDirectory = path.join(contentDirectory, 'tech')

  if (!fs.existsSync(postsDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(postsDirectory)
  const posts = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '')
      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data } = matter(fileContents)

      return {
        slug,
        ...(data as PostFrontmatter),
      }
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return posts
}

export async function getThoughtPost(slug: string): Promise<Post | null> {
  const fullPath = path.join(contentDirectory, 'thoughts', `${slug}.md`)

  if (!fs.existsSync(fullPath)) {
    return null
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  const processedContent = await remark()
    .use(remarkHtml)
    .process(content)
  const contentHtml = processedContent.toString()

  return {
    slug,
    contentHtml,
    ...(data as PostFrontmatter),
  }
}

export async function getTechPost(slug: string): Promise<Post | null> {
  const fullPath = path.join(contentDirectory, 'tech', `${slug}.md`)

  if (!fs.existsSync(fullPath)) {
    return null
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  const processedContent = await remark()
    .use(remarkHtml)
    .process(content)
  const contentHtml = processedContent.toString()

  return {
    slug,
    contentHtml,
    ...(data as PostFrontmatter),
  }
}

export function getPhotoManifest(): PhotoManifest {
  const filePath = path.join(contentDirectory, 'photos', 'photo-manifest.md')

  if (!fs.existsSync(filePath)) {
    return { photos: [] }
  }

  const fileContents = fs.readFileSync(filePath, 'utf8')
  const { data } = matter(fileContents)

  return data as PhotoManifest
}

export function getAllSlugs(directory: 'thoughts' | 'tech'): string[] {
  const postsDirectory = path.join(contentDirectory, directory)

  if (!fs.existsSync(postsDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(postsDirectory)
  return fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => fileName.replace(/\.md$/, ''))
}
