import type { Configuration } from 'webpack'

export default async (): Promise<Configuration> => ({
  mode: 'production',
  cache: false,
  devtool: 'hidden-source-map',
  output: {
    clean: true,
    filename: 'assets/js/[name].[contenthash].js',
    chunkFilename: 'assets/js/[name].[contenthash].chunk.js',
  },
})
