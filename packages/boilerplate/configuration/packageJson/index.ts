import { react, vue2, vue3 } from './dependencies'

const rootBase = {
  private: true,
  workspaces: [
    'packages/*',
  ],
}

const packageBase = {
  name: '',
  version: '0.0.1',
}

export { packageBase, react as reactDependencies, rootBase, vue2 as vue2Dependencies, vue3 as vue3Dependencies }
