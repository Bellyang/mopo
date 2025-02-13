import type { Lib, MopoConfig, TConfig, TPluginProps, Workspace, WorkspacesRoot } from '@mopo/shared'
import { logger, workspace as workspaces } from '@mopo/shared'
import normalizeConfigs from './configs'
import normalizeCss from './css'
import mopo from './mopo'
import normalizePages from './pages'
import normalizePlugin from './plugin'
import normalizeServer from './server'

import { validateConfig } from './utils/validator'

export async function generateConfig(cwd: string, lib: Lib): Promise<TConfig> {
  const mopoConfig: MopoConfig = await mopo(cwd)

  validateConfig(mopoConfig)

  const [css, pages, baseConfig, server] = await Promise.all([
    normalizeCss(mopoConfig.css),
    normalizePages(mopoConfig.pages),
    normalizeConfigs(mopoConfig),
    normalizeServer(mopoConfig.devServer),
  ])

  const pluginConfigs: TPluginProps = await normalizePlugin(cwd, mopoConfig.configs, lib)

  return {
    ...baseConfig,
    devServer: server,
    css,
    configs: pluginConfigs,
    pages,
  }
}

export default async function loadConfiguration(): Promise<Workspace | TConfig> {
  const { findWorkspacesRoot } = workspaces
  const workspace: WorkspacesRoot | null = findWorkspacesRoot()
  if (workspace === null)
    throw new Error(logger.NOT_MONOREPO)
  return await generateConfig(workspace.path, 'vue2')
}
