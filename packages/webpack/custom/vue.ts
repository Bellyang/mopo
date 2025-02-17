import type { Package } from '@mopo/shared'

import { req } from '../utils/resolver'

export default (pkg: Package) => {
  const { lib } = pkg
  if (lib === 'react')
    return []
  return [
    {
      test: /\.vue$/,
      exclude: /node_modules/,
      use: [{
        loader: req.resolve(lib === 'vue2' ? 'vue-loader2' : 'vue-loader3'),
        options: {
          compiler: lib === 'vue2' ? req('vue-template-compiler/build') : undefined,
        },
      }],
    },
  ]
}
