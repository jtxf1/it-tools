<picture>
    <source srcset="./.github/logo-dark.png" media="(prefers-color-scheme: light)">
    <source srcset="./.github/logo-white.png" media="(prefers-color-scheme: dark)">
    <img src="./.github/logo-dark.png" alt="logo">
</picture>

对开发人员和 IT 工作者来说非常有用的工具。 [看一看](https://it-tools.tech).

## 自托管

**From docker hub:**

```sh
docker run -d --name it-tools --restart unless-stopped -p 8080:80 corentinth/it-tools:latest
```

**From github packages:**

```sh
docker run -d --name it-tools --restart unless-stopped -p 8080:80 ghcr.io/corentinth/it-tools:latest
```

**其他解决方案:**

- [Cloudron](https://www.cloudron.io/store/tech.ittools.cloudron.html)
- [Tipi](https://www.runtipi.io/docs/apps-available)
- [Unraid](https://unraid.net/community/apps?q=it-tools)

## Contribute

### 推荐的开发工具设置

VSCode插件:

- [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (并禁用 Vetur)
- [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [i18n Ally](https://marketplace.visualstudio.com/items?itemName=lokalise.i18n-ally)

使用以下设置:

```json
{
  "editor.formatOnSave": false,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "i18n-ally.localesPaths": ["locales", "src/tools/*/locales"],
  "i18n-ally.keystyle": "nested"
}
```

### TypeScript 对 `.vue` 导入的支持

默认情况下，TypeScript 无法处理 .vue 导入的类型信息，因此我们将 tsc CLI 替换为 vue-tsc 进行类型检查。在编辑器中，我们需要 TypeScript Vue 插件 (Volar) 来使 TypeScript 语言服务能够识别 .vue 类型。

如果您觉得独立的 TypeScript 插件不够快，Volar 还实现了性能更高的接管模式 。您可以按照以下步骤启用它：

1. 禁用内置 TypeScript 插件
   1. 从 VSCode 的命令面板运行 `Extensions: Show Built-in Extensions`
   2. 找到 `TypeScript and JavaScript Language Features` ，右键单击并选择 `Disable (Workspace)`
2. 通过从命令面板运行 `Developer: Reload Window` 来重新加载 VSCode 窗口。

### 安装依赖

```sh
pnpm install
```

### 运行

```sh
pnpm dev
```

### 编译

```sh
pnpm build
```

### 测试 [Vitest](https://vitest.dev/)

```sh
pnpm test
```

### 检测 [ESLint](https://eslint.org/)

```sh
pnpm lint
```

### 创建一个新的工具

要创建新工具，有一个脚本可以生成新工具的样板，只需运行：

```sh
pnpm run script:create:tool my-tool-name
```

它将在 `src/tools` 中创建一个包含正确文件的目录，并在 `src/tools/index.ts` 中导入。你只需要将导入的工具添加到正确的类别中，然后开发该工具即可。