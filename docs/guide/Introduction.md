# Mopo: Next-Generation Monorepo Development Toolkit

## Introduction

Mopo is a full-lifecycle CLI tool designed for modern monorepo development, offering comprehensive solutions from coding to production deployment. Built for engineering teams seeking efficiency and standardization, it provides:

## 1. Native Monorepo Support
**Core Advantages:**
- Unified dependency management
- Cross-project dependency resolution
- Multi-package simultaneous development
- Support for npm/yarn/pnpm workspace configurations

**Workspace Examples:**
::: code-group

```json [package.json]
{
  "workspaces": [
    "projects/web-*"
  ]
}
```

```yaml [pnpm-workspace.yaml]
packages:
  - 'packages/**'
  - '!packages/__test__/**'
```

:::

## 2. Build System Agnostic
**Current Support:**
- Webpack (default)
- Vite (modern alternative)

**Roadmap:**
- Rspack (Rust-based)
- ESBuild (Ultra-fast)

**Usage Examples:**
```bash
# Default webpack build
mopo serve --name=@yourOrg/project-name

# Vite-powered development
mopo serve --name=@yourOrg/project-name --bundler=vite

# Production build
mopo build --name=@yourOrg/project-name
```

## 3. Universal Framework Support
**Multi-Framework Ecosystem:**
- Vue 2/3 (with automatic version detection)
- React 16.8+ (Full Hooks support)
- Framework coexistence patterns

## 4. Modern Development Toolchain
**Cutting-Edge Features:**
- First-class TypeScript support
- Smart TSConfig inheritance
- Built-in Linter (ESLint) 
- Integrated Test Runner (Vitest/Jest)

## 5. Zero-Config Philosophy
**Project Structure Comparison:**
```
Traditional Setup (11+ config files)
├── .eslintrc.js
├── .prettierrc
├── babel.config.js
├── webpack.config.js
├── postcss.config.js
└── ...(8 more)

Mopo Project (Code-First)
├── code/            # Pure business logic
└── package.json    # Clean dependency declaration
```

**Key Benefits:**
- Automatic config generation
- Hidden complexity management
- Standardized cross-project conventions
- One-command dependency synchronization

## Why Choose Mopo?
1. **Monorepo Optimized** - Streamline multi-package workflows
2. **Tech Stack Freedom** - Mix frameworks and build tools
3. **Future-Proof** - Modern standards with upgrade paths
4. **Team Efficiency** - Reduce setup/maintenance overhead

Start your next project with `mopo init` and experience modern monorepo development reinvented.

> *Note: Compatible with Node.js lastest version, available via `npm install -g @mopo/cli`*
