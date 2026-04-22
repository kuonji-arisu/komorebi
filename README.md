# Komorebi

Komorebi is a minimal personal blog built with Vue 3, Vite, Vue Router, and Vite SSG. It reads local Markdown files at build time and deploys as static HTML.

## Features

- Static generation with `vite-ssg`
- Markdown posts from `src/content/posts`
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
src/content/posts/    Markdown posts
src/lib/              Content helpers, shared types, slug utilities
src/pages/            Route-level Vue pages
src/router/           Vue Router route records
src/styles/           Tokens, base layout, prose styles
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

## Tags

Each tag automatically gets a static page at `/tags/<tag-slug>`. Keep tag names short and stable so URLs remain tidy.

## Styling

Global styles are split into:

- `src/styles/tokens.css`: theme variables
- `src/styles/base.css`: layout and component-level primitives
- `src/styles/prose.css`: Markdown typography

The design goal is a quiet single-column reading experience with light borders, soft surfaces, and consistent spacing.

## Deployment

Any static host can serve the `dist` directory. Before deploying, set the production domain with `SITE_URL` and run:

```sh
pnpm build
```
