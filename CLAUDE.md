# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Simon Wang Personal Blog** ("Simon · 拾时造物") - A minimalist personal website showcasing investment philosophy, technical notes, and photography. Built with a content-first approach where all content lives in Markdown files.

## Tech Stack

- **Frontend**: Next.js 14+ with App Router
- **Styling**: Tailwind CSS with custom design tokens
- **Content**: Markdown files with frontmatter (no CMS/database)
- **Hot Reload**: SWR client-side polling (5s interval) for real-time content updates
- **API**: Next.js API routes for dynamic content loading

## Directory Structure

```
myBlog/
├── app/
│   ├── api/                    # API routes for dynamic content
│   │   ├── about/route.ts      # GET /api/about
│   │   ├── resume/route.ts     # GET /api/resume
│   │   ├── thoughts/
│   │   │   ├── route.ts       # GET /api/thoughts
│   │   │   └── [slug]/route.ts # GET /api/thoughts/[slug]
│   │   ├── tech/
│   │   │   ├── route.ts       # GET /api/tech
│   │   │   └── [slug]/route.ts # GET /api/tech/[slug]
│   │   └── photos/route.ts    # GET /api/photos
│   ├── thoughts/               # Thoughts archive page
│   │   └── [slug]/            # Individual thought posts
│   ├── tech/                   # Tech notes archive page
│   │   └── [slug]/            # Individual tech posts
│   ├── photo/                  # Photography gallery
│   ├── layout.tsx             # Root layout with fonts, nav
│   ├── page.tsx               # Home page
│   └── globals.css            # Global styles
├── components/                # Reusable UI components
│   ├── Banner.tsx            # Hero/masthead section
│   ├── MobileNav.tsx         # Mobile bottom navigation
│   └── ScrollReveal.tsx      # Scroll animation wrapper
├── content/                   # All Markdown content
│   ├── config/
│   │   ├── about.md          # Personal info & bio
│   │   └── resume.md         # Career timeline
│   ├── thoughts/              # Investment philosophy posts (auto hot-reload)
│   └── tech/                  # Technical notes (auto hot-reload)
├── lib/
│   └── markdown.ts           # MD parsing utilities
├── public/
│   └── photos/              # Photo assets
└── doc/
    └── playground/           # Design prototypes (do not modify)
```

## Content Format

### about.md (Personal Info)
```yaml
---
name: Simon
chineseName: 王思明
englishName: Simon Wang
title: 拾时造物
tagline: "用时间构建投资哲学"
subtitle: "在数据与代码之间，寻找秩序的美。"
region: Shanghai
established: 2011
email: hello@simonwang.io
github: simonwang
twitter: simonwang_photo
instagram: simonwang_photo
tags:
  - 📍 上海
  - 🎯 长期主义
  - ☕ 咖啡
---

Bio content in Markdown (below the frontmatter)...
```

### resume.md (Career Timeline)
```yaml
---
timeline:
  - period: "2022 - 现在"
    title: 全职投资者
    description: 专注A股、港股二级市场研究
    color: terracotta
  - period: "2019 - 2022"
    title: 高级后端工程师
    description: 某中型互联网公司技术负责人
    color: sage
skills:
  - 投资分析
  - A股/港股
  - Python
---
```

### Thoughts Post (content/thoughts/*.md)
```yaml
---
title: "Post Title"
date: "2024-03-15"
tags:
  - 投资随笔
  - A股
  - 港股
excerpt: "Short description for preview cards"
featured: true
quote: "A memorable quote from the article (optional)"
closingText: "A closing thought or reflection (optional)"
---

Post body in Markdown...
```

**Note**: `featured: true` makes the post show on homepage. `quote` and `closingText` are displayed on homepage for featured posts.

### Tech Post (content/tech/*.md)
```yaml
---
title: "Tech Note Title"
date: "2024-03-10"
tags:
  - Python
  - 数据分析
excerpt: "Brief description"
---

Post body in Markdown with code blocks...
```

### Photo Manifest (content/photos/photo-manifest.md)
```yaml
---
photos:
  - src: "/photos/chuanxi.jpg"
    alt: "Mountain landscape"
    location: 川西高原
    camera:
      aperture: "f/8"
      shutter: "1/250s"
      iso: 100
    width: 800
    height: 600
    featured: true
    span: "row-span-2"  # Optional: for masonry layout
---
```

## Hot Reload

Content updates automatically via SWR polling:
- **Interval**: 5 seconds
- **Triggers**: Focus window, page visibility
- **No restart needed**: Add/edit markdown files, website updates automatically

## Design System

### Colors
| Name | Hex | Usage |
|------|-----|-------|
| oatmeal | #F5F4EF | Primary background |
| cream | #FAF8F5 | Section backgrounds |
| charcoal | #2C2C2C | Primary text |
| ink | #1A3A3A | Accent text |
| terracotta | #B85C4B | Primary accent |
| sage | #7A8B6F | Secondary accent |
| rust | #C17B5F | Tertiary accent |
| forest | #2D4A3E | Dark accent |

### Typography
- **Serif**: Noto Serif SC (headings, drop caps)
- **Sans**: Inter (body text)
- **Mono**: JetBrains Mono (tags, metadata)

## Commands

```bash
npm run dev          # Start development server (localhost:3000)
PORT=3001 npm run dev  # Start on port 3001
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## How to Add Content

### 1. Add a Thought Post
1. Create `content/thoughts/2024-04-01-my-new-thought.md`
2. Add frontmatter (title, date, tags, excerpt)
3. Write content in Markdown
4. Save - website auto-updates within 5 seconds

### 2. Add a Tech Note
1. Create `content/tech/2024-04-01-my-new-note.md`
2. Add frontmatter (title, date, tags, excerpt)
3. Write content in Markdown with code blocks
4. Save - website auto-updates within 5 seconds

### 3. Add Photos
1. Add photos to `public/photos/`
2. EXIF metadata (aperture, shutter, ISO, GPS location) is automatically extracted
3. Optional: Create `content/photos/photo-manifest.md` to override:
   - Custom alt text
   - Custom location name (overrides GPS)
   - Masonry span (e.g., `span: "row-span-2"`)
   - Custom camera settings (overrides EXIF)

Example manifest (optional):
```yaml
---
photos:
  - src: "/photos/chuanxi.jpg"
    alt: "Mountain landscape"  # overrides filename
    location: "川西高原"  # overrides GPS
    span: "row-span-2"  # for masonry layout
---
```

### 4. Update Personal Info
Edit `content/config/about.md` - all fields hot-reload

### 5. Update Resume/Timeline
Edit `content/config/resume.md` - all fields hot-reload

## Design Prototypes

The `doc/playground/` directory contains HTML prototypes:
- `blog-playground.html` - Desktop design
- `blog-mobile.html` - Mobile design

These are reference implementations showing exact styling, animations, and layout.
