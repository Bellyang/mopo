import webpackBundleAnalyzer from 'webpack-bundle-analyzer'

export default ({ analyzer }: { analyzer: boolean | undefined }) => {
  const BundleAnalyzerPlugin = webpackBundleAnalyzer.BundleAnalyzerPlugin
  if (!analyzer)
    return []
  return [new BundleAnalyzerPlugin()]
}
