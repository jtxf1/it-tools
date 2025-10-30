<script setup lang="ts">
import type { ShadowRootExpose } from 'vue-shadow-dom'
import { render } from '@regexper/render'
import RandExp from 'randexp'
import { useQueryParamOrStorage } from '@/composable/queryParams'
import { useValidation } from '@/composable/validation'
import { matchRegex } from './regex-tester.service'

const regex = useQueryParamOrStorage({ name: 'regex', storageName: 'regex-tester:regex', defaultValue: '' })
const text = ref('')
const global = ref(true)
const ignoreCase = ref(false)
const multiline = ref(false)
const dotAll = ref(true)
const unicode = ref(true)
const unicodeSets = ref(false)
const visualizerSVG = ref<ShadowRootExpose>()

const regexValidation = useValidation({
  source: regex,
  rules: [
    {
      message: 'Invalid regex: {0}',
      validator: value => new RegExp(value),
      getErrorMessage: (value) => {
        const _ = new RegExp(value)
        return ''
      },
    },
  ],
})
const results = computed(() => {
  let flags = 'd'
  if (global.value) {
    flags += 'g'
  }
  if (ignoreCase.value) {
    flags += 'i'
  }
  if (multiline.value) {
    flags += 'm'
  }
  if (dotAll.value) {
    flags += 's'
  }
  if (unicode.value) {
    flags += 'u'
  }
  else if (unicodeSets.value) {
    flags += 'v'
  }

  try {
    return matchRegex(regex.value, text.value, flags)
  }
  catch (_) {
    return []
  }
})

const sample = computed(() => {
  try {
    const randexp = new RandExp(new RegExp(regex.value.replace(/\(\?<[^>]*>/g, '(?:')))
    return randexp.gen()
  }
  catch (_) {
    return ''
  }
})

watchEffect(
  async () => {
    const regexValue = regex.value
    // shadow root is required:
    // @regexper/render append a <defs><style> that broke svg transparency of icons in the whole site
    const visualizer = visualizerSVG.value?.shadow_root
    if (visualizer) {
      while (visualizer.lastChild) {
        visualizer.removeChild(visualizer.lastChild)
      }
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
      try {
        await render(regexValue, svg)
      }
      catch (_) {
      }
      visualizer.appendChild(svg)
    }
  },
)
</script>

<template>
  <div class="parent">
    <div class="child">
      <c-card title="Regex" mb-1>
        <c-input-text
          v-model:value="regex"
          label="Regex to test:"
          placeholder="Put the regex to test"
          multiline
          rows="3"
          :validation="regexValidation"
        />
        <router-link target="_blank" to="/regex-memo" mb-1 mt-1>
          See Regular Expression Cheatsheet
        </router-link>
        <n-space>
          <n-checkbox v-model:checked="global">
            <span title="Global search">Global search. (<code>g</code>)</span>
          </n-checkbox>
          <n-checkbox v-model:checked="ignoreCase">
            <span title="Case-insensitive search">Case-insensitive search. (<code>i</code>)</span>
          </n-checkbox>
          <n-checkbox v-model:checked="multiline">
            <span title="Allows ^ and $ to match next to newline characters.">Multiline(<code>m</code>)</span>
          </n-checkbox>
          <n-checkbox v-model:checked="dotAll">
            <span title="Allows . to match newline characters.">Singleline(<code>s</code>)</span>
          </n-checkbox>
          <n-checkbox v-model:checked="unicode">
            <span title="Unicode; treat a pattern as a sequence of Unicode code points.">Unicode(<code>u</code>)</span>
          </n-checkbox>
          <n-checkbox v-model:checked="unicodeSets">
            <span title="An upgrade to the u mode with more Unicode features.">Unicode Sets (<code>v</code>)</span>
          </n-checkbox>
        </n-space>

        <n-divider />

        <c-input-text
          v-model:value="text"
          label="Text to match:"
          placeholder="Put the text to match"
          multiline
          rows="5"
        />
      </c-card>

      <c-card title="Matches" mb-1 mt-3>
        <n-table v-if="results?.length > 0">
          <thead>
            <tr>
              <th scope="col">
                Index in text
              </th>
              <th scope="col">
                Value
              </th>
              <th scope="col">
                Captures
              </th>
              <th scope="col">
                Groups
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="match of results" :key="match.index">
              <td>{{ match.index }}</td>
              <td>{{ match.value }}</td>
              <td>
                <ul>
                  <li v-for="capture in match.captures" :key="capture.name">
                    "{{ capture.name }}" = {{ capture.value }} [{{ capture.start }} - {{ capture.end }}]
                  </li>
                </ul>
              </td>
              <td>
                <ul>
                  <li v-for="group in match.groups" :key="group.name">
                    "{{ group.name }}" = {{ group.value }} [{{ group.start }} - {{ group.end }}]
                  </li>
                </ul>
              </td>
            </tr>
          </tbody>
        </n-table>
        <c-alert v-else>
          No match
        </c-alert>
      </c-card>

      <c-card title="Sample matching text" mt-3>
        <pre style="white-space: pre-wrap; word-break: break-all;">{{ sample }}</pre>
      </c-card>

      <c-card title="Regex Diagram" style="overflow-x: scroll;" mt-3>
        <shadow-root ref="visualizerSVG">
&#xa0;
        </shadow-root>
      </c-card>
    </div>

    <div class="child">
      <c-card title="Regex" mb-1>
        <c-input-text
          v-model:value="regex"
          label="Regex to test:"
          placeholder="Put the regex to test"
          multiline
          rows="3"
          :validation="regexValidation"
        />
        <router-link target="_blank" to="/regex-memo" mb-1 mt-1>
          See Regular Expression Cheatsheet
        </router-link>
        <n-space>
          <n-checkbox v-model:checked="global">
            <span title="Global search">Global search. (<code>g</code>)</span>
          </n-checkbox>
          <n-checkbox v-model:checked="ignoreCase">
            <span title="Case-insensitive search">Case-insensitive search. (<code>i</code>)</span>
          </n-checkbox>
          <n-checkbox v-model:checked="multiline">
            <span title="Allows ^ and $ to match next to newline characters.">Multiline(<code>m</code>)</span>
          </n-checkbox>
          <n-checkbox v-model:checked="dotAll">
            <span title="Allows . to match newline characters.">Singleline(<code>s</code>)</span>
          </n-checkbox>
          <n-checkbox v-model:checked="unicode">
            <span title="Unicode; treat a pattern as a sequence of Unicode code points.">Unicode(<code>u</code>)</span>
          </n-checkbox>
          <n-checkbox v-model:checked="unicodeSets">
            <span title="An upgrade to the u mode with more Unicode features.">Unicode Sets (<code>v</code>)</span>
          </n-checkbox>
        </n-space>

        <n-divider />

        <c-input-text
          v-model:value="text"
          label="Text to match:"
          placeholder="Put the text to match"
          multiline
          rows="5"
        />
      </c-card>

      <c-card title="Matches" mb-1 mt-3>
        <n-table v-if="results?.length > 0">
          <thead>
            <tr>
              <th scope="col">
                Index in text
              </th>
              <th scope="col">
                Value
              </th>
              <th scope="col">
                Captures
              </th>
              <th scope="col">
                Groups
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="match of results" :key="match.index">
              <td>{{ match.index }}</td>
              <td>{{ match.value }}</td>
              <td>
                <ul>
                  <li v-for="capture in match.captures" :key="capture.name">
                    "{{ capture.name }}" = {{ capture.value }} [{{ capture.start }} - {{ capture.end }}]
                  </li>
                </ul>
              </td>
              <td>
                <ul>
                  <li v-for="group in match.groups" :key="group.name">
                    "{{ group.name }}" = {{ group.value }} [{{ group.start }} - {{ group.end }}]
                  </li>
                </ul>
              </td>
            </tr>
          </tbody>
        </n-table>
        <c-alert v-else>
          No match
        </c-alert>
      </c-card>

      <c-card title="Sample matching text" mt-3>
        <pre style="white-space: pre-wrap; word-break: break-all;">{{ sample }}</pre>
      </c-card>

      <c-card title="Regex Diagram" style="overflow-x: scroll;" mt-3>
        <shadow-root ref="visualizerSVG">
&#xa0;
        </shadow-root>
      </c-card>
    </div>
  </div>
</template>

<!-- scoped 确保样式仅作用于当前组件，lang="less" 启用 Less 语法 -->
<style scoped lang="less">
// 父容器样式：使用 Flex 布局强制子元素并排不换行
.parent {
  max-width: 1200px; // 父容器最大宽度
  display: flex; // 启用 Flex 布局
  flex-wrap: nowrap; // 强制子元素不换行（默认值，可省略但显式更清晰）
  margin: 0 auto; // 可选：让父容器水平居中
  gap: 20px; // 可选：子元素之间的间距（Less 支持直接写数值）

  // 子元素样式
  .child {
    max-width: 600px; // 子元素最大宽度
    flex-shrink: 0; // 防止子元素被压缩（内容超出时保持最大宽度）
    padding: 20px; // 内边距
    background: #f0f0f0; // 背景色（方便演示）
  }
}
</style>
