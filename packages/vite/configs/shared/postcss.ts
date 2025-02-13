import type { TConfig } from '@mopo/shared'

import { req } from '../../utils'

export default async (css: TConfig['css'], configs: TConfig['configs']) => {
  const { mergeConfig } = await import('vite')
  const { modules } = css
  const { postcss } = configs

  if (modules && Object.keys(modules).length) {
    return mergeConfig(postcss.config, {
      plugins: [
        req(req.resolve('postcss-modules'))(modules),
      ],
    })
  }
  return postcss.config
}
