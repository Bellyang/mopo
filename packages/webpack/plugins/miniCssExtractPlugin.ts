import MiniCssExtractPlugin from 'mini-css-extract-plugin'

export default ({ mode }: { mode: string | undefined }) => {
  if (mode === 'development')
    return []
  return [
    new MiniCssExtractPlugin({
      ignoreOrder: true,
      filename: 'assets/css/[name].[chunkhash:8].css',
      chunkFilename: 'assets/css/[id].[contenthash:8].css',
    }),
  ]
}
