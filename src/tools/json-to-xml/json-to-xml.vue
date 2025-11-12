<script setup lang="ts">
import type { UseValidationRule } from '@/composable/validation'
import JSON5 from 'json5'
import convert from 'xml-js'
import { withDefaultOnError } from '@/utils/defaults'
import { isValidXML } from '../xml-formatter/xml-formatter.service'

const defaultValue = '{"a":{"_attributes":{"x":"1.234","y":"It\'s"}}}'
function transformer(value: string) {
  return withDefaultOnError(() => {
    return convert.js2xml(JSON5.parse(value), { compact: true })
  }, '')
}

const rules: UseValidationRule<string>[] = [
  {
    validator: (v: string) => v === '' || JSON5.parse(v),
    message: 'Provided JSON is not valid.',
  },
]
const defaultValue1 = '<a x="1.234" y="It\'s"/>'
function transformer1(value: string) {
  return withDefaultOnError(() => {
    return JSON.stringify(convert.xml2js(value, { compact: true }), null, 2)
  }, '')
}

const rules1: UseValidationRule<string>[] = [
  {
    validator: isValidXML,
    message: 'Provided XML is not valid.',
  },
]

const defaultIf = ref(true)
const name = ref('JSON')
const inputElement = ref<typeof CInputText>()
const tooltipText = ref('json to xml')
function default_click() {
  inputElement.value?.clear()
  defaultIf.value = !defaultIf.value
  name.value = name.value === 'JSON' ? 'XML' : 'JSON'
  tooltipText.value = defaultIf.value ? 'json to xml' : 'xml to json'
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
    ref="inputElement"
    :input-default="defaultIf ? defaultValue : defaultValue1"
    :input-label="`Your ${name}`"
    :input-placeholder="`Paste your ${name} here...`"
    :output-label="`${name} from your ${name === 'YAML' ? 'TOML' : 'YAML'}`"
    :output-language="`${name.toLowerCase}`"
    :input-validation-rules="defaultIf ? rules : rules1"
    :transformer="defaultIf ? transformer : transformer1"
  />
</template>
