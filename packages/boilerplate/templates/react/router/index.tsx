import type { RouteObject } from 'react-router'
import { lazy } from 'react'
import { createBrowserRouter, Navigate } from 'react-router'

import { LazyLoad } from './utils'

const router: RouteObject[] = [
  {
    path: '/',
    children: [
      {
        index: true,
        element: <Navigate to="/home" />,
      },
      {
        path: '/home',
        element: LazyLoad(lazy(() => import('@/views/home'))),
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/404" />,
  },
]

export default createBrowserRouter(router)
