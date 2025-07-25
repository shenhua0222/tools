import { createMemoryHistory, createRouter } from 'vue-router'

import HomeView from '@src/pages/Home.vue'
import JsonView from '@src/pages/JsonView.vue'

const routes = [
  {path: '/', redirect: '/json'},
  { path: '/svg', component: HomeView },
  { path: '/json', component: JsonView },
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

export default router