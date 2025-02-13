import type { WebpackPluginInstance } from 'webpack'
import { spinner } from '@mopo/shared'
import chalk from 'chalk'

import webpack from 'webpack'

export default (): WebpackPluginInstance[] => [
  new webpack.ProgressPlugin((percentage: number, message: string, ...args: string[]) => {
    spinner.change(chalk.blue(`${(percentage * 100).toFixed()}% ${message} ${args[args.length - 1]}`))
  }),
]
