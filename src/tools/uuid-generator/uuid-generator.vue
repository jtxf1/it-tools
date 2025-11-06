<script setup lang="ts">
import _ from 'lodash'
import { ulid } from 'ulid'
import { v1 as generateUuidV1, v3 as generateUuidV3, v4 as generateUuidV4, v5 as generateUuidV5, NIL as nilUuid } from 'uuid'
import { computedRefreshable } from '@/composable/computedRefreshable'
import { useCopy } from '@/composable/copy'
import { withDefaultOnError } from '@/utils/defaults'

const versions = ['NIL', 'v1', 'v3', 'v4', 'v5'] as const

const version = useStorage<typeof versions[number]>('uuid-generator:version', 'v4')
const count = useStorage('uuid-generator:quantity', 1)
const v35Args = ref({ namespace: '6ba7b811-9dad-11d1-80b4-00c04fd430c8', name: '' })

const validUuidRules = [
  {
    message: 'Invalid UUID',
    validator: (value: string) => {
      if (value === nilUuid) {
        return true
      }

      return Boolean(value.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/))
    },
  },
]

const generators = {
  NIL: () => nilUuid,
  v1: (index: number) => generateUuidV1({
    clockseq: index,
    msecs: Date.now(),
    nsecs: Math.floor(Math.random() * 10000),
    node: new Uint8Array(Array.from({ length: 6 }, () => Math.floor(Math.random() * 256))),
  }),
  v3: () => generateUuidV3(v35Args.value.name, v35Args.value.namespace),
  v4: () => generateUuidV4(),
  v5: () => generateUuidV5(v35Args.value.name, v35Args.value.namespace),
}

const [uuids, refreshUUIDs] = computedRefreshable(() => withDefaultOnError(() =>
  Array.from({ length: count.value }, (_ignored, index) => {
    const generator = generators[version.value] ?? generators.NIL
    return generator(index)
  }).join('\n'), ''))

const { copy } = useCopy({ source: uuids, text: 'UUIDs copied to the clipboard' })
const amount = useStorage('ulid-generator-amount', 1)
const formats = [{ label: 'Raw', value: 'raw' }, { label: 'JSON', value: 'json' }] as const
const format = useStorage<typeof formats[number]['value']>('ulid-generator-format', formats[0].value)

const [ulids, refreshUlids] = computedRefreshable(() => {
  const ids = _.times(amount.value, () => ulid())

  if (format.value === 'json') {
    return JSON.stringify(ids, null, 2)
  }

  return ids.join('\n')
})

const { copy: copy1 } = useCopy({ source: ulids, text: 'ULIDs copied to the clipboard' })
</script>

<template>
  <div class="parent">
    <div class="child">
      <c-buttons-select v-model:value="version" :options="[...versions]" label="UUID version" label-width="100px" mb-2 />

      <div mb-2 flex items-center>
        <span w-100px>Quantity </span>
        <n-input-number v-model:value="count" flex-1 :min="1" :max="50" placeholder="UUID quantity" />
      </div>

      <div v-if="version === 'v3' || version === 'v5'">
        <div>
          <c-buttons-select
            v-model:value="v35Args.namespace"
            :options="{
              DNS: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
              URL: '6ba7b811-9dad-11d1-80b4-00c04fd430c8',
              OID: '6ba7b812-9dad-11d1-80b4-00c04fd430c8',
              X500: '6ba7b814-9dad-11d1-80b4-00c04fd430c8',
            }"
            label="Namespace"
            label-width="100px"
            mb-2
          />
        </div>
        <div flex-1>
          <c-input-text
            v-model:value="v35Args.namespace"
            placeholder="Namespace"
            label-width="100px"
            label-position="left"
            label=" "
            :validation-rules="validUuidRules"
            mb-2
          />
        </div>

        <c-input-text
          v-model:value="v35Args.name"
          placeholder="Name"
          label="Name"
          label-width="100px"
          label-position="left"
          mb-2
        />
      </div>

      <c-input-text
        style="text-align: center; font-family: monospace"
        :value="uuids"
        multiline
        placeholder="Your uuids"
        autosize
        rows="1"
        readonly
        raw-text
        monospace
        my-3
        class="uuid-display"
      />

      <div flex justify-center gap-3>
        <c-button autofocus @click="copy()">
          Copy
        </c-button>
        <c-button @click="refreshUUIDs">
          Refresh
        </c-button>
      </div>
    </div>
    <div class="child">
      <div flex items-center>
        <label w-75px> Quantity:</label>
        <n-input-number v-model:value="amount" min="1" max="100" flex-1 />
      </div>

      <c-buttons-select v-model:value="format" :options="[...formats]" label="Format: " label-width="75px" />

      <c-card mt-5 flex data-test-id="ulids">
        <pre m-0 m-x-auto>{{ ulids }}</pre>
      </c-card>

      <div flex justify-center gap-2>
        <c-button data-test-id="refresh" @click="refreshUlids()">
          Refresh
        </c-button>
        <c-button @click="copy1()">
          Copy
        </c-button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
::v-deep(.uuid-display) {
  textarea {
    text-align: center;
  }
}
// 父容器样式：使用 Flex 布局强制子元素并排不换行
.parent {
  max-width: 1200px; // 父容器最大宽度
  display: flex; // 启用 Flex 布局
  flex-wrap: nowrap; // 强制子元素不换行（默认值，可省略但显式更清晰）
  flex: 0 1 auto;
  width: 100%;
  // 子元素样式
  .child {
    margin: 10px; // 可选：让父容器水平居中
    width: 50%; // 子元素最大宽度
    flex-shrink: 0; // 防止子元素被压缩（内容超出时保持最大宽度）
  }
}
</style>
