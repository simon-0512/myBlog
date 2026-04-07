'use client'

import Link from 'next/link'
import { formatDate } from '@/lib/markdown'
import { useEffect, useRef } from 'react'

interface ThoughtPost {
  slug: string
  title: string
  date: string
  tags: string[]
  excerpt: string
  featured?: boolean
  contentHtml?: string
}

interface ThoughtsSectionProps {
  posts: ThoughtPost[]
}

export default function ThoughtsSection({ posts }: ThoughtsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)

  // Get featured post or most recent one
  const featuredPost = posts.find((post) => post.featured) || posts[0]

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

  if (!featuredPost) {
    return null
  }

  // Extract first paragraph for preview
  const getPreviewContent = (html: string) => {
    if (!html) return ''
    // Get first ~200 characters of text content
    const textContent = html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
    return textContent.slice(0, 300) + (textContent.length > 300 ? '...' : '')
  }

  return (
    <section
      ref={sectionRef}
      id="thoughts"
      className="py-32 px-8 bg-cream/50 md:py-32 md:px-8"
    >
      <div className="max-w-3xl mx-auto">
        {/* Section Label */}
        <div className="flex items-center gap-6 mb-16 reveal">
          <span className="section-num">01</span>
          <div>
            <h2 className="font-serif text-2xl text-charcoal">思考</h2>
            <p className="font-mono text-xs text-charcoal/40 mt-1 tracking-wider">THOUGHTS & ESSAYS</p>
          </div>
        </div>

        {/* Editor's Note Style */}
        <article className="relative pl-10 border-l-2 border-ink/10">
          <div className="quote-mark">"</div>

          <div className="relative">
            {/* Content preview */}
            <p className="drop-cap text-lg font-sans leading-[2] text-charcoal/85 mb-10 reveal">
              {featuredPost.excerpt || getPreviewContent(featuredPost.contentHtml || '')}
            </p>

            {/* Continue reading prompt */}
            <p className="text-lg font-sans leading-[2] text-charcoal/85 mb-10 reveal">
              这个博客就是想记录这些&quot;看似无用&quot;的想法。没有精准的买点提示，没有华丽的收益截图。只是一些关于商业本质的思考，关于人性的观察，关于<span className="text-terracotta font-medium">时间的价值</span>。
            </p>

            {/* Blockquote */}
            <blockquote className="relative pl-8 py-6 my-14 bg-ink/5 rounded-r-lg reveal">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-terracotta to-sage rounded-full" />
              <p className="font-serif text-xl text-charcoal/80 leading-relaxed">
                &quot;时间是投资者最好的朋友，也是普通人最大的杠杆。&quot;
              </p>
            </blockquote>

            {/* Continue link */}
            <p className="text-lg font-sans leading-[2] text-charcoal/85 reveal">
              投资这件事，最终比拼的是谁更能&quot;看见&quot;未来。而&quot;看见&quot;的能力，需要不断训练。所以，写下来；所以，<span className="highlight">思考下去</span>。
            </p>
          </div>

          {/* Meta */}
          <div className="mt-12 flex items-center gap-4 text-charcoal/40 font-mono text-xs reveal">
            {featuredPost.tags?.[0] && (
              <span className="px-2 py-1 bg-terracotta/10 text-terracotta rounded">
                {featuredPost.tags[0]}
              </span>
            )}
            <span>{formatDate(featuredPost.date)}</span>
          </div>
        </article>

        {/* Archive Link */}
        <div className="mt-12 text-center reveal">
          <Link
            href="/thoughts"
            className="inline-flex items-center gap-2 font-mono text-sm text-charcoal/50 hover:text-terracotta transition-colors group"
          >
            查看全部思考
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
