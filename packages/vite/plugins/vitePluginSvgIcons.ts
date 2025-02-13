import { dict } from '@mopo/shared'

import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

export default ({ path }: { path: string }) => [
  createSvgIconsPlugin({
    iconDirs: [dict.target(`${path}/assets/svg'`)],
    symbolId: 'icon-[name]',
    inject: 'body-first',
  }),
  // 这里为main.ts加入import 'virtual:svg-icons-register'
  {
    name: 'vite-plugin-insert-main',
    transform(code: string, id: string) {
      const main = dict.target(`${path}/main.ts`)
      const maints = `import 'virtual:svg-icons-register';\n${code}`
      if (main === id) {
        return {
          code: maints,
          map: { mappings: '' },
        }
      }
      return null
    },
  },
]
