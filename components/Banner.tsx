'use client'

import { useEffect, useRef } from 'react'

export default function Banner() {
  const bannerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    // Scroll reveal animation
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

    document.querySelectorAll('.reveal').forEach((el) => {
      observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <header ref={bannerRef} className="banner-section flex flex-col justify-center px-8 pt-24 pb-16 md:pt-24 md:pb-16">
      {/* Illustration Background */}
      <div className="banner-bg" />

      {/* Geometric Shapes - Desktop (4 shapes), Mobile (3 shapes) */}
      <div className="banner-shapes">
        <div className="shape shape-1 hidden md:block" />
        <div className="shape shape-2" />
        <div className="shape shape-3 hidden md:block" />
        <div className="shape shape-4 hidden md:block" />
      </div>

      {/* Decorative lines */}
      <div className="absolute top-32 left-8 w-px h-32 bg-gradient-to-b from-transparent via-ink/20 to-transparent hidden md:block" />
      <div className="absolute bottom-32 right-12 w-24 h-px bg-gradient-to-r from-transparent via-terracotta/30 to-transparent hidden md:block" />

      <div className="max-w-7xl mx-auto w-full relative z-10">
        {/* Pre-title */}
        <p className="flex items-center gap-3 font-mono text-xs tracking-[0.3em] text-charcoal/40 mb-6 reveal md:gap-3 md:mb-6 md:text-xs md:tracking-[0.3em]">
          <span className="inline-block w-8 h-px bg-terracotta" />
          投资 / 技术 / 摄影 / 生活
        </p>

        {/* Main Masthead */}
        <h1 className="masthead-name font-serif text-[14vw] lg:text-[11vw] xl:text-[9vw] leading-[0.88] tracking-tight text-charcoal mb-8">
          Simon
          <br />
          <span className="text-ink">Wang</span>
        </h1>

        {/* Subtitle / Philosophy */}
        <div className="max-w-xl ml-1 reveal" style={{ animationDelay: '0.3s' }}>
          <p className="text-lg font-sans text-charcoal/60 leading-relaxed mb-6">
            用时间构建投资哲学。
          </p>
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs text-sage tracking-wider">SHANGHAI</span>
            <span className="w-1 h-1 rounded-full bg-terracotta" />
            <span className="font-mono text-xs text-charcoal/40">EST. 2011</span>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="mt-20 flex items-center gap-4 reveal hidden md:flex" style={{ animationDelay: '0.5s' }}>
          <div className="w-16 h-px bg-gradient-to-r from-charcoal/30 to-transparent" />
          <span className="font-mono text-xs text-charcoal/40 tracking-widest">SCROLL</span>
          <svg
            className="w-4 h-4 text-charcoal/30 animate-bounce"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </div>
    </header>
  )
}
