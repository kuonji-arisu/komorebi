<script setup lang="ts">
import { computed } from 'vue'
import { useHead } from '@unhead/vue'
import { useRoute } from 'vue-router'
import { absoluteUrl, site } from '@/config/site'
import { formatPostDate, getPostBySlug, tagPath } from '@/lib/content'

const route = useRoute()
const post = computed(() => getPostBySlug(String(route.params.slug ?? '')))

useHead(() => {
  if (!post.value) {
    return {
      title: `Post not found | ${site.title}`,
      meta: [{ name: 'robots', content: 'noindex' }],
    }
  }

  const canonical = absoluteUrl(post.value.path)
  const title = `${post.value.title} | ${site.title}`

  return {
    title,
    meta: [
      { name: 'description', content: post.value.summary },
      { property: 'og:title', content: post.value.title },
      { property: 'og:description', content: post.value.summary },
      { property: 'og:type', content: 'article' },
      { property: 'og:url', content: canonical },
      { property: 'og:image', content: absoluteUrl(site.ogImage) },
      { property: 'article:published_time', content: post.value.date },
      { name: 'keywords', content: post.value.tags.join(', ') },
      ...post.value.tags.map((tag) => ({ property: 'article:tag', content: tag })),
    ],
    link: [{ rel: 'canonical', href: canonical }],
    script: [
      {
        type: 'application/ld+json',
        textContent: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: post.value.title,
          description: post.value.summary,
          datePublished: post.value.date,
          dateModified: post.value.date,
          keywords: post.value.tags,
          author: {
            '@type': 'Person',
            name: site.author,
          },
          mainEntityOfPage: canonical,
          image: absoluteUrl(site.ogImage),
        }),
      },
    ],
  }
})
</script>

<template>
  <article v-if="post" class="article-page">
    <header class="article-header">
      <RouterLink class="back-link" to="/">Back to writing</RouterLink>
      <time class="article-meta" :datetime="post.date">{{ formatPostDate(post.date) }}</time>
      <h1 class="article-title">{{ post.title }}</h1>
      <p class="article-summary">{{ post.summary }}</p>
      <ul v-if="post.tags.length" class="tag-list" aria-label="Post tags">
        <li v-for="tag in post.tags" :key="tag">
          <RouterLink :to="tagPath(tag)">{{ tag }}</RouterLink>
        </li>
      </ul>
    </header>

    <nav v-if="post.headings.length" class="article-toc" aria-label="Post contents">
      <a
        v-for="heading in post.headings"
        :key="heading.id"
        :class="`article-toc__link article-toc__link--level-${heading.level}`"
        :href="`#${heading.id}`"
      >
        {{ heading.text }}
      </a>
    </nav>

    <div class="prose" v-html="post.html" />
  </article>

  <section v-else class="page-intro">
    <p class="eyebrow">404</p>
    <h1 class="page-title">Post not found</h1>
    <p class="page-summary">The note you are looking for is not available.</p>
    <RouterLink class="text-link" to="/">Return home</RouterLink>
  </section>
</template>
