import type { Package } from '@mopo/shared'
import type { CommandArgument } from '../types'
import { join, resolve } from 'node:path'
import { generatePackageJson, templateDir } from '@mopo/boilerplate'

import { logger, spinner, workspace } from '@mopo/shared'
import { to } from 'await-to-js'
import fse from 'fs-extra'
import { cliExecutor } from '../utils/commadExecutor'

import { checkProjectName, outputPackageJson } from '../utils/projectInfo'
import { confirm, input, select } from '../utils/prompts'

function getProjectInfo(name: string) {
  const checkResult = checkProjectName(name)
  if (checkResult)
    throw new Error(checkResult)
  return name
}

export default async (
  { args }: CommandArgument,
) => {
  const cwd = process.cwd()
  const libs = ['vue2', 'vue3', 'react']
  const workspacesRoot = workspace.findWorkspacesRoot()
  if (!workspacesRoot)
    throw new Error(logger.NOT_MONOREPO)

  const name = args[0]
  const { globs, path } = workspacesRoot
  const projectPath = name.includes('/') ? name.split('/')[1] : name
  getProjectInfo(name)

  const packagePaths = workspace.findPackagePath(globs)
  if (!packagePaths.length)
    throw new Error(logger.INVALID_WORKSPACE_PATTERN)

  const targetPath = await (async () => {
    if (packagePaths.length > 1) {
      const answer = await select({
        message: logger.SELECT_PACKAGE_ROOT,
        choices: packagePaths.map(path => ({ name: path, value: path })),
      })
      if (!answer) {
        const packagePath = await input({
          message: 'Please enter the path to create the project (relative to the workspace root)',
          required: true,
          validate: (value: string) => {
            const pathRegex = /^[\w\-/]+$/
            const name = value.split('/').pop() || ''
            return pathRegex.test(name) && workspace.validatePathWithGlobs(join(cwd, value), globs.map(glob => join(cwd, glob)))
          },
        }) as string
        return resolve(path, packagePath)
      }
      return resolve(path, answer, projectPath)
    }
    return resolve(path, packagePaths[0], projectPath)
  })()

  if (fse.pathExistsSync(targetPath)) {
    const shouldContinue = await confirm({
      message: logger.directoryExists(targetPath),
    })
    if (!shouldContinue)
      process.exit(0)

    const [removeErr] = await to(fse.emptyDir(targetPath))
    if (removeErr)
      throw removeErr
  }

  let answer = await select({
    message: logger.SELECT_TEMPLATE,
    choices: libs.map(name => ({ name, value: name })),
  }) as Package['lib']
  // TODO: throw error if user not select
  if (!answer)
    answer = 'vue2'

  logger.log(logger.creatingProject(targetPath))

  await spinner.wrap(
    logger.COPYING,
    async () => to(fse.copy(templateDir(answer), targetPath)),
  )

  await spinner.wrap(
    logger.SETTING,
    async () => {
      const pkgJson = generatePackageJson('package', answer, name)
      return to(outputPackageJson(targetPath, pkgJson))
    },
  )

  const packageManager = await select({
    message: logger.SELECT_PACKAGE_MANAGER,
    choices: [
      { name: 'pnpm', value: 'pnpm' },
      { name: 'yarn', value: 'yarn' },
      { name: 'npm', value: 'npm' },
    ],
    defaultValue: 'pnpm',
  }) || 'pnpm'

  await spinner.wrap(
    logger.INSTALLING,
    async () => to(cliExecutor({
      prefix: packageManager,
      options: ['install'],
      opts: { cwd: path },
      shouldLog: false,
    })),
  )

  logger.log(logger.createSuccess(name))
  logger.log(logger.getStarted(name))
}
