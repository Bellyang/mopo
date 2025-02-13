import type { Package } from '@mopo/shared'
import type { Compiler } from 'webpack'
import type { BuildParams } from './types/index'
import { logger, spinner } from '@mopo/shared'

import { to } from 'await-to-js'
import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'

import webpackConfig from './merge'
import assetsInfo from './utils/assetsInfo'
import cleanCache from './utils/cleanCache'

function buildRunner(compiler: Compiler): Promise<string> {
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) {
        console.error(err.stack || err)
        if (err.message)
          console.error(err.message)
        return reject(err)
      }
      if (!stats)
        return reject(new Error('no compile stats.'))

      const info = stats.toJson()
      if (stats.hasErrors())
        return reject(info.errors)
      if (stats.hasWarnings())
        console.warn(info.warnings)
      if (Array.isArray(info.assets))
        assetsInfo(info)
      resolve('success')
    })
  })
}

export { cleanCache }

export default async (configs: BuildParams, pkg: Package, isBuild: boolean = false): Promise<void> => {
  const [mergeErr, config] = await to(webpackConfig(configs, pkg))
  if (mergeErr)
    throw mergeErr
  const compiler = webpack(config)
  if (isBuild) {
    spinner.start(logger.building(configs.pkgName))
    const [runErr] = await to(buildRunner(compiler))
    if (runErr) {
      spinner.fail(logger.building(configs.pkgName))
      throw runErr
    }
    spinner.succeed(logger.building(configs.pkgName))
    return
  }
  logger.log(logger.starting(configs.pkgName))
  const { devServer: devServerOptions } = config
  const server = new WebpackDevServer(devServerOptions, compiler)

  const [compileErr] = await to(server.start())
  if (compileErr)
    throw compileErr
}
