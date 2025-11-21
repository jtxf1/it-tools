<script setup lang="ts">
import { ref, reactive } from 'vue'
import { NButton, NInput, NForm, NRadioGroup, NRadio, NCard } from 'naive-ui'

type LogContent = string | number | boolean | object | null | undefined

interface LogEntry {
  content: LogContent
  type: 'log' | 'info' | 'warn' | 'error'
  timestamp: string
}

interface FormValue {
  language: 'javascript' | 'typescript'
  code: string
}

const formValue = reactive<FormValue>({
  language: 'javascript',
  code: `// 示例代码：计算斐波那契数列
function fibonacci(n) {
  if (n <= 1) return n
  return fibonacci(n - 1) + fibonacci(n - 2)
}

console.log('斐波那契数列前10项：')
for (let i = 0; i < 10; i++) {
  console.log(fibonacci(i))
}

// 也可以使用箭头函数
const square = x => x * x
console.log('5的平方:', square(5))`,
})

const output = ref<LogEntry[]>([])
const error = ref<string | null>(null)
const isExecuting = ref(false)

// 保存原始console方法
const originalConsole = {
  log: console.log,
  info: console.info,
  warn: console.warn,
  error: console.error,
}

// 格式化时间戳
const formatTime = (): string => {
  const now = new Date()
  return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}.${now.getMilliseconds().toString().padStart(3, '0')}`
}

// 重写console方法以捕获输出
const captureConsole = () => {
  console.log = (...args) => {
    output.value.push({
      content: args.length === 1 ? args[0] : args,
      type: 'log',
      timestamp: formatTime(),
    })
    originalConsole.log(...args)
  }

  console.info = (...args) => {
    output.value.push({
      content: args.length === 1 ? args[0] : args,
      type: 'info',
      timestamp: formatTime(),
    })
    originalConsole.info(...args)
  }

  console.warn = (...args) => {
    output.value.push({
      content: args.length === 1 ? args[0] : args,
      type: 'warn',
      timestamp: formatTime(),
    })
    originalConsole.warn(...args)
  }

  console.error = (...args) => {
    output.value.push({
      content: args.length === 1 ? args[0] : args,
      type: 'error',
      timestamp: formatTime(),
    })
    originalConsole.error(...args)
  }
}

// 恢复原始console方法
const restoreConsole = () => {
  console.log = originalConsole.log
  console.info = originalConsole.info
  console.warn = originalConsole.warn
  console.error = originalConsole.error
}

// 执行代码
const executeCode = () => {
  clearOutput()
  isExecuting.value = true
  error.value = null
  captureConsole()

  try {
    // 创建一个包装函数，将代码作为表达式执行
    const code = formValue.code.trim()

    // 如果代码不是以 console 开头的语句，将其包装在立即执行函数中
    let wrappedCode = code
    if (!code.startsWith('console.')) {
      // 检查是否是表达式，如果是则输出结果
      if (
        !code.includes(';') &&
        !code.includes('{') &&
        !code.includes('function') &&
        !code.includes('if') &&
        !code.includes('for') &&
        !code.includes('while') &&
        !code.includes('switch') &&
        !code.includes('try') &&
        !code.includes('class')
      ) {
        wrappedCode = `console.log((${code}));`
      } else {
        wrappedCode = code
      }
    }

    // 使用立即执行函数来执行用户代码，避免变量污染全局
    new Function(wrappedCode)()
  } catch (err) {
    error.value = err?.toString() || '执行时发生未知错误'
    output.value.push({
      content: err?.toString() || '执行时发生未知错误',
      type: 'error',
      timestamp: formatTime(),
    })
  } finally {
    restoreConsole()
    isExecuting.value = false
  }
}

// 清空输出
const clearOutput = () => {
  output.value = []
  error.value = null
}

// 清空代码
const clearCode = () => {
  formValue.code = ''
}
</script>

<template>
  <c-card>
    <div class="mb-4">
      <n-radio-group v-model:value="formValue.language">
        <n-radio value="javascript">JavaScript</n-radio>
        <n-radio value="typescript">TypeScript</n-radio>
      </n-radio-group>
      <n-button @click="executeCode" type="primary" :loading="isExecuting" class="mr-2"> 执行代码 </n-button>
      <n-button @click="clearOutput" class="mr-2"> 清空输出 </n-button>
      <n-button @click="clearCode"> 清空代码 </n-button>
    </div>

    <n-form :model="formValue" label-placement="top">
      <n-input
        v-model:value="formValue.code"
        type="textarea"
        :autosize="{
          minRows: 15,
          maxRows: 15,
        }"
        placeholder="请输入要执行的JavaScript或TypeScript代码..."
        class="font-mono text-sm"
      />
    </n-form>
  </c-card>

  <c-card>
    <h3 class="text-lg font-bold mb-4">执行结果</h3>
    <div class="result-container">
      <n-card v-if="output.length === 0 && !error" class="text-gray-500 italic h-full flex items-center justify-center">
        执行结果将显示在这里...
      </n-card>

      <div v-else>
        <n-card v-if="error" class="mb-4 bg-red-50 border-red-200" embedded>
          <div class="text-red-600"><strong>错误:</strong> {{ error }}</div>
        </n-card>

        <n-card title="输出日志" embedded>
          <div
            v-for="(log, index) in output"
            :key="index"
            class="log-entry mb-1 p-2 rounded text-sm font-mono"
            :class="{
              'bg-blue-50 text-blue-800': log.type === 'log',
              'bg-green-50 text-green-800': log.type === 'info',
              'bg-yellow-50 text-yellow-800': log.type === 'warn',
              'bg-red-50 text-red-800': log.type === 'error',
            }"
          >
            <span class="mr-2 text-xs opacity-70">[{{ log.timestamp }}]</span>
            <span v-if="typeof log.content === 'object'">
              {{ JSON.stringify(log.content, null, 2) }}
            </span>
            <span v-else>{{ log.content }}</span>
          </div>
        </n-card>
      </div>
    </div>
  </c-card>
</template>

<style lang="less" scoped>
.result-container {
  height: calc(100% - 40px);
}

.log-entry {
  border-left: 3px solid #e0e0e0;
}

.log-entry.bg-blue-50 {
  border-left-color: #3b82f6;
}

.log-entry.bg-green-50 {
  border-left-color: #10b981;
}

.log-entry.bg-yellow-50 {
  border-left-color: #f59e0b;
}

.log-entry.bg-red-50 {
  border-left-color: #ef4444;
}
</style>
