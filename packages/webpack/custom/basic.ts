import type { Package } from '@mopo/shared'

import type { Configuration } from 'webpack'
import { dict } from '@mopo/shared'

function rewritePath(path: string, repoRoot: string, pkgName: string, outputDir: string) {
  const pkg = pkgName.includes('/') ? pkgName.split('/')[1] : pkgName
  if (outputDir === 'root')
    return dict.dist(repoRoot, pkg)
  return dict.dist(path, './')
}

export default (
  mergedConfig: Configuration,
  { path, repoRoot, pkgName }: { path: string, repoRoot: string, pkgName: string },
  { lib, outputDir, publicPath, productionSourceMap }: { lib: Package['lib'], outputDir: string, publicPath: string, productionSourceMap: boolean },
): Configuration => {
  const { mode } = mergedConfig
  const basic = {
    output: { publicPath, path: rewritePath(path, repoRoot, pkgName, outputDir) },
    devtool: mode === 'production'
      ? (productionSourceMap ? 'hidden-source-map' : false)
      : mergedConfig.devtool,
  }
  if (lib === 'vue2')
    return { ...basic, resolve: { alias: { vue$: 'vue/dist/vue.esm.js' } } }
  return basic
}
