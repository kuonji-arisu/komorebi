/// <reference types="vite/client" />

declare module 'virtual:content' {
  import type { Page, Post } from './src/lib/types'

  export const posts: Post[]
  export const pages: Page[]
}
