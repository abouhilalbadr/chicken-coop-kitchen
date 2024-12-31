import { createRouter, createWebHashHistory } from "vue-router"
import Home from "./views/Home.vue"
import Password from "./views/Password.vue"
import Cuisine from "./views/Cuisine.vue"

import { useStore } from "./store"

const routes = [
  { path: '/', component: Home },
  { path: '/password', component: Password },
  { path: '/cuisine', component: Cuisine },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

router.beforeEach((to, from) => {
  const store = useStore()
  if (store?.user && (to.path === '/' || to.path === '/password')) {
    return '/cuisine'
  }
  if (!store.user && to.path.includes('cuisine') ) {
    return '/'
  }
})

export default router