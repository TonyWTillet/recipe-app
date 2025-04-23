import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AccountView from '../views/AccountView.vue'
import RecipesView from '../views/RecipesView.vue'
import { useAuth } from '@/composables/useAuth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/account',
      name: 'account',
      component: AccountView,
      meta: { requiresAuth: true }
    },
    {
      path: '/recipes',
      name: 'recipes',
      component: RecipesView,
      meta: { requiresAuth: true }
    },
  ],
})

// Navigation guard pour protéger les routes qui nécessitent une authentification
router.beforeEach((to, from, next) => {
  const { user } = useAuth()

  if (to.meta.requiresAuth && !user.value) {
    next({ name: 'home' })
  } else {
    next()
  }
})

export default router
