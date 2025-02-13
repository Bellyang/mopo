import { eslintConf, prettierConf } from '../utils/configPath'
import { deps } from '../utils/resolver'

export default {
  './**/*.{js,ts,vue}': [
    `${deps.eslint} --fix -c ${eslintConf}`,
    `${deps.prettier} --write --config ${prettierConf}`,
  ],
  // './**/*.{css,scss,vue}': [
  //   `${sharedLoader('stylelint/bin/stylelint.js')} --config ${configFile("./stylelint.config.js")} --customSyntax postcss-html --fix`
  // ]
}
