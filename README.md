# Komorebi

Komorebi is a minimal personal blog built with Vue 3, Vite, Vue Router, and Vite SSG. It reads local Markdown files at build time and deploys as static HTML.

## Features

- Static generation with `vite-ssg`
- Markdown posts from `src/content/posts`
- Markdown content pages from `src/content/pages`
- Frontmatter parsing with `gray-matter`
- Markdown rendering with `markdown-it`
- Shiki code highlighting
- Home, post, about, tag, and 404 pages
- Light and dark themes using CSS tokens
- Per-page SEO with canonical links, Open Graph metadata, and article JSON-LD
- Generated `sitemap.xml`, `robots.txt`, and `feed.xml`

## Project Structure

```text
plugins/              Build-time content and static file generation
public/               Static assets copied into the build output
src/components/       Small shared Vue components
src/config/           Site metadata
src/content/pages/    Markdown content pages such as About
src/content/posts/    Markdown posts
src/lib/              Content helpers, shared types, slug utilities
src/pages/            Route-level Vue pages
src/router/           Vue Router route records
src/styles/           CSS tokens, base rules, layout, components, page headings, article, page variants, prose
```

## Setup

```sh
pnpm install
pnpm dev
```

Build and preview the static site:

```sh
pnpm build
pnpm preview
```

`pnpm build` runs TypeScript checks and `vite-ssg build`. The output is written to `dist`.

## Site Metadata

Edit `src/config/site.json` for the site title, description, author, locale, default URL, feed path, and Open Graph image.

For production builds, set `SITE_URL` so generated canonical URLs, Open Graph URLs, RSS links, robots, and sitemap entries use the deployed domain:

```sh
SITE_URL=https://your-domain.example pnpm build
```

On Windows PowerShell:

```powershell
$env:SITE_URL = 'https://your-domain.example'
pnpm build
```

## Writing Posts

Create Markdown files in `src/content/posts`. The filename becomes the post slug.

```md
---
title: Post title
date: 2026-04-20
summary: A short summary for lists and SEO.
tags:
  - Vue
  - Notes
draft: false
---

Your post content starts here.
```

Required frontmatter:

- `title`: post title
- `date`: ISO-style date string
- `summary`: short description for lists, SEO, and RSS
- `tags`: short stable labels used for static tag pages

Optional frontmatter:

- `draft: true` hides a post from routes, lists, RSS, and sitemap output

## Page Types

This site keeps routing and page composition in Vue. Markdown is a build-time content source, not the page system itself.

- Pure Markdown-like pages still get a route-level Vue page, such as `src/pages/AboutView.vue`, which reads a matching file from `src/content/pages`.
- Pure Vue pages should stay in `src/pages` when the page is mostly layout, interaction, or custom composition.
- Mixed pages should let the Vue page own the URL, SEO, layout, and interactive parts, then render Markdown from `src/content/pages` only where prose belongs.

Do not automatically register `src/content/pages/*.md` as routes. Add public URLs explicitly in `src/router/index.ts`, `src/main.ts`, and static metadata generation when needed.

## Content Pages

Content pages such as About live in `src/content/pages` and are rendered by route-level Vue pages. Use simple frontmatter:

```md
---
title: Page title
summary: A short page summary.
---
```

Use Markdown content pages for mostly textual content such as About, Links, or Now. The recommended pattern is:

1. Create or update a route-level Vue page in `src/pages`.
2. Read the Markdown source with `getContentPage('<slug>')`.
3. Set page metadata with `useContentPageHead(...)`, passing the route path owned by the Vue page.
4. Render the Markdown body inside the page's chosen layout.

Avoid a generic `ContentPageView` until several real pages share the same behavior, layout, and metadata needs.

## Tags

Each tag automatically gets a static page at `/tags/<tag-slug>`. Keep tag names short and stable so URLs remain tidy.

## Styling

Global styles are split into:

- `src/styles/tokens.css`: theme variables
- `src/styles/base.css`: reset rules and element defaults
- `src/styles/layout.css`: site shell, header, navigation, footer, and theme toggle layout
- `src/styles/components.css`: reusable visual pieces such as post cards, tags, and text links
- `src/styles/page-headings.css`: shared page intro, title, and summary patterns
- `src/styles/article.css`: post header, metadata, title, summary, table of contents, and article back-link styles
- `src/styles/pages.css`: route-level layout variants for home, about, and tag pages
- `src/styles/prose.css`: Markdown typography

The design goal is a quiet single-column reading experience with light borders, soft surfaces, and consistent spacing.

## Deployment

Any static host can serve the `dist` directory. Before deploying, set the production domain with `SITE_URL` and run:

```sh
pnpm build
```
