import type { TConfig } from '@mopo/shared'

import type { CSSOptions } from 'vite'
import postcss from './postcss'

export default async (
  css: TConfig['css'],
  configs: TConfig['configs'],
): Promise<CSSOptions> => {
  const { preprocessorOptions } = css
  const { sass } = preprocessorOptions
  return {
    postcss: await postcss(css, configs),
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
        ...sass,
      },
    },
  }
}
