import type { MopoConfig } from '@mopo/shared'

import joi from 'joi'

const configItemSchema = joi.alternatives().try(
  joi.string(),
  joi.object({
    path: joi.string(),
    config: joi.object(),
    configPath: joi.string(),
  }),
)

const hmrSchema = joi.alternatives().try(
  joi.boolean(),
  joi.object({
    protocol: joi.string().optional(),
    host: joi.string().optional(),
    port: joi.number().optional(),
    path: joi.string().optional(),
    timeout: joi.number().optional(),
    overlay: joi.boolean().optional(),
    clientPort: joi.number().optional(),
    server: joi.any().optional(),
  }),
)

const schema = joi.object({
  outputDir: joi.string().allow('root', 'package'),
  publicPath: joi.string().allow(''),
  transpileDependencies: joi.alternatives().try(
    joi.boolean(),
    joi.array(),
  ),
  productionSourceMap: joi.boolean(),
  devServer: joi.object({
    port: joi.number(),
    host: joi.string(),
    strictPort: joi.boolean(),
    https: joi.boolean(),
    open: joi.boolean(),
    watch: joi.alternatives().try(joi.object(), joi.valid(null)),
    proxy: joi.object().pattern(
      joi.string(),
      joi.alternatives().try(joi.string(), joi.object()),
    ),
    headers: joi.object().pattern(
      joi.string(),
      joi.alternatives().try(
        joi.string(),
        joi.array().items(joi.string()),
      ),
    ),
    cors: joi.alternatives().try(joi.boolean(), joi.object()),
    warmup: joi.object({
      clientFiles: joi.array().items(joi.string()).optional(),
      ssrFiles: joi.array().items(joi.string()).optional(),
    }),
    fs: joi.object({
      strict: joi.boolean().optional(),
      allow: joi.array().items(joi.string()).optional(),
      deny: joi.array().items(joi.string()).optional(),
    }),
    origin: joi.string(),
    sourcemapIgnoreList: joi.alternatives().try(
      joi.boolean().valid(false),
      joi.function(),
    ),
    middlewareMode: joi.boolean(),
    hmr: hmrSchema,
  }),
  pages: joi.object().pattern(
    /\w+/,
    joi.alternatives().try(
      joi.string().required(),
      joi.array().items(joi.string().required()),

      joi.object().keys({
        entry: joi.alternatives().try(
          joi.string().required(),
          joi.array().items(joi.string().required()),
        ).required(),
      }).unknown(true),
    ),
  ),
  configs: joi.alternatives().try(
    joi.string(),
    joi.object({
      typescript: configItemSchema,
      czg: configItemSchema,
      eslint: configItemSchema,
      lintStaged: configItemSchema,
      prettier: configItemSchema,
      releaseIt: configItemSchema,
      commitlint: configItemSchema,
      babel: configItemSchema,
      postcss: configItemSchema,
    }),
  ),
  crossorigin: joi.string().valid('', 'anonymous', 'use-credentials'),
  integrity: joi.boolean(),

  css: joi.object({
    sourceMap: joi.boolean(),
    preprocessorOptions: joi.object({
      sass: joi.object(),
    }),
    modules: joi.object(),
  }),

  configureBundler: joi.func(),

})

export function validateConfig(config: MopoConfig): void {
  const { error } = schema.validate(config, {
    abortEarly: false,
    allowUnknown: false,
  })

  if (error) {
    throw new Error(
      `Configuration validation failed:\n${error.details
        .map(detail => `- ${detail.message}`)
        .join('\n')}`,
    )
  }
}
