<script setup lang="ts">
import { site } from '@/config/site'
import { getContentPage, useContentPageHead } from '@/lib/content-pages'

const page = getContentPage('about')
const { title, description } = useContentPageHead(page, {
  routePath: '/about',
  fallbackTitle: 'About',
  fallbackDescription: `A short about page for the person behind ${site.title}.`,
  ogType: 'profile',
})
</script>

<template>
  <section class="page-intro">
    <p class="eyebrow">About</p>
    <h1 class="page-title">{{ title }}</h1>
    <p class="page-summary">{{ description }}</p>
  </section>

  <section v-if="page" class="prose about-prose" v-html="page.html" />
</template>
