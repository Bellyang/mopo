import type { Package } from '@mopo/shared'
import { VueLoaderPlugin as VueLoaderPlugin2 } from 'vue-loader2'

import { VueLoaderPlugin as VueLoaderPlugin3 } from 'vue-loader3'

export default (pkg: Package) => {
  const { lib } = pkg
  if (lib === 'vue2')
    return [new VueLoaderPlugin2()]
  if (lib === 'vue3')
    return [new VueLoaderPlugin3()]
  return []
}
