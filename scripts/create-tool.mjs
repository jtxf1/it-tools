/* eslint-env node */
// 导入 Node.js 内置模块，用于文件系统操作和路径处理
import { access, mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
// 导入 URL 处理模块，用于将 URL 转换为文件路径
import { fileURLToPath } from 'node:url'

// 检查文件是否存在
async function fileExists(path) {
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}

// 获取当前脚本所在目录（兼容 ES 模块）
const currentDirname = dirname(fileURLToPath(import.meta.url))

// 定义工具代码存放的根目录：相对于当前脚本向上一级，进入 src/tools
const toolsDir = join(currentDirname, '..', 'src', 'tools')

// 从命令行参数中读取用户指定的工具名称和类别
const toolName = process.argv[2]
const categoryName = process.argv[3] // 新增参数：类别名称

// 如果未提供工具名，则抛出错误提示
if (!toolName) {
  console.error('Error: Please specify a tool name.')
  console.log('Usage: node create-tool.mjs <tool-name> [category-name]')
  console.log('Example: node create-tool.mjs my-awesome-tool Development')
  process.exit(1)
}

// 将 kebab-case（如 my-tool）转换为 camelCase（如 myTool）
const toolNameCamelCase = toolName.replace(/-([a-z])/g, (x) => x[1].toUpperCase())

// 将 kebab-case 转换为 Title Case（如 My Awesome Tool），用于显示名称
const toolNameTitleCase = toolName
  .split('-')
  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  .join(' ')

// 构建该工具专属的子目录路径
const toolDir = join(toolsDir, toolName)

// 创建工具目录（递归创建，避免错误）
await mkdir(toolDir, { recursive: true })
console.log(`Directory created: ${toolDir}`)

/**
 * 辅助函数：在工具目录下创建一个文件
 * @param name 文件名（如 index.ts）
 * @param content 文件内容
 */
async function createToolFile(name, content) {
  // 构建文件路径
  const filePath = join(toolDir, name)
  // 写入文件内容（去除首尾空白字符）
  await writeFile(filePath, content.trim())
  console.log(`File created: ${filePath}`)
}

// 创建 Vue 组件文件（基础模板）
await createToolFile(
  `${toolName}.vue`,
  `<script setup lang="ts">
// Add your component logic here
</script>

<template>
  <div class="${toolName}">
    <h1>${toolNameTitleCase}</h1>
    <p>Tool content goes here.</p>
  </div>
</template>

<style lang="less" scoped>
.${toolName} {
  padding: 1rem;
}
</style>

`,
)

// 创建工具元信息注册文件（index.ts）
await createToolFile(
  `index.ts`,
  `import { ArrowsShuffle } from '@vicons/tabler'
import { translate } from '@/plugins/i18n.plugin'
import { defineTool } from '../tool'

export const tool = defineTool({
  name: translate('tools.${toolName}.title'),
  path: '/${toolName}',
  description: translate('tools.${toolName}.description'),
  keywords: ['${toolName.split('-').join("', '")}'],
  component: () => import('./${toolName}.vue'),
  icon: ArrowsShuffle,
  createdAt: new Date('${new Date().toISOString().split('T')[0]}'),
})

`,
)

// 创建业务逻辑服务文件（初始为空，供后续实现核心功能）
await createToolFile(`${toolName}.service.ts`, `// Add your service logic here\n`)

// 更新 src/tools/index.ts，自动导入新工具
const toolsIndex = join(toolsDir, 'index.ts')

if (await fileExists(toolsIndex)) {
  let indexContent = await readFile(toolsIndex, { encoding: 'utf-8' })

  // 检查是否已存在该工具的导入
  if (!indexContent.includes(`import { tool as ${toolNameCamelCase} } from './${toolName}'`)) {
    // 添加导入语句
    const importStatement = `import { tool as ${toolNameCamelCase} } from './${toolName}'\n`
    indexContent = importStatement + indexContent

    // 如果提供了类别名称，将工具添加到对应的类别中
    if (categoryName) {
      // 检查类别是否存在
      const categoryExists = indexContent.includes(`name: '${categoryName}'`)

      if (categoryExists) {
        // 找到对应类别的 components 数组
        const categoryPattern = new RegExp(
          `(\\{\\s*name:\\s*'${categoryName}'[^}]*?components:\\s*\\[)([^\\]]*?)(\\][^}]*?\\})`,
          's',
        )
        const match = indexContent.match(categoryPattern)

        if (match) {
          let componentsList = match[2]
          // 检查组件是否已存在于该类别中
          if (!componentsList.includes(toolNameCamelCase)) {
            // 添加新组件到数组中
            if (componentsList.trim() !== '') {
              componentsList = `${componentsList},\n      ${toolNameCamelCase}`
            } else {
              componentsList = `\n       + ${toolNameCamelCase}`
            }

            // 替换原内容
            const newContent = indexContent.replace(categoryPattern, `$1${componentsList}$3`)
            indexContent = newContent
            console.log(`Added ${toolNameCamelCase} to category '${categoryName}'`)
          } else {
            console.log(`${toolNameCamelCase} already exists in category '${categoryName}'`)
          }
        } else {
          console.error(`Error: Could not find category '${categoryName}' in index.ts`)
        }
      } else {
        console.error(`Error: Category '${categoryName}' does not exist`)
        console.log(
          'Available categories: Development, Crypto, Converter, Web, Images and videos, Network, Math, Measurement, Text, Data',
        )
        process.exit(1)
      }
    }

    await writeFile(toolsIndex, indexContent)
    console.log(`Added import in: ${toolsIndex}`)
  } else {
    console.log(`Tool ${toolName} already exists in index.ts`)
  }
} else {
  console.error(`Error: ${toolsIndex} does not exist`)
  console.log('Please create the tools index file first.')
  process.exit(1)
}

// 更新国际化文件
const localesDir = join(currentDirname, '..', 'locales')
const locales = ['en.yml', 'zh.yml']

for (const locale of locales) {
  const localePath = join(localesDir, locale)

  if (await fileExists(localePath)) {
    let content = await readFile(localePath, 'utf-8')

    // 检查是否已存在该工具的配置
    if (!content.includes(`  ${toolName}:`)) {
      // 使用更安全的YAML处理方式
      const lines = content.split('\n')
      let toolsIndex = -1

      // 找到 tools: 行的索引
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].trim() === 'tools:') {
          toolsIndex = i
          break
        }
      }

      if (toolsIndex !== -1) {
        // 在 tools: 下添加新工具配置，保持正确的缩进
        const newConfig = [
          `  ${toolName}:`,
          `    title: ${toolNameTitleCase}`,
          `    description: ${toolNameTitleCase} description`,
        ]

        // 找到 tools 下面第一个非空行，然后插入配置
        let insertIndex = toolsIndex + 1
        while (insertIndex < lines.length && lines[insertIndex].trim() === '') {
          insertIndex++
        }

        lines.splice(insertIndex, 0, ...newConfig)

        content = lines.join('\n')
        await writeFile(localePath, content)
        console.log(`Added ${toolName} configuration to ${locale}`)
      } else {
        console.warn(`Warning: Could not find 'tools:' section in ${locale}`)
      }
    } else {
      console.log(`${toolName} configuration already exists in ${locale}`)
    }
  } else {
    console.warn(`Warning: Locale file ${localePath} does not exist, skipping...`)
  }
}

console.log(`\n✅ Tool "${toolName}" has been created successfully!`)
if (categoryName) {
  console.log(`🏷️  Added to category: ${categoryName}`)
}
console.log(`📁 Tool directory: ${toolDir}`)
console.log(`📝 Remember to customize the component, service, and translations as needed.`)
