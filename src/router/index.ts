import type { RouteRecordRaw } from 'vue-router'
import AboutView from '@/pages/AboutView.vue'
import HomeView from '@/pages/HomeView.vue'
import NotFoundView from '@/pages/NotFoundView.vue'
import PostView from '@/pages/PostView.vue'
import TagView from '@/pages/TagView.vue'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView,
  },
  {
    path: '/posts/:slug',
    name: 'post',
    component: PostView,
  },
  {
    path: '/tags/:tag',
    name: 'tag',
    component: TagView,
  },
  {
    path: '/404',
    name: 'not-found',
    component: NotFoundView,
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
  },
]
