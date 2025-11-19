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

// uTools API onPluginEnter(callback)
// type 为 "text"、"regex"、 "over" 时， payload 值为进入插件应用时的主输入框文本
utools.onPluginEnter(({ code, type, payload, option }) => {
  console.log('用户进入插件应用', code, type, payload, option)
  const statusElement = document.getElementById('status')
  const textElement = document.getElementById('text')
  if (statusElement && textElement && type === 'regex' && payload) {
    statusElement.innerText = '匹配到正则文本'
    textElement.textContent = payload
  } else {
    if (statusElement !== null && textElement !== null) {
      statusElement.innerText = '未匹配到正则文本'
      textElement.textContent = ''
    }
  }
})

export default router
