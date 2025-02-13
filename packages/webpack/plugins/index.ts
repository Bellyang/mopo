import type { Package } from '@mopo/shared'
import type { BuildParams } from '../types/index'
import bundleAnalyzerPlugin from './bundleAnalyzerPlugin'
// import stylelintWebpackPlugin from './stylelintWebpackPlugin'
import caseSensitivePathsPlugin from './caseSensitivePathsPlugin'
import compressionPlugin from './compressionPlugin'
import copyWebpackPlugin from './copyWebpackPlugin'
import definePlugin from './definePlugin'
import eslintPlugin from './eslintPlugin'
import forkTsCheckerWebpackPlugin from './forkTsCheckerWebpackPlugin'
import miniCssExtractPlugin from './miniCssExtractPlugin'
import mkcertPlugin from './mkcertPlugin'
import progressPlugin from './progressPlugin'
import providePlugin from './providePlugin'

import vueLoaderPlugin from './vueLoaderPlugin'
import workboxWebpackPlugin from './workboxWebpackPlugin'

export default async (
  buildParams: BuildParams,
  pkg: Package,
) => {
  const { mode, path, pkgName, env, analyzer } = buildParams
  const { devServer } = pkg.configs
  const { eslint, typescript } = pkg.configs.configs

  const plugins = [
    ...providePlugin(pkg),
    ...vueLoaderPlugin(pkg),
    ...mkcertPlugin(devServer.https),
    ...eslintPlugin({ path, eslint }),
    ...caseSensitivePathsPlugin(),
    ...progressPlugin(),
    ...compressionPlugin(),
    ...definePlugin({ path, env, pkg }),
    ...miniCssExtractPlugin({ mode }),
    // ...stylelintWebpackPlugin(name),
    ...copyWebpackPlugin({ path }),
    ...bundleAnalyzerPlugin({ analyzer }),
    ...workboxWebpackPlugin({ pkgName, env }),
    ...forkTsCheckerWebpackPlugin({ path, typescript }),
  ]

  return plugins
}
