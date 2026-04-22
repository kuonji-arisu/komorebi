/// <reference types="vite/client" />

declare module 'virtual:posts' {
  import type { Post } from './src/lib/types'

  export const posts: Post[]
}
