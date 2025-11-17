<script setup lang="ts">
import type { UseValidationRule } from '@/composable/validation'
import { ref } from 'vue'
import yaml from 'yaml'
import { withDefaultOnError } from '@/utils/defaults'
import { formatXml, isValidXML } from './xml-formatter.service'
import { formatYaml } from './yaml-models'

const defaultValue = useStorage('xml-formatter:default-value', 'spring:\n  name: bug')
const indentSize = useStorage('xml-formatter:indent-size', 2)
const collapseContent = useStorage('xml-formatter:collapse-content', true)
const labelSwitch = useStorage('xml-formatter:label-switch', 'Sort keys :')
const label1 = useStorage('xml-formatter:label-1', 'YAML')
const isXml = ref<boolean>(true)

function transformer(value: string) {
  return isXml.value
    ? withDefaultOnError(() => formatYaml({ rawYaml: value, indentSize, sortKeys: collapseContent }), '')
    : formatXml(value, {
        indentation: ' '.repeat(indentSize.value),
        collapseContent: collapseContent.value,
        lineSeparator: '\n',
      })
}

const rules: UseValidationRule<string>[] = [
  {
    validator: isXml.value ? v => (v === '' || yaml.parse(v)) : isValidXML,
    message: `Provided ${label1} is not valid.`,
  },
]
// 监听isXml的变化
watch(
  isXml, // 要监听的源
  (newValue) => {
    collapseContent.value = true
    indentSize.value = 2
    if (newValue) {
      labelSwitch.value = 'Collapse content:'
      label1.value = 'YAML'
      defaultValue.value = 'spring:\n  name: bug'
    }
    else {
      labelSwitch.value = 'Sort keys :'
      label1.value = 'XML'
      defaultValue.value = '<hello><world>foo</world><world>bar</world></hello>'
    }
  },
  // 可选配置：是否深度监听（ref基本类型无需深度监听）
  { immediate: false }, // immediate为true时，初始化时立即执行一次
)
</script>

<template>
  <div important:flex-full important:flex-shrink-0 important:flex-grow-0>
    <div flex justify-center>
      <n-form-item label="xml:" label-placement="left">
        <n-switch v-model:value="isXml" />
      </n-form-item>
      <n-form-item label="&nbsp;&nbsp;:yaml" label-placement="left" />
      <n-form-item :label="labelSwitch" label-placement="left">
        <n-switch v-model:value="collapseContent" />
      </n-form-item>
      <n-form-item label="Indent size:" label-placement="left" label-width="100" :show-feedback="false">
        <n-input-number v-model:value="indentSize" min="1" max="10" w-100px />
      </n-form-item>
    </div>
  </div>

  <format-transformer
    :input-label="`Your ${label1}`"
    input-placeholder="Paste your XML here..."
    :output-label="`Formatted XML from your ${label1}` "
    :output-language="label1"
    :input-validation-rules="rules"
    :transformer="transformer"
    :input-default="defaultValue"
  />
</template>
