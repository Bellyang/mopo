import type { WebpackPluginInstance } from 'webpack'
import { dict } from '@mopo/shared'

import ESLintPlugin from 'eslint-webpack-plugin'

export default ({ path, eslint }: { path: string, eslint: Record<string, any> }): WebpackPluginInstance[] => {
  return [
    new ESLintPlugin({
      fix: true,
      cache: true,
      threads: true,
      emitWarning: true,
      exclude: ['node_modules', 'dist'],
      context: dict.target(path),
      extensions: ['.vue', '.js', '.ts', '.tsx', '.html'],
      cacheLocation: dict.cache(__dirname, 'eslint'),
      eslintPath: eslint.path,
      overrideConfigFile: eslint.configPath,
      files: ['./**/*'],
    }),
  ]
}
