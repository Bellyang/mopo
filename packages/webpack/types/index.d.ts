export interface BuildParams {
  env: string
  sm?: boolean
  path: string
  mode?: string
  pkgName: string
  repoRoot: string
  analyzer?: boolean
  devServer?: boolean
}
