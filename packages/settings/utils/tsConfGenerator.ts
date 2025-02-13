import type { TSConfig } from 'pkg-types'
import { join, relative } from 'node:path'
import { dict } from '@mopo/shared'

import fse from 'fs-extra'

import { readTSConfig } from 'pkg-types'

const toUnixPath = (path: string) => path.replace(/[\\/]+/g, '/').replace(/^([a-z]+:|\.\/)/i, '')

function updateTSConfig(projectPath: string, tsConfig: TSConfig): TSConfig {
  const includes = tsConfig.include || []
  const cwd = relative(dict.cache(__dirname, '.'), projectPath)
  if (!includes.length)
    return tsConfig
  return {
    ...tsConfig,
    include: includes.map(include => toUnixPath(join(cwd, include))),
    compilerOptions: {
      ...tsConfig.compilerOptions,
      paths: {
        '@/*': [`${toUnixPath(join(cwd, '/*'))}`],
      },
    },
  }
}

export async function generateTSConfig(path: string, tsConfigPath: string): Promise<string> {
  const sourcePath = tsConfigPath
  const targetPath = dict.cache(__dirname, 'tsconfig.json')

  try {
    const baseConfig = await readTSConfig(sourcePath)
    const updatedConfig = updateTSConfig(path, baseConfig)
    await fse.outputJSON(targetPath, updatedConfig, { spaces: 2 })
    return targetPath
  }
  catch (error) {
    console.log('Error reading or writing the TS config:', error)
    return sourcePath
  }
}
