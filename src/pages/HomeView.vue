<script setup lang="ts">
import { useHead } from '@unhead/vue'
import { absoluteUrl, site } from '@/config/site'
import { formatPostDate, posts, tagPath } from '@/lib/content'

useHead({
  title: site.title,
  meta: [
    { name: 'description', content: site.description },
    { property: 'og:title', content: site.title },
    { property: 'og:description', content: site.description },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: absoluteUrl('/') },
    { property: 'og:image', content: absoluteUrl(site.ogImage) },
  ],
  link: [{ rel: 'canonical', href: absoluteUrl('/') }],
})
</script>

<template>
  <section class="page-intro" aria-labelledby="home-title">
    <p class="eyebrow">Personal blog</p>
    <h1 id="home-title">{{ site.title }}</h1>
    <p class="lede">{{ site.description }}</p>
  </section>

  <section class="post-list" aria-labelledby="latest-posts">
    <h2 id="latest-posts">Latest Writing</h2>

    <article v-for="post in posts" :key="post.slug" class="post-card">
      <RouterLink class="post-card__link" :to="post.path">
        <time :datetime="post.date">{{ formatPostDate(post.date) }}</time>
        <h3>{{ post.title }}</h3>
        <p>{{ post.summary }}</p>
      </RouterLink>
      <ul v-if="post.tags.length" class="tag-list post-card__tags" aria-label="Post tags">
        <li v-for="tag in post.tags" :key="tag">
          <RouterLink :to="tagPath(tag)">{{ tag }}</RouterLink>
        </li>
      </ul>
    </article>
  </section>
</template>
