import type { CommandArgument } from '../types'
import { relative } from 'node:path'
import { generatePackageJson, templateDir } from '@mopo/boilerplate'
import { dict, logger, spinner } from '@mopo/shared'

import { to } from 'await-to-js'
import fs from 'fs-extra'
import { exec } from '../utils/commadExecutor'
import { gitCheckIsInsideWorkTree } from '../utils/git'
import { checkProjectName, outputPackageJson } from '../utils/projectInfo'
import { confirm } from '../utils/prompts'

import prepare from './prepare'

function endProcess(name: string, isCurrent: boolean) {
  logger.log(logger.createRepoSuccess(name))
  logger.log(logger.createSuggestion(name, isCurrent))
}

export default async ({ args }: CommandArgument) => {
  const name = args[0]
  const repoPath = dict.repo(name)
  const isCurrent = name === '.' || name === './'
  const repoName = isCurrent ? relative('../', process.cwd()) : name

  const checkResult = checkProjectName(repoName)
  if (checkResult)
    throw new Error(checkResult)
  logger.log(logger.creatingRepo(repoPath))
  if (fs.pathExistsSync(repoPath)) {
    if (isCurrent) {
      const isOK = await confirm({ message: logger.isGenerate(true) })
      if (!isOK)
        return process.exit(1)
    }
    else {
      const answer = await confirm({ message: logger.directoryExists(repoPath) })
      if (!answer)
        return process.exit(1)
      const [removeErr] = await to(fs.emptyDir(repoPath))
      if (removeErr)
        throw removeErr
    }
  }

  await spinner.wrap(logger.COPYING, async () => to(fs.copy(templateDir('wrapper'), repoPath)))

  await outputPackageJson(repoPath, generatePackageJson('root'))

  const isExist = await gitCheckIsInsideWorkTree(repoPath)
  if (!isExist) {
    const isOK = await confirm({ message: logger.GIT_INITIALIZE })
    if (!isOK)
      return endProcess(repoName, isCurrent)
    const gitInitProcess = exec('git', ['init', '--quiet'], { cwd: repoPath, stdin: 'inherit' }, true)
    await spinner.wrap(logger.GIT_INITIALIZING, async () => to(gitInitProcess))
  }

  const gitExist = await gitCheckIsInsideWorkTree(repoPath)
  if (!gitExist)
    return endProcess(repoName, isCurrent)

  await spinner.wrap(logger.INIT_HOOKS, async () => to(prepare(false)))

  endProcess(repoName, isCurrent)
}
