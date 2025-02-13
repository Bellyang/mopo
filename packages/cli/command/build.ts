import type { Workspace } from '@mopo/shared'
import type { Options } from '../types'

import { existsSync } from 'node:fs'
import { dict, errorMessageCatch, logger, workspace as workspaces } from '@mopo/shared'
import { to } from 'await-to-js'

import { cliExecutor } from '../utils/commadExecutor'
import { executeBundler } from '../utils/executeBundler'

async function installDependencies(root: string, npmClient: string) {
  if (!existsSync(dict.lock(root)))
    return

  logger.log(logger.INSTALL_DEPENDENCIES)
  const options = ['install']

  if (npmClient === 'npm') {
    await cliExecutor({ prefix: npmClient, options: ['ci'] })
  }
  else {
    await cliExecutor({
      prefix: npmClient,
      options: [...options, '--frozen-lockfile'],
    })
  }
}

async function buildTasks(options: Options, workspace: Workspace) {
  const { rootPath: root, packages } = workspace
  const npmClient = workspaces.getNpmClient(root) || 'pnpm'

  const [installErr] = await to(installDependencies(root, npmClient))
  if (installErr)
    throw installErr

  for (const pkg of packages) {
    const [buildErr] = await to(executeBundler(root, { ...options, env: 'production' }, pkg, true))
    if (buildErr) {
      const message = errorMessageCatch.toErrorWithMessage(buildErr).message
      logger.log(logger.buildOutput(pkg.name, message))
      process.exit(1)
    }
  }
}

export default async ({ options }: { options: Options }, workspace: Workspace) => {
  await buildTasks(options, workspace)
  logger.log(logger.BUILD_DONE)
}
