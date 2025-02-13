import { resolve } from 'node:path'

export const cwd = process.cwd()
// base path: target monorepo path
const resolveCWD = (...paths: string[]) => resolve(cwd, ...paths)

export const lock = (repoRoot: string) => resolve(repoRoot, 'pnpm-lock.yaml')

export const dist = (repoRoot: string, name: string) => resolve(repoRoot, `./dist/${name}`)
export const repo = (name: string) => resolveCWD(name)

export const target = (name: string) => resolveCWD(name)
// base path: packages/modules/
const resolveTarget = (name: string, ...paths: string[]) => resolve(target(name), ...paths)

export const localPublic = (name: string) => resolveTarget(name, './public')
export const localPkg = (name: string) => resolveTarget(name, './package.json')
export const entry = (name: string, entry: string) => resolveTarget(name, entry)
// base path: the absolute path of the directory containing the currently executing file
const resolveCtx = (ctx: string, ...paths: string[]) => resolve(ctx, ...paths)

export const pkg = (ctx: string) => resolveCtx(ctx, '../../package.json')
export const configPath = (ctx: string) => resolveCtx(ctx, '../vite/config.js')
// bundle tools cache file dir
export const cache = (ctx: string, name: string = ''): string => resolveCtx(ctx, '../.cache', name)
