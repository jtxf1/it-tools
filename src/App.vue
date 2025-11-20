<script setup lang="ts">
import type { NDateLocale } from 'naive-ui'
import { darkTheme, dateZhCN, NGlobalStyle, NMessageProvider, NNotificationProvider, zhCN } from 'naive-ui'
import { RouterView, useRoute } from 'vue-router'
import { layouts } from './layouts'
import { useStyleStore } from './stores/style.store'
import { darkThemeOverrides, lightThemeOverrides } from './themes'
import { useCommandPaletteStore } from '@/modules/command-palette/command-palette.store'
import { main } from '@/utools'
import { isValidCode } from '@/utils/string'

const dateLocale = ref<NDateLocale | null>(dateZhCN)

const route = useRoute()
const layout = computed(() => route?.meta?.layout ?? layouts.base)
const styleStore = useStyleStore()

const theme = computed(() => (styleStore.isDarkTheme ? darkTheme : null))
const themeOverrides = computed(() => (styleStore.isDarkTheme ? darkThemeOverrides : lightThemeOverrides))

const { locale } = useI18n()

syncRef(locale, useStorage('locale', locale))

const router = useRouter()

onMounted(() => {
  main().then((code) => {
    console.log('code:', code)
    if (isValidCode(code)) {
      const commandPaletteStore = useCommandPaletteStore()
      console.log('searchOptions in utools index:', commandPaletteStore.searchOptions)
      if (commandPaletteStore.searchOptions !== null && commandPaletteStore.searchOptions.length > 0) {
        // 提取所有 keywords 并合并成一个数组
        const allKeywords = commandPaletteStore.searchOptions.flatMap((tool) => tool.keywords || [])

        // 打印结果
        console.log(allKeywords)
        const option = commandPaletteStore.searchOptions.find(
          (tool) => Array.isArray(tool.keywords) && tool.keywords.includes(code),
        )
        if (option !== null && option?.to) {
          console.log('option:', option)
          console.log('option.to:', option.to)
          router.push(option?.to + '?is-tools=true')
        }
      }
    }
  })
})
</script>

<template>
  <n-config-provider :theme="theme" :theme-overrides="themeOverrides" :locale="zhCN" :date-locale="dateLocale">
    <NGlobalStyle />
    <NMessageProvider placement="bottom">
      <NNotificationProvider placement="bottom-right">
        <component :is="layout">
          <RouterView />
        </component>
      </NNotificationProvider>
    </NMessageProvider>
  </n-config-provider>
</template>

<style>
body {
  min-height: 100%;
  margin: 0;
  padding: 0;
}

html {
  height: 100%;
  margin: 0;
  padding: 0;
}

* {
  box-sizing: border-box;
}
</style>
