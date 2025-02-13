import * as React from 'react'
import { createRoot } from 'react-dom/client'

import App from './app'

const root = document.getElementById('app')
if (!root)
  throw new Error('No root element found')

createRoot(root).render(
  React.createElement(
    React.StrictMode,
    null,
    React.createElement(App, null),
  ),
)
