import { logger } from '@mopo/shared'
import semver from 'semver'

export function checkNodeVersion(wanted: string, id: string): void {
  if (!semver.satisfies(process.version, wanted, { includePrerelease: true })) {
    logger.log(logger.necessaryNodeVersion(wanted, id))
    process.exit(1)
  }
}

export function notifyOutDated() {
  const EOL_NODE_MAJORS = ['8.x', '9.x', '11.x', '13.x']
  for (const major of EOL_NODE_MAJORS) {
    if (semver.satisfies(process.version, major)) {
      logger.log(logger.recommendedNodeVersion(major))
    }
  }
}
