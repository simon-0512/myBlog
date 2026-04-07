'use client'

import { useState, useEffect, useRef } from 'react'
import useSWR from 'swr'
import Link from 'next/link'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface AboutData {
  instagram: string
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
  size: 'small' | 'medium' | 'large' | 'wide'
}

interface PhotoManifest {
  photos: Photo[]
}

const INITIAL_SHOW = 16

// Height classes for masonry variety
const heightClasses = {
  small: 'h-48 md:h-56',
  medium: 'h-56 md:h-64',
  large: 'h-64 md:h-80',
  wide: 'h-48 md:h-56',
}

function PhotoItem({ photo, index }: { photo: Photo; index: number }) {
  const [loaded, setLoaded] = useState(false)
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '200px' }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className="break-inside-avoid mb-2"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.6s ease-out ${index * 0.05}s, transform 0.6s ease-out ${index * 0.05}s`
      }}
    >
      <div
        className="relative overflow-hidden cursor-pointer group"
        style={{
          height: heightClasses[photo.size],
          gridColumn: photo.size === 'wide' ? 'span 2' : 'span 1'
        }}
      >
        {/* Image */}
        {visible && (
          <img
            src={photo.src}
            alt={photo.alt}
            loading="lazy"
            onLoad={() => setLoaded(true)}
            className={`w-full h-full object-cover transition-transform duration-500 cubic-bezier(0.25, 0.46, 0.45, 0.94) ${loaded ? 'opacity-100' : 'opacity-0'} group-hover:scale-105`}
            style={{ transitionDelay: loaded ? '0s' : '0s' }}
          />
        )}

        {/* Loading placeholder */}
        {!loaded && (
          <div className="absolute inset-0 bg-charcoal/10 animate-pulse" />
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500 cubic-bezier(0.25, 0.46, 0.45, 0.94)" />

        {/* Hover info */}
        <div className="absolute inset-0 flex flex-col justify-end p-3 opacity-0 group-hover:opacity-100 transition-all duration-500 cubic-bezier(0.25, 0.46, 0.45, 0.94) translate-y-2 group-hover:translate-y-0">
          <div className="flex flex-wrap gap-1.5">
            {photo.camera.aperture && (
              <span className="px-2 py-0.5 bg-black/60 backdrop-blur-sm text-white/90 text-xs font-mono rounded">
                {photo.camera.aperture}
              </span>
            )}
            {photo.camera.shutter && (
              <span className="px-2 py-0.5 bg-black/60 backdrop-blur-sm text-white/90 text-xs font-mono rounded">
                {photo.camera.shutter}
              </span>
            )}
            {photo.camera.iso > 0 && (
              <span className="px-2 py-0.5 bg-black/60 backdrop-blur-sm text-white/90 text-xs font-mono rounded">
                ISO {photo.camera.iso}
              </span>
            )}
          </div>
          {photo.location && (
            <span className="mt-1.5 px-2 py-0.5 bg-black/60 backdrop-blur-sm text-white/90 text-xs font-mono rounded">
              {photo.location}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default function PhotoPage() {
  const [showCount, setShowCount] = useState(INITIAL_SHOW)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  const { data: photos, isLoading } = useSWR<PhotoManifest>('/api/photos', fetcher, {
    refreshInterval: 5000,
    revalidateOnFocus: true,
  })

  const { data: about } = useSWR<AboutData>('/api/about', fetcher, {
    refreshInterval: 5000,
    revalidateOnFocus: true,
  })

  const handleLoadMore = () => {
    setIsLoadingMore(true)
    setTimeout(() => {
      setShowCount(prev => prev + 16)
      setIsLoadingMore(false)
    }, 300)
  }

  if (isLoading || !photos) {
    return (
      <main className="min-h-screen bg-oatmeal flex items-center justify-center">
        <div className="text-charcoal/40 font-mono text-sm">加载中...</div>
      </main>
    )
  }

  const visiblePhotos = photos.photos.slice(0, showCount)
  const hasMore = showCount < photos.photos.length

  return (
    <main className="min-h-screen bg-oatmeal pb-32 md:pb-0">
      {/* Header */}
      <header className="pt-24 pb-8 px-6 md:px-12 sticky top-0 z-10 bg-oatmeal/95 backdrop-blur-sm">
        <div className="max-w-[1800px] mx-auto flex items-center justify-between">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <div className="dot-accent">
                <span></span><span></span><span></span>
              </div>
              <span className="font-mono text-xs text-charcoal/50 tracking-wider">SIMON</span>
            </div>
            <h1 className="font-serif text-3xl md:text-4xl text-charcoal">摄影</h1>
          </div>
          <div className="flex items-center gap-6">
            <span className="font-mono text-xs text-charcoal/40">{photos.photos.length} 张照片</span>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-charcoal/90 text-oatmeal px-4 py-2 rounded-full font-mono text-xs opacity-90 hover:opacity-100 transition-opacity"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              首页
            </Link>
          </div>
        </div>
      </header>

      {/* Full-bleed Masonry Grid */}
      <section className="px-2 md:px-4 pb-8">
        <div className="max-w-[1800px] mx-auto">
          {/* True Masonry using CSS columns */}
          <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-2">
            {visiblePhotos.map((photo, index) => (
              <PhotoItem key={photo.src} photo={photo} index={index} />
            ))}
          </div>

          {/* Load More */}
          {hasMore && (
            <div className="text-center mt-8">
              <button
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                className="inline-flex items-center gap-3 bg-charcoal text-oatmeal px-8 py-4 rounded-full font-mono text-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoadingMore ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    加载中...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 9l-7 7-7-7"/>
                    </svg>
                    加载更多 ({photos.photos.length - showCount} 张)
                  </>
                )}
              </button>
            </div>
          )}

          {photos.photos.length === 0 && (
            <div className="text-center py-32 text-charcoal/40">
              <p className="font-serif text-xl">暂无摄影作品</p>
              <p className="font-mono text-sm mt-2">public/photos directory is empty</p>
            </div>
          )}
        </div>
      </section>

      {/* Instagram Button */}
      <InstagramButton />
    </main>
  )
}

function InstagramButton() {
  const [clicked, setClicked] = useState(false)

  const handleClick = () => {
    setClicked(true)
    setTimeout(() => setClicked(false), 800)
  }

  return (
    <div className="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 z-20">
      <button
        onClick={handleClick}
        className="relative inline-flex items-center gap-2 bg-charcoal text-oatmeal px-5 py-2.5 rounded-full font-mono text-xs hover:scale-105 transition-transform duration-200"
      >
        <svg
          className={`w-4 h-4 transition-transform duration-100 ${clicked ? 'scale-75' : 'scale-100'}`}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
        @simon_all_photo

        {/* Checkmark pop */}
        <span
          className={`absolute -right-2 -top-2 w-4 h-4 bg-terracotta rounded-full flex items-center justify-center text-white text-xs font-bold transition-all duration-500 ${
            clicked
              ? 'opacity-100 scale-100 -translate-y-1'
              : 'opacity-0 scale-0 translate-y-0'
          }`}
          style={{
            transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
          }}
        >
          <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </span>
      </button>
    </div>
  )
}
