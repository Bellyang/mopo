import { dict } from '@mopo/shared'
import chalk from 'chalk'

import progress from 'vite-plugin-progress'

export default ({ path }: { path: string }) => [
  progress({
    srcDir: dict.target(path),
    format: `${chalk.green('Building')} ${chalk.cyan('[:bar]')} :percent`,
    callback: () => `${chalk.green('Succeed')}`,
  }),
]
