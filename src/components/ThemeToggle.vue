<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

type Theme = 'light' | 'dark'

const theme = ref<Theme>('light')

const label = computed(() => (theme.value === 'dark' ? 'Use light theme' : 'Use dark theme'))

function setTheme(nextTheme: Theme) {
  theme.value = nextTheme

  if (typeof document !== 'undefined') {
    document.documentElement.dataset.theme = nextTheme
  }

  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('theme', nextTheme)
  }
}

function toggleTheme() {
  setTheme(theme.value === 'dark' ? 'light' : 'dark')
}

onMounted(() => {
  const stored = localStorage.getItem('theme')
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'

  setTheme(stored === 'dark' || stored === 'light' ? stored : systemTheme)
})
</script>

<template>
  <button class="theme-toggle" type="button" :aria-label="label" :title="label" @click="toggleTheme">
    <svg v-if="theme === 'dark'" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 17.2a5.2 5.2 0 1 0 0-10.4 5.2 5.2 0 0 0 0 10.4Zm0 3.3a.8.8 0 0 1-.8-.8v-1.1a.8.8 0 0 1 1.6 0v1.1a.8.8 0 0 1-.8.8Zm0-15.1a.8.8 0 0 1-.8-.8V3.5a.8.8 0 0 1 1.6 0v1.1a.8.8 0 0 1-.8.8Zm8.5 7.4h-1.1a.8.8 0 0 1 0-1.6h1.1a.8.8 0 0 1 0 1.6Zm-15.9 0H3.5a.8.8 0 0 1 0-1.6h1.1a.8.8 0 0 1 0 1.6Zm13.1 5.7a.8.8 0 0 1-.6-.2l-.8-.8a.8.8 0 1 1 1.2-1.2l.8.8a.8.8 0 0 1-.6 1.4ZM7.1 7.9a.8.8 0 0 1-.6-.2L5.7 7a.8.8 0 0 1 1.2-1.2l.8.8a.8.8 0 0 1-.6 1.4Zm9.8 0a.8.8 0 0 1-.6-1.4l.8-.8a.8.8 0 1 1 1.2 1.2l-.8.8a.8.8 0 0 1-.6.2ZM6.3 18.5a.8.8 0 0 1-.6-1.4l.8-.8a.8.8 0 1 1 1.2 1.2l-.8.8a.8.8 0 0 1-.6.2Z"
      />
    </svg>
    <svg v-else viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M20.2 15.5a.8.8 0 0 1 .1.8A8.8 8.8 0 0 1 3.8 10a8.6 8.6 0 0 1 4.4-6.3.8.8 0 0 1 1.1 1 7.5 7.5 0 0 0 9.9 9.9.8.8 0 0 1 1 .9Zm-2.4 1.4A9.1 9.1 0 0 1 7.1 6.2a7.2 7.2 0 1 0 10.7 10.7Z"
      />
    </svg>
  </button>
</template>
