import { dict } from '@mopo/shared'

import fse from 'fs-extra'

export default async (): Promise<string> => {
  const cache = dict.cache(__dirname)
  try {
    const statsDir = await fse.stat(cache)
    if (!statsDir.isDirectory())
      throw new Error('target cache path is not a directory')

    await fse.remove(cache)
    return cache
  }
  catch (e) {
    if (e instanceof Error && e.message.includes('no such file'))
      throw new Error('cache path not exists')
    throw e
  }
}
