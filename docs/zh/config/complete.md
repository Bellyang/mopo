# 完整配置

```typescript
Partial<{
  pages: Pages
  css: Css
  outputDir: 'root' | 'package'
  publicPath: string
  productionSourceMap: boolean
  devServer: DevConfig
  configs: string | TPluginProps | TPlugin | undefined
  configureBundler: (bundler: 'vite' | 'webpack', env: string, library: Lib, config: Configuration | UserConfig) => Promise<Configuration | UserConfig>
  transpileDependencies: boolean | Array<string | RegExp>
}>
```