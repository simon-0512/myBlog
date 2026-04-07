# Simon · 拾时造物

一个极简风格的个人博客，专注于投资哲学、技术笔记与摄影展示。

## 特性

- **内容即代码**：所有内容以 Markdown 文件管理，无需数据库
- **热更新**：新增/修改 Markdown 文件后页面自动刷新，无需重启开发服务器
- **自动元数据**：照片自动提取 EXIF 信息（光圈、快门、ISO）
- **静态导出**：支持 `next export` 生成纯静态站点
- **响应式设计**：适配桌面端与移动端

## 技术栈

- **框架**：Next.js 14+ (App Router)
- **样式**：Tailwind CSS
- **内容**：Markdown + gray-matter
- **照片 EXIF**：[exifr](https://github.com/nickrtorres/exifr)
- **数据请求**：SWR (5秒轮询实现热更新)

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

### 3. 构建生产版本

```bash
npm run build
npm run start
```

### 4. 静态导出

```bash
npm run export
```

导出文件位于 `out/` 目录，可部署至任意静态托管服务（Vercel、Netlify、GitHub Pages 等）。

## 内容管理

### 目录结构

```
content/
├── config/
│   ├── about.md      # 个人简介
│   └── resume.md     # 职业履历
├── thoughts/         # 投资思考文章
├── tech/             # 技术笔记
└── photos/           # 照片元数据（自动生成）
```

### 添加新文章

**思考（Thoughts）**

1. 在 `content/thoughts/` 下创建 `.md` 文件
2. 添加 frontmatter：

```markdown
---
title: "文章标题"
date: "2026-04-07"
tags:
  - 投资
  - A股
excerpt: "文章摘要，用于首页预览"
featured: true
quote: "文章中引用的金句"
closingText: "文章结尾语"
---

正文内容...
```

**技术笔记（Tech）**

1. 在 `content/tech/` 下创建 `.md` 文件
2. 添加 frontmatter：

```markdown
---
title: "技术笔记标题"
date: "2026-04-07"
tags:
  - Python
  - 数据分析
excerpt: "笔记摘要"
---

正文内容...
```

### 编辑个人简介

修改 `content/config/about.md`：

```markdown
---
name: Simon
chineseName: 王思明
englishName: Simon Wang
title: 拾时造物
tagline: "用时间构建投资哲学"
region: Shanghai
established: 2011
email: hello@simonwang.io
github: simonwang
twitter: simonwang_photo
---

个人简介正文...
```

### 编辑职业履历

修改 `content/config/resume.md`：

```markdown
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
---
```

### 照片管理

照片存放在 `public/photos/` 目录，API `/api/photos` 会自动：
- 扫描目录下的所有图片
- 提取 EXIF 元数据（光圈、快门、ISO）
- 根据图片尺寸自动分类（small/medium/large/wide）
- 按文件名排序

无需手动维护照片清单，新增照片后刷新页面即可见。

## 页面结构

| 路径 | 说明 |
|------|------|
| `/` | 首页，展示全部内容区块 |
| `/thoughts` | 思考文章列表 |
| `/thoughts/[slug]` | 思考文章详情 |
| `/tech` | 技术笔记列表 |
| `/tech/[slug]` | 技术笔记详情 |
| `/photo` | 摄影画廊 |

## 设计系统

### 色彩

| 名称 | 色值 | 用途 |
|------|------|------|
| oatmeal | `#F5F4EF` | 主背景 |
| cream | `#FAF8F5` | 区块背景 |
| charcoal | `#2C2C2C` | 主文字 |
| terracotta | `#B85C4B` | 主强调色 |
| sage | `#7A8B6F` | 次强调色 |

### 字体

- **衬线**：Noto Serif SC（标题）
- **无衬线**：Inter（正文）
- **等宽**：JetBrains Mono（标签、元数据）

## 部署

### Vercel（推荐）

1. Fork 本项目
2. 在 Vercel 导入仓库
3. 无需额外配置，自动部署

### 其他静态托管

```bash
npm run export
```

将 `out/` 目录内容部署至服务器或托管服务。

## 自定义

### 修改站点信息

- `app/layout.tsx` - 站点标题、描述
- `app/globals.css` - 全局样式、动画
- `tailwind.config.ts` - Tailwind 配置

### 修改设计原型

参考 `doc/playground/` 下的 HTML 原型文件，了解设计细节。

## License

MIT
