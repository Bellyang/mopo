import type { HttpServer, ProxyOptions, ServerOptions, UserConfig } from 'vite'
import type { Configuration } from 'webpack'

type Lib = 'vue2' | 'vue3' | 'react'
export type Pages = Record<string, PageConfig | string> | string

interface DefaultPageConfig {
  title: string
  entry: string
  filename: string
  template: string
  minify: boolean
}

export type PageConfig = Partial<DefaultPageConfig>

export type NormalizedPages = Record<string, DefaultPageConfig>

export type TPlugin = Record<
  'postcss' | 'babel' | 'czg' | 'eslint' | 'lintStaged' |
  'prettier' | 'releaseIt' | 'typescript' | 'commitlint',
  Config
>

export interface Config {
  configPath: string
  config: Record<PropertyKey, any>
}

export type TPluginConfig = Config & {
  path: string
  binPath: string
}

export type TEntityPropsMapper<T> = {
  [Property in keyof T]: TPluginConfig
}

export type TPluginProps = TEntityPropsMapper<TPlugin>

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

export interface Css {
  sourceMap: boolean
  modules: CSSModulesOptions
  preprocessorOptions: CSSPreprocessorOptions
}

export type DevConfig = Partial<{
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
  warmup: { clientFiles?: string[], ssrFiles?: string[] }
  // vite only
  fs: {
    strict?: boolean
    allow?: string[]
    deny?: string[]
  }
  // vite only
  origin: string
  // vite only
  sourcemapIgnoreList: false | ((sourcePath: string, sourcemapPath: string) => boolean)
  // vite only
  middlewareMode: boolean
  hmr: boolean | {
    protocol?: string
    host?: string
    port?: number
    path?: string
    timeout?: number
    overlay?: boolean
    clientPort?: number
    server?: HttpServer
  }
}>

export type MopoConfig = Partial<{
  pages: Pages
  css: Css
  outputDir: 'root' | 'package'
  publicPath: string
  integrity: boolean
  productionSourceMap: boolean
  devServer: DevConfig
  configs: string | TPluginProps | TPlugin | undefined
  crossorigin: '' | 'anonymous' | 'use-credentials'
  configureBundler: (bundler: 'vite' | 'webpack', env: string, library: Lib, config: Configuration | UserConfig) => Promise<Configuration | UserConfig>
  transpileDependencies: boolean | Array<string | RegExp>
}>

export interface NormalizedConfig {
  publicPath: string
  outputDir: 'root' | 'package'
  integrity: boolean
  crossorigin: '' | 'anonymous' | 'use-credentials'
  productionSourceMap: boolean
  transpileDependencies: boolean | Array<string | RegExp>
  configureBundler: (bundler: 'vite' | 'webpack', env: string, library: Lib, config: Configuration | UserConfig) => Promise<Configuration | UserConfig>
}

export interface NormalizedCss {
  sourceMap: boolean
  modules: CSSModulesOptions
  preprocessorOptions: Record<'sass', object>
}

export interface NormalizedServer {
  port: number
  host: string
  strictPort: boolean
  https: boolean
  open: boolean
  watch?: object | null
  proxy?: Record<string, string | ProxyOptions>
  headers?: ServerOptions['headers']
  // vite only
  cors?: boolean | ServerOptions['cors']
  // vite only
  warmup?: { clientFiles?: string[], ssrFiles?: string[] }
  // vite only
  fs?: {
    strict?: boolean
    allow?: string[]
    deny?: string[]
  }
  // vite only
  origin?: string
  // vite only
  sourcemapIgnoreList?: false | ((sourcePath: string, sourcemapPath: string) => boolean)
  // vite only
  middlewareMode?: boolean
  hmr: boolean | {
    protocol: string
    host: string
    port: number
    path: string
    timeout: number
    overlay: boolean
    clientPort?: number
    server?: HttpServer
  }
}

export type TConfig = NormalizedConfig & { configs: TPluginProps, pages: NormalizedPages, css: NormalizedCss, devServer: NormalizedServer }
