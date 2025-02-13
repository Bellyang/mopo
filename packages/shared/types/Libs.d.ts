import type { TConfig } from './Configuration'

export type Lib = 'vue2' | 'vue3' | 'react'
export type Libs = Record<string, { path: string, lib: Lib }>
export type Library = Record<string, { lib: Lib, configs: TConfig }>
