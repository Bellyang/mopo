import { configPath } from '@mopo/settings'
import { logger, pathOperator, workspace } from '@mopo/shared'

import { to } from 'await-to-js'
import { exec } from '../utils/commadExecutor'

async function createGlobalHooks(shouldLog: boolean) {
  const platform = process.platform
  const workspaces = workspace.findWorkspacesRoot()
  const configUrl = configPath.configPath('../')
  const hooks = configPath.configPath('../hooks')

  if (!workspaces)
    throw new Error(logger.NOT_MONOREPO)

  const cwd = workspaces.path
  const stdout = await exec('git', ['config', 'core.hooksPath'], { cwd }, false, false)
  const result = stdout ? stdout.toString() : ''

  if (!pathOperator.isRelative(configUrl, result)) {
    if (platform === 'darwin') {
      // platforms like linux need permission to access hooks
      await exec('chmod', ['ug+x', `${hooks}/commit-msg`])
      await exec('chmod', ['ug+x', `${hooks}/prepare-commit-msg`])
    }
    await exec('git', ['config', 'core.hooksPath', hooks], { cwd })
    shouldLog && logger.log(logger.HOOK_INIT)
    return
  }
  shouldLog && logger.log(logger.SKIPPED_HOOK)
}

export default async (shouldLog: boolean = true) => {
  const [err] = await to(createGlobalHooks(shouldLog))
  if (err)
    throw err
}
