import type { Config } from '../../types/Configuration'
import { loader } from '../utils/loader'

interface ConfigLoaderOptions {
  moduleName: string
  searchPlaces?: string[]
  packageProp?: string | string[]
}

export function createConfigLoader({ moduleName, searchPlaces: customSearchPlaces, packageProp }: ConfigLoaderOptions) {
  // Default extensions for config files
  const defaultExtensions = [
    'js',
    'cjs',
    'mjs',
    'ts',
    'cts',
    'mts',
    'json',
    'yaml',
    'yml',
  ]

  // Generate default search places if not provided
  const defaultSearchPlaces = [
    // .modulerc files
    `.${moduleName}rc`,
    ...defaultExtensions.map(ext => `.${moduleName}rc.${ext}`),
    // module.config.* files
    ...defaultExtensions.map(ext => `${moduleName}.config.${ext}`),
    // package.json is always included
    'package.json',
  ]

  return async (cwd?: string, explicitPath?: string): Promise<Record<PropertyKey, never> | Config> => {
    const options = {
      moduleName,
      searchPlaces: customSearchPlaces || defaultSearchPlaces,
      ...(packageProp && { packageProp: Array.isArray(packageProp) ? packageProp : [packageProp] }),
      cwd,
      explicitPath,
    }

    const data = await loader(options)
    if (!data)
      return {}
    return data.isEmpty ? {} : { configPath: data.filepath, config: data.config }
  }
}
