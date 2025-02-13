import type { TConfig } from '@mopo/shared'
import type { RuleSetRule } from 'webpack'

import { dict } from '@mopo/shared'
import { req } from '../utils/resolver'

export function babelConfig(configs: Record<string, any>): RuleSetRule['use'] {
  return [{
    loader: req.resolve('babel-loader'),
    options: {
      cacheDirectory: dict.cache(__dirname, `babel`),
      ...configs,
    },
  }]
}

export default (
  path: string,
  transpileDependencies: boolean | Array<string | RegExp>,
  configs: TConfig['configs'],
): RuleSetRule[] => {
  const transpile
    = transpileDependencies === true
      ? undefined
      : transpileDependencies || /node_modules/

  const { babel, typescript } = configs

  return [
    {
      test: /\.m?jsx?$/,
      exclude: transpile,
      use: babelConfig(babel.config),
    },
    {
      test: /\.tsx?$/,
      exclude: /node_modules/,
      use: [
        ...(babelConfig(babel.config) as []),
        {
          loader: req.resolve('ts-loader'),
          options: {
            context: dict.target(path),
            transpileOnly: true,
            appendTsSuffixTo: [/\.vue$/],
            configFile: typescript.configPath,
          },
        },
      ],
    },
  ]
}
