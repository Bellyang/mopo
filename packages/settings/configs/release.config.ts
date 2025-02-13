const packageName = process.env.npm_package_name
const scope = packageName

export default {
  plugins: {
    '@release-it-plugins/workspaces': {
      publish: false,
      skipChecks: true,
    },
    '@release-it/conventional-changelog': {
      infile: 'CHANGELOG.md',
      preset: {
        name: 'conventionalcommits',
      },
      header: '# 📋 Changelog',
      ignoreRecommendedBump: true,
      types: [
        { type: 'feat', section: '✨ Features' },
        { type: 'fix', section: '🐛 Bug Fixes' },
        { type: 'perf', section: '⚡ Performance Improvements' },
        { type: 'revert', section: '⏪ Reverts' },
        { type: 'chore', section: '🔨 Chores' },
        { type: 'docs', section: '📝 Documentation' },
        { type: 'style', section: '💄 Styles' },
        { type: 'refactor', section: '♻️ Code Refactoring' },
        { type: 'test', section: '✅ Tests' },
        { type: 'build', section: '👷‍ Build System' },
        { type: 'ci', section: '🔧 Continuous Integration' },
      ],
      gitRawCommitsOpts: {
        path: '.',
      },
      commitsOpts: {
        path: '.',
      },
    },
  },
  npm: {
    tag: true,
    publish: false,
    skipChecks: true,
    versionArgs: ['--no-workspaces-update'],
  },
  git: {
    push: true,
    commitsPath: '.',
    requireCommits: true,
    requireCommitsFail: false,
    tagName: `${scope}-v\${version}`,
    commitMessage: `chore(${scope}): 🔨 Release-version: \${version}`,
  },
}
