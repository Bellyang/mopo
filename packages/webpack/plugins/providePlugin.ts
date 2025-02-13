import type { Package } from '@mopo/shared'

import webpack from 'webpack'

export default (pkg: Package) => {
  const { lib } = pkg
  if (lib === 'vue3')
    return []
  if (lib === 'vue2') {
    return [
      new webpack.ProvidePlugin({
        Vue: ['vue/dist/vue.esm.js', 'default'],
      }),
    ]
  }
  return []
}
