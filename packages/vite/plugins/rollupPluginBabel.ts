import type { TConfig } from '@mopo/shared'
import babel from '@rollup/plugin-babel'

export default (configs: TConfig['configs'], transpileDependencies: boolean | Array<string | RegExp>) => {
  const { babel: babelConfig } = configs
  const transpile
    = transpileDependencies === true
      ? undefined
      : transpileDependencies || /node_modules/

  return [
    babel({
      babelHelpers: 'inline',
      extensions: ['.vue', '.ts', '.js', '.tsx', '.jsx'],
      include: transpile,
      ...babelConfig.config,
    }),
  ]
}
