import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { auth } from '../firebase/config'
import { onAuthStateChanged } from 'firebase/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
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
      component: () => import('../views/AccountView.vue'),
      meta: { requiresAuth: true },
    },
  ],
})

// Navigation guard pour protéger les routes qui nécessitent une authentification
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)

  if (requiresAuth) {
    // Vérifier si l'utilisateur est connecté
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe() // Arrêter d'écouter les changements d'état d'authentification

      if (user) {
        // L'utilisateur est connecté, permettre l'accès à la route
        next()
      } else {
        // L'utilisateur n'est pas connecté, rediriger vers la page de connexion
        next({ name: 'login' })
      }
    })
  } else {
    // La route ne nécessite pas d'authentification, continuer normalement
    next()
  }
})

export default router
