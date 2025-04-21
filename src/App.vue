<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { ref, onMounted, onUnmounted } from 'vue'
import { useAuth } from './composables/useAuth'
import { auth } from './firebase/config'
import { onAuthStateChanged } from 'firebase/auth'
import type { User } from 'firebase/auth'

const { logout } = useAuth()
const user = ref<User | null>(null)
const isMenuOpen = ref(false)

// Gérer l'état de connexion de l'utilisateur
onMounted(() => {
  const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    user.value = currentUser
  })

  // Nettoyer l'écouteur lors du démontage du composant
  onUnmounted(() => {
    unsubscribe()
  })
})

// Fermer le menu si on clique en dehors
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.user-menu')) {
    isMenuOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}
</script>

<template>
  <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <nav>
        <RouterLink to="/">Accueil</RouterLink>
        <div class="auth-links">
          <template v-if="user">
            <div class="user-menu">
              <button @click="toggleMenu" class="user-menu-button">
                {{ user.displayName || user.email }}
                <span class="arrow-down">▼</span>
              </button>
              <div v-if="isMenuOpen" class="user-menu-dropdown">
                <RouterLink to="/account" class="menu-item">Mon compte</RouterLink>
                <button @click="logout" class="menu-item logout-button">Déconnexion</button>
              </div>
            </div>
          </template>
          <template v-else>
            <RouterLink to="/login">Connexion</RouterLink>
          </template>
        </div>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
  background-color: #f8f9fa;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

.auth-links {
  display: flex;
  align-items: center;
}

.user-menu {
  position: relative;
}

.user-menu-button {
  background: none;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  color: #333;
}

.arrow-down {
  font-size: 0.8rem;
}

.user-menu-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  min-width: 200px;
  z-index: 1000;
}

.menu-item {
  display: block;
  padding: 0.75rem 1rem;
  text-decoration: none;
  color: #333;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
}

.menu-item:hover {
  background-color: #f8f9fa;
}

.logout-button {
  color: #dc3545;
}

.logout-button:hover {
  background-color: #fff5f5;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
