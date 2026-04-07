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

export default function ThoughtPostPage() {
  const params = useParams()
  const slug = params.slug as string

  const { data: post, isLoading } = useSWR<Post>(`/api/thoughts/${slug}`, fetcher, {
    refreshInterval: 5000,
    revalidateOnFocus: true,
  })

  const { data: allPosts } = useSWR<Post[]>('/api/thoughts', fetcher, {
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
      <main className="min-h-screen bg-cream/50 pb-20 md:pb-0 flex items-center justify-center">
        <div className="text-charcoal/40 font-mono text-sm">加载中...</div>
      </main>
    )
  }

  const currentIndex = allPosts?.findIndex(p => p.slug === slug) ?? -1
  const prevPost = currentIndex < (allPosts?.length ?? 0) - 1 ? allPosts?.[currentIndex + 1] : null
  const nextPost = currentIndex > 0 ? allPosts?.[currentIndex - 1] : null

  return (
    <main className="min-h-screen bg-cream/50 pb-20 md:pb-0">
      {/* Header */}
      <header className="pt-32 pb-12 px-8">
        <div className="max-w-2xl mx-auto">
          <Link href="/thoughts" className="inline-flex items-center gap-2 text-charcoal/40 hover:text-terracotta font-mono text-xs mb-8 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            思考
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
        <div className="max-w-2xl mx-auto">
          <div
            className="article-content"
            dangerouslySetInnerHTML={{ __html: post.contentHtml || '' }}
          />
        </div>
      </article>

      {/* Post Navigation */}
      <nav className="fixed bottom-20 md:bottom-8 left-0 right-0 px-8">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          {prevPost ? (
            <Link
              href={`/thoughts/${prevPost.slug}`}
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
              href={`/thoughts/${nextPost.slug}`}
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

      <style jsx>{`
        .article-content {
          font-family: 'Inter', sans-serif;
          color: rgba(44, 44, 44, 0.85);
          line-height: 1.8;
        }

        .article-content :global(h1) {
          font-family: 'Noto Serif SC', serif;
          font-size: 2rem;
          font-weight: 600;
          color: #2c2c2c;
          margin-top: 3rem;
          margin-bottom: 1.5rem;
          line-height: 1.4;
        }

        .article-content :global(h2) {
          font-family: 'Noto Serif SC', serif;
          font-size: 1.5rem;
          font-weight: 600;
          color: #2c2c2c;
          margin-top: 2.5rem;
          margin-bottom: 1rem;
          line-height: 1.4;
        }

        .article-content :global(h3) {
          font-family: 'Noto Serif SC', serif;
          font-size: 1.25rem;
          font-weight: 600;
          color: #2c2c2c;
          margin-top: 2rem;
          margin-bottom: 0.75rem;
          line-height: 1.4;
        }

        .article-content :global(h4) {
          font-family: 'Noto Serif SC', serif;
          font-size: 1.1rem;
          font-weight: 600;
          color: #2c2c2c;
          margin-top: 1.5rem;
          margin-bottom: 0.5rem;
        }

        .article-content :global(p) {
          margin-bottom: 1.5rem;
          font-size: 1.0625rem;
          line-height: 1.9;
        }

        .article-content :global(strong) {
          font-weight: 600;
          color: #1a3a3a;
        }

        .article-content :global(em) {
          font-style: italic;
          color: #1a3a3a;
        }

        .article-content :global(a) {
          color: #b85c4b;
          text-decoration: none;
          border-bottom: 1px solid transparent;
          transition: border-color 0.2s;
        }

        .article-content :global(a:hover) {
          border-bottom-color: #b85c4b;
        }

        .article-content :global(blockquote) {
          margin: 2rem 0;
          padding: 1.25rem 1.5rem;
          border-left: 3px solid #b85c4b;
          background: rgba(26, 58, 58, 0.03);
          border-radius: 0 8px 8px 0;
        }

        .article-content :global(blockquote p) {
          margin: 0;
          font-family: 'Noto Serif SC', serif;
          font-size: 1.125rem;
          font-style: italic;
          color: rgba(44, 44, 44, 0.85);
        }

        .article-content :global(ul),
        .article-content :global(ol) {
          margin: 1.5rem 0;
          padding-left: 1.5rem;
        }

        .article-content :global(li) {
          margin-bottom: 0.75rem;
          line-height: 1.8;
        }

        .article-content :global(code) {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.9em;
          background: rgba(26, 58, 58, 0.06);
          padding: 0.15rem 0.4rem;
          border-radius: 4px;
          color: #b85c4b;
        }

        .article-content :global(pre) {
          margin: 1.5rem 0;
          padding: 1.25rem;
          background: #2c2c2c;
          border-radius: 8px;
          overflow-x: auto;
        }

        .article-content :global(pre code) {
          background: transparent;
          color: #f5f4ef;
          padding: 0;
          font-size: 0.875rem;
          line-height: 1.6;
        }

        .article-content :global(hr) {
          margin: 2.5rem 0;
          border: none;
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(44, 44, 44, 0.1), transparent);
        }

        .article-content :global(img) {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 1.5rem 0;
        }
      `}</style>
    </main>
  )
}
