<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { site } from '@/config/site'
import ThemeToggle from './ThemeToggle.vue'
</script>

<template>
  <header class="site-header">
    <RouterLink class="site-brand" to="/" aria-label="Home">
      <span class="site-mark" aria-hidden="true">Q</span>
      <span>{{ site.name }}</span>
    </RouterLink>

    <nav class="site-nav" aria-label="Primary navigation">
      <RouterLink to="/">Writing</RouterLink>
      <RouterLink to="/about">About</RouterLink>
      <ThemeToggle />
    </nav>
  </header>
</template>
