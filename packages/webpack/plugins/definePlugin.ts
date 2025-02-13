import type { Package } from '@mopo/shared'

import webpack from 'webpack'

export default ({ path, env, pkg }: { path: string, env: string, pkg: Package }) => {
  const { lib } = pkg

  const vue3 = {
    __VUE_OPTIONS_API__: 'true',
    __VUE_PROD_DEVTOOLS__: 'false',
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false',
  }

  return [
    new webpack.DefinePlugin({
      ...(lib === 'vue3' ? vue3 : {}),
      'process.env': {
        APP_ENV: JSON.stringify(env),
        TIME_BUILDED: JSON.stringify(new Date().valueOf()),
        PROJECT: JSON.stringify(path),
      },
    }),
  ]
}
