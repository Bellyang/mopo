# 项目配置指南

**配置文件结构**

Mopo 支持多层级配置体系，采用配置文件继承机制实现配置复用：

```
root/
├── mopo.config.ts       # 全局基础配置
└── packages/
    ├── workspace-a/
    │   └── mopo.config.ts  # 继承并覆盖全局配置
    └── workspace-b/
        └── mopo.config.ts  # 独立个性配置
```
**配置继承示例**

```javascript
// 根目录配置 (root/mopo.config.ts)
export default {
  publicPath: '/common/',
  css: { sourceMap: true }
}

// 工作区配置 (workspace/mopo.config.ts)
import baseConfig from '../../mopo.config'

export default {
  ...baseConfig,
  publicPath: '/workspace-specific/',  // 覆盖公共路径配置
  devServer: { port: 8080 }            // 新增开发服务器配置
}
```

**Mopo**支持为每个**workspace**配置独立的**mopo.config.ts**文件。配置文件的解析采用[cosmiconfig](https://github.com/cosmiconfig/cosmiconfig)，支持多种配置文件格式。

支持的配置文件格式如下：

::: details
* <em>moporc</em>
* <em>moporc.json</em>
* <em>moporc.yaml</em>
* <em>moporc.yml</em>
* <em>moporc.js</em>
* <em>moporc.cjs</em>
* <em>moporc.mjs</em>
* <em>moporc.ts</em>
* <em>moporc.cts</em>
* <em>moporc.mts</em>
* <em>mopo.config.js</em>
* <em>mopo.config.cjs</em>
* <em>mopo.config.mjs</em>
* <em>mopo.config.ts</em>
* <em>mopo.config.cts</em>
* <em>mopo.config.mts</em>
* <em>package.json</em> # 在package.json中设置mopo属性
:::

## 1. Pages

**类型定义：**

```typescript
type PageConfig = {
  entry: string           // 必填：入口文件路径
  title?: string          // 页面标题（默认：项目名称）
  filename?: string       // 输出文件名（默认：index.html）
  template?: string       // 自定义 HTML 模板路径
  minify?: boolean        // HTML 压缩（默认：生产环境开启）
}
type Pages = Record<string, PageConfig | string> | string
```
**典型应用场景：**

```typescript
// 多入口应用配置
export default {
  pages: {
    main: {
      entry: 'src/main.ts',
      title: '主应用'
    },
    admin: {
      entry: 'src/admin-portal.ts',
      template: 'public/admin-template.html'
    }
  }
}
```


## 2. outputDir

**类型定义：**

```typescript
type outputDir = 'root' | 'package'
```

**配置选项：**

* root：统一输出到项目根目录的 dist 文件夹

* package：各工作区独立生成 dist 目录

**目录结构对比：**

```
# root 模式
dist/
├── workspace-a
└── workspace-b

# package 模式
packages/
├── workspace-a/
│   └── dist/
└── workspace-b/
    └── dist/
```
## 3. publicPath

**类型定义：**

```typescript
type publicPath = string
```

对应**webpack**中的**output.publicPath**和Vite中的**base**。

**配置示例：**

```typescript
publicPath: '/',                               // 相对路径（默认）
publicPath: 'https://cdn.example.com/assets/'  // CDN 绝对路径
```

## 4. css

**Types：**

```typescript
export interface CSSModulesOptions {
  getJSON?: (
    cssFileName: string,
    json: Record<string, string>,
    outputFileName: string,
  ) => void
  scopeBehaviour?: 'global' | 'local'
  globalModulePaths?: RegExp[]
  exportGlobals?: boolean
  generateScopedName?:
    | string
    | ((name: string, filename: string, css: string) => string)
  hashPrefix?: string
  localsConvention?:
    | 'camelCase'
    | 'camelCaseOnly'
    | 'dashes'
    | 'dashesOnly'
    | ((
        originalClassName: string,
        generatedClassName: string,
        inputFile: string,
      ) => string)
}

export type CSSPreprocessorOptions = Record<'sass', object>

export type Css = {
  sourceMap: boolean
  modules: CSSModulesOptions
  preprocessorOptions: CSSPreprocessorOptions
}
```
**配置示例:**
```typescript
export default {
  css: {
    sourceMap: process.env.NODE_ENV !== 'production',
    modules: {
      localsConvention: 'camelCase',
      generateScopedName: '[name]__[local]___[hash:base64:5]'
    },
    preprocessorOptions: {
      sass: {
        additionalData: `$primary-color: #1890ff;`
      }
    }
  }
}
```
设置**css**的打包行为，包括是否生成**sourceMap**，设置[postcss-modules](https://github.com/madyankin/postcss-modules)的行为，以及[scss](https://sass-lang.com/documentation/js-api/interfaces/stringoptions/)的配置。

## 5. productionSourceMap

**Types：**

```typescript
type productionSourceMap = boolean
```
构建后是否生成**source map**文件。如果为**true**，将会创建一个独立的**source map**文件。

**示例：**

```typescript
productionSourceMap: process.env.NODE_ENV === 'development'  // 开发环境启用
```

## 6. devServer

**类型定义：**

```typescript
type DevConfig = Partial<{
  port: number
  host: string
  strictPort: boolean
  https: boolean
  open: boolean
  watch: object | null
  proxy: Record<string, string | ProxyOptions>
  headers: ServerOptions['headers']
  // vite only
  cors: boolean | ServerOptions['cors']
  // vite only
  warmup: { clientFiles?: string[], ssrFiles?: string[] },
  // vite only
  fs: {
    strict?: boolean,
    allow?: string[],
    deny?: string[],
  },
  // vite only
  origin: string,
  // vite only
  sourcemapIgnoreList: false | ((sourcePath: string, sourcemapPath: string) => boolean),
  // vite only
  middlewareMode: boolean,
  hmr: boolean | {
    protocol?: string,
    host?: string,
    port?: number,
    path?: string,
    timeout?: number,
    overlay?: boolean,
    clientPort?: number,
    server?: HttpServer
  }
}>
```

设置开发服务器的行为，其中标明为**vite only**的配置仅影响**vite**。详细配置可以参考[webpack](https://webpack.js.org/configuration/dev-server/)或者[vite](https://vite.dev/config/build-options.html#build-sourcemap)的配置。但是目前暂不支持通过命令行参数配置的方式。

**跨工具统一配置：**

```typescript
devServer: {
  port: 3000,                // 统一端口配置
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true
    }
  }
}
```

**Vite 专属配置：**
```typescript
devServer: {
  // Vite 特定配置
  cors: { 
    origin: 'https://dev.example.com',
    methods: ['GET', 'POST']
  },
  warmup: {
    clientFiles: ['./src/main.ts']
  }
}
```

## 7. configureBundler

**类型定义：**

```typescript
type configureBundler = (bundler: 'vite' | 'webpack', env: string, library: Lib, config: Configuration | UserConfig) => Promise<Configuration | UserConfig>

type Lib = 'vue2' | 'vue3' | 'react'
```

此处接收一个函数作为参数，返回一个带有webpack或者vite配置的对象。在webpack中使用[webpack-merge](https://github.com/survivejs/webpack-merge)，vite中使用[mergeconfig](https://vite.dev/guide/api-javascript.html#mergeconfig)来合并配置。

函数中会携带当前**bundler**的信息，环境信息，当前使用Vue 2/3还是React，以及最终的**bundler**配置信息，可以在函数中根据不同情况来返回不同的配置。

**示例：**
```typescript
configureBundler: async (bundler, env, lib, currentConfig) => {
  if (bundler === 'webpack') {
    return {
      module: {
        rules: [/* 自定义加载规则 */]
      }
    }
  }
  
  if (bundler === 'vite') {
    return {
      build: {
        rollupOptions: { /* Rollup 高级配置 */ }
      }
    }
  }
  
  return {}
}
```
## 8. transpileDependencies

**Types：**

```typescript
type transpileDependencies = boolean | Array<string | RegExp>
```
这里的**transpileDependencies**与**vue-cli**中的[transpileDependencies](https://cli.vuejs.org/config/#transpiledependencies)一致，目前考虑实际项目考虑适配低端浏览器的情况依然较高，这里仍采用**babel**来转换新的语法。


