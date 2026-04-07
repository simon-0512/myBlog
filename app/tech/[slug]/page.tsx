'use client'

import useSWR from 'swr'
import Link from 'next/link'
import { formatDate } from '@/lib/markdown'
import { useEffect } from 'react'
import { useParams } from 'next/navigation'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface Post {
  slug: string
  title: string
  date: string
  tags: string[]
  excerpt: string
  contentHtml?: string
}

export default function TechPostPage() {
  const params = useParams()
  const slug = params.slug as string

  const { data: post, isLoading } = useSWR<Post>(`/api/tech/${slug}`, fetcher, {
    refreshInterval: 5000,
    revalidateOnFocus: true,
  })

  const { data: allPosts } = useSWR<Post[]>('/api/tech', fetcher, {
    refreshInterval: 5000,
    revalidateOnFocus: true,
  })

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -80px 0px'
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
        }
      })
    }, observerOptions)

    document.querySelectorAll('.reveal').forEach(el => {
      observer.observe(el)
    })

    return () => observer.disconnect()
  }, [post])

  if (isLoading || !post) {
    return (
      <main className="min-h-screen bg-oatmeal pb-20 md:pb-0 flex items-center justify-center">
        <div className="text-charcoal/40 font-mono text-sm">加载中...</div>
      </main>
    )
  }

  const currentIndex = allPosts?.findIndex(p => p.slug === slug) ?? -1
  const prevPost = currentIndex < (allPosts?.length ?? 0) - 1 ? allPosts?.[currentIndex + 1] : null
  const nextPost = currentIndex > 0 ? allPosts?.[currentIndex - 1] : null

  return (
    <main className="min-h-screen bg-oatmeal pb-20 md:pb-0">
      {/* Header */}
      <header className="pt-32 pb-12 px-8">
        <div className="max-w-3xl mx-auto">
          <Link href="/tech" className="inline-flex items-center gap-2 text-charcoal/40 hover:text-terracotta font-mono text-xs mb-8 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            技术
          </Link>

          <div className="flex flex-wrap items-center gap-2 mb-4">
            {post.tags.map(tag => (
              <span key={tag} className="px-2 py-0.5 bg-terracotta/10 text-terracotta text-xs font-mono rounded">
                {tag}
              </span>
            ))}
          </div>

          <Link href="/" className="block group">
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-charcoal leading-tight mb-6 group-hover:text-terracotta transition-colors">
              {post.title}
            </h1>
          </Link>

          <div className="flex items-center gap-4 text-charcoal/40 font-mono text-xs">
            <span>{formatDate(post.date)}</span>
          </div>

          <div className="mt-8 w-24 h-px bg-gradient-to-r from-terracotta to-sage"></div>
        </div>
      </header>

      {/* Article Content */}
      <article className="px-8 pb-32">
        <div className="max-w-3xl mx-auto">
          <div
            className="prose prose-lg max-w-none
              prose-headings:font-serif prose-headings:text-charcoal
              prose-p:font-sans prose-p:text-charcoal/80 prose-p:leading-[2]
              prose-a:text-terracotta prose-a:no-underline hover:prose-a:underline
              prose-blockquote:font-serif prose-blockquote:text-charcoal/80 prose-blockquote:border-l-terracotta
              prose-code:font-mono prose-code:text-terracotta prose-code:bg-ink/5 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
              prose-pre:bg-charcoal prose-pre:text-oatmeal
              prose-strong:text-charcoal prose-em:text-ink
              prose-img:rounded-lg"
            dangerouslySetInnerHTML={{ __html: post.contentHtml || '' }}
          />
        </div>
      </article>

      {/* Post Navigation */}
      <nav className="fixed bottom-20 md:bottom-8 left-0 right-0 px-8">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          {prevPost ? (
            <Link
              href={`/tech/${prevPost.slug}`}
              className="inline-flex items-center gap-2 bg-charcoal/90 text-oatmeal px-4 py-2 rounded-full font-mono text-xs opacity-90 hover:opacity-100 transition-opacity"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 19l-7-7 7-7" />
              </svg>
              <span className="hidden md:inline max-w-[150px] truncate">{prevPost.title}</span>
              <span className="md:hidden">上一篇</span>
            </Link>
          ) : <div />}

          {nextPost ? (
            <Link
              href={`/tech/${nextPost.slug}`}
              className="inline-flex items-center gap-2 bg-charcoal/90 text-oatmeal px-4 py-2 rounded-full font-mono text-xs opacity-90 hover:opacity-100 transition-opacity"
            >
              <span className="hidden md:inline max-w-[150px] truncate">{nextPost.title}</span>
              <span className="md:hidden">下一篇</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ) : <div />}
        </div>
      </nav>
    </main>
  )
}
