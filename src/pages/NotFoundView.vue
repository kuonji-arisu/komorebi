<script setup lang="ts">
import { useHead } from '@unhead/vue'
import { site } from '@/config/site'

useHead({
  title: `Not found | ${site.title}`,
  meta: [
    { name: 'description', content: 'The page you are looking for could not be found.' },
    { name: 'robots', content: 'noindex' },
  ],
})
</script>

<template>
  <section class="page-intro">
    <p class="eyebrow">404</p>
    <h1>This page drifted out of view.</h1>
    <p class="lede">The link may be old, or the note may have moved.</p>
    <RouterLink class="text-link" to="/">Return to the latest writing</RouterLink>
  </section>
</template>
