import { createRequire } from 'node:module'

export const req = require.main ? require : createRequire(import.meta.url)
