import { posts as generatedPosts } from 'virtual:posts'
import { slugify } from './slugs'
import type { Post, Tag } from './types'

export const posts: Post[] = generatedPosts
export const tags: Tag[] = buildTags(posts)

export function getPostBySlug(slug: string) {
  return posts.find((post) => post.slug === slug)
}

export function getTagBySlug(slug: string) {
  return tags.find((tag) => tag.slug === slug)
}

export function getPostsByTagSlug(slug: string) {
  return posts.filter((post) => post.tags.some((tag) => tagPath(tag) === `/tags/${slug}`))
}

export function tagPath(tag: string) {
  return `/tags/${slugify(tag, 'tag')}`
}

export function formatPostDate(date: string) {
  return new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

function buildTags(sourcePosts: Post[]) {
  const tagMap = new Map<string, Tag>()

  for (const post of sourcePosts) {
    for (const tag of post.tags) {
      const slug = slugify(tag, 'tag')
      const existing = tagMap.get(slug)

      tagMap.set(slug, {
        name: existing?.name ?? tag,
        slug,
        path: `/tags/${slug}`,
        count: (existing?.count ?? 0) + 1,
      })
    }
  }

  return Array.from(tagMap.values()).sort((a, b) => a.name.localeCompare(b.name))
}
