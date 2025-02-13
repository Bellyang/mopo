import { dict } from '@mopo/shared'

import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'

export default ({ path, typescript }: { path: string, typescript: Record<string, any> }) => [
  new ForkTsCheckerWebpackPlugin({
    typescript: {
      context: dict.target(path),
      typescriptPath: typescript.path,
      configFile: typescript.configPath,
    },
  }),
]
