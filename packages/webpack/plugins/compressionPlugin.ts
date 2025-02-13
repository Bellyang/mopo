import CompressionPlugin from 'compression-webpack-plugin'

export default () => {
  return [
    new CompressionPlugin({
      test: /.(js|css)$/,
      filename: '[path][base].gz',
      algorithm: 'gzip',
      threshold: 10240,
      minRatio: 0.8,
    }),
  ]
}
