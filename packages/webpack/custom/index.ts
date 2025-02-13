import type { Package } from '@mopo/shared'
import type { Configuration, EntryObject, RuleSetRule, WebpackPluginInstance } from 'webpack'
import type { BuildParams } from '../types/index'
import loaders from '../loaders'
import babel from './babel'
import basic from './basic'
import style from './css'
import devtool from './devServer'

import entries from './entries'

import html from './html'
import plugins from './plugins'
import vue from './vue'

export default async (
  buildParams: BuildParams,
  mergedConfig: Configuration,
  pkg: Package,
): Promise<Configuration> => {
  const { lib } = pkg
  const { mode, path, pkgName, repoRoot } = buildParams
  const { css, transpileDependencies, pages, devServer, publicPath, productionSourceMap, configs, outputDir } = pkg.configs
  const { sourceMap, modules, preprocessorOptions } = css

  const config: Configuration = basic(mergedConfig, { path, repoRoot, pkgName }, { publicPath, productionSourceMap, outputDir, lib })
  config.module = { rules: [] }

  if (mode === 'development') {
    config.devServer = await devtool({ path, pkgName, devtool: devServer })
  }
  config.entry = entries({ path, pages }) as EntryObject
  config.plugins = html({ pages, pkgName })

  const defaultLoaders: RuleSetRule[] = await loaders()

  const vueRules = vue(pkg)
  const jsRules = babel(path, transpileDependencies, configs)
  const cssRules = style({
    mode,
    sourceMap,
    modules,
    postcss: configs.postcss,
    preprocessorOptions,
  })

  config.module.rules = [...vueRules, ...jsRules, ...cssRules, ...defaultLoaders]

  config.plugins = [...config.plugins, ...(await plugins(buildParams, pkg)) as WebpackPluginInstance[]]

  return config
}
