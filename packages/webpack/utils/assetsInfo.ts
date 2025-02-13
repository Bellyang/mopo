import type { StatsCompilation } from 'webpack'

import chalk from 'chalk'

type OutputCategory = 'html' | 'js' | 'css' | 'img' | 'svg' | 'others'

export default (info: StatsCompilation) => {
  const output: Record<OutputCategory, string> = { html: '', js: '', css: '', img: '', svg: '', others: '' }
  const assetCategories = {
    'assets/js/': 'js',
    'assets/css/': 'css',
    '.html': 'html',
    'assets/img/': 'img',
    'assets/svg/': 'svg',
  }
  if (info && info.assets) {
    info.assets.forEach((asset) => {
      if (asset.name && asset.size) {
        const fileSizeInBytes = asset.size
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
        const sizeType = Math.floor(Math.log(fileSizeInBytes) / Math.log(1024))
        const size = Math.round(fileSizeInBytes / (1024 ** sizeType))
        const category = (Object.entries(assetCategories).find(([key]) => asset.name.includes(key))?.[1] || 'others') as OutputCategory
        output[category] += `  -- ${asset.name} --> ${chalk.green(`${size} ${sizes[sizeType]}`)} \n`
      }
    })
    console.log(Object.entries(output).map(([key, value]) =>
      // eslint-disable-next-line prefer-template
      value && `${chalk.green(key + ':')}\n${value}'\n'`,
    ).join(''))
  }
}
