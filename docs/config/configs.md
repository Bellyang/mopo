# Configuration Files

**Types:**

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

Various project configurations including <em>postcss</em>, <em>babel</em>, <em>czg</em>, <em>eslint</em>, <em>lintStaged</em>, <em>prettier</em>, <em>releaseIt</em>, <em>typescript</em>, <em>commitlint</em>, <em>browserslist</em> can be configured individually using configuration files, all parsed using [cosmiconfig](https://github.com/cosmiconfig/cosmiconfig).

Each **config** includes four configuration items:

* path

  **Types: string**

  Package directory path, e.g., <em>lint-staged</em> in **node_modules**:
  ```
  root/
  └── node_modules/
      └── lint-staged
  ```
  Required for **@commitlint/cli**, **lint-staged**, **release-it**. Optional if no specific package version is needed.

* binPath

  **Types: string**

  Package binary file location, e.g., for <em>typescript</em>:
  ```
  root/
  └── node_modules/
      └── typescript
        └── bin
          └── tsc
  ```
  Used for executing script commands. Required for **czg**, **eslint**, **prettier**, **releaseIt**, **lintStaged**, **commitlint**, **typescript**. Optional if no specific version is needed.

* configPath

  **Types: string**

  Configuration file path, e.g., **eslint.config.ts** location. Recommended to use <em>.config</em> directory for all configuration files. Supports various formats, for example, **eslint** configurations:

  ::: details
  eslint.config.js
  eslint.config.mjs
  eslint.config.cjs
  eslint.config.ts
  eslint.config.mts
  eslint.config.cts 
  :::

* config

  **Types: Record<PropertyKey, any>**

  Configuration object. These settings will be passed through without validation. Using configuration objects directly is less common; it's recommended to specify a configuration file path instead.

**Example:**
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