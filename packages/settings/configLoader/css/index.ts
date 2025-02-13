import type { Css, MopoConfig, NormalizedCss } from '@mopo/shared'

const defaultCss: Css = {
  sourceMap: false,
  preprocessorOptions: {
    sass: {},
  },
  modules: {},
} as const

export default (configs?: MopoConfig['css']): NormalizedCss => {
  if (!configs)
    return { ...defaultCss }
  return {
    ...defaultCss,
    ...configs,
  }
}
