import { existsSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join, resolve } from 'node:path'
import fse from 'fs-extra'

function shared(name: string, opts: Record<string, any> = {}) {
  const executable = opts.executable || name
  return resolve(__dirname, `../../node_modules/.bin/${executable}`)
}
const requireResolver = require.main ? require.resolve : createRequire(import.meta.url).resolve
const isWindows = process && (process.platform === 'win32' || /^(?:msys|cygwin)$/.test(process.env?.OSTYPE || ''))

function splitPath(path: string) {
  const parts = path.split(/(\/|\\)/)
  if (!parts.length)
    return parts
  return !parts[0].length ? parts.slice(1) : parts
}

function findParentDir(currentFullPath: string, clue: string): string | null {
  const testDir = (parts: string[]): string | null => {
    if (parts.length === 0)
      return null

    const p = parts.join('')
    const itdoes = existsSync(join(p, clue))
    return itdoes ? p : testDir(parts.slice(0, -1))
  }

  return testDir(splitPath(currentFullPath))
}

function requireResolve(name: string) {
  const requireOpts = {
    // paths: require.main ? require.main.paths : module.paths
  }
  try {
    return requireResolver(name, requireOpts)
  }
  catch (_err) {
    const modJson = requireResolver(`${name}/package.json`, requireOpts)
    return dirname(modJson)
  }
}

export const req = require.main ? require : createRequire(import.meta.url)
export const dep = (name: string) => requireResolver(name)

export function bin(name: string, opts: Record<string, any> = {}): string {
  const executable = opts.executable || name

  const mod = requireResolve(name)

  const dir = findParentDir(mod, 'package.json') || ''

  const pack = fse.readJSONSync(join(dir, 'package.json'))
  const binfield = pack.bin

  const binpath = typeof binfield === 'object' ? binfield[executable] : binfield
  if (!binpath)
    throw new Error(`No bin \`${executable}\` in module \`${name}\``)

  return join(dir, binpath)
}

const resolveBin = (name: string, opts: Record<string, any> = {}) => isWindows ? shared(name, opts) : bin(name, opts)

export const deps = {
  babel: '',
  postcss: '',
  browserslist: '',
  czg: resolveBin('czg'),
  eslint: resolveBin('eslint'),
  vueTsc: resolveBin('vue-tsc'),
  prettier: resolveBin('prettier'),
  releaseIt: resolveBin('release-it'),
  lintStaged: resolveBin('lint-staged'),
  commitlint: resolveBin('@commitlint/cli', { executable: 'commitlint' }),
  typescript: resolveBin('typescript', { executable: 'tsc' }),
}
