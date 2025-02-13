import type { Package } from '@mopo/shared'

import type { Configuration } from 'webpack'
import type { BuildParams } from './types/index'
import * as webpackMerge from 'webpack-merge'
import base from './configs/webpack.base'

import dev from './configs/webpack.dev'

import prod from './configs/webpack.prod'

import test from './configs/webpack.test'
import custom from './custom'
import sm from './plugins/speedMeasurePlugin'

const { merge } = webpackMerge

async function mergeCommandConfig(defaultConfig: Configuration, { mode = 'development', env }: BuildParams): Promise<Configuration | undefined> {
  if (mode === 'development')
    return merge(defaultConfig, await dev())
  if (mode === 'production')
    return merge(defaultConfig, env === 'test' ? await test() : await prod())
  return merge(defaultConfig, await dev())
}

export default async (configs: BuildParams, pkg: Package): Promise<Configuration> => {
  const { lib, configs: userConfig } = pkg

  const defaultConfig = await base(configs)
  const mergedConfig = await mergeCommandConfig(defaultConfig, configs)

  if (!mergedConfig)
    throw new Error('Failed to merge configurations')

  const customConfig = await custom(configs, mergedConfig, pkg)
  const mergedCustomConfig = merge(mergedConfig, customConfig)

  const config = await userConfig.configureBundler('webpack', configs.env, lib, mergedCustomConfig) as Configuration

  return sm({ sm: configs.sm, mode: configs.mode, config, pkg })
}
