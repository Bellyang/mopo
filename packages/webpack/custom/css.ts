import type { TConfig } from '@mopo/settings'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'

import * as webpackMerge from 'webpack-merge'

import { req } from '../utils/resolver'

type NormalizedCss = TConfig['css']

const { merge } = webpackMerge
const loaderGne = (name: string, options: object) => ({ loader: req.resolve(name), options })

function postcssOptions(modules: NormalizedCss['modules'], postcss: Record<string, any>) {
  if (modules && Object.keys(modules).length) {
    return loaderGne('postcss-loader', {
      postcssOptions: merge(postcss, {
        plugins: [req(req.resolve('postcss-modules'))(modules)],
      }),
    })
  }
  return loaderGne('postcss-loader', { postcssOptions: postcss })
}

export default (
  { mode = 'development', sourceMap, modules, preprocessorOptions, postcss,
  }: NormalizedCss & { mode: string | undefined, postcss: Record<string, any> }) => {
  const loaders = [
    mode === 'development' ? req.resolve('style-loader') : MiniCssExtractPlugin.loader,
    loaderGne('css-loader', { sourceMap: sourceMap ?? true }),
    postcssOptions(modules, postcss),
    loaderGne('sass-loader', merge({
      implementation: req(req.resolve('sass')),
    }, preprocessorOptions.sass)),
  ]

  return [{
    test: /\.css|sass|scss$/,
    use: loaders,
  }]
}
