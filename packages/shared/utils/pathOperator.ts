import { readdirSync, statSync } from 'node:fs'
import path from 'node:path'

export const dictlist = (dir: string): string[] => readdirSync(dir).filter(name => statSync(path.join(dir, name)).isDirectory())

export function pathsEqual(pathString: string, dirString: string) {
  const uri = path.resolve(pathString)
  const dir = path.resolve(dirString)
  if (process.platform === 'win32')
    return uri.toLowerCase() === dir.toLowerCase()
  return uri === dir
}

export function isSubdir(parent: string, dir: string) {
  const relative = path.relative(parent, dir)
  return relative && !relative.startsWith('..') && !path.isAbsolute(relative)
}

export function isRelative(parent: string, dir: string) {
  const relative = path.relative(parent, dir)
  return relative && !relative.startsWith('..') && !path.isAbsolute(relative)
}
