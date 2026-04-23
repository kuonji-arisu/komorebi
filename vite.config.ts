import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath, URL } from 'node:url'

import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import { contentPlugin, readPublishedPostRoutes, readPublishedPosts, readPublishedTagRoutes } from './plugins/content'
import { site } from './src/config/site'

const rootDir = fileURLToPath(new URL('.', import.meta.url))
const outDir = join(rootDir, 'dist')

// https://vite.dev/config/
export default defineConfig({
  define: {
    __SITE_URL__: JSON.stringify(process.env.SITE_URL ?? ''),
  },
  plugins: [contentPlugin(rootDir), vue(), staticSiteFiles()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})

function staticSiteFiles(): Plugin {
  return {
    name: 'quiet-notes-static-files',
    apply: 'build',
    async closeBundle() {
      const siteUrl = process.env.SITE_URL ?? site.url
      const tagRoutes = await readPublishedTagRoutes(rootDir)
      const urls = ['/', '/about', ...readPublishedPostRoutes(rootDir), ...tagRoutes]
      const now = new Date().toISOString()
      const posts = await readPublishedPosts(rootDir)

      mkdirSync(outDir, { recursive: true })
      writeFileSync(join(outDir, 'sitemap.xml'), renderSitemap(siteUrl, urls, now))
      writeFileSync(
        join(outDir, 'robots.txt'),
        `User-agent: *\nAllow: /\n\nSitemap: ${new URL('/sitemap.xml', siteUrl).toString()}\n`,
      )
      writeFileSync(join(outDir, 'feed.xml'), renderRssFeed(siteUrl, posts))
    },
  }
}

function renderSitemap(siteUrl: string, urls: string[], lastmod: string) {
  const entries = urls
    .map((url) => {
      const loc = escapeXml(new URL(url, siteUrl).toString())

      return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`
}

function renderRssFeed(siteUrl: string, posts: Awaited<ReturnType<typeof readPublishedPosts>>) {
  const feedUrl = new URL(site.feedPath, siteUrl).toString()
  const siteTitle = escapeXml(site.title)
  const siteDescription = escapeXml(site.description)
  const latestDate = posts[0]?.date ?? new Date().toISOString()
  const items = posts
    .map((post) => {
      const postUrl = new URL(post.path, siteUrl).toString()

      return [
        '    <item>',
        `      <title>${escapeXml(post.title)}</title>`,
        `      <link>${escapeXml(postUrl)}</link>`,
        `      <guid>${escapeXml(postUrl)}</guid>`,
        `      <pubDate>${new Date(post.date).toUTCString()}</pubDate>`,
        `      <description>${escapeXml(post.summary)}</description>`,
        ...post.tags.map((tag) => `      <category>${escapeXml(tag)}</category>`),
        '    </item>',
      ].join('\n')
    })
    .join('\n')

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '  <channel>',
    `    <title>${siteTitle}</title>`,
    `    <link>${escapeXml(new URL('/', siteUrl).toString())}</link>`,
    `    <description>${siteDescription}</description>`,
    `    <language>${escapeXml(site.locale.replace('_', '-'))}</language>`,
    `    <lastBuildDate>${new Date(latestDate).toUTCString()}</lastBuildDate>`,
    `    <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml"/>`,
    items,
    '  </channel>',
    '</rss>',
    '',
  ].join('\n')
}

function escapeXml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}
