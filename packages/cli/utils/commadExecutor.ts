import type { Workspace } from '@mopo/shared'
import type { Command as Commander } from 'commander'

import type Execa from 'execa'
import type { CommandDescription } from '../types'
import { errorMessageCatch, logger } from '@mopo/shared'
import { to } from 'await-to-js'

import chalk from 'chalk'
import leven from 'leven'
import minimist from 'minimist'

type CommandInstance = InstanceType<typeof Command>

export async function exec(cmd: string, options: string[], opts?: Execa.Options, pipe: boolean = false, throwErr: boolean = true, write: string = ''): Promise<string | string[] | unknown[] | Uint8Array | undefined> {
  const { execa } = await import('execa')
  const child = execa(cmd, options, opts)
  if (write.length !== 0) {
    child.stdin?.write(write)
    child.stdin?.end()
  }
  if (pipe)
    child.stdout?.pipe(process.stdout)
  const [err, result] = await to(child)
  if (err && throwErr)
    throw err
  return result?.stdout
}

export function suggestCommands(program: CommandInstance, unknownCommand: string): void {
  const availableCommands = program.commands.map((cmd: any) => cmd._name)
  const suggestion = availableCommands.reduce((best, cmd) => {
    const distance = leven(cmd, unknownCommand)
    return distance < 3 && distance < leven(best || '', unknownCommand) ? cmd : best
  }, '')

  if (suggestion)
    logger.log(logger.suggestions(suggestion))
}

export function commaderGenerator(program: CommandInstance, excutor: CommandDescription): void {
  const { name: commandName, prehooks, argument, command, description, options } = { ...excutor }
  if (!command)
    process.exit(0)

  let iterateCommand = program.command(...command)
  if (description)
    iterateCommand.description(description)
  // iterate command.option().option().option()...
  if (argument)
    argument.forEach(arg => iterateCommand = iterateCommand.argument(arg))
  options?.forEach(option => iterateCommand = iterateCommand.option(...option))

  iterateCommand.action(async function (this: Commander) {
    if (argument) {
      const argumentLen = argument.length
      const argumentParams = argumentLen - 1
      if (argumentLen > 1 && minimist(process.argv.slice(3))._.length > argumentParams)
        logger.log(logger.moreArguments())
    }

    const commandArguments = { command, args: this.args, options: this.opts() }
    const { default: executeName } = await import(`../command/${commandName}.ts`)
    const preExecuteHooks = Array.isArray(prehooks) ? prehooks : []

    try {
      const preExecuteResult: Workspace[] = []
      for (const hook of preExecuteHooks) {
        const { default: preProcess } = await import(`../hooks/${hook}.ts`)
        preExecuteResult.push(await preProcess(commandArguments))
      }

      await executeName(commandArguments, ...preExecuteResult)
    }
    catch (err: unknown) {
      const message = errorMessageCatch.toErrorWithMessage(err).message
      logger.log(`\nError executing command: ${command}.\n${chalk.red(`message: ${message}`)}`)
      process.exit(1)
    }
  })
}

export function handleCommand(program: CommandInstance, command: CommandDescription): void {
  const { name, version, usage, args, prehooks, argument, command: cmd, description, options } = { ...command }

  if (name === 'args' && args) {
    program.arguments(args).action(() => {
      program.outputHelp()
      logger.log(logger.unknown(name))
      suggestCommands(program, name)
    })
  }
  else if (name === 'version' && version && usage) {
    program.version(...version).passThroughOptions().usage(...usage)
  }
  else {
    commaderGenerator(program, { name, argument, prehooks, command: cmd, description, options })
  }
}

export async function silentCliExecutor({ prefix, options, opts }:
{ prefix: string, options: string[], opts?: Execa.Options }): Promise<string | null> {
  const [err, out] = await to(exec(`${prefix}`, options, opts))
  if (err)
    return null
  return out as string
}

export async function cliExecutor({ prefix, options, opts, shouldLog }:
{ prefix: string, options: string[], opts?: Execa.Options, shouldLog?: boolean }) {
  const [err, out] = await to(exec(`${prefix}`, options, opts))
  if (err)
    throw err
  return shouldLog ? logger.log(`\n${chalk.blue(out)}`) : out
}
