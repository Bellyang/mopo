const ENV_MAP = {
  development: { env: 'development', qa: 'dev' },
  test: { env: 'test', qa: 'qa' },
  production: { env: 'production', qa: 'prod' },
} as const

const getEnvValues = (env: string) => ENV_MAP[env as keyof typeof ENV_MAP] || { env: '', qa: 'dev' }

export default ({ env, pkgName, lib }: { env: string, pkgName: string, lib: string }) => {
  const { env: NODE_ENV, qa: VUE_APP_ENV } = getEnvValues(env)

  const vue3 = {
    __VUE_OPTIONS_API__: 'true',
    __VUE_PROD_DEVTOOLS__: 'false',
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false',
  }

  return {
    ...(lib === 'vue3' ? vue3 : {}),
    'process.env': {
      NODE_ENV,
      VUE_APP_ENV,
      TIME_BUILDED: JSON.stringify(new Date().valueOf()),
      PROJECT: JSON.stringify(pkgName),
    },
  }
}
