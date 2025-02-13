import type { TConfig } from '@mopo/shared'
import type Server from 'webpack-dev-server'
import type { Configuration, ProxyConfigArrayItem } from 'webpack-dev-server'
import { readFileSync } from 'node:fs'

import { dict } from '@mopo/shared'
import ip from 'ip'
import portfinder from 'portfinder'

type NormalizedServer = TConfig['devServer']

const DEFAULT_CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
  'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
} as const

function logServerUrls(name: string, port: number): void {
  console.log(
    '\n%c' + `${name} is compiling at:`
    + '\n%c' + `http://localhost:${port}`
    + '\n%c' + `http://${ip.address()}:${port}\n`,
    'color: green',
    'color: blue',
    'color: blue',
  )
}

function rewriteProxy(proxy: NormalizedServer['proxy']): ProxyConfigArrayItem[] {
  if (!proxy)
    return []
  return Object.entries(proxy).map(([key, value]) => {
    if (typeof value === 'string') {
      return ({
        context: [key],
        target: value,
        changeOrigin: true,
      })
    }
    return {
      context: [key],
      target: value.target,
      ws: value.ws,
      changeOrigin: value.changeOrigin ?? true,
      pathRewrite: value.rewrite,
      secure: value.secure,
      headers: value.headers,
    }
  })
}

function rewriteHmr(hmr: NormalizedServer['hmr'], port: number): boolean | Server.ClientConfiguration | undefined {
  if (hmr === false)
    return undefined

  const clientPort = typeof hmr === 'object'
    ? hmr.port !== port
      ? port
      : hmr.port
    : 8080

  const defaultHmr: Server.ClientConfiguration = {
    webSocketURL: `auto://${ip.address()}:${port}/ws`,
    reconnect: true,
    overlay: false,
  }

  if (hmr === undefined || hmr === true)
    return defaultHmr

  const { protocol, host, path, timeout, overlay } = hmr
  const webSocketURL = `${protocol}://${host}:${clientPort}/${path}`

  return {
    ...defaultHmr,
    webSocketURL,
    reconnect: timeout,
    overlay,
  }
}

function rewriteWatch(watch: NormalizedServer['watch']): object | boolean {
  if (watch === undefined)
    return true
  if (watch === null)
    return false
  return watch
}

export default async (
  { path, devtool, pkgName }: { path: string, devtool: NormalizedServer, pkgName: string },
): Promise<Configuration> => {
  portfinder.basePort = devtool.port
  const port = await portfinder.getPortPromise()

  if (devtool.strictPort && port !== devtool.port) {
    throw new Error(`Port ${devtool.port} is already in use`)
  }

  const { https, open, host, proxy, headers, cors, hmr, watch } = devtool

  const server = https
    ? {
        type: 'https',
        options: {
          key: readFileSync(dict.cache(__dirname, 'mkcert/mkcert.key')),
          cert: readFileSync(dict.cache(__dirname, 'mkcert/mkcert.pem')),
        },
      }
    : {}

  const devServer: Configuration = {
    client: rewriteHmr(hmr, port),
    static: {
      watch: rewriteWatch(watch),
      directory: dict.localPublic(path),
    },
    port,
    open,
    host,
    hot: hmr !== false,
    compress: true,
    proxy: rewriteProxy(proxy),
    headers: {
      ...(cors && DEFAULT_CORS_HEADERS),
      ...(headers && Object.fromEntries(
        Object.entries(headers).map(([key, value]) => [key, String(value)]),
      )),
    },
    server,
    setupExitSignals: true,
    historyApiFallback: true,
    onListening: (devServer: Server) => {
      const { port: serverPort } = (devServer as any).server.address() as { port: number }
      logServerUrls(pkgName, serverPort)
    },
  }

  return devServer
}
