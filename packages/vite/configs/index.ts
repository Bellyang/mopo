import type { Package } from '@mopo/shared'
import { dirname } from 'node:path'

import { dict } from '@mopo/shared'
import plugins from '../plugins'
import { req } from '../utils'
import build from './build'
import server from './server'

import shared from './shared'

export default async (
  { env, path, pkgName, repoRoot, analyzer }:
  { env: string, path: string, pkgName: string, repoRoot: string, analyzer: boolean },
  pkg: Package,
) => {
  const { devServer, outputDir, publicPath } = pkg.configs
  const { defineConfig } = await import('vite')

  const serverConfig = await server(devServer)
  const { define, css } = await shared({ env, pkgName }, pkg)
  const buildConfig = await build(path, repoRoot, pkgName, outputDir)
  const pluginsConfig = await plugins({ path, analyzer }, pkg)

  const alias = [
    {
      find: '@',
      replacement: dict.target(path),
    },
    {
      find: 'core-js',
      replacement: dirname(req.resolve('core-js')),
    },
  ]

  if (pkg.lib === 'vue2') {
    alias.push({
      find: 'vue$',
      replacement: dict.target('../../node_modules/vue/dist/vue.runtime.esm.js'),
    })
  }

  const config = defineConfig({
    css,
    mode: env,
    base: publicPath,
    define,
    root: dict.target(path),
    cacheDir: dict.cache(__dirname, '.vite'),
    server: serverConfig,
    build: buildConfig,
    plugins: pluginsConfig,
    resolve: {
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
      alias,
    },
  })

  return config
}
