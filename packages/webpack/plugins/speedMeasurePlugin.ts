import type { Package } from '@mopo/shared'
import type { Configuration, WebpackPluginInstance } from 'webpack'
import SpeedMeasurePlugin from 'speed-measure-webpack-plugin'

import miniCssExtractPlugin from './miniCssExtractPlugin'
import vueLoaderPlugin from './vueLoaderPlugin'

export default (
  { sm, mode, config, pkg }:
  { sm: boolean | undefined, mode: string | undefined, config: Configuration, pkg: Package },
): Configuration => {
  if (sm && config.plugins) {
    const smp = new SpeedMeasurePlugin()
    config.plugins = config.plugins.filter(plugin =>
      plugin && !['MiniCssExtractPlugin', 'VueLoaderPlugin'].includes(plugin.constructor.name),
    )
    // handling a speedMeasurePlugin bug
    // https://github.com/stephencookdev/speed-measure-webpack-plugin/issues/167#issuecomment-976836861
    const configWithTimeMeasures = smp.wrap(config as any) as Configuration
    if (mode !== 'development' && configWithTimeMeasures.plugins) {
      configWithTimeMeasures.plugins.push(
        ...miniCssExtractPlugin({ mode }),
      )
    }
    // see also
    // https://github.com/stephencookdev/speed-measure-webpack-plugin/issues/147
    if (configWithTimeMeasures.plugins) {
      configWithTimeMeasures.plugins.push(
        ...vueLoaderPlugin(pkg) as WebpackPluginInstance[],
      )
    }
    return configWithTimeMeasures
  }
  return config
}
