import type { Buffer } from 'node:buffer'

import { readFileSync, writeFileSync } from 'node:fs'
import readline from 'node:readline'
import { dict } from '@mopo/shared'
import chalk from 'chalk'
import fse from 'fs-extra'

import { normalizePath } from 'vite'

export default async function progress({ clearLine = true }: { clearLine?: boolean }) {
  const process = await import('node:process')
  if (typeof clearLine === 'undefined')
    clearLine = true

  let total: Buffer | string = '0'
  const totalFilePath = dict.cache(__dirname, 'rollup-plugin-progress')
  try {
    total = readFileSync(totalFilePath)
  }
  catch (_e) {
    fse.outputFileSync(totalFilePath, '0')
  }
  const progress = { total: Number.parseInt(total.toString()), loaded: 0 }

  return [{
    apply: 'serve',
    name: 'rollup-plugin-progress',
    load() { progress.loaded += 1 },
    transform(_code: string, id: string) {
      const file = normalizePath(id)
      if (file.includes(':'))
        return

      if (clearLine && process.stdout.isTTY) {
        readline.cursorTo(process.stdout, 0)
        let output = ''
        if (progress.total > 0) {
          const percent = Math.round(100 * progress.loaded / progress.total)
          output += `${Math.min(100, percent)}% `
        }
        output += `(${chalk.red(progress.loaded)}): ${file}`
        if (output.length < process.stdout.columns) {
          process.stdout.write(output)
        }
        else {
          process.stdout.write(output.substring(0, process.stdout.columns - 1))
        }
      }
      else {
        // console.log(`(${chalk.red(progress.loaded)}): ${file}`)
      }
    },
    generateBundle() {
      writeFileSync(totalFilePath, String(progress.loaded))
      if (clearLine && process.stdout.isTTY) {
        readline.cursorTo(process.stdout, 0)
      }
    },
  }]
}
