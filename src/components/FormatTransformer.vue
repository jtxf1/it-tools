<script setup lang="ts">
import type { UseValidationRule } from '@/composable/validation'
import _ from 'lodash'
import { computed, ref, toRefs, watch } from 'vue' // 确保导入watch
import CInputText from '@/ui/c-input-text/c-input-text.vue'

const props = withDefaults(
  defineProps<{
    transformer?: (v: string) => string
    inputValidationRules?: UseValidationRule<string>[]
    inputLabel?: string
    inputPlaceholder?: string
    inputDefault?: string
    outputLabel?: string
    outputLanguage?: string
  }>(),
  {
    transformer: _.identity,
    inputValidationRules: () => [],
    inputLabel: 'Input',
    inputDefault: '',
    inputPlaceholder: 'Input...',
    outputLabel: 'Output',
    outputLanguage: '',
  },
)

const { transformer, inputValidationRules, inputLabel, outputLabel, outputLanguage, inputPlaceholder, inputDefault }
  = toRefs(props)

const inputElement = ref<typeof CInputText>()

const input = ref(inputDefault.value)

// 关键：监听inputDefault的变化，同步更新input
watch(
  inputDefault, // 监听inputDefault（ref对象）
  (newVal) => {
    input.value = newVal // 当inputDefault变化时，更新input的值
  },
)
function clear() {
  inputElement.value?.clear()
}
// 注意：这里的output应该依赖input的值，而不是inputDefault（否则输入框手动修改后output不会更新）
const output = computed(() => transformer.value(input.value))
// 向父组件暴露方法和引用，使其可以访问组件内部的方法和引用
defineExpose({
  inputElement,
  clear, // 清空输入框内容的方法
})
</script>

<template>
  <CInputText
    ref="inputElement"
    v-model:value="input"
    :placeholder="inputPlaceholder"
    :label="inputLabel"
    rows="20"
    autosize
    raw-text
    multiline
    test-id="input"
    :validation-rules="inputValidationRules"
    monospace
  />

  <div overflow-auto>
    <div mb-5px>
      {{ outputLabel }}
    </div>
    <textarea-copyable :value="output" :language="outputLanguage" :follow-height-of="inputElement?.inputWrapperRef" />
  </div>
</template>
