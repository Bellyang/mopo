# Project Configuration Guide

**Configuration File Structure**

Mopo supports a multi-level configuration system, implementing configuration reuse through an inheritance mechanism:

```
root/
├── mopo.config.ts       # Global base configuration
└── packages/
    ├── workspace-a/
    │   └── mopo.config.ts  # Inherits and overrides global config
    └── workspace-b/
        └── mopo.config.ts  # Independent configuration
```

**Configuration Inheritance Example**

```javascript
// Root configuration (root/mopo.config.ts)
export default {
  publicPath: '/common/',
  css: { sourceMap: true }
}

// Workspace configuration (workspace/mopo.config.ts)
import baseConfig from '../../mopo.config'

export default {
  ...baseConfig,
  publicPath: '/workspace-specific/',  // Override public path
  devServer: { port: 8080 }           // Add dev server config
}
```

**Mopo** supports independent **mopo.config.ts** files for each **workspace**. Configuration files are parsed using [cosmiconfig](https://github.com/cosmiconfig/cosmiconfig), supporting multiple file formats.

Supported configuration file formats:

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
* <em>package.json</em> # Set mopo property in package.json
:::

## 1. Pages

**Type Definition:**

```typescript
type PageConfig = {
  entry: string           // Required: entry file path
  title?: string          // Page title (default: project name)
  filename?: string       // Output filename (default: index.html)
  template?: string       // Custom HTML template path
  minify?: boolean        // HTML minification (default: enabled in production)
}
type Pages = Record<string, PageConfig | string> | string
```

**Typical Usage:**

```typescript
// Multi-entry application configuration
export default {
  pages: {
    main: {
      entry: 'src/main.ts',
      title: 'Main Application'
    },
    admin: {
      entry: 'src/admin-portal.ts',
      template: 'public/admin-template.html'
    }
  }
}
```

## 2. outputDir

**Type Definition:**

```typescript
type outputDir = 'root' | 'package'
```

**Configuration Options:**

* root: Unified output to the dist folder in the project root directory

* package: Each workspace generates its own dist directory

**Directory Structure Comparison:**

```
# root mode
dist/
├── workspace-a
└── workspace-b

# package mode
packages/
├── workspace-a/
│   └── dist/
└── workspace-b/
    └── dist/
```

## 3. publicPath

**Type Definition:**

```typescript
type publicPath = string
```

Corresponds to **output.publicPath** in webpack and **base** in Vite.

**Configuration Examples:**

```typescript
publicPath: '/',                               // Relative path (default)
publicPath: 'https://cdn.example.com/assets/'  // CDN absolute path
```

## 4. css

**Types:**

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

**Configuration Example:**
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

Controls CSS bundling behavior, including sourceMap generation, [postcss-modules](https://github.com/madyankin/postcss-modules) behavior, and [scss](https://sass-lang.com/documentation/js-api/interfaces/stringoptions/) configuration.

## 5. productionSourceMap

**Types:**

```typescript
type productionSourceMap = boolean
```

Determines whether to generate source map files after building. If **true**, an independent source map file will be created.

**Example:**

```typescript
productionSourceMap: process.env.NODE_ENV === 'development'  // Enable in development
```

## 6. devServer

**Type Definition:**

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

Configures development server behavior. Options marked with **vite only** only affect **vite**. For detailed configuration, refer to [webpack](https://webpack.js.org/configuration/dev-server/) or [vite](https://vite.dev/config/build-options.html#build-sourcemap) documentation. Command-line parameter configuration is currently not supported.

**Cross-tool Universal Configuration:**

```typescript
devServer: {
  port: 3000,                // Unified port configuration
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true
    }
  }
}
```

**Vite-specific Configuration:**
```typescript
devServer: {
  // Vite-specific options
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

**Type Definition:**

```typescript
type configureBundler = (bundler: 'vite' | 'webpack', env: string, library: Lib, config: Configuration | UserConfig) => Promise<Configuration | UserConfig>

type Lib = 'vue2' | 'vue3' | 'react'
```

Accepts a function as a parameter that returns a webpack or vite configuration object. Uses [webpack-merge](https://github.com/survivejs/webpack-merge) for webpack and [mergeconfig](https://vite.dev/guide/api-javascript.html#mergeconfig) for vite to merge configurations.

The function receives information about the current **bundler**, environment, framework (Vue 2/3 or React), and final **bundler** configuration, allowing different configurations based on these parameters.

**Example:**
```typescript
configureBundler: async (bundler, env, lib, currentConfig) => {
  if (bundler === 'webpack') {
    return {
      module: {
        rules: [/* Custom loader rules */]
      }
    }
  }
  
  if (bundler === 'vite') {
    return {
      build: {
        rollupOptions: { /* Advanced Rollup configuration */ }
      }
    }
  }
  
  return {}
}
```

## 8. transpileDependencies

**Types:**

```typescript
type transpileDependencies = boolean | Array<string | RegExp>
```

Similar to [transpileDependencies](https://cli.vuejs.org/config/#transpiledependencies) in vue-cli. Given the continued need for legacy browser support in real projects, **babel** is still used for syntax transformation.
