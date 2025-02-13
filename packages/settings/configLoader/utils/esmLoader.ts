import type { Loader } from 'cosmiconfig'
import process from 'node:process'
import chalk from 'chalk'
import { TypeScriptLoader } from 'cosmiconfig-typescript-loader'

type LoaderError = Error & {
  code?: string
}

// export NODE_OPTIONS="--experimental-transform-types --disable-warning ExperimentalWarning"
export function esmTsLoader(): Loader {
  return async (path: string, _: string) => {
    try {
      // for windows path issue see https://github.com/nodejs/node/issues/31710
      // const urlPath = url.pathToFileURL(path).href
      const result = await TypeScriptLoader()(path, _) as { default?: any }
      return result.default || result
    }
    catch (e: any) {
      // @ts-expect-error deno not support
      const isDeno = typeof Deno !== 'undefined' && Deno?.version?.deno
      if (isDeno)
        throw e
      const error = e as LoaderError
      const isNodeLTSInRange = (() => {
        if (!process.version.startsWith('v'))
          return false
        const major = process.version.split('.')[0].slice(1)
        const minor = process.version.split('.')[1]
        return Number(major) >= 22 && Number(minor) >= 10
      })()
      if (error.code === 'ERR_UNKNOWN_FILE_EXTENSION') {
        if (isNodeLTSInRange)
          console.log(chalk.gray(`Loading file: ${path}\nRequires injecting experimental NODE_OPTIONS env: --experimental-transform-types}`))
        else
          console.log(chalk.gray(`Loading file: ${path}\n1. Requires Node.js version >= v22.10.0\n2. Inject experimental NODE_OPTIONS env: --experimental-transform-types}`))
        return {}
      }
      throw error
    }
  }
}
