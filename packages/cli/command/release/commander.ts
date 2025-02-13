import type { TConfig } from '@mopo/shared'

import type Execa from 'execa'
import { exec } from '../../utils/commadExecutor'

export async function command(cwd: string, releaseIt: TConfig['configs']['releaseIt'], baseOptions: string[], opt: Execa.Options) {
  const options = [releaseIt.binPath, '--config', ...baseOptions]
  await exec(
    'npx',
    options,
    {
      cwd,
      ...opt,
      stdin: 'inherit',
    },
    true,
  )
}
