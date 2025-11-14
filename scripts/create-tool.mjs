// 导入 Node.js 文件系统模块，用于异步文件操作
import { mkdir, readFile, writeFile } from 'node:fs/promises'
// 导入路径处理模块，用于构建路径
import { dirname, join } from 'node:path'
// 导入 URL 处理模块，用于将 URL 转换为文件路径
import { fileURLToPath } from 'node:url'

// 获取当前脚本文件的目录路径
const currentDirname = dirname(fileURLToPath(import.meta.url))

// 定义工具文件夹的路径，相对于当前脚本位置
const toolsDir = join(currentDirname, '..', 'src', 'tools')

// 从命令行参数获取工具名称
const toolName = process.argv[2]

// 如果没有提供工具名称，则抛出错误
if (!toolName) {
  throw new Error('Please specify a toolname.')
}

// 将工具名称转换为驼峰命名法（例如：my-tool -> myTool）
const toolNameCamelCase = toolName.replace(/-./g, x => x[1].toUpperCase())
// 将工具名称转换为标题格式（例如：my-tool -> My Tool）
const toolNameTitleCase = toolName[0].toUpperCase() + toolName.slice(1).replace(/-/g, ' ')
// 构建工具目录路径
const toolDir = join(toolsDir, toolName)

// 创建工具目录
await mkdir(toolDir)
console.log(`Directory created: ${toolDir}`)

/**
 * 创建工具文件的异步函数
 * @param {string} name - 文件名
 * @param {string} content - 文件内容
 */
async function createToolFile(name, content) {
  // 构建文件路径
  const filePath = join(toolDir, name)
  // 写入文件内容（去除首尾空白字符）
  await writeFile(filePath, content.trim())
  console.log(`File created: ${filePath}`)
}

// 创建 Vue 组件文件
createToolFile(
  `${toolName}.vue`,
  `
<template>
  <div>
    Lorem ipsum
  </div>
</template>

<script setup lang="ts">

</script>

<style lang="less" scoped>
</style>
`,
)

// 创建工具定义的入口文件
createToolFile(
  `index.ts`,
  `
import { ArrowsShuffle } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: '${toolNameTitleCase}',          // 工具名称（标题格式）
  path: '/${toolName}',                 // 工具路径
  description: '',                       // 工具描述（待填写）
  keywords: ['${toolName.split('-').join('\', \'')}'], // 工具关键词
  component: () => import('./${toolName}.vue'), // 异步导入 Vue 组件
  icon: ArrowsShuffle,                  // 工具图标
  createdAt: new Date('${new Date().toISOString().split('T')[0]}'), // 创建日期
});
`,
)

// 创建服务文件（空内容）
createToolFile(`${toolName}.service.ts`, ``)

// 创建服务单元测试文件
createToolFile(
  `${toolName}.service.test.ts`,
  `
import { expect, describe, it } from 'vitest';
// import { } from './${toolName}.service';
//
// describe('${toolName}', () => {
//
// })
`,
)

// 创建端到端测试文件
createToolFile(
  `${toolName}.e2e.spec.ts`,
  `
import { test, expect } from '@playwright/test';

test.describe('Tool - ${toolNameTitleCase}', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/${toolName}');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('${toolNameTitleCase} - IT Tools');
  });

  test('', async ({ page }) => {

  });
});
  
`,
)

// 更新工具索引文件，添加新工具的导入语句
const toolsIndex = join(toolsDir, 'index.ts')
// 读取现有索引文件内容并按行分割
const indexContent = await readFile(toolsIndex, { encoding: 'utf-8' }).then(r => r.split('\n'))

// 在第4行插入新工具的导入语句
indexContent.splice(3, 0, `import { tool as ${toolNameCamelCase} } from './${toolName}';`)
// 将更新后的内容写回索引文件
writeFile(toolsIndex, indexContent.join('\n'))
console.log(`Added import in: ${toolsIndex}`)

// 添加国际化支持
const localesDir = join(currentDirname, '..', 'locales')

// 更新 en.yml 文件
try {
  const enYmlPath = join(localesDir, 'en.yml')
  let enYmlContent = await readFile(enYmlPath, { encoding: 'utf-8' })

  // 在 tools 部分的最后添加新工具的国际化内容
  const enYmlLines = enYmlContent.split('\n')
  let toolsSectionIndex = -1
  let toolsEndIndex = enYmlLines.length // 默认在文件末尾

  // 找到 tools 部分的位置和结束位置
  for (let i = 0; i < enYmlLines.length; i++) {
    if (enYmlLines[i].trim() === '')
      continue // 跳过空行
    if (enYmlLines[i].startsWith('tools:')) {
      toolsSectionIndex = i
    }
    // 找到 tools 部分的结束位置（下一个顶级部分或文件末尾）
    if (toolsSectionIndex !== -1 && i > toolsSectionIndex) {
      if (enYmlLines[i].trim() && !enYmlLines[i].startsWith('  ') && !enYmlLines[i].startsWith('    ') && !enYmlLines[i].startsWith('#')) {
        toolsEndIndex = i
        break
      }
    }
  }

  // 查找 tools 部分的实际结束位置
  if (toolsSectionIndex !== -1) {
    for (let i = toolsSectionIndex + 1; i < enYmlLines.length; i++) {
      if (enYmlLines[i].trim() === '')
        continue // 跳过空行

      // 检查是否是顶级键（非 tools 部分的内容）
      if (!enYmlLines[i].startsWith('  ') && !enYmlLines[i].startsWith('#')) {
        toolsEndIndex = i
        break
      }
    }
  }

  // 如果找到了 tools 部分，在其后添加新工具的国际化内容
  if (toolsSectionIndex !== -1) {
    const toolContent = [
      `  ${toolName}:`,
      `    title: "${toolNameTitleCase}"`,
      `    description: "${toolNameTitleCase} description"`,
      '\n',
    ]

    enYmlLines.splice(toolsEndIndex, 0, ...toolContent)

    enYmlContent = enYmlLines.join('\n')
    await writeFile(enYmlPath, enYmlContent)
    console.log(`Updated en.yml with new tool: ${toolName}`)
  }
  else {
    console.log('Could not find tools section in en.yml')
  }
}
catch (error) {
  console.error('Error updating en.yml:', error.message)
}

// 更新 zh.yml 文件
try {
  const zhYmlPath = join(localesDir, 'zh.yml')
  let zhYmlContent = await readFile(zhYmlPath, { encoding: 'utf-8' })

  // 在 tools 部分的最后添加新工具的国际化内容
  const zhYmlLines = zhYmlContent.split('\n')
  let toolsSectionIndex = -1
  let toolsEndIndex = zhYmlLines.length // 默认在文件末尾

  // 找到 tools 部分的位置和结束位置
  for (let i = 0; i < zhYmlLines.length; i++) {
    if (zhYmlLines[i].startsWith('tools:')) {
      toolsSectionIndex = i
    }
    // 找到 tools 部分的结束位置（下一个顶级部分或文件末尾）
    if (toolsSectionIndex !== -1 && i > toolsSectionIndex) {
      if (zhYmlLines[i].trim() && !zhYmlLines[i].startsWith('  ') && !zhYmlLines[i].startsWith('    ') && !zhYmlLines[i].startsWith('#')) {
        toolsEndIndex = i
        break
      }
    }
  }

  // 查找 tools 部分的实际结束位置
  if (toolsSectionIndex !== -1) {
    for (let i = toolsSectionIndex + 1; i < zhYmlLines.length; i++) {
      if (zhYmlLines[i].trim() === '')
        continue // 跳过空行

      // 检查是否是顶级键（非 tools 部分的内容）
      if (!zhYmlLines[i].startsWith('  ') && !zhYmlLines[i].startsWith('#')) {
        toolsEndIndex = i
        break
      }
    }
  }

  // 如果找到了 tools 部分，在其后添加新工具的国际化内容
  if (toolsSectionIndex !== -1) {
    const toolContent = [
      `  ${toolName}:`,
      `    title: ${toolNameTitleCase}`,
      `    description: ${toolNameTitleCase} description`,
    ]

    zhYmlLines.splice(toolsEndIndex, 0, ...toolContent)

    zhYmlContent = zhYmlLines.join('\n')
    await writeFile(zhYmlPath, zhYmlContent)
    console.log(`Updated zh.yml with new tool: ${toolName}`)
  }
  else {
    console.log('Could not find tools section in zh.yml')
  }
}
catch (error) {
  console.error('Error updating zh.yml:', error.message)
}
