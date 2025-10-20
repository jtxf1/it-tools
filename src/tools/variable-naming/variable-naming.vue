<script setup lang="ts">
const ibanExamples = [
  '驼峰',
  '下划线',
  '全小写',
  '全大写',
  '横线',
]
</script>

<template>
  <div>
    <c-input-text placeholder="请输入变量" test-id="iban-input" />

    <c-card title="Valid IBAN examples" mt-5>
      <div v-for="iban in ibanExamples" :key="iban">
        <c-text-copyable :value="iban" font-mono :displayed-value="undefined" />
      </div>
    </c-card>
  </div>
</template>

<style lang="less" scoped>
</style>
