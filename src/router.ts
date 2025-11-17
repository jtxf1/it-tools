import { createRouter, createWebHistory } from 'vue-router'
import { config } from './config'
import { layouts } from './layouts/index'
// import NotFound from './pages/404.page.vue'
import HomePage from './pages/HomePage.vue'
import { tools } from './tools'
import { routes as demoRoutes } from './ui/demo/demo.routes'

const toolsRoutes = tools.map(({ path, name, component, ...config }) => ({
  path,
  name,
  component,
  meta: { isTool: true, layout: layouts.toolLayout, name, ...config },
}))
const toolsRedirectRoutes = tools
  .filter(({ redirectFrom }) => redirectFrom && redirectFrom.length > 0)
  .flatMap(
    ({ path, redirectFrom }) => redirectFrom?.map((redirectSource) => ({ path: redirectSource, redirect: path })) ?? [],
  )

const router = createRouter({
  history: createWebHistory(config.app.baseUrl),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
    },
    {
      path: '/index.html',
      name: 'home1',
      component: HomePage,
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('./pages/AboutPage.vue'),
    },
    ...toolsRoutes,
    ...toolsRedirectRoutes,
    ...(config.app.env === 'development' ? demoRoutes : []),
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: HomePage },
  ],
})

export default router
