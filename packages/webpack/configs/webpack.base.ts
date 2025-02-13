import type { Configuration } from 'webpack'
import type { BuildParams } from '../types/index'

import { dirname } from 'node:path'

import { dict } from '@mopo/shared'

import entry from '../custom/entries'
import { req } from '../utils/resolver'

export default async (args: BuildParams): Promise<Configuration> => {
  const { path, repoRoot, pkgName, env } = args
  // file names cannot contains '/'
  const pkg = pkgName.includes('/') ? pkgName.split('/')[1] : pkgName
  const entries = entry({ path })

  return {
    target: ['web', 'es5'],
    context: dict.target(path),
    entry: entries as Configuration['entry'],
    stats: 'errors-warnings',
    cache: {
      type: 'filesystem',
      cacheDirectory: dict.cache(__dirname, 'webpack'),
    },
    infrastructureLogging: { level: 'none' },
    output: {
      path: dict.dist(repoRoot, pkg),
      publicPath: '/',
      filename: 'assets/js/[name].[chunkhash:8].js',
      chunkFilename: 'assets/js/[name].[chunkhash:8].js',
      crossOriginLoading: env === 'production' ? 'anonymous' : false,
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
      alias: {
        '@': dict.target(path),
        'core-js': dirname(req.resolve('core-js')),
      },
    },
    optimization: {
      splitChunks: {
        cacheGroups: {
          vendors: {
            name: 'chunk-vendors',
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            chunks: 'initial',
          },
          common: {
            name: 'chunk-common',
            minChunks: 2,
            priority: -20,
            chunks: 'initial',
            reuseExistingChunk: true,
          },
        },
      },
    },
  }
}
