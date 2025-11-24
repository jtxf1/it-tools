// eslint.config.mjs
import { defineConfig } from 'eslint/config'
import globals from 'globals'
import pluginPrettier from 'eslint-plugin-prettier'

export default defineConfig([
  {
    // 匹配所有 TypeScript 和 Vue 文件
    files: ['**/*.{ts,mts,tsx,vue}'],

    // 语言选项配置
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: ['./tsconfig.json'],
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },

    // 规则配置
    rules: {
      // 通用规则
      'no-unused-vars': 'warn',
      'no-console': 'warn',
      'no-debugger': 'warn',

      // TypeScript 规则
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/consistent-type-imports': 'error',

      // Vue 规则
      'vue/multi-word-component-names': 'off',
      'vue/require-default-prop': 'warn',
      'vue/no-unused-components': 'warn',

      // Prettier 集成（关键配置）
      'prettier/prettier': [
        'error',
        {
          // 确保与 .prettierrc 一致
          semi: false,
          singleQuote: true,
          trailingComma: 'all',
          printWidth: 100,
          arrowParens: 'avoid',
        },
      ],
    },

    // 插件配置
    plugins: {
      prettier: pluginPrettier,
    },
  },
  // ✅ 关键配置：排除 public 目录下所有 JS 文件
  {
    ignores: [
      // 排除 public 目录下所有 JS 文件（包括子目录）
      'public/**/*.js',
      // 其他常见忽略项
      'node_modules',
      'dist',
      '_templates',
      '.vscode',
      '.idea',
      '.git',
      '.github',
      'vite.config.js',
      'eslint.config.mjs',
      'package.json',
    ],
  },
])
