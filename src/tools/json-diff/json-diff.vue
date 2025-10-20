<script setup lang="ts">
import JSON5 from 'json5'

import { isNotThrowing } from '@/utils/boolean'
import { withDefaultOnError } from '@/utils/defaults'
import DiffsViewer from './diff-viewer/diff-viewer.vue'

const rawLeftJson = ref('')
const rawRightJson = ref('')

const leftJson = computed(() => {
  return withDefaultOnError(() => {
    // 1. 检查原始值是否存在
    if (!rawLeftJson.value) {
      return {} // 返回空对象作为默认
    }

    // 2. 清理空白
    const content = rawLeftJson.value.trim()

    // 3. 处理空内容
    if (content === '') {
      return {}
    }

    // 4. 尝试解析
    return JSON5.parse(content)
  }, {}) // 解析失败时返回空对象而非undefined
})
const rightJson = computed(() => {
  return withDefaultOnError(() => {
    // 处理可能的空值或空白内容
    const content = (rawRightJson.value || '').trim()

    // 如果内容为空，返回空对象作为默认值
    if (!content) {
      return {}
    }

    // 尝试解析 JSON5
    return JSON5.parse(content)
  }, {}) // 解析失败时返回空对象，避免 undefined 问题
})

const jsonValidationRules = [
  {
    validator: (value: string) => value === '' || isNotThrowing(() => JSON5.parse(value)),
    message: 'Invalid JSON format',
  },
]
</script>

<template>
  <c-input-text
    v-model:value="rawLeftJson"
    :validation-rules="jsonValidationRules"
    label="Your first JSON"
    placeholder="Paste your first JSON here..."
    rows="20"
    multiline
    test-id="leftJson"
    raw-text
    monospace
  />

  <c-input-text
    v-model:value="rawRightJson"
    :validation-rules="jsonValidationRules"
    label="Your JSON to compare"
    placeholder="Paste your JSON to compare here..."
    rows="20"
    multiline
    test-id="rightJson"
    raw-text
    monospace
  />

  <DiffsViewer :left-json="leftJson" :right-json="rightJson" />
</template>
