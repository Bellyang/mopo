import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHashHistory } from 'vue-router'

import HomePage from '../views/HomePage.vue'

export const constantRoutes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  scrollBehavior: () => ({
    top: 0,
  }),
  routes: constantRoutes,
})

export default router
