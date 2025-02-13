import type { Package } from '@mopo/shared'
import css from './css'

import define from './define'

export default async (
  { env, pkgName }: { env: string, pkgName: string },
  pkg: Package,
) => ({
  css: await css(pkg.configs.css, pkg.configs.configs),
  define: define({ env, pkgName, lib: pkg.lib }),
})
