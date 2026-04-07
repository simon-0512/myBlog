'use client'

import { useEffect } from 'react'
import useSWR from 'swr'
import Link from 'next/link'
import { formatDate } from '@/lib/markdown'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface AboutData {
  chineseName: string
  englishName: string
  tagline: string
  region: string
  established: number
  email: string
  github: string
  twitter: string
  instagram: string
  bio?: string
  tags: string[]
}

interface TimelineItem {
  period: string
  title: string
  description: string
  color: string
}

interface ResumeData {
  timeline: TimelineItem[]
  skills: string[]
}

interface Post {
  slug: string
  title: string
  date: string
  tags: string[]
  excerpt: string
  featured?: boolean
}

interface Photo {
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
  size: 'small' | 'medium' | 'large' | 'wide'
}

interface PhotoManifest {
  photos: Photo[]
}

export default function HomeClient() {
  const { data: about } = useSWR<AboutData>('/api/about', fetcher, {
    refreshInterval: 5000,
    revalidateOnFocus: true,
  })

  const { data: resume } = useSWR<ResumeData>('/api/resume', fetcher, {
    refreshInterval: 5000,
    revalidateOnFocus: true,
  })

  const { data: thoughts } = useSWR<Post[]>('/api/thoughts', fetcher, {
    refreshInterval: 5000,
    revalidateOnFocus: true,
  })

  const { data: techPosts } = useSWR<Post[]>('/api/tech', fetcher, {
    refreshInterval: 5000,
    revalidateOnFocus: true,
  })

  const { data: photos } = useSWR<PhotoManifest>('/api/photos', fetcher, {
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

    // Re-observe on data changes
    const interval = setInterval(observe, 1000)

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault()
        const href = anchor.getAttribute('href')
        if (href) {
          const target = document.querySelector(href)
          if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        }
      })
    })

    return () => {
      observer.disconnect()
      clearInterval(interval)
    }
  }, [])

  if (!about || !resume || !thoughts || !techPosts || !photos) {
    return (
      <main className="min-h-screen bg-oatmeal flex items-center justify-center">
        <div className="text-charcoal/40 font-mono text-sm">加载中...</div>
      </main>
    )
  }

  const featuredThought = thoughts.find(p => p.featured) || thoughts[0]

  return (
    <main>
      {/* Banner / Masthead */}
      <header className="banner-section flex flex-col justify-center px-8 pt-24 pb-16">
        <div className="banner-bg"></div>
        <div className="banner-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
        </div>

        <div className="absolute top-32 left-8 w-px h-32 bg-gradient-to-b from-transparent via-ink/20 to-transparent"></div>
        <div className="absolute bottom-32 right-12 w-24 h-px bg-gradient-to-r from-transparent via-terracotta/30 to-transparent"></div>

        <div className="max-w-7xl mx-auto w-full relative z-10">
          <p className="flex items-center gap-3 font-mono text-xs tracking-[0.3em] text-charcoal/40 mb-6 reveal">
            <span className="inline-block w-8 h-px bg-terracotta"></span>
            投资 / 技术 / 摄影 / 生活
          </p>

          <h1 className="masthead-name font-serif text-[14vw] lg:text-[11vw] xl:text-[9vw] leading-[0.88] tracking-tight text-charcoal mb-8">
            {about.chineseName.split('')[0]}<br />
            <span className="text-ink">{about.englishName.split(' ')[1]}</span>
          </h1>

          <div className="max-w-xl ml-1 reveal">
            <p className="text-lg font-sans text-charcoal/60 leading-relaxed mb-6">
              {about.tagline}
            </p>
            <div className="flex items-center gap-4">
              <span className="font-mono text-xs text-sage tracking-wider">{about.region.toUpperCase()}</span>
              <span className="w-1 h-1 rounded-full bg-terracotta"></span>
              <span className="font-mono text-xs text-charcoal/40">EST. {about.established}</span>
            </div>
          </div>

          <div className="mt-20 flex items-center gap-4 reveal">
            <div className="w-16 h-px bg-gradient-to-r from-charcoal/30 to-transparent"></div>
            <span className="font-mono text-xs text-charcoal/40 tracking-widest">SCROLL</span>
            <svg className="w-4 h-4 text-charcoal/30 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </header>

      {/* Thoughts Section */}
      <section id="thoughts" className="py-32 px-8 bg-cream/50">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-6 mb-16 reveal">
            <span className="section-num">01</span>
            <div>
              <h2 className="font-serif text-2xl text-charcoal">思考</h2>
              <p className="font-mono text-xs text-charcoal/40 mt-1 tracking-wider">THOUGHTS & ESSAYS</p>
            </div>
          </div>

          {featuredThought && (
            <article className="relative pl-10 border-l-2 border-ink/10">
              <div className="quote-mark">"</div>

              <div className="relative">
                <p className="drop-cap text-lg font-sans leading-[2] text-charcoal/85 mb-10 reveal">
                  {featuredThought.excerpt}
                </p>

                {featuredThought.quote && (
                  <blockquote className="relative pl-8 py-6 my-14 bg-ink/5 rounded-r-lg reveal">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-terracotta to-sage rounded-full"></div>
                    <p className="font-serif text-xl text-charcoal/80 leading-relaxed">
                      "{featuredThought.quote}"
                    </p>
                  </blockquote>
                )}

                {featuredThought.closingText && (
                  <p className="text-lg font-sans leading-[2] text-charcoal/85 reveal">
                    {featuredThought.closingText}
                  </p>
                )}
              </div>

              <div className="mt-8 flex items-center gap-4 text-charcoal/40 font-mono text-xs reveal">
                <span className="px-2 py-1 bg-terracotta/10 text-terracotta rounded">{featuredThought.tags[0]}</span>
                <span>{formatDate(featuredThought.date)}</span>
                <Link
                  href={`/thoughts/${featuredThought.slug}`}
                  className="inline-flex items-center gap-1 text-terracotta hover:text-terracotta/70 transition-colors ml-4"
                >
                  查看全文
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </article>
          )}
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-7xl mx-auto px-8">
        <div className="separator"></div>
      </div>

      {/* Tech Section */}
      <section id="tech" className="py-32 px-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-6 mb-16 reveal">
            <span className="section-num">02</span>
            <div>
              <h2 className="font-serif text-2xl text-charcoal">技术</h2>
              <p className="font-mono text-xs text-charcoal/40 mt-1 tracking-wider">TECHNICAL NOTES</p>
            </div>
          </div>

          <div className="space-y-0">
            {techPosts.slice(0, 4).map((post, index) => (
              <Link
                key={post.slug}
                href={`/tech/${post.slug}`}
                className="block py-7 border-b border-charcoal/5 hover-lift group reveal"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex justify-between items-start gap-8">
                  <div className="flex-1">
                    <h3 className="font-serif text-xl text-charcoal group-hover:text-terracotta transition-colors">
                      {post.title}
                    </h3>
                    <p className="font-sans text-sm text-charcoal/50 mt-2">
                      {post.excerpt}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <span className="tech-tag">{post.tags[0]}</span>
                    <span className="font-mono text-xs text-charcoal/30">{formatDate(post.date)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-12 text-center reveal">
            <Link
              href="/tech"
              className="inline-flex items-center gap-2 font-mono text-sm text-charcoal/50 hover:text-terracotta transition-colors group"
            >
              查看全部技术笔记
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-7xl mx-auto px-8">
        <div className="separator"></div>
      </div>

      {/* Photo Section */}
      <section id="photo" className="py-20 px-2 md:px-4 bg-cream/50">
        <div className="max-w-[1800px] mx-auto">
          <div className="flex items-center justify-between mb-8 px-2">
            <div className="flex items-center gap-6 reveal">
              <span className="section-num">03</span>
              <div>
                <h2 className="font-serif text-2xl text-charcoal">摄影</h2>
                <p className="font-mono text-xs text-charcoal/40 mt-1 tracking-wider">PHOTO ESSAYS</p>
              </div>
            </div>
            <Link
              href="/photo"
              className="inline-flex items-center gap-2 font-mono text-sm text-charcoal/50 hover:text-terracotta transition-colors group reveal"
            >
              <span>查看全部 {photos.photos.length} 张</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          {/* Masonry Preview - 2-3 rows */}
          <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-2">
            {photos.photos.slice(0, 10).map((photo, index) => (
              <div
                key={photo.src}
                className="break-inside-avoid mb-2 reveal"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="relative overflow-hidden cursor-pointer group">
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 cubic-bezier(0.25, 0.46, 0.45, 0.94) group-hover:scale-105"
                    style={{
                      height: photo.size === 'large' ? 'h-64 md:h-80' : photo.size === 'wide' ? 'h-48' : 'h-48 md:h-56'
                    }}
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500 cubic-bezier(0.25, 0.46, 0.45, 0.94)" />
                  {/* Hover info */}
                  <div className="absolute inset-0 flex flex-col justify-end p-2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                    <div className="flex flex-wrap gap-1">
                      {photo.camera.aperture && (
                        <span className="px-1.5 py-0.5 bg-black/60 backdrop-blur-sm text-white/90 text-xs font-mono rounded">
                          {photo.camera.aperture}
                        </span>
                      )}
                      {photo.camera.shutter && (
                        <span className="px-1.5 py-0.5 bg-black/60 backdrop-blur-sm text-white/90 text-xs font-mono rounded">
                          {photo.camera.shutter}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* View All Button */}
          <div className="text-center mt-6">
            <Link
              href="/photo"
              className="inline-flex items-center gap-2 bg-charcoal text-oatmeal px-5 py-2.5 rounded-full font-mono text-xs opacity-90 hover:opacity-100 transition-opacity"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              @simon_all_photo
            </Link>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-7xl mx-auto px-8">
        <div className="separator"></div>
      </div>

      {/* Resume / About Section */}
      <section id="resume" className="py-32 px-8">
        <div className="max-w-5xl mx-auto">
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
                <div className="timeline-line"></div>

                <h3 className="font-serif text-xl text-charcoal mb-5">我是谁</h3>
                <div className="space-y-4 text-charcoal/70 font-sans text-sm leading-relaxed">
                  <p>
                    {about.bio?.split('\n\n')[0] || '前互联网后端开发，现全职投资者。'}
                  </p>
                  <p>
                    相信<span className="text-ink font-medium">时间是最好的杠杆</span>——无论是投资还是个人成长。
                  </p>
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  {about.tags?.map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-ink/5 text-ink text-xs rounded-full font-mono">{tag}</span>
                  ))}
                </div>

                <div className="mt-8 flex gap-6">
                  <a href={`https://github.com/${about.github}`} target="_blank" rel="noopener noreferrer" className="font-mono text-xs text-charcoal/40 hover:text-terracotta transition-colors">GitHub</a>
                  <a href={`https://twitter.com/${about.twitter}`} target="_blank" rel="noopener noreferrer" className="font-mono text-xs text-charcoal/40 hover:text-terracotta transition-colors">Twitter</a>
                  <a href={`mailto:${about.email}`} className="font-mono text-xs text-charcoal/40 hover:text-terracotta transition-colors">Email</a>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="reveal" style={{ animationDelay: '0.1s' }}>
              <div className="relative pl-10">
                <div className="timeline-line"></div>

                <h3 className="font-serif text-xl text-charcoal mb-6">经历</h3>

                <div className="space-y-8">
                  {resume.timeline.map((item, index) => (
                    <div key={index} className="relative">
                      <div
                        className={`absolute -left-10 top-1 w-3 h-3 rounded-full border-2 border-oatmeal ${
                          item.color === 'terracotta' ? 'bg-terracotta' :
                          item.color === 'sage' ? 'bg-sage' :
                          item.color === 'ink' ? 'bg-ink/50' :
                          'bg-charcoal/30'
                        }`}
                      ></div>
                      <span className={`font-mono text-xs ${
                        item.color === 'terracotta' ? 'text-terracotta' : 'text-charcoal/40'
                      }`}>{item.period}</span>
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
    </main>
  )
}
