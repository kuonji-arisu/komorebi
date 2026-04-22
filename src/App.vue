<script setup lang="ts">
import { useHead } from '@unhead/vue'
import SiteHeader from '@/components/SiteHeader.vue'
import { absoluteUrl, site } from '@/config/site'

useHead({
  link: [
    {
      rel: 'alternate',
      type: 'application/rss+xml',
      title: `${site.title} RSS`,
      href: absoluteUrl(site.feedPath),
    },
  ],
})
</script>

<template>
  <div class="site-shell">
    <SiteHeader />
    <main class="site-main" id="main-content">
      <RouterView />
    </main>
    <footer class="site-footer">
      <p>Built with Vue, Markdown, and a quiet amount of care.</p>
    </footer>
  </div>
</template>
