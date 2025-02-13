import type { Package } from '@mopo/shared'
import type { PluginOption } from 'vite'
// import vitePluginLegacy from './vitePluginLegacy'
import rollupPluginBabel from './rollupPluginBabel'
import rollupPluginVisualizer from './rollupPluginVisualizer'
import vitePluginBuildChecker from './vitePluginBuildChecker'
import vitePluginCommon from './vitePluginCommon'
import vitePluginCompression from './vitePluginCompression'
import vitePluginHtml from './vitePluginHtml'
import vitePluginMkcert from './vitePluginMkcert'
import vitePluginPathResolve from './vitePluginPathResolve'
import vitePluginProgress from './vitePluginProgress'
import vitePluginResolveExtensionVue from './vitePluginResolveExtensionVue'
import vitePluginSvgIcons from './vitePluginSvgIcons'

import vitePuginChecker from './vitePuginChecker'
import viteRequireContext from './viteRequireContext'

export default async (
  { path, analyzer }: { path: string, analyzer: boolean },
  pkg: Package,
): Promise<PluginOption[]> => {
  const { lib, root } = pkg
  const { devServer, pages, configs, transpileDependencies } = pkg.configs
  const https = devServer.https
  const vuePlugin = lib === 'vue2'
    ? (await import('./vitePluginVue2')).default
    : lib === 'vue3'
      ? (await import('./vitePluginVue3')).default
      : (await import('./vitePluginReact')).default

  return [
    ...vuePlugin(),
    // ...vitePluginLegacy(),
    ...vitePluginCompression(),
    ...vitePluginCommon(),
    ...rollupPluginBabel(configs, transpileDependencies),
    ...vitePluginHtml(path, root, pages),
    ...await vitePluginProgress({ path }),
    ...vitePluginSvgIcons({ path }),
    ...viteRequireContext({ path }),
    ...vitePluginPathResolve({ path }),
    ...vitePluginResolveExtensionVue(),
    ...await vitePuginChecker({ path, lib }, configs),
    ...await vitePluginBuildChecker({ path, lib }, configs),
    ...rollupPluginVisualizer({ path, analyzer }),
    ...vitePluginMkcert(https),
  ] as PluginOption[]
}
