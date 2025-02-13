import type { Cache, JSONValue, NpmClient, Options, RawPackage, WorkspacesRoot } from '../types/Workspace'
import { existsSync } from 'node:fs'
import { homedir } from 'node:os'

import { join, posix, resolve, sep } from 'node:path'
import glob from 'fast-glob'
import { globSync } from 'glob'
import micromatch from 'micromatch'

import { findGlobs, isObject, resolveJSONFile } from './resolveFile'

const fileCache = new Map<string, JSONValue>()
export const clearFileCache = () => fileCache.clear()
export function createWorkspacesCache(): Cache {
  return {
    root: new Map(),
    workspaces: new Map(),
    clear() {
      this.root.clear()
      this.workspaces.clear()
    },
  }
}

function findRoot(dir: string, stopDir: string, cache?: Cache): WorkspacesRoot | null {
  function memo(value: WorkspacesRoot | null) {
    cache?.root.set(dir, value)
    return value
  }

  const globs = findGlobs(dir, fileCache)

  if (globs)
    return memo({ path: dir.split(sep).join(posix.sep), globs })

  const next = resolve(dir, '..')

  if (next === stopDir || next === dir)
    return memo(null)

  return findRoot(next, stopDir, cache)
}

export function getNpmClient(rootDir: string): NpmClient | null {
  const pairs: { type: NpmClient, file: string }[] = [
    { type: 'npm', file: 'package-lock.json' },
    { type: 'yarn', file: 'yarn.lock' },
    { type: 'pnpm', file: 'pnpm-lock.yaml' },
  ]
  for (const pair of pairs) {
    const file = join(rootDir, pair.file)
    if (existsSync(file))
      return pair.type
  }
  return null
}

export function findWorkspacesRoot(dirname?: string, options: Options = {}): WorkspacesRoot | null {
  const dir = dirname ? resolve(dirname) : process.cwd()
  const stopDir = options.stopDir ? resolve(options.stopDir) : homedir()
  const cache = options.cache

  if (!cache)
    return findRoot(dir, stopDir, cache)

  for (const [key, value] of cache.root.entries()) {
    if ((dir + sep).startsWith(key + sep))
      return value
  }
  return null
}

export function findWorkspaces(dirname?: string, options: Options = {}): RawPackage[] | null {
  const root = findWorkspacesRoot(dirname, options)

  if (!root)
    return null

  const cached = options.cache?.workspaces.get(root.path)
  if (cached)
    return cached

  const seenPaths = new Set<string>()

  const workspaces = glob.sync(root.globs, {
    absolute: true,
    unique: true,
    cwd: root.path,
    onlyDirectories: true,
    followSymbolicLinks: false,
    ignore: ['**/node_modules/**', '**/dist/**', '**/build/**'],
  })
    .filter((path) => {
      // filter duplicate path
      if (seenPaths.has(path))
        return false
      seenPaths.add(path)
      // quick check if package.json exists
      return existsSync(join(path, 'package.json'))
    })
    .map(path => ({
      path,
      package: resolveJSONFile(path, 'package.json', fileCache),
    }))
    .filter(
      (v): v is RawPackage =>
        isObject(v.package) && typeof v.package.name === 'string',
    )

  options.cache?.workspaces.set(root.path, workspaces)
  return workspaces
}

export const validatePathWithGlobs = (path: string, globs: string[]) => micromatch.isMatch(path, globs)

// only glob, not fast-glob can handle path like path.join('package/*', '../')
export function findPackagePath(globs: string[]) {
  return globSync(globs.map(glob => join(glob, '../')), {
  // absolute: true,
    follow: false,
    ignore: ['**/node_modules/**', '**/dist/**', '**/build/**'],
  })
    .filter(path => !path.startsWith('.'))
}
