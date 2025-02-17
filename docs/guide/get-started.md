# Quick Start Guide

## 1. Installation

::: tip
Node Version Support  
Mopo requires Node 18+. We recommend using Node version managers like n, nvm, volta, or fnm to switch Node versions.
:::

Install Mopo CLI globally using your preferred package manager:

::: code-group

```bash [npm]
npm install -g @mopo/cli
```

```bash [yarn]
yarn global add @mopo/cli
```

:::

After installation, verify by running:

```bash
mopo -v  # Check version
mopo -h  # Show help
```

## 2. Upgrade

Update to the latest version:

::: code-group

```bash [npm]
npm update -g @mopo/cli
```

```bash [yarn]
yarn global update --latest @mopo/cli
```

:::

## 3. Create Repository

Initialize a new monorepo:

```bash
mopo init repoName      # Create new repo
mopo init .             # Use current directory
```

Generates:
```
repoName/
├── packages/            # Default workspace
├── .gitignore           # Git exclusion rules
├── package.json         # Workspace config (npm/yarn)
└── pnpm-workspace.yaml  # PNPM workspace configuration
```

## 4. Create Project

Scaffold a new project within the monorepo:

```bash
mopo create projectName  # New project
mopo create .            # Current directory
```

The CLI will:
1. Detect workspace configuration
2. Prompt for framework selection (Vue 2/3 or React)
3. Generate project structure

## 5. Start Dev Server

Launch development environment:

```bash
mopo serve -n projectName       # Start by name
mopo serve -d                   # Smart detection via Git changes
mopo serve projectName -b vite  # Use Vite bundler
```

Access via browser at the displayed port.

## 6. Build Project

Production build commands:

```bash
mopo build -n projectName      # Build specific project
mopo build -d                  # Git-change based build
mopo build projectName -b vite # Vite-based build
```

## 7. Commit Changes

Standardized commits using Conventional Commit:

```bash
mopo commit -n projectName  # Commit specific project
mopo commit -d              # Git-change based commit
```

Features:
- Interactive commit prompt
- Commit message validation
- Powered by [cz-git](https://github.com/Zhengqbbb/cz-git)

## 8. Release Packages

Version management and publishing:

```bash
mopo release -a                   # Unified version bump for all packages
mopo release -d                   # Smart detection via Git changes
mopo release -n @yourOrg/pkg-name # Version cascade for dependencies
```

Key features:
- CHANGELOG generation via [release-it](https://github.com/release-it/release-it)
- Workspace-aware version control
- Dual release modes: unified or cascading versions

---

> TIP: Use `mopo [command] --help` for detailed option explanations.  
> Example: `mopo serve --help` shows all serve command options.