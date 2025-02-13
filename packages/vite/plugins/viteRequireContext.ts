import { dict } from '@mopo/shared'

import ViteRequireContext from '@originjs/vite-plugin-require-context'

export default ({ path }: { path: string }) => [
  ViteRequireContext.default({ projectBasePath: dict.target(path) }),
]
