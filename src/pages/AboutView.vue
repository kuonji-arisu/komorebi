<script setup lang="ts">
import { useHead } from '@unhead/vue'
import { absoluteUrl, site } from '@/config/site'

const description = 'A short about page for the person behind Quiet Notes.'

useHead({
  title: `About | ${site.title}`,
  meta: [
    { name: 'description', content: description },
    { property: 'og:title', content: `About | ${site.title}` },
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
    <h1>A quiet place for notes.</h1>
    <p class="lede">
      This page is intentionally small. Replace it with a short bio, the themes you write about,
      and the best way for readers to reach you.
    </p>
  </section>

  <section class="prose about-prose">
    <p>
      I use this site for durable notes: ideas that benefited from being written down slowly,
      decisions that deserve a little context, and small observations from building software.
    </p>
    <p>
      The first version keeps the machinery out of sight. Posts are local Markdown files, the site
      builds to static HTML, and the design leaves room for the writing to do most of the work.
    </p>
  </section>
</template>
