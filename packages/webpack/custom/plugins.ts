import type { Package } from '@mopo/shared'
import type { BuildParams } from '../types/index'
import plugins from '../plugins'

export default async (
  buildParams: BuildParams,
  pkg: Package,
) => await plugins(buildParams, pkg)
