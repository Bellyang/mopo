import type { Workspace } from '@mopo/shared'

import type { Options } from '../types'

import { logger } from '@mopo/shared'
import { executeBundler } from '../utils/executeBundler'

function shutDownInfo() {
  return ['SIGINT', 'SIGTERM'].forEach(signal => process.on(signal, () => {
    logger.log(logger.SHUTTING_DOWN)
    process.exit(0)
  }))
}

export default async (
  { options }: { options: Options },
  workspace: Workspace,
) => {
  const root = workspace.rootPath
  const packages = workspace.packages

  for (const pkg of packages) {
    await executeBundler(root, { ...options, env: 'development' }, pkg)
  }

  shutDownInfo()
}
