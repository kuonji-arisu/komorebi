import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

import matter from 'gray-matter'
import MarkdownIt from 'markdown-it'
import type Token from 'markdown-it/lib/token.mjs'
import { createHighlighter, type Highlighter } from 'shiki'
import type { Plugin } from 'vite'
import { slugify } from '../src/lib/slugs'
import type { Page, PageFrontmatter, Post, PostFrontmatter, PostHeading } from '../src/lib/types'

const virtualContentModuleId = 'virtual:content'
const resolvedVirtualContentModuleId = `\0${virtualContentModuleId}`

interface MarkdownEnv {
  headingCounts: Map<string, number>
  headings: PostHeading[]
}

let highlighterPromise: Promise<Highlighter> | undefined

export function contentPlugin(rootDir: string): Plugin {
  const postsDir = join(rootDir, 'src', 'content', 'posts')
  const pagesDir = join(rootDir, 'src', 'content', 'pages')

  return {
    name: 'komorebi-content',
    resolveId(id) {
      return id === virtualContentModuleId ? resolvedVirtualContentModuleId : undefined
    },
    async load(id) {
      if (id !== resolvedVirtualContentModuleId) {
        return undefined
      }

      for (const filename of readMarkdownFilenames(postsDir)) {
        this.addWatchFile(join(postsDir, filename))
      }

      for (const filename of readMarkdownFilenames(pagesDir)) {
        this.addWatchFile(join(pagesDir, filename))
      }

      const [posts, pages] = await Promise.all([readPublishedPosts(rootDir), readContentPages(rootDir)])

      return `export const posts = ${JSON.stringify(posts)}\nexport const pages = ${JSON.stringify(pages)}`
    },
    async handleHotUpdate(context) {
      if (
        !context.file.endsWith('.md') ||
        (!context.file.includes(postsDir) && !context.file.includes(pagesDir))
      ) {
        return undefined
      }

      const mod = context.server.moduleGraph.getModuleById(resolvedVirtualContentModuleId)

      if (mod) {
        context.server.moduleGraph.invalidateModule(mod)
        return [mod]
      }

      return undefined
    },
  }
}

export function readPublishedPostRoutes(rootDir: string) {
  const postsDir = join(rootDir, 'src', 'content', 'posts')

  return readMarkdownFilenames(postsDir)
    .map((filename) => {
      const raw = readFileSync(join(postsDir, filename), 'utf8')
      const { data } = matter(raw)

      return data.draft === true ? undefined : `/posts/${slugFromFilename(filename)}`
    })
    .filter((route): route is string => Boolean(route))
}

export async function readPublishedTagRoutes(rootDir: string) {
  const posts = await readPublishedPosts(rootDir)
  const tagSlugs = new Set(posts.flatMap((post) => post.tags.map((tag) => slugify(tag, 'tag'))))

  return Array.from(tagSlugs)
    .sort((a, b) => a.localeCompare(b))
    .map((tag) => `/tags/${tag}`)
}

export async function readPublishedPosts(rootDir: string) {
  const postsDir = join(rootDir, 'src', 'content', 'posts')
  const highlighter = await getHighlighter()
  const markdown = createMarkdownRenderer(highlighter)

  return readMarkdownFilenames(postsDir)
    .map((filename) => parsePost(postsDir, filename, markdown))
    .filter((post) => !post.draft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export async function readContentPages(rootDir: string) {
  const pagesDir = join(rootDir, 'src', 'content', 'pages')
  const highlighter = await getHighlighter()
  const markdown = createMarkdownRenderer(highlighter)

  return readMarkdownFilenames(pagesDir)
    .map((filename) => parsePage(pagesDir, filename, markdown))
    .sort((a, b) => a.slug.localeCompare(b.slug))
}

function createMarkdownRenderer(highlighter: Highlighter) {
  const markdown = new MarkdownIt({
    html: false,
    linkify: true,
    typographer: true,
    highlight(code, lang) {
      const language = normalizeLanguage(highlighter, lang)

      return highlighter.codeToHtml(code, {
        lang: language,
        themes: {
          light: 'github-light',
          dark: 'github-dark',
        },
      })
    },
  })

  const defaultHeadingOpen =
    markdown.renderer.rules.heading_open ??
    ((tokens, idx, options, _env, self) => self.renderToken(tokens, idx, options))

  markdown.renderer.rules.heading_open = (tokens, idx, options, env, self) => {
    const token = tokens[idx]
    const inlineToken = tokens[idx + 1]
    const level = readHeadingLevel(token)

    if (level && level >= 2 && level <= 4 && inlineToken?.type === 'inline') {
      const markdownEnv = env as MarkdownEnv
      const text = inlineToken.content.trim()
      const id = uniqueHeadingId(text, markdownEnv.headingCounts)

      token.attrSet('id', id)
      markdownEnv.headings.push({ id, level, text })
    }

    return defaultHeadingOpen(tokens, idx, options, env, self)
  }

  return markdown
}

function parsePost(postsDir: string, filename: string, markdown: MarkdownIt): Post {
  const filePath = join(postsDir, filename)
  const raw = readFileSync(filePath, 'utf8')
  const { data, content } = matter(raw)
  const frontmatter = normalizeFrontmatter(data, filePath)
  const tocDirective = extractTocDirective(content)
  const slug = slugFromFilename(filename)
  const env: MarkdownEnv = {
    headingCounts: new Map(),
    headings: [],
  }

  return {
    ...frontmatter,
    slug,
    path: `/posts/${slug}`,
    html: markdown.render(tocDirective.content, env),
    headings: env.headings,
    showToc: tocDirective.hasToc && env.headings.length > 0,
  }
}

function parsePage(pagesDir: string, filename: string, markdown: MarkdownIt): Page {
  const filePath = join(pagesDir, filename)
  const raw = readFileSync(filePath, 'utf8')
  const { data, content } = matter(raw)
  const frontmatter = normalizePageFrontmatter(data, filePath)
  const slug = slugFromFilename(filename)
  const env: MarkdownEnv = {
    headingCounts: new Map(),
    headings: [],
  }

  return {
    ...frontmatter,
    slug,
    path: `/${slug}`,
    html: markdown.render(content, env),
  }
}

function normalizeFrontmatter(data: Record<string, unknown>, filePath: string): PostFrontmatter {
  const title = readRequiredString(data.title, 'title', filePath)
  const date = normalizeDate(data.date, filePath)
  const summary = readRequiredString(data.summary, 'summary', filePath)
  const tags = normalizeTags(data.tags, filePath)

  return {
    title,
    date,
    summary,
    tags,
    draft: data.draft === true,
  }
}

function normalizePageFrontmatter(data: Record<string, unknown>, filePath: string): PageFrontmatter {
  const title = readRequiredString(data.title, 'title', filePath)
  const summary = readRequiredString(data.summary, 'summary', filePath)

  return {
    title,
    summary,
  }
}

function readRequiredString(value: unknown, field: string, filePath: string) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`${filePath} is missing a non-empty "${field}" frontmatter field.`)
  }

  return value.trim()
}

function normalizeDate(value: unknown, filePath: string) {
  const date = value instanceof Date ? value : new Date(readRequiredString(value, 'date', filePath))

  if (Number.isNaN(date.getTime())) {
    throw new Error(`${filePath} has an invalid "date" frontmatter field.`)
  }

  return date.toISOString().slice(0, 10)
}

function normalizeTags(value: unknown, filePath: string) {
  if (value === undefined) {
    return []
  }

  const tags =
    typeof value === 'string'
      ? value.split(',')
      : Array.isArray(value)
        ? value
        : failInvalidTags(filePath)

  return Array.from(
    new Set(
      tags.map((tag) => {
        if (typeof tag !== 'string' || tag.trim() === '') {
          throw new Error(`${filePath} has an invalid "tags" frontmatter field.`)
        }

        return tag.trim()
      }),
    ),
  )
}

function failInvalidTags(filePath: string): never {
  throw new Error(`${filePath} has an invalid "tags" frontmatter field.`)
}

function extractTocDirective(content: string) {
  const tocDirectivePattern = /^[ \t]*<!-{2,}\s*toc\s*-{2,}>[ \t]*(?:\r?\n|$)/i
  const leadingBlankLinesPattern = /^(?:[ \t]*\r?\n)*/
  const leadingBlankLines = content.match(leadingBlankLinesPattern)?.[0] ?? ''
  const firstContent = content.slice(leadingBlankLines.length)
  const match = firstContent.match(tocDirectivePattern)

  if (!match) {
    return {
      content,
      hasToc: false,
    }
  }

  return {
    content: firstContent.slice(match[0].length).replace(/^(?:[ \t]*\r?\n)+/, ''),
    hasToc: true,
  }
}

function readMarkdownFilenames(contentDir: string) {
  return readdirSync(contentDir).filter((filename) => filename.endsWith('.md'))
}

function slugFromFilename(filename: string) {
  return filename
    .replace(/\.md$/, '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function normalizeLanguage(highlighter: Highlighter, lang: string) {
  const requested = lang.trim().toLowerCase()
  const aliases: Record<string, string> = {
    js: 'javascript',
    md: 'markdown',
    sh: 'bash',
    ts: 'typescript',
  }
  const language = aliases[requested] ?? requested

  return highlighter.getLoadedLanguages().includes(language) ? language : 'text'
}

function readHeadingLevel(token: Token | undefined) {
  if (!token?.tag.startsWith('h')) {
    return undefined
  }

  const level = Number(token.tag.slice(1))

  return Number.isInteger(level) ? level : undefined
}

function uniqueHeadingId(text: string, counts: Map<string, number>) {
  const base = slugifyHeading(text)
  const count = counts.get(base) ?? 0

  counts.set(base, count + 1)

  return count === 0 ? base : `${base}-${count + 1}`
}

function slugifyHeading(text: string) {
  return slugify(text, 'section')
}

function getHighlighter() {
  highlighterPromise ??= createHighlighter({
    themes: ['github-light', 'github-dark'],
    langs: ['bash', 'css', 'html', 'javascript', 'json', 'markdown', 'text', 'typescript', 'vue'],
  })

  return highlighterPromise
}
