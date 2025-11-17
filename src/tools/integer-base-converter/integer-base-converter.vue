<script setup lang="ts">
import { useCopy } from '@/composable/copy'
import { useValidation } from '@/composable/validation'
import { getErrorMessageIfThrows } from '@/utils/error'

import InputCopyable from '../../components/InputCopyable.vue'
import { convertBase } from './integer-base-converter.model'
import {
  arabicToRoman,
  isValidRomanNumber,
  MAX_ARABIC_TO_ROMAN,
  MIN_ARABIC_TO_ROMAN,
  romanToArabic,
} from './roman-numeral-converter.service'

const inputProps = {
  'labelPosition': 'left',
  'labelWidth': '170px',
  'labelAlign': 'right',
  'readonly': true,
  'mb-2': '',
} as const

const input = ref('42')
const inputBase = ref(10)
const outputBase = ref(42)

function errorlessConvert(...args: Parameters<typeof convertBase>) {
  try {
    return convertBase(...args)
  }
  catch {
    return ''
  }
}

const error = computed(() =>
  getErrorMessageIfThrows(() =>
    convertBase({ value: input.value, fromBase: inputBase.value, toBase: outputBase.value }),
  ),
)

const inputNumeral = ref(42)
const outputRoman = computed(() => arabicToRoman(inputNumeral.value))

const { attrs: validationNumeral } = useValidation({
  source: inputNumeral,
  rules: [
    {
      validator: value => value >= MIN_ARABIC_TO_ROMAN && value <= MAX_ARABIC_TO_ROMAN,
      message: `We can only convert numbers between ${MIN_ARABIC_TO_ROMAN.toLocaleString()} and ${MAX_ARABIC_TO_ROMAN.toLocaleString()}`,
    },
  ],
})

const inputRoman = ref('XLII')
const outputNumeral = computed(() => romanToArabic(inputRoman.value))

const validationRoman = useValidation({
  source: inputRoman,
  rules: [
    {
      validator: value => isValidRomanNumber(value),
      message: 'The input you entered is not a valid roman number',
    },
  ],
})

const { copy: copyRoman } = useCopy({ source: outputRoman, text: 'Roman number copied to the clipboard' })
const { copy: copyArabic } = useCopy({ source: () => String(outputNumeral), text: 'Arabic number copied to the clipboard' })
</script>

<template>
  <div class="parent">
    <div class="child">
      <c-card>
        <c-input-text v-model:value="input" label="Input number" placeholder="Put your number here (ex: 42)" label-position="left" label-width="110px" mb-2 label-align="right" />

        <n-form-item label="输入基数" label-placement="left" label-width="110" :show-feedback="false">
          <n-input-number v-model:value="inputBase" max="64" min="2" placeholder="Put your input base here (ex: 10)" w-full />
        </n-form-item>

        <n-alert v-if="error" style="margin-top: 25px" type="error">
          {{ error }}
        </n-alert>
        <n-divider />

        <InputCopyable
          label="Binary (2)"
          v-bind="inputProps"
          :value="errorlessConvert({ value: input, fromBase: inputBase, toBase: 2 })"
          placeholder="Binary version will be here..."
        />

        <InputCopyable
          label="Octal (8)"
          v-bind="inputProps"
          :value="errorlessConvert({ value: input, fromBase: inputBase, toBase: 8 })"
          placeholder="Octal version will be here..."
        />

        <InputCopyable
          label="Decimal (10)"
          v-bind="inputProps"
          :value="errorlessConvert({ value: input, fromBase: inputBase, toBase: 10 })"
          placeholder="Decimal version will be here..."
        />

        <InputCopyable
          label="Hexadecimal (16)"
          v-bind="inputProps"
          :value="errorlessConvert({ value: input, fromBase: inputBase, toBase: 16 })"
          placeholder="Hexadecimal version will be here..."
        />

        <InputCopyable
          label="Base64 (64)"
          v-bind="inputProps"
          :value="errorlessConvert({ value: input, fromBase: inputBase, toBase: 64 })"
          placeholder="Base64 version will be here..."
        />

        <div flex items-baseline>
          <n-input-group style="width: 160px; margin-right: 10px">
            <n-input-group-label> 自定义: </n-input-group-label>
            <n-input-number v-model:value="outputBase" max="64" min="2" />
          </n-input-group>

          <InputCopyable
            flex-1
            v-bind="inputProps"
            :value="errorlessConvert({ value: input, fromBase: inputBase, toBase: outputBase })"
            :placeholder="`Base ${outputBase} will be here...`"
          />
        </div>
      </c-card>
    </div>
    <div class="child">
      <c-card title="Arabic to roman">
        <div flex items-center justify-between>
          <n-form-item v-bind="validationNumeral as any">
            <n-input-number v-model:value="inputNumeral" :min="1" style="width: 200px" :show-button="false" />
          </n-form-item>
          <div class="result">
            {{ outputRoman }}
          </div>
          <c-button autofocus :disabled="validationNumeral.validationStatus === 'error'" @click="copyRoman()">
            Copy
          </c-button>
        </div>
      </c-card>
      <c-card title="Roman to arabic" mt-5>
        <div flex items-center justify-between>
          <c-input-text v-model:value="inputRoman" style="width: 200px" :validation="validationRoman" />

          <div class="result">
            {{ outputNumeral }}
          </div>
          <c-button :disabled="!validationRoman.isValid" @click="copyArabic()">
            Copy
          </c-button>
        </div>
      </c-card>
    </div>
  </div>
</template>

<style lang="less" scoped>
.n-input-group:not(:first-child) {
  margin-top: 5px;
}
.result {
  font-size: 22px;
}
// 父容器样式：使用 Flex 布局强制子元素并排不换行
.parent {
  max-width: 1200px; // 父容器最大宽度
  display: flex; // 启用 Flex 布局
  flex-wrap: nowrap; // 强制子元素不换行（默认值，可省略但显式更清晰）
  margin: 0 auto; // 可选：让父容器水平居中
  flex: 0 1 auto;
  // 子元素样式
  .child {
    max-width: 600px; // 子元素最大宽度
    flex-shrink: 0; // 防止子元素被压缩（内容超出时保持最大宽度）
  }
}
</style>
