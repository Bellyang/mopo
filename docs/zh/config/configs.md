# 配置文件相关

**Types：**

```typescript
type configs = string | TPluginProps | TPlugin | undefined

type TPlugin = Record<
  'postcss' | 'babel' | 'czg' | 'eslint' | 'lintStaged' |
  'prettier' | 'releaseIt' | 'typescript' | 'commitlint' | 'browserslist',
  Config
>

type Config = {
  configPath: string
  config: Record<PropertyKey, any>
}

type TPluginConfig = Config & {
  path: string
  binPath: string
}

type TEntityPropsMapper<T> = {
  [Property in keyof T]: TPluginConfig
}

type TPluginProps = TEntityPropsMapper<TPlugin>
```

项目中各种配置项，包括<em>postcss</em>, <em>babel</em>, <em>czg</em>, <em>eslint</em>, <em>lintStaged</em>, <em>prettier</em>, <em>releaseIt</em>, <em>typescript</em>, <em>commitlint</em>, <em>browserslist</em>都可以以配置文件的形式单独配置，统一使用[cosmiconfig](https://github.com/cosmiconfig/cosmiconfig)来读取配置信息。

每个**config**中包括四个配置项：

* path

  **Types：string**

  对应包所在的目录，如<em>lint-staged</em>对应其在**node_modules**中的地址，如：
  ```
  root/
  └── node_modules/
      └── lint-staged
  ```
  目前**@commitlint/cli**, **lint-staged**, **release-it**需要此地址，如果不需要特别版本的包执行命令，此项可以不填。

* binPath

  **Types：string**

  对应包的bin文件所在位置，比如<em>typescript</em>，**bin**地址为：
  ```
  root/
  └── node_modules/
      └── typescript
        └── bin
          └── tsc
  ```
  **bin**地址为执行其脚本命令时使用，目前**czg**, **eslint**, **prettier**, **releaseIt**,**lintStaged**, **commitlint**, **typescript**使用此地址，如果无特殊版本需要，可以不填。

* configPath

  **Types：string**

  配置文件的地址，比如**eslint**的**eslint.config.ts**的位置，建议在项目目录下使用<em>.config</em>文件来放置所有的配置文件，支持配置对象文档支持的配置格式。如**eslint**的配置：

  ::: details
  eslint.config.js

  eslint.config.mjs

  eslint.config.cjs

  eslint.config.ts

  eslint.config.mts

  eslint.config.cts 
  :::

* config

  **Types：Record<PropertyKey, any>**

  配置的对象，这里的设置将不会校验并传入对应配置，使用配置对象的情况比较少，请尽量指定配置文件路径。

**示例：**
```typescript
configs: {
  eslint: {
    configPath: './.config/eslint.config.ts',
    config: {
      rules: {
        'no-console': 'warn'
      }
    }
  },
  prettier: {
    config: {
      printWidth: 120,
      semi: false
    }
  }
}
```