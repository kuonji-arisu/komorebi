import { ViteSSG } from 'vite-ssg'
import App from './App.vue'
import { posts, tags } from './lib/content'
import { routes } from './router'
import './styles/index.css'

export const createApp = ViteSSG(App, {
  base: import.meta.env.BASE_URL,
  routes,
})

// Static routes stay explicit for content pages. Add route-level Vue pages here
// when they should be generated; do not derive routes from src/content/pages.
export function includedRoutes() {
  return ['/', '/about', '/404', ...posts.map((post) => post.path), ...tags.map((tag) => tag.path)]
}
