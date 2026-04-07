'use client'

import Link from 'next/link'
import { formatDate } from '@/lib/markdown'
import { useEffect, useRef } from 'react'

interface TechPost {
  slug: string
  title: string
  date: string
  tags: string[]
  excerpt: string
}

interface TechSectionProps {
  posts: TechPost[]
}

export default function TechSection({ posts }: TechSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -80px 0px' }
    )

    const revealElements = sectionRef.current?.querySelectorAll('.reveal')
    revealElements?.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="tech"
      className="py-32 px-8 md:py-32 md:px-8"
    >
      <div className="max-w-5xl mx-auto">
        {/* Section Label */}
        <div className="flex items-center gap-6 mb-16 reveal">
          <span className="section-num">02</span>
          <div>
            <h2 className="font-serif text-2xl text-charcoal">技术</h2>
            <p className="font-mono text-xs text-charcoal/40 mt-1 tracking-wider">TECHNICAL NOTES</p>
          </div>
        </div>

        {/* Tech Index */}
        <div className="space-y-0">
          {posts.map((post, index) => (
            <Link
              key={post.slug}
              href={`/tech/${post.slug}`}
              className="block py-7 border-b border-charcoal/5 hover-lift group reveal"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                <div className="flex-1">
                  <h3 className="font-serif text-xl text-charcoal group-hover:text-terracotta transition-colors">
                    {post.title}
                  </h3>
                  <p className="font-sans text-sm text-charcoal/50 mt-2">
                    {post.excerpt}
                  </p>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  {post.tags?.[0] && (
                    <span className="tech-tag">{post.tags[0]}</span>
                  )}
                  <span className="font-mono text-xs text-charcoal/30">{formatDate(post.date)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* More Link */}
        <div className="mt-12 text-center reveal">
          <Link
            href="/tech"
            className="inline-flex items-center gap-2 font-mono text-sm text-charcoal/50 hover:text-terracotta transition-colors group"
          >
            查看全部技术笔记
            <svg
              className="w-4 h-4 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
