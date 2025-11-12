<script setup lang="ts">
import type { UseValidationRule } from '@/composable/validation'
import { parse as parseToml, stringify as stringifyToml } from 'iarna-toml-esm'
import JSON5 from 'json5'
import { withDefaultOnError } from '../../utils/defaults'
import { isValidToml } from './toml.services'

const defaultIf = ref(true)
const name = ref('JSON')
const inputElement = ref<typeof CInputText>()

const convertJsonToToml = (value: string) => [stringifyToml(JSON5.parse(value))].flat().join('\n').trim()

const transformer = (value: string) => value.trim() === '' ? '' : withDefaultOnError(() => convertJsonToToml(value), '')

const rules: UseValidationRule<string>[] = [
  {
    validator: (v: string) => v === '' || JSON5.parse(v),
    message: 'Provided JSON is not valid.',
  },
]

const transformer1 = (value: string) => value === '' ? '' : withDefaultOnError(() => JSON.stringify(parseToml(value), null, 3), '')

const rules1: UseValidationRule<string>[] = [
  {
    validator: isValidToml,
    message: 'Provided TOML is not valid.',
  },
]
const tooltipText = ref('json to toml')
function default_click() {
  inputElement.value?.clear()
  defaultIf.value = !defaultIf.value
  name.value = name.value === 'JSON' ? 'TOML' : 'JSON'
  tooltipText.value = defaultIf.value ? 'json to toml' : 'toml to json'
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
    :input-label="`Your ${name}`"
    :input-placeholder="`Paste your ${name} here...`"
    :output-label="`${name} from your ${name === 'YAML' ? 'TOML' : 'YAML'}`"
    :output-language="`${name.toLowerCase}`"
    :input-validation-rules="defaultIf ? rules : rules1"
    :transformer="defaultIf ? transformer : transformer1"
  />
</template>
