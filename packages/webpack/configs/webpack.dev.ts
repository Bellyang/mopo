import type { Configuration } from 'webpack'

export default async (): Promise<Configuration> => ({
  mode: 'development',
  devtool: 'inline-source-map',
  optimization: {
    runtimeChunk: 'single',
  },
})
