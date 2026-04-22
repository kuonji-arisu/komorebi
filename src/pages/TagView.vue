<script setup lang="ts">
import { computed } from 'vue'
import { useHead } from '@unhead/vue'
import { useRoute } from 'vue-router'
import { absoluteUrl, site } from '@/config/site'
import { formatPostDate, getPostsByTagSlug, getTagBySlug } from '@/lib/content'

const route = useRoute()
const tagSlug = computed(() => String(route.params.tag ?? ''))
const tag = computed(() => getTagBySlug(tagSlug.value))
const taggedPosts = computed(() => getPostsByTagSlug(tagSlug.value))

useHead(() => {
  if (!tag.value) {
    return {
      title: `Tag not found | ${site.title}`,
      meta: [{ name: 'robots', content: 'noindex' }],
    }
  }

  const title = `${tag.value.name} | ${site.title}`
  const description = `${tag.value.count} post${tag.value.count === 1 ? '' : 's'} tagged ${tag.value.name}.`

  return {
    title,
    meta: [
      { name: 'description', content: description },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: absoluteUrl(tag.value.path) },
    ],
    link: [{ rel: 'canonical', href: absoluteUrl(tag.value.path) }],
  }
})
</script>

<template>
  <section v-if="tag" class="page-intro">
    <p class="eyebrow">Tag</p>
    <h1>{{ tag.name }}</h1>
    <p class="lede">{{ tag.count }} post{{ tag.count === 1 ? '' : 's' }} collected under this tag.</p>
  </section>

  <section v-if="tag" class="post-list" aria-labelledby="tag-posts">
    <h2 id="tag-posts">Writing</h2>

    <article v-for="post in taggedPosts" :key="post.slug" class="post-card">
      <RouterLink class="post-card__link" :to="post.path">
        <time :datetime="post.date">{{ formatPostDate(post.date) }}</time>
        <h3>{{ post.title }}</h3>
        <p>{{ post.summary }}</p>
      </RouterLink>
    </article>
  </section>

  <section v-else class="page-intro">
    <p class="eyebrow">404</p>
    <h1>Tag not found</h1>
    <p class="lede">There are no published notes under this tag.</p>
    <RouterLink class="text-link" to="/">Return home</RouterLink>
  </section>
</template>
