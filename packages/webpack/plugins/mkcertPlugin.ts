import { dict } from '@mopo/shared'

import MkcertPlugin from 'webpack-mkcert-plugin'

export default (isHttps: boolean) => {
  if (!isHttps)
    return []
  return [new MkcertPlugin({
    outputDir: dict.cache(__dirname, 'mkcert'),
    key: 'mkcert.key',
    cert: 'mkcert.pem',
  })]
}
