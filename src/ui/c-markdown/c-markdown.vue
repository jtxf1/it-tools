<script setup lang="ts">
import DomPurify from 'dompurify'
import { marked } from 'marked'

const props = withDefaults(defineProps<{ markdown?: string }>(), { markdown: '' })
const { markdown } = toRefs(props)

marked.use({
  renderer: {
    link({ href, title, tokens }) {
      return `<a class="text-primary transition decoration-none hover:underline" href="${href}" target="_blank" rel="noopener">${title}-${tokens}</a>`
    },
  },
})

const html = computed(() => DomPurify.sanitize(marked(markdown.value).toString(), { ADD_ATTR: ['target'] }))
</script>

<template>
  <!-- eslint-disable-next-line vue/no-v-html -->
  <div v-html="html" />
</template>
