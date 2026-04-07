'use client'

import { useEffect, useRef } from 'react'
import { PhotoMeta } from '@/lib/content'

interface PhotoSectionProps {
  photos: PhotoMeta[]
}

export default function PhotoSection({ photos }: PhotoSectionProps) {
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

  // Only show first 6 photos on homepage
  const displayPhotos = photos.slice(0, 6)

  return (
    <section
      ref={sectionRef}
      id="photo"
      className="py-32 px-8 bg-cream/50 md:py-32 md:px-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Label */}
        <div className="flex items-center gap-6 mb-16 reveal">
          <span className="section-num">03</span>
          <div>
            <h2 className="font-serif text-2xl text-charcoal">摄影</h2>
            <p className="font-mono text-xs text-charcoal/40 mt-1 tracking-wider">PHOTO ESSAYS</p>
          </div>
        </div>

        {/* Masonry Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-7">
          {displayPhotos.map((photo, index) => (
            <div
              key={photo.src}
              className={`photo-item rounded-lg overflow-hidden reveal ${photo.span || ''}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`relative ${getPhotoHeight(photo, index)}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                {/* Camera Tags Overlay */}
                <div className="photo-tags">
                  <span className="photo-tag">
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    {photo.camera.aperture}
                  </span>
                  <span className="photo-tag">
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeWidth="2"
                        d="M12 8v4l3 3"
                      />
                    </svg>
                    {photo.camera.shutter}
                  </span>
                  <span className="photo-tag">
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    ISO {photo.camera.iso}
                  </span>
                  <span className="photo-tag bg-charcoal/80 text-white">
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {photo.location}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Instagram Link */}
        <div className="mt-12 text-center reveal">
          <a
            href="https://instagram.com/simonwang_photo"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 font-mono text-sm text-charcoal/50 hover:text-terracotta transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
            @simonwang_photo
          </a>
        </div>
      </div>
    </section>
  )
}

// Calculate photo height based on span and index
function getPhotoHeight(photo: PhotoMeta, index: number): string {
  // First photo (featured) - tall
  if (index === 0) {
    return 'h-full min-h-[280px] md:min-h-[420px]'
  }
  // Regular photos
  return 'h-52 md:h-64'
}
