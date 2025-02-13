#!/usr/bin/env node

import type { CommandDescription } from '../types'

import { logger } from '@mopo/shared'
import { Command } from 'commander'
import { commands } from '../configs/commandGroups'
import { handleCommand } from '../utils/commadExecutor'
import { enhanceErrorMessages } from '../utils/errorHandler'
import { checkNodeVersion, notifyOutDated } from '../utils/nodeChecker'

import { cliPkgInfo } from '../utils/projectInfo'

const requiredVersion: string = cliPkgInfo.engines?.node || ''

checkNodeVersion(requiredVersion, 'mopo')
notifyOutDated()

const program = new Command()
program.enablePositionalOptions()

commands.forEach((command: CommandDescription) => handleCommand(program, command))

program.on('--help', () => {
  logger.log('\n')
  logger.log(logger.detail())
  logger.log('\n')
})

program.commands.forEach(c => c.on('--help', () => logger.log()))

enhanceErrorMessages('missingArgument', argName => logger.missing(argName))

program.parse(process.argv)
