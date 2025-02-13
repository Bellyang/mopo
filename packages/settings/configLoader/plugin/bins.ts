import type { TPlugin } from '@mopo/shared'
import { resolve } from 'node:path'
import { to } from 'await-to-js'
import fse from 'fs-extra'

import { deps as defaultBins } from '../../utils/resolver'

async function bin(cwd: string, path: string, name: string): Promise<string> {
  const packageJsonPath = resolve(cwd, path, 'package.json')
  const [err, pack] = await to(fse.readJSON(packageJsonPath))
  if (err)
    throw new Error(`No package.json in module \`${path}\``)
  const binfield = pack.bin
  const binpath = typeof binfield === 'object' ? binfield[name] : binfield
  if (!binpath)
    throw new Error(`No bin \`${name}\` in module \`${path}\``)
  return resolve(cwd, path, binpath)
}

export async function binsLoader(cwd: string, name: keyof TPlugin, path?: string): Promise<string> {
  return path ? await bin(cwd, path, name) : Promise.resolve(defaultBins[name])
}
