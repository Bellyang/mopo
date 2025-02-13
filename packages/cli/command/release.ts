import type { Workspace } from '@mopo/shared'
import type { CommandArgument } from '../types'
import type { Options } from './release/releaseProcess'
import { logger } from '@mopo/shared'
import getWorkspace from '../hooks/workspace'

import { confirm } from '../utils/prompts'
import { bumpVersion, releasePkg, releaseSameVer } from './release/releaseProcess'
import { updateDependencies } from './release/updateDependencies'

export default async (
  { options }: { options: Options },
  { rootPath, packages, rootConfig }: Workspace,
) => {
  let flag = true
  const { sameVersion } = options || {}
  const { releaseIt } = rootConfig.configs

  if (sameVersion)
    return await releaseSameVer(rootPath, releaseIt, options)

  for (const pkg of packages) {
    const { releaseIt } = pkg.configs.configs
    await bumpVersion(flag, releaseIt, pkg.relativePath, pkg.name, options)
    flag = false
  }

  const ws = await getWorkspace({ options, args: [] } as CommandArgument)
  const answer = await confirm({ message: logger.UPDATE_DEPENDENCIES })
  if (answer) {
    await updateDependencies(ws.packages)
    logger.log(logger.UPDATE_DEPENDENCIES_DONE)
  }

  for (const pkg of ws.packages) {
    const { releaseIt } = pkg.configs.configs
    await releasePkg(pkg.relativePath, pkg.name, releaseIt, options)
  }
}
