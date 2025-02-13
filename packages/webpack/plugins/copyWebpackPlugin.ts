import { dict } from '@mopo/shared'
import CopyWebpackPlugin from 'copy-webpack-plugin'

export default ({ path }: { path: string }) => {
  const shouldCopy = true
  if (!shouldCopy)
    return []
  return [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: dict.localPublic(path),
          noErrorOnMissing: true,
          globOptions: {
            dot: true,
            gitignore: true,
            ignore: ['**/*index.html', '**/.DS_Store'],
          },
        },
      ],
    }),
  ]
}
