import type { TConfig } from '@mopo/shared'
import type { ServerOptions } from 'vite'

import ip from 'ip'
import portfinder from 'portfinder'

export default async (
  server: TConfig['devServer'],
): Promise<ServerOptions> => {
  const address = server.host || ip.address()

  portfinder.basePort = server.port
  const port = await portfinder.getPortPromise()

  if (port !== server.port) {
    if (server.strictPort) {
      throw new Error(`Port ${server.port} is already in use`)
    }
    server.port = port
    if (typeof server.hmr === 'object') {
      server.hmr.port = port
    }
  }

  if (typeof server.hmr === 'object') {
    if (server.hmr.protocol === 'auto') {
      server.hmr.protocol = 'ws'
    }
  }

  return {
    ...server,
    https: (server.https === true) ? {} : server.https || false,
    host: address,
  } as ServerOptions
}
