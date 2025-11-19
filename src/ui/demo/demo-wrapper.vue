<script lang="ts" setup>
import type { RouteRecordName } from 'vue-router'
import _ from 'lodash'
import { demoRoutes } from './demo.routes'

const route = useRoute()
const a = [
  'c-alert',
  'c-button',
  'c-buttons-select',
  'c-card',
  'c-collapse',
  'c-diff-editor',
  'c-file-upload',
  'c-input-text',
  'c-key-value-list',
  'c-label',
  'c-link',
  'c-markdown',
  'c-modal-value',
  'c-modal',
  'c-select',
  'c-table',
  'c-text-copyable',
  'c-tooltip',
]
const b = [
  'c-alert 提示',
  'c-button 按钮',
  'c-buttons-select 选择',
  'c-card 卡片',
  'c-collapse 折叠',
  'c-diff-editor 文本对比',
  'c-file-upload 文件上传',
  'c-input-text 输入框',
  'c-list 列表',
  'c-label 标签',
  'c-link 链接',
  'c-markdown md文档',
  'c-modal-value 弹框按钮',
  'c-modal 弹框',
  'c-select 下拉选框',
  'c-table 表格',
  'c-text-copyable 复制',
  'c-tooltip 提示文本',
]

const componentName = computed(() => _.startCase(String(route.name).replace(/^c-/, '')))
// 替换 const 箭头函数为 function 声明
function getSafeIndex(name: RouteRecordName | string) {
  // 处理 undefined 或非 string 类型（如 symbol）
  if (name === undefined || typeof name !== 'string') {
    return name // 或返回默认值，如 'unknown'
  }
  const c = a.indexOf(name)
  if (c >= 0) {
    return b[c]!
  }
  return name
}
</script>

<template>
  <div mt-2 w-full p-8>
    <h1>c-lib components</h1>

    <div flex>
      <div w-200px b-r b-gray b-op-10 b-r-solid pr-4>
        <c-button
          v-for="{ name } of demoRoutes"
          :key="name"
          variant="text"
          :to="{ name }"
          w-full
          important:justify-start
          important:text-left
          :type="route.name === name ? 'primary' : 'default'"
        >
          {{ getSafeIndex(name) }}
        </c-button>
      </div>

      <div flex-1 pl-4>
        <h1>{{ componentName }}</h1>

        <router-view />
      </div>
    </div>
  </div>
</template>
