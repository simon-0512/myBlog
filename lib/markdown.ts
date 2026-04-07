import { remark } from 'remark'
import remarkHtml from 'remark-html'

export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark()
    .use(remarkHtml)
    .process(markdown)
  return result.toString()
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}.${month}.${day}`
}

export function formatDateShort(dateString: string): string {
  const date = new Date(dateString)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${month}.${day}`
}

export function slugToTitle(slug: string): string {
  return slug
    .replace(/^\d{4}-\d{2}-\d{2}-/, '')  // Remove date prefix
    .replace(/-/g, ' ')  // Replace hyphens with spaces
    .replace(/\b\w/g, (l) => l.toUpperCase())  // Capitalize first letter of each word
}
