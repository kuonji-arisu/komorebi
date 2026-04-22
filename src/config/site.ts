import siteConfig from './site.json'

declare const __SITE_URL__: string | undefined

export interface SiteConfig {
  name: string
  title: string
  description: string
  url: string
  author: string
  locale: string
  ogImage: string
  feedPath: string
}

const siteUrl = typeof __SITE_URL__ === 'string' && __SITE_URL__ ? __SITE_URL__ : siteConfig.url

export const site: SiteConfig = {
  ...siteConfig,
  url: siteUrl,
}

export function absoluteUrl(path = '/') {
  return new URL(path, site.url).toString()
}
