import type { PackageJson } from '@mopo/shared'
import { dict, logger } from '@mopo/shared'
import { to } from 'await-to-js'

import fse from 'fs-extra'

import validateProjectName from 'validate-npm-package-name'

export const cliPkgInfo = fse.readJsonSync(dict.pkg(__dirname))

export function checkProjectName(name: string): string {
  let msg = ''
  const isvalid = validateProjectName(name)
  if (!isvalid.validForNewPackages && !isvalid.validForOldPackages)
    msg = isvalid.errors && logger.invalidName(name, isvalid.errors)
  if (!isvalid.validForNewPackages && isvalid.validForOldPackages)
    msg = isvalid.warnings && logger.invalidName(name, isvalid.warnings)
  return msg
}

export async function outputPackageJson(path: string, pkgJson: PackageJson): Promise<void> {
  const packageJson = dict.localPkg(path)
  const [outputRrr] = await to(fse.outputJson(packageJson, pkgJson, { spaces: 2 }))
  if (outputRrr)
    throw outputRrr
}

export async function getProjectName(name: string) {
  const [err, pkg] = await to(fse.readJson(dict.localPkg(name)))
  if (err)
    throw new Error(logger.readPkgNameFail(name))
  return pkg.name
}
