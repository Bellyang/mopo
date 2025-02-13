import type { Plugin } from 'vite'

import { viteCommonjs } from '@originjs/vite-plugin-commonjs'

export default (): Plugin[] => [viteCommonjs()]
