'use client'

import Link from 'next/link'
import { formatDate } from '@/lib/markdown'
import type { Post } from '@/lib/content'

interface TechClientProps {
  posts: Post[]
}

export default function TechClient({ posts }: TechClientProps) {
  return (
    <main className="min-h-screen bg-oatmeal pb-20 md:pb-0">
      {/* Header */}
      <header className="pt-32 pb-16 px-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <div className="dot-accent">
              <span></span><span></span><span></span>
            </div>
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
              <Link
                key={post.slug}
                href={`/tech/${post.slug}`}
                className="block py-8 border-b border-charcoal/5 hover-lift group reveal"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.tags.map(tag => (
                        <span key={tag} className="tech-tag">{tag}</span>
                      ))}
                    </div>

                    <h2 className="font-serif text-xl md:text-2xl text-charcoal group-hover:text-terracotta transition-colors mb-2">
                      {post.title}
                    </h2>

                    <p className="text-charcoal/60 font-sans leading-relaxed max-w-2xl">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <span className="font-mono text-xs text-charcoal/30">{formatDate(post.date)}</span>
                  </div>
                </div>
              </Link>
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
