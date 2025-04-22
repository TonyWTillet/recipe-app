<script setup lang="ts">
import { RouterView } from 'vue-router'
import { ref, onMounted, onUnmounted } from 'vue'
import { useAuth } from './composables/useAuth'
import { auth } from './firebase/config'
import { onAuthStateChanged } from 'firebase/auth'
import type { User } from 'firebase/auth'
import HomeHeader from './components/HomeHeader.vue'

const { logout } = useAuth()
const user = ref<User | null>(null)

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
</script>

<template>
  <div class="min-h-screen w-full fixed inset-0 bg-[#0a0a0a]">
    <!-- Fond avec effet de dégradé -->
    <div class="fixed inset-0 w-full h-full">
      <!-- Dégradé violet en haut à droite -->
      <div class="absolute inset-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,rgba(124,58,237,0.3),rgba(10,10,10,0)_80%)]"></div>
      <!-- Dégradé vert-bleu au centre -->
      <div class="absolute inset-0 w-full h-full bg-[radial-gradient(circle_at_60%_50%,rgba(16,185,129,0.25),rgba(10,10,10,0)_80%)]"></div>
      <!-- Dégradé bleu en bas à gauche -->
      <div class="absolute inset-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_left,rgba(59,130,246,0.3),rgba(10,10,10,0)_80%)]"></div>
    </div>

    <!-- Contenu principal -->
    <div class="relative z-20 min-h-screen flex flex-col">
      <HomeHeader :user="user" @logout="logout" class="bg-transparent" />

      <main class="flex-1 container mx-auto px-4 py-8">
        <RouterView v-slot="{ Component }">
          <transition
            name="page"
            mode="out-in"
          >
            <component :is="Component" />
          </transition>
        </RouterView>
      </main>

      <footer class="border-t border-white/10 py-6">
        <div class=" mx-auto px-4 flex justify-center items-center w-full">
          <p class="text-gray-400">&copy; {{ new Date().getFullYear() }} Recipe Chatbot. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  </div>
</template>

<style>
/* Styles globaux */
html, body {
  height: 100%;
  margin: 0;
  padding: 0;
  background: #0a0a0a;
  color: white;
  overflow-x: hidden;
}

#app {
  min-height: 100%;
  width: 100%;
  position: relative;
  background: #0a0a0a;
}

/* Animations de transition de page */
.page-enter-active,
.page-leave-active {
  transition: all 0.3s ease-in-out;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* Style de défilement personnalisé */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>
