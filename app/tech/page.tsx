'use client'

import useSWR from 'swr'
import Link from 'next/link'
import { formatDate } from '@/lib/markdown'
import { useEffect } from 'react'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface Post {
  slug: string
  title: string
  date: string
  tags: string[]
  excerpt: string
}

export default function TechPage() {
  const { data: posts, isLoading } = useSWR<Post[]>('/api/tech', fetcher, {
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

    const observe = () => {
      document.querySelectorAll('.reveal').forEach(el => {
        observer.observe(el)
      })
    }

    observe()
    const interval = setInterval(observe, 1000)

    return () => {
      observer.disconnect()
      clearInterval(interval)
    }
  }, [])

  if (isLoading || !posts) {
    return (
      <main className="min-h-screen bg-oatmeal pb-20 md:pb-0 flex items-center justify-center">
        <div className="text-charcoal/40 font-mono text-sm">加载中...</div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-oatmeal pb-20 md:pb-0">
      {/* Header */}
      <header className="pt-32 pb-16 px-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <div className="dot-accent">
              <span></span><span></span><span></span>
            </div>
            <span className="font-mono text-xs text-charcoal/50 tracking-wider">SIMON</span>
          </div>

          <h1 className="font-serif text-5xl md:text-6xl text-charcoal mb-4">技术</h1>
          <p className="font-mono text-sm text-charcoal/40 tracking-wider">TECHNICAL NOTES</p>

          <div className="mt-8 w-24 h-px bg-gradient-to-r from-terracotta to-sage"></div>
        </div>
      </header>

      {/* Posts List */}
      <section className="px-8 pb-32">
        <div className="max-w-5xl mx-auto">
          <div className="space-y-0">
            {posts.map((post, index) => (
              <article
                key={post.slug}
                className="reveal py-10 border-b border-charcoal/5"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Link href={`/tech/${post.slug}`} className="group">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="px-2 py-0.5 bg-terracotta/10 text-terracotta text-xs font-mono rounded">
                      {post.tags[0]}
                    </span>
                    {post.tags.slice(1, 3).map(tag => (
                      <span key={tag} className="px-2 py-0.5 bg-ink/5 text-ink/60 text-xs font-mono rounded">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <h2 className="font-serif text-2xl text-charcoal group-hover:text-terracotta transition-colors mb-2">
                    {post.title}
                  </h2>

                  <p className="text-charcoal/60 font-sans leading-relaxed mb-4">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center gap-4 text-charcoal/40 font-mono text-xs">
                    <span>{formatDate(post.date)}</span>
                    <span className="w-1 h-1 rounded-full bg-charcoal/20"></span>
                    <span>阅读更多 →</span>
                  </div>
                </Link>
              </article>
            ))}
          </div>

          {posts.length === 0 && (
            <div className="text-center py-20 text-charcoal/40">
              <p className="font-serif text-xl">暂无技术笔记</p>
              <p className="font-mono text-sm mt-2">tech directory is empty</p>
            </div>
          )}
        </div>
      </section>

      {/* Back to Home */}
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 md:bottom-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-charcoal text-oatmeal px-5 py-2.5 rounded-full font-mono text-xs opacity-90 hover:opacity-100 transition-opacity"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          返回首页
        </Link>
      </div>
    </main>
  )
}
