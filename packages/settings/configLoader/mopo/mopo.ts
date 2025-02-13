import { loader } from '../utils/loader'

export default async (cwd: string) => {
  const moduleName = 'mopo'
  const options = {
    moduleName,
    searchPlaces: [
      `.${moduleName}rc`,
      `.${moduleName}rc.json`,
      `.${moduleName}rc.yaml`,
      `.${moduleName}rc.yml`,
      `.${moduleName}rc.js`,
      `.${moduleName}rc.cjs`,
      `.${moduleName}rc.mjs`,
      `.${moduleName}rc.ts`,
      `.${moduleName}rc.cts`,
      `.${moduleName}rc.mts`,
      `${moduleName}.config.js`,
      `${moduleName}.config.cjs`,
      `${moduleName}.config.mjs`,
      `${moduleName}.config.ts`,
      `${moduleName}.config.cts`,
      `${moduleName}.config.mts`,
      'package.json',
    ],
    cwd,
  }

  const data = await loader(options)
  if (data === null)
    return {}
  return data.isEmpty ? {} : data.config
}
