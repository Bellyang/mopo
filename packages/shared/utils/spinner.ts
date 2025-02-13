import chalk from 'chalk'
import ora from 'ora'

const spinner = ora()
let lastMsg: { symbol: string, text: string } | null = null

export function start(symbol: string, msg?: string) {
  if (!msg) {
    msg = symbol
    symbol = chalk.green('✔')
  }
  if (lastMsg)
    spinner.stopAndPersist(lastMsg)
  spinner.text = ` ${msg}`
  lastMsg = { symbol: `${symbol} `, text: msg }
  spinner.start()
}

export const change = (msg: string) => spinner.text = msg

export function stop(persist: boolean = true) {
  if (!spinner.isSpinning)
    return

  const action = lastMsg && persist !== false ? spinner.stopAndPersist : spinner.stop
  action.call(spinner, { symbol: lastMsg?.symbol, text: lastMsg?.text })
  lastMsg = null
}

export const fail = (text: string) => spinner.fail(text)

export const succeed = (text: string) => spinner.succeed(text)

export async function wrap(msg: string, fn: (...args: any[]) => any, persist: boolean = true) {
  start(msg)
  const [err, result] = await fn()
  if (err)
    throw err
  stop(persist)
  return result
}
