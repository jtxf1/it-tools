<script setup lang="ts">
import type { UseValidationRule } from '@/composable/validation'
import JSON5 from 'json5'
import { parse as parseYaml, stringify } from 'yaml'

import { isNotThrowing } from '@/utils/boolean'
import { withDefaultOnError } from '@/utils/defaults'

function transformer(value: string) {
  return withDefaultOnError(() => {
    const obj = parseYaml(value, { merge: true })
    return obj ? JSON.stringify(obj, null, 3) : ''
  }, '')
}

const rules: UseValidationRule<string>[] = [
  {
    validator: (value: string) => isNotThrowing(() => parseYaml(value)),
    message: 'Provided YAML is not valid.',
  },
]

const transformer1 = (value: string) => withDefaultOnError(() => stringify(JSON5.parse(value)), '')

const rules1: UseValidationRule<string>[] = [
  {
    validator: (value: string) => value === '' || isNotThrowing(() => stringify(JSON5.parse(value))),
    message: 'Provided JSON is not valid.',
  },
]
const defaultIf = ref(true)
const tooltipText = ref('json to yaml')
function default_click() {
  defaultIf.value = !defaultIf.value
  tooltipText.value = !defaultIf.value ? 'yaml to json' : 'json to yaml'
}
</script>

<template>
  <div style="flex: 0 0 100%">
    <div style="margin: 0 auto; max-width: 600px" flex justify-center gap-3>
      <c-button class="isExclusive" @click="default_click()">
        {{ tooltipText }}
      </c-button>
    </div>
  </div>
  <format-transformer
    v-if="defaultIf"
    input-label="Your YAML"
    input-placeholder="Paste your yaml here..."
    output-label="JSON from your YAML"
    output-language="json"
    :input-validation-rules="rules"
    :transformer="transformer"
  />

  <format-transformer
    v-if="!defaultIf"
    input-label="Your JSON"
    input-placeholder="Paste your JSON here..."
    output-label="YAML from your JSON"
    output-language="yaml"
    :input-validation-rules="rules1"
    :transformer="transformer1"
  />
</template>

<style lang="less" scoped>
.exclusive {
  // 使用UnoCSS text-green-500的颜色值（绿色字体）
  color: #22c55e;

  // 可选：添加hover效果增强交互
  &:hover {
    color: #16a34a; // 深一点的绿色
  }
}
</style>
