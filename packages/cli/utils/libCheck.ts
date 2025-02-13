import type { Lib } from '@mopo/shared'

import { silentCliExecutor } from '../utils/commadExecutor'

const versionCache = new Map<string, Promise<string | null>>()

const SUPPORTED_LIBS = {
  vue: {
    name: 'vue',
    getVersion: (version: string) => version.startsWith('2.') ? 'vue2' : 'vue3',
  },
  react: {
    name: 'react',
    getVersion: (): 'react' => 'react',
  },
} as const

function parseLibInfo(pkgList: string | null): Lib | null {
  if (!pkgList)
    return null
  const packagePattern = /([a-z0-9-]+)@(\d+\.\d+\.\d+)/i
  const match = pkgList.match(packagePattern)
  if (!match)
    return null
  const [, packageName, version] = match

  const lib = SUPPORTED_LIBS[packageName as keyof typeof SUPPORTED_LIBS]
  return lib ? lib.getVersion(version) : null
}

export async function queryLib(npmClient: string, dir: string): Promise<Lib | null> {
  const getCachedList = async (pkgName: string): Promise<string | null> => {
    const cacheKey = `${dir}:${pkgName}`
    if (!versionCache.has(cacheKey)) {
      const promise = silentCliExecutor({
        prefix: npmClient,
        options: ['list', pkgName, '--json', '--depth=0'],
        opts: { cwd: dir },
      }).catch((error) => {
        console.error(`Failed to query ${pkgName} version in ${dir}:`, error)
        return null
      })
      versionCache.set(cacheKey, promise)
    }
    return versionCache.get(cacheKey)!
  }

  const results = await Promise.all(
    Object.keys(SUPPORTED_LIBS).map(lib => getCachedList(lib)),
  )

  for (const result of results) {
    const lib = parseLibInfo(result)
    if (lib)
      return lib
  }
  return null
}
