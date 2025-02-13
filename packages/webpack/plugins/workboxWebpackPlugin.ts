import { GenerateSW } from 'workbox-webpack-plugin'

const defaultRuntimeCaching = [
  {
    urlPattern: '/*',
    handler: 'NetworkFirst' as const,
    options: {
      networkTimeoutSeconds: 1,
    },
  },
]

export default ({ pkgName, env }: { pkgName: string, env: string }) => {
  const workbox: { active: boolean, name: string, importScripts: string[], exclude: (string | RegExp)[], runtimeCaching: boolean } = {
    active: false,
    name: '',
    importScripts: [],
    exclude: [],
    runtimeCaching: false,
  }
  if (!workbox.active)
    return []
  return [
    new GenerateSW({
      cacheId: `${pkgName}`,
      swDest: workbox.name || `./sw.js`,
      importScripts: workbox.importScripts || [],
      skipWaiting: true,
      clientsClaim: true,
      cleanupOutdatedCaches: true,
      maximumFileSizeToCacheInBytes: env === 'development' ? 15 * 1024 * 1024 : 5 * 1024 * 1024,
      exclude: (workbox.exclude || []).concat([/\.map$/, /^manifest.*\.js$/]),
      runtimeCaching: /* workbox.runtimeCaching || */ defaultRuntimeCaching,
    }),
  ]
}
