import type { PackageJson } from '@mopo/shared'
import { packageJson } from '../configuration'

export function generatePackageJson(type: 'root' | 'package', name?: 'vue2' | 'vue3' | 'react', pkgName?: string): PackageJson {
  const { rootBase, packageBase, vue2Dependencies, vue3Dependencies, reactDependencies } = packageJson
  if (type === 'package') {
    if (pkgName)
      packageBase.name = pkgName
    if (name === 'vue2')
      return { ...packageBase, ...vue2Dependencies }
    if (name === 'vue3')
      return { ...packageBase, ...vue3Dependencies }
    if (name === 'react')
      return { ...packageBase, ...reactDependencies }
  }
  return rootBase
}
