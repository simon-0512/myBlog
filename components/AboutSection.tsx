'use client'

import { useEffect, useRef } from 'react'
import { AboutData, ResumeData } from '@/lib/content'

interface AboutSectionProps {
  about: AboutData
  resume: ResumeData
}

const colorMap: Record<string, string> = {
  terracotta: 'bg-terracotta',
  sage: 'bg-sage',
  ink: 'bg-ink/50',
  charcoal: 'bg-charcoal/30',
}

export default function AboutSection({ about, resume }: AboutSectionProps) {
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
      id="resume"
      className="py-32 px-8 md:py-32 md:px-8"
    >
      <div className="max-w-5xl mx-auto">
        {/* Section Label */}
        <div className="flex items-center gap-6 mb-16 reveal">
          <span className="section-num">04</span>
          <div>
            <h2 className="font-serif text-2xl text-charcoal">关于</h2>
            <p className="font-mono text-xs text-charcoal/40 mt-1 tracking-wider">ABOUT & RESUME</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-16">
          {/* Bio */}
          <div className="reveal">
            <div className="relative pl-10">
              <div className="timeline-line" />

              <h3 className="font-serif text-xl text-charcoal mb-5">我是谁</h3>
              <div className="space-y-4 text-charcoal/70 font-sans text-sm leading-relaxed">
                <p>{about.bio || '前互联网后端开发，现全职投资者。'}</p>
                <p>
                  相信<span className="text-ink font-medium">时间是最好的杠杆</span>
                  ——无论是投资还是个人成长。这个博客记录我的思考碎片、技术笔记和生活点滴。
                </p>
              </div>

              {/* Tags */}
              <div className="mt-6 flex flex-wrap gap-2">
                {about.tags?.map((tag, index) => (
                  <span
                    key={index}
                    className={`px-3 py-1 text-xs rounded-full font-mono ${
                      index === 0
                        ? 'bg-ink/5 text-ink'
                        : index === 1
                        ? 'bg-terracotta/5 text-terracotta'
                        : 'bg-sage/10 text-sage'
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Social Links */}
              <div className="mt-8 flex gap-6">
                {about.github && (
                  <a
                    href={`https://github.com/${about.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs text-charcoal/40 hover:text-terracotta transition-colors"
                  >
                    GitHub
                  </a>
                )}
                {about.twitter && (
                  <a
                    href={`https://twitter.com/${about.twitter}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs text-charcoal/40 hover:text-terracotta transition-colors"
                  >
                    Twitter
                  </a>
                )}
                {about.email && (
                  <a
                    href={`mailto:${about.email}`}
                    className="font-mono text-xs text-charcoal/40 hover:text-terracotta transition-colors"
                  >
                    Email
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="reveal" style={{ animationDelay: '0.1s' }}>
            <div className="relative pl-10">
              <div className="timeline-line" />

              <h3 className="font-serif text-xl text-charcoal mb-6">经历</h3>

              <div className="space-y-8">
                {resume.timeline?.map((item, index) => (
                  <div key={index} className="relative">
                    <div
                      className={`absolute -left-10 top-1 w-3 h-3 rounded-full border-2 border-oatmeal ${
                        colorMap[item.color] || 'bg-charcoal/30'
                      }`}
                    />
                    <span className="font-mono text-xs text-charcoal/40">{item.period}</span>
                    <h4 className="font-sans font-medium text-charcoal mt-1">{item.title}</h4>
                    <p className="font-sans text-sm text-charcoal/50 mt-1">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
