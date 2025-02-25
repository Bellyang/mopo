# Commands

Run **mopo -h** to display all available commands:

```bash
Usage: mopo <command> [options]

Options:
  -v, --version      Output the version number
  -h, --help         Display help for command

Commands:
  init <repo-name>   Initialize a new monorepo
  create <app-name>  Create a new project
  prepare [options]  Initialize git hooks
  serve [options]    Start development server
  build [options]    Build projects
  commit [options]   Stage changes and create conventional commit
  release [options]  Manage versioning and releases
```

## 1. Initialize Repository

To create a new monorepo repository:

```bash
mopo init repoName
```

::: details
![Init repo](/init.gif)
:::

The **init** command will:
- Create a new directory with specified `repoName` (or use current directory)
- Initialize a monorepo structure with default configuration

Default directory structure:
```
repoName/
├── packages/            # Workspace directory
├── .gitignore           # Git exclusion rules
├── package.json         # Workspace configuration (npm/yarn)
└── pnpm-workspace.yaml  # PNPM workspace configuration
```

::: tip
Of course, it is also possible not to use this directory structure; you can create the repository according to your own needs.
After git initialization (when .git directory exists), run:
```bash
mopo prepare
```
to set up git hooks that validate commit message formats.
:::

## 2. Create Project

Generate a new project with:

```bash
mopo create projectName
```

::: details
![Create project](/create.gif)
:::

Example using namespaced package:
```bash
mopo create @yourOrg/pkgName
```
This will:
- Create project under `packages/pkgName`
- Set `name` in package.json to `@yourOrg/pkgName`

```json [package.json]
{
  "name": "@yourOrg/pkgName", // [!code focus]
  "version": "0.0.1",
}
```

During creation you'll be prompted to:
1. Choose framework: Vue 2/3 or React
2. Select package manager: pnpm, npm, or yarn

Generated project structures:

::: code-group
``` [Vue 2/3]
projectName/
├── assets       # Static assets
├── components   # Reusable components
├── config       # Configuration files
├── views        # Page components
├── public       # Public assets
├── router       # Routing configuration
├── store        # State management
├── types        # Type definitions
├── utils        # Utility functions
├── main.ts      # Application entry
├── index.html   # Base HTML template
└── package.json
```
``` [React]
projectName/
├── api           # API handlers
├── app.tsx       # Root component
├── assets        # Static assets
├── components    # Reusable components
├── config        # Configuration files
├── features      # Feature modules
├── hooks         # Custom hooks
├── index.html    # Base HTML template
├── main.ts       # Application entry
├── router        # Routing configuration
├── services      # Service layers
├── store         # State management
├── types         # Type definitions
└── utils         # Utility functions
```
:::

This project structure is not fixed; only main.ts and index.html must be in the root directory as the main entry points.

::: warning
Vite requires `index.html` at project root - [Vite Documentation](https://vite.dev/guide/#index-html-and-project-root)
:::

## 3. Start Development Server

Launch development environment with:

```bash
# Start specific project
mopo serve -n @yourOrg/pkgName

# Start projects with recent changes
mopo serve -d

# Start all projects (use cautiously)
mopo serve -a
```
::: danger PERFORMANCE NOTICE
Use `-a/--all` flags judiciously as they may impact build times
:::

Advanced options:
```bash
mopo serve -n projectName -b vite  # Use Vite instead of webpack
mopo serve -n projectName -an      # Enable bundle analysis
mopo serve -n projectName -s       # Measure build speed
```

Full command options:
```bash
Usage: mopo serve [options]

Start development server

Options:
  -a --all                Serve all projects (default: false)
  -an --analyzer          Enable bundle analyzer (default: false)
  -s --speed              Measure build speed (default: false)
  -d --diff               Serve changed projects from git diff (default: false)
  -n --names [names...]   Projects to serve in sequence (default: [])
  -b --bundler [bundler]  Bundler selection (webpack|vite) (default: "webpack")
  -h, --help              Display help
```

## 4. Build Projects

Build project artifacts:

```bash
# Build specific project
mopo build -n @yourOrg/pkgName

# Build changed projects
mopo build -d

# Build all projects (use cautiously)
mopo build -a
```
::: danger PERFORMANCE NOTICE
Use `-a/--all` flags judiciously as they may impact build times
:::
## 5. Commit Changes

Commit with conventional format:

```bash
mopo commit -n @yourOrg/pkgName  # Commit specific project
mopo commit -d                   # Commit changed projects
mopo commit -a                   # Commit all projects
```

Commit process flow:
1. Interactive file selection for staging
2. Lint-staged validation
3. Commit message dialog enforcing [Conventional Commits](https://www.conventionalcommits.org/)

Valid message formats:
```bash
feat(scope): add new feature
fix(scope1, scope2): resolve issue
chore(pkg)!: breaking change
```

## 6. Versioning and Release

Release management using [release-it](https://github.com/release-it/release-it):

```bash
# Release specific project
mopo release -n @yourOrg/pkgName

# Release changed projects
mopo release -d

# Coordinated release of all projects
mopo release -a

# Coordinated release of all projects with same version
mopo release -s
```

Release workflow:
1. Version bump with -s flag using [workspaces plugin](https://github.com/release-it-plugins/workspaces)
2. CHANGELOG generation via [conventional-changelog](https://github.com/release-it/conventional-changelog)
3. Dependency version synchronization
4. Tagging and pushing changes

::: info [Complete Process for Sequential Release]
Project A

Upgrade version number -> Generate CHANGELOG

Project B

Upgrade version number -> Generate CHANGELOG

Select projects (Project A, B)

Upgrade dependency version number -> Commit -> Tag -> Push
:::

The process may vary depending on the actual configuration files.

