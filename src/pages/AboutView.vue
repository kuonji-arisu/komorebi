<script setup lang="ts">
import { useHead } from '@unhead/vue'
import { absoluteUrl, site } from '@/config/site'
import { getPageBySlug } from '@/lib/content'

const page = getPageBySlug('about')
const title = page?.title ?? 'About'
const description = page?.summary ?? `A short about page for the person behind ${site.title}.`
const headTitle = `${title} | ${site.title}`

useHead({
  title: headTitle,
  meta: [
    { name: 'description', content: description },
    { property: 'og:title', content: headTitle },
    { property: 'og:description', content: description },
    { property: 'og:type', content: 'profile' },
    { property: 'og:url', content: absoluteUrl('/about') },
  ],
  link: [{ rel: 'canonical', href: absoluteUrl('/about') }],
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
