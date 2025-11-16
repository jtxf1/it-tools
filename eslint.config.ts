// eslint.config.ts
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import { defineConfig } from 'eslint/config'

// === 动态加载 .eslintrc-auto-import.json 中的 globals ===
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const autoImportPath = path.resolve(__dirname, '.eslintrc-auto-import.json')

let autoImportGlobals: Record<string, boolean | 'readonly' | 'writable'> = {}

if (fs.existsSync(autoImportPath)) {
  try {
    const content = fs.readFileSync(autoImportPath, 'utf8')
    const config = JSON.parse(content)
    autoImportGlobals = config.globals || {}
  } catch (e) {
    console.warn('Failed to parse .eslintrc-auto-import.json:', e)
  }
}

// 合并 browser 全局变量和 auto-import 全局变量
const mergedGlobals = {
  ...globals.browser,
  ...autoImportGlobals,
}

// === ESLint 配置 ===
export default defineConfig([
  {
    // 全局忽略（等价于 .eslintignore）
    ignores: ['dist/**', 'node_modules/**', 'components.d.ts', '.eslintrc-auto-import.json'],
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,vue}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: {
      globals: globals.node, // 👈 使用合并后的 globals
    },
    rules: {},
  },
  {
    files: ['**/*.{js,ts,vue}'],
    languageOptions: {
      globals: mergedGlobals, // 👈 使用合并后的 globals
    },
    rules: {},
  },
  tseslint.configs.recommended,
  pluginVue.configs['flat/essential'],
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
      },
    },
  },
])
