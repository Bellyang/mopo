import { logger } from '@mopo/shared'
import chalk from 'chalk'

import { Command } from 'commander'

export function enhanceErrorMessages(methodName: string, log: (argName: string) => void) {
  (Command.prototype as any)[methodName] = function (...args: [string]) {
    if (methodName === 'unknownOption' && (this as any)._allowUnknownOption)
      return
    this.outputHelp()
    logger.log(`  ${chalk.red(log(...args))}`)
    logger.log('')
    process.exit(0)
  }
}
