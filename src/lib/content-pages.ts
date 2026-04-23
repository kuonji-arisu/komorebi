import { useHead } from '@unhead/vue'
import { absoluteUrl, site } from '@/config/site'
import { getPageBySlug } from './content'
import type { Page } from './types'

interface ContentPageHeadOptions {
  routePath: string
  fallbackTitle: string
  fallbackDescription: string
  ogType?: string
}

export function getContentPage(slug: string) {
  return getPageBySlug(slug)
}

export function useContentPageHead(page: Page | undefined, options: ContentPageHeadOptions) {
  const title = page?.title ?? options.fallbackTitle
  const description = page?.summary ?? options.fallbackDescription
  const headTitle = `${title} | ${site.title}`
  const canonical = absoluteUrl(options.routePath)

  useHead({
    title: headTitle,
    meta: [
      { name: 'description', content: description },
      { property: 'og:title', content: headTitle },
      { property: 'og:description', content: description },
      { property: 'og:type', content: options.ogType ?? 'website' },
      { property: 'og:url', content: canonical },
    ],
    link: [{ rel: 'canonical', href: canonical }],
  })

  return {
    title,
    description,
  }
}
