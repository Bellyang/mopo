import type { LoaderOptions } from '../../types/Loader'
import os from 'node:os'
import path from 'node:path'
import { cosmiconfig } from 'cosmiconfig'

import { esmTsLoader } from './esmLoader'

export const commonCosmiconfigOptions = {
  ignoreEmptySearchPlaces: true,
  cache: true,
  loaders: {
    '.ts': esmTsLoader(),
    '.cts': esmTsLoader(),
    '.mjs': esmTsLoader(),
    '.mts': esmTsLoader(),
  },
}

export async function loader(options: LoaderOptions) {
  const cwd = options.cwd || process.cwd()
  const cosmiconfigFn = cosmiconfig(options.moduleName, {
    searchPlaces: options.searchPlaces || [],
    packageProp: options.packageProp || options.moduleName,
    stopDir: options.stopDir,
    ...commonCosmiconfigOptions,
  })

  const resultPath = options.explicitPath ? path.resolve(cwd, options.explicitPath) : undefined
  const resultFn = resultPath ? cosmiconfigFn.load : cosmiconfigFn.search
  const searchPath = resultPath || cwd
  const result = await resultFn(searchPath) ?? await cosmiconfigFn.search(os.homedir())
  return result ?? null
}
