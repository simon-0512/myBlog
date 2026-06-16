import type { Metadata } from 'next'
import './globals.css'
import MobileNav from '@/components/MobileNav'

export const metadata: Metadata = {
  title: 'Simon · 拾时造物',
  description: '用时间构建投资哲学。在数据与代码之间，寻找秩序的美。',
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;500;600;700&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased pb-16 md:pb-0">
        {/* Fixed Navigation - Desktop */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-oatmeal/95 backdrop-blur-md border-b border-ink/5 hidden md:block">
          <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
            <a href="/" className="flex items-center gap-3 hover:opacity-70 transition-opacity">
              <img src="/logo.svg" alt="拾时造物" className="w-8 h-8" />
            </a>
            <div className="flex gap-10">
              <a href="#thoughts" className="nav-link text-sm text-charcoal/70 hover:text-charcoal">思考</a>
              <a href="#tech" className="nav-link text-sm text-charcoal/70 hover:text-charcoal">技术</a>
              <a href="#photo" className="nav-link text-sm text-charcoal/70 hover:text-charcoal">摄影</a>
              <a href="#resume" className="nav-link text-sm text-charcoal/70 hover:text-charcoal">关于</a>
              <a href="http://120.53.94.131:5173/" target="_blank" rel="noopener noreferrer" className="nav-link text-sm text-charcoal/70 hover:text-charcoal">PixelBrick</a>
            </div>
          </div>
        </nav>

        {children}

        {/* Footer */}
        <footer className="py-12 px-8 border-t border-charcoal/5 hidden md:block">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <p className="font-serif text-charcoal/40 text-sm">
              © 2026 CUI WEIJIAN
            </p>
            <div className="flex items-center gap-4">
              <img src="/logo.svg" alt="拾时造物" className="w-6 h-6 opacity-60" />
              <a
                href="https://claude.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 px-3 py-1.5 rounded-full bg-ink/5 hover:bg-ink/10 transition-colors"
                title="Built with Claude"
              >
                <svg className="w-4 h-4 text-ink/60" viewBox="0 0 40 40" fill="none">
                  <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <path d="M20 8c-2 4-6 8-6 14 0 6 4 10 6 10s6-4 6-10c0-6-4-10-6-14z" fill="currentColor" opacity="0.2"/>
                  <circle cx="20" cy="22" r="4" fill="currentColor"/>
                  <path d="M20 8v4M14 14l3 3M26 14l-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <span className="font-mono text-xs text-ink/50 group-hover:text-ink/70 transition-colors">powered by claude</span>
              </a>
            </div>
          </div>
        </footer>

        {/* Mobile Navigation */}
        <MobileNav />
      </body>
    </html>
  )
}
