# Project Templates

The boilerplate package provides project templates and project initialization functionality.

## Docs

(boilerplate)[https://mopo-cli.vercel.app/extensions/boilerplate]

## Core Features

1. **Template Management**
   - Supports project templates for multiple frameworks
   - Currently supported template types:
     - Vue 2
     - Vue 3
     - React
     - Wrapper (Wrapper template)
   - Unified template directory path management via the `templateDir` function

2. **Project Initialization**
   - Provides `generatePackageJson` utility function
   - Used to generate project package.json configuration files
   - Ensures standardization of project dependencies and configurations

## API Reference

### templateDir

```typescript
function templateDir(name: 'vue2' | 'vue3' | 'react' | 'wrapper'): string
```

Currently, this package's functionality is relatively basic. Future updates will integrate repository and project creation features from the CLI into this package.

## Roadmap

### Near-term Plans
1. **Scenario-based Template Extensions**
   - SSR Server-side Rendering Templates (Next.js/Nuxt.js)
   - Mini Program Development (Wepy/Mpvue)
   - Micro-frontend Architecture Templates (qiankun/Module Federation)
   - Component Library Development Templates (Storybook + Theme System)

2. **Framework Ecosystem Enhancement**
   - Svelte Lightweight Framework Support
   - Integration of Preact High-performance Alternative
   - Deno Runtime Environment Adaptation

### More
- Visual Template Configuration Interface (Web Dashboard)
- Enterprise Private Template Repository Support
- CI/CD Pipeline Automatic Integration


