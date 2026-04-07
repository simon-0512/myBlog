'use client'

import Link from 'next/link'
import type { PhotoManifest, AboutData } from '@/lib/content'

interface PhotoClientProps {
  photos: PhotoManifest
  about: AboutData
}

export default function PhotoClient({ photos, about }: PhotoClientProps) {
  return (
    <main className="min-h-screen bg-cream/50 pb-20 md:pb-0">
      {/* Header */}
      <header className="pt-32 pb-16 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <div className="dot-accent">
              <span></span><span></span><span></span>
            </div>
          </div>

          <h1 className="font-serif text-5xl md:text-6xl text-charcoal mb-4">摄影</h1>
          <p className="font-mono text-sm text-charcoal/40 tracking-wider">PHOTO ESSAYS</p>

          <div className="mt-8 w-24 h-px bg-gradient-to-r from-terracotta to-sage"></div>
        </div>
      </header>

      {/* Photo Grid */}
      <section className="px-8 pb-32">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-7">
            {photos.photos.map((photo, index) => (
              <div
                key={photo.src}
                className={`photo-item rounded-lg overflow-hidden reveal ${photo.span || ''}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div
                  className={`relative ${
                    photo.span?.includes('row-span-2') ? 'h-full min-h-[420px]' :
                    photo.span?.includes('col-span-2') ? 'h-64 md:h-80' :
                    'h-52'
                  }`}
                >
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    className="w-full h-full object-cover"
                  />
                  <div className="photo-tags">
                    <span className="photo-tag">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/></svg>
                      {photo.camera.aperture}
                    </span>
                    <span className="photo-tag">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeWidth="2" d="M12 8v4l3 3"/></svg>
                      {photo.camera.shutter}
                    </span>
                    <span className="photo-tag">
                      ISO {photo.camera.iso}
                    </span>
                    <span className="photo-tag bg-charcoal/80 text-white">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                      {photo.location}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {photos.photos.length === 0 && (
            <div className="text-center py-20 text-charcoal/40">
              <p className="font-serif text-xl">暂无摄影作品</p>
              <p className="font-mono text-sm mt-2">photo-manifest.md is empty</p>
            </div>
          )}

          {/* Instagram Link */}
          <div className="mt-16 text-center">
            <a
              href={`https://instagram.com/${about.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 font-mono text-sm text-charcoal/50 hover:text-terracotta transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              @{about.instagram}
            </a>
          </div>
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
