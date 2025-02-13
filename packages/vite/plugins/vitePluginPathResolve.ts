import fs from 'node:fs'
import path from 'node:path'
import { dict } from '@mopo/shared'

function joinFolderPath(unverifyPath: string, childFile = 'index.js'): string | undefined {
  const getFile = path.resolve(unverifyPath, childFile)
  try {
    // try js
    fs.statSync(getFile)
    return getFile
  }
  catch (_) {
    // try vue
    if (childFile === 'index.vue')
      return
    return joinFolderPath(unverifyPath, 'index.vue')
  }
}
// .vue .js .tsx .jsx
function joinFilePath(filePath: string, ext = '.vue') {
  try {
    // .vue cannot parse by vite
    fs.statSync(filePath + ext)
    return filePath + ext
  }
  catch (_) {
    return filePath
  }
}
function recurseTry(unverifyPath: string) {
  try {
    const status = fs.statSync(unverifyPath)
    if (status.isDirectory()) {
      return joinFolderPath(unverifyPath)
    }
    else if (status.isFile()) {
      return unverifyPath
    }
    return joinFilePath(unverifyPath)
  }
  catch (_) {
    // const extArr = ['.vue', '.js', '.jsx', '.ts', '.tsx']
    // const isFile = extArr.filter((ext) => unverifyPath.indexOf(ext) > 1)
    // if (isFile.length > 0) throw error
    return joinFilePath(unverifyPath)
  }
}

function localResolve(alias: Record<string, string> = {}) {
  const aliasArray = Object.keys(alias)
  return {
    name: 'alias-defualt',
    resolveId(source: string, importer: string) {
      const localAlias = aliasArray.filter(k => source.includes(k))[0]
      const isRelative = source.includes('./')
      if (!localAlias && !isRelative)
        return
      if (!importer)
        return
      const basename = path.basename(importer)
      let directory = importer.split(basename)[0]
      // @todo Absolute path
      if (!isRelative)
        directory = alias[localAlias].replace(localAlias, '')

      const unverifyPath = path.resolve(directory, source)
      const aimPath = recurseTry(unverifyPath)
      return aimPath
    },
  }
}

export default ({ path }: { path: string }) => {
  return [localResolve({ components: dict.target(`${path}/components`) })]
}
